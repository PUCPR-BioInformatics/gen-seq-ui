import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { from, Observable, of, zip } from 'rxjs';

import { AbstractComponent } from '../../core/abstract.component';
import { SystemService } from '../../core/system.service';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { GenesisProcessService } from '../genesis-process.service';
import { GenesisProcessModel } from '../shared/model/genesis-process.model';
import { FormHelper } from '../../shared/helper/form.helper';
import { GenesisStates } from '../genesis.states';
import { AlignmentToolModel } from '../shared/model/alignment-tool.model';
import { GeneomeReferenceModel } from '../shared/model/geneome-reference.model';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-genesis-process-creation',
    templateUrl: './genesis-process-creation.component.html',
    styleUrls: ['./genesis-process-creation.component.scss']
})
export class GenesisProcessCreationComponent extends AbstractComponent{

    public aligmentTools: Array<AlignmentToolModel>;
    public parametersForm: FormGroup;
    public rnaAlignmentForm: FormGroup;
    public dnaAlignmentForm: FormGroup;
    public genomeReferences: Array<GeneomeReferenceModel>;
    public fromGenesisExecution: GenesisProcessModel
    public loading = true;

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService,
        public genesisService: GenesisProcessService,
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

    public eventGenesisSummary(): void {
        this.router.navigate(['../'], {
            relativeTo: this.route
        });
    }
    public getDnaAlignmentTools(): Array<AlignmentToolModel> {
        return this.aligmentTools.filter((aligmentTool: AlignmentToolModel) => aligmentTool.type === 'dna')
    }
    protected getExecutionReference(): Observable<GenesisProcessModel> {
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
            map((result: [Array<AlignmentToolModel>, Array<GeneomeReferenceModel>, GenesisProcessModel]) => {
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
            forceDump: new FormControl(false, Validators.required),
            forceAlignment: new FormControl(false, Validators.required),
            toolName: new FormControl('', Validators.required)
        });
        this.rnaAlignmentForm = new FormGroup({
            alignmentParameters: new FormControl(''),
            dumpParameters: new FormControl(''),
            forceDump: new FormControl(false, Validators.required),
            forceAlignment: new FormControl(false, Validators.required),
            toolName: new FormControl('', Validators.required)
        });

        if (this.fromGenesisExecution) {
            const dnaAlignmentParameters = this.fromGenesisExecution.dnaResource.alignmentParameters.parameters;
            const dnaDumpParameters = this.fromGenesisExecution.dnaResource.fastqDumpParameters.parameters;
            const rnaAlignmentParameters = this.fromGenesisExecution.rnaResource.alignmentParameters.parameters;
            const rnaDumpParameters = this.fromGenesisExecution.rnaResource.fastqDumpParameters.parameters;

            this.parametersForm.setValue({
                reference: this.fromGenesisExecution.reference,
                dnaSraId: this.fromGenesisExecution.dnaResource.sra,
                rnaSraId: this.fromGenesisExecution.rnaResource.sra,
            });
            this.dnaAlignmentForm.setValue({
                alignmentParameters: (dnaAlignmentParameters) ? dnaAlignmentParameters.toString() : '',
                dumpParameters: (dnaDumpParameters) ? dnaDumpParameters.toString() : '',
                toolName: this.fromGenesisExecution.dnaResource.alignmentParameters.toolName,
                forceDump: false,
                forceAlignment: false
            });
            this.rnaAlignmentForm.setValue({
                alignmentParameters: (rnaAlignmentParameters) ? rnaAlignmentParameters.toString() : '',
                dumpParameters:  (rnaDumpParameters) ? rnaDumpParameters.toString() : '',
                toolName: this.fromGenesisExecution.rnaResource.alignmentParameters.toolName,
                forceDump: false,
                forceAlignment: false
            });
        }
    }
    public eventCreateGenesisProcess(): void {
        const creationParametersRaw = FormHelper.getRawValueNotNull(this.parametersForm);
        const creationDnaAlignmentRaw = FormHelper.getRawValueNotNull(this.dnaAlignmentForm);
        const creationRnaAlignmentRaw = FormHelper.getRawValueNotNull(this.rnaAlignmentForm);
        const genesisProcess = {
            reference: creationParametersRaw.reference,
            dnaResource: {
                alignmentParameters: {
                    toolName: creationDnaAlignmentRaw.toolName,
                    parameters: (creationDnaAlignmentRaw.alignmentParameters) ? creationDnaAlignmentRaw.alignmentParameters.split(',') : [],
                    force: creationDnaAlignmentRaw.forceAlignment
                },
                fastqDumpParameters: {
                    parameters: (creationDnaAlignmentRaw.dumpParameters) ? creationDnaAlignmentRaw.dumpParameters?.split(',') : [],
                    force: creationDnaAlignmentRaw.forceDump
                },
                sra: creationParametersRaw.dnaSraId as string,

            },
            rnaResource: {
                alignmentParameters: {
                    toolName: creationRnaAlignmentRaw.toolName,
                    parameters: (creationRnaAlignmentRaw.alignmentParameters) ? creationRnaAlignmentRaw.alignmentParameters.split(',') : [],
                    force: creationRnaAlignmentRaw.forceAlignment
                },
                fastqDumpParameters: {
                    parameters: (creationRnaAlignmentRaw.dumpParameters) ? creationRnaAlignmentRaw.dumpParameters.split(',') : [],
                    force: creationRnaAlignmentRaw.forceDump
                },
                sra: creationParametersRaw.rnaSraId as string,
            }
        } as GenesisProcessModel;
        console.log(genesisProcess)
        this.genesisService.createProcess(genesisProcess).subscribe(
            (genesisProcess: GenesisProcessModel) => {
                const link = GenesisStates.genesis.path + '/' + genesisProcess._id;
               this.openSuccessMessageBox(
                   'O Processo começou!', 'Sucesso',  link, 'Clique para Acompanhar'
               ).afterClosed().subscribe(() => {
                   this.router.navigate(['../'], {
                       relativeTo: this.route
                   });
               })
            }, (error: HttpErrorResponse) => this.openErrorMessageBox(error)
        );
    }
}
