import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { AbstractComponent } from '../../core/abstract.component';
import { SystemService } from '../../core/system.service';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { ProcessService } from '../process.service';
import { ProcessModel } from '../shared/model/process.model';
import { FormHelper } from '../../shared/helper/form.helper';
import { ProcessStates } from '../process.states';
import { AlignmentToolModel } from '../shared/model/alignment-tool.model';
import { GeneomeReferenceModel } from '../shared/model/geneome-reference.model';
import { CommandParametersModel } from '../shared/model/command-parameters.model';

@Component({
    selector: 'app-creation',
    templateUrl: './creation.component.html',
    styleUrls: ['./creation.component.scss']
})
export class CreationComponent extends AbstractComponent{

    public aligmentTools: Array<AlignmentToolModel>;
    public parametersForm: FormGroup;
    public rnaAlignmentForm: FormGroup;
    public dnaAlignmentForm: FormGroup;
    public genomeReferences: Array<GeneomeReferenceModel>;
    public fromGenesisExecution: ProcessModel
    public loading = true;

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService,
        public genesisService: ProcessService,
        public router: Router,
        public route: ActivatedRoute
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
        this.initializeGenomeReferencesAndAlignmentTools().subscribe(
            () => {
                this.initializeForm();
                this.loading = false;
            }, (error) => {
                this.openErrorMessageBox(error);
            }
        );
    }

    public buildCommandParameters(
        toolName: string, shellArguments: Array<string>,
        force: boolean, commandArguments: {[key: string] : boolean | number | string }
    ): CommandParametersModel {
        return {
            toolName,
            shellArguments,
            force,
            arguments: commandArguments
        } as CommandParametersModel
    }
    public buildGenesis(creationParametersRaw: any, creationRnaAlignmentRaw: any, creationDnaAlignmentRaw: any): ProcessModel {
        const dnaAlignmentParameters = (creationDnaAlignmentRaw.alignmentParameters) ? creationDnaAlignmentRaw.alignmentParameters.split(',') : [];
        const dnaDumpParameters = (creationDnaAlignmentRaw.dumpParameters) ? creationDnaAlignmentRaw.dumpParameters.split(',') : [];
        const dnaExtractionParameters = (creationDnaAlignmentRaw.extractionParameters) ? creationDnaAlignmentRaw.extractionParameters.split(',') : [];

        const rnaAlignmentParameters = (creationRnaAlignmentRaw.alignmentParameters) ? creationRnaAlignmentRaw.alignmentParameters.split(',') : [];
        const rnaDumpParameters = (creationRnaAlignmentRaw.dumpParameters) ? creationRnaAlignmentRaw.dumpParameters.split(',') : [];
        const rnaExtractionParameters = (creationRnaAlignmentRaw.extractionParameters) ? creationRnaAlignmentRaw.extractionParameters.split(',') : [];

        const dnaAlignment = this.buildCommandParameters(
            creationDnaAlignmentRaw.toolName, dnaAlignmentParameters, creationDnaAlignmentRaw.forceAlignment,
            { forceIndex: creationRnaAlignmentRaw.forceIndex }
        );
        const dnaFastq = this.buildCommandParameters(
            null, dnaDumpParameters, creationDnaAlignmentRaw.forceAlignment,
            { isPaired: creationDnaAlignmentRaw.pairedDump as boolean }
        );
        const dnaExtraction = this.buildCommandParameters(
            null, dnaExtractionParameters, creationDnaAlignmentRaw.forceExtraction,
            {}
        );
        const rnaAlignment = this.buildCommandParameters(
            creationRnaAlignmentRaw.toolName, rnaAlignmentParameters, creationRnaAlignmentRaw.forceAlignment,
            { forceIndex: creationRnaAlignmentRaw.forceIndex }
        );
        const rnaFastq = this.buildCommandParameters(
            null, rnaDumpParameters, creationRnaAlignmentRaw.forceAlignment,
            { isPaired: creationRnaAlignmentRaw.pairedDump as boolean }
        );

        const rnaExtraction = this.buildCommandParameters(
            null, rnaExtractionParameters, creationRnaAlignmentRaw.forceExtraction,
            {}
        );


        return {
            dnaResource: {
                alignment: dnaAlignment,
                extraction: dnaExtraction,
                fastqDump: dnaFastq,
                sra: creationParametersRaw.dnaSraId as string
            },
            rnaResource: {
                alignment: rnaAlignment,
                extraction: rnaExtraction,
                fastqDump: rnaFastq,
                sra: creationParametersRaw.rnaSraId as string
            },
            reference: creationParametersRaw.reference
        } as ProcessModel;
    }
    public eventCreateGenesisProcess(): void {
        const creationParametersRaw = FormHelper.getRawValueNotNull(this.parametersForm);
        const creationDnaAlignmentRaw = FormHelper.getRawValueNotNull(this.dnaAlignmentForm);
        const creationRnaAlignmentRaw = FormHelper.getRawValueNotNull(this.rnaAlignmentForm);
        const genesisProcess = this.buildGenesis(creationParametersRaw, creationRnaAlignmentRaw, creationDnaAlignmentRaw);
        this.genesisService.createProcess(genesisProcess).subscribe(
            (genesisProcess: ProcessModel) => {
                const link = ProcessStates.detail.path + '/' + genesisProcess._id;
                this.openSuccessMessageBox(
                    'O Processo começou!', 'Sucesso',  link, 'Clique para Acompanhar'
                ).afterClosed().subscribe((result) => {
                    if (!result.linked) {
                        this.router.navigate([ProcessStates.list.path]);
                    }
                })
            }, (error: HttpErrorResponse) => this.openErrorMessageBox(error)
        );
    }
    public eventGenesisSummary(): void {
        this.router.navigate(['../'], {
            relativeTo: this.route
        });
    }
    public getDnaAlignmentTools(): Array<AlignmentToolModel> {
        return this.aligmentTools.filter((aligmentTool: AlignmentToolModel) => aligmentTool.type === 'dna')
    }
    protected getExecutionReference(): Observable<ProcessModel> {
        const fromProcessId = this.route.snapshot.queryParams.from;
        if (fromProcessId) {
            return this.genesisService.getProcessById(fromProcessId);
        } else {
            return of(null);
        }
    }
    public getRnaAlignmentTools(): Array<AlignmentToolModel> {
        return this.aligmentTools.filter((aligmentTool: AlignmentToolModel) => aligmentTool.type === 'rna')
    }
    public initializeGenomeReferencesAndAlignmentTools(): Observable<boolean> {
        return zip(
            this.genesisService.getAlignmentTools(),
            this.genesisService.getGenomeReferences(),
            this.getExecutionReference()
        ).pipe(
            map((result: [Array<AlignmentToolModel>, Array<GeneomeReferenceModel>, ProcessModel]) => {
                this.aligmentTools = result[0];
                this.genomeReferences = result[1];
                this.fromGenesisExecution = result[2];
                return true;
            })
        );
    }
    public initializeForm(): void {
        this.parametersForm = new FormGroup({
            reference: new FormControl('', Validators.required),
            dnaSraId: new FormControl('', Validators.required),
            rnaSraId: new FormControl('', Validators.required),
        });
        this.dnaAlignmentForm = new FormGroup({
            alignmentParameters: new FormControl(''),
            dumpParameters: new FormControl(''),
            extractionParameters: new FormControl(''),
            forceDump: new FormControl(false, Validators.required),
            pairedDump: new FormControl(true, Validators.required),
            forceAlignment: new FormControl(false, Validators.required),
            forceExtraction: new FormControl(false, Validators.required),
            forceIndex: new FormControl(false, Validators.required),
            toolName: new FormControl('', Validators.required)
        });
        this.rnaAlignmentForm = new FormGroup({
            alignmentParameters: new FormControl(''),
            dumpParameters: new FormControl(''),
            extractionParameters: new FormControl(''),
            forceDump: new FormControl(false, Validators.required),
            pairedDump: new FormControl(true, Validators.required),
            forceAlignment: new FormControl(false, Validators.required),
            forceExtraction: new FormControl(false, Validators.required),
            forceIndex: new FormControl(false, Validators.required),
            toolName: new FormControl('', Validators.required)
        });

        if (this.fromGenesisExecution) {
            const dnaAlignmentParameters = this.fromGenesisExecution.dnaResource.alignment.shellArguments;
            const dnaDumpParameters = this.fromGenesisExecution.dnaResource.fastqDump.shellArguments;
            const dnaExtractionParameters = this.fromGenesisExecution.dnaResource.extraction.shellArguments;

            const rnaAlignmentParameters = this.fromGenesisExecution.rnaResource.alignment.shellArguments;
            const rnaDumpParameters = this.fromGenesisExecution.rnaResource.fastqDump.shellArguments;
            const rnaExtractionParameters = this.fromGenesisExecution.rnaResource.extraction.shellArguments;

            this.parametersForm.setValue({
                reference: this.fromGenesisExecution.reference,
                dnaSraId: this.fromGenesisExecution.dnaResource.sra,
                rnaSraId: this.fromGenesisExecution.rnaResource.sra,
            });
            this.dnaAlignmentForm.setValue({
                alignmentParameters: (dnaAlignmentParameters) ? dnaAlignmentParameters.toString() : '',
                dumpParameters: (dnaDumpParameters) ? dnaDumpParameters.toString() : '',
                extractionParameters: (dnaExtractionParameters) ? dnaExtractionParameters.toString() : '',
                toolName: this.fromGenesisExecution.dnaResource.alignment.toolName,
                pairedDump: this.fromGenesisExecution.dnaResource.fastqDump.arguments['isPaired'],
                forceAlignment: false,
                forceDump: false,
                forceExtraction: false,
                forceIndex: false
            });
            this.rnaAlignmentForm.setValue({
                alignmentParameters: (rnaAlignmentParameters) ? rnaAlignmentParameters.toString() : '',
                dumpParameters:  (rnaDumpParameters) ? rnaDumpParameters.toString() : '',
                extractionParameters: (rnaExtractionParameters) ? rnaExtractionParameters.toString() : '',
                toolName: this.fromGenesisExecution.rnaResource.alignment.toolName,
                pairedDump: this.fromGenesisExecution.rnaResource.fastqDump.arguments['isPaired'],
                forceAlignment: false,
                forceDump: false,
                forceExtraction: false,
                forceIndex: false
            });
        }
    }
}
