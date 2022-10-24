import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { AbstractComponent } from '../../core/abstract.component';
import { SystemService } from '../../core/system.service';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { GenesisProcessService } from '../genesis-process.service';
import { GenesisProcessModel } from '../shared/model/genesis-process.model';
import { FormHelper } from '../../shared/helper/form.helper';
import { GenesisStates } from '../genesis.states';
import { AlignmentToolModel } from '../shared/model/alignment-tool.model';
import { GeneomeReferenceModel } from '../shared/model/geneome-reference.model';
import validate = WebAssembly.validate;

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

    public buildGenesis(creationParametersRaw: any, creationRnaAlignmentRaw: any, creationDnaAlignmentRaw: any): GenesisProcessModel {
        const dnaAlignmentParameters = (creationDnaAlignmentRaw.alignmentParameters) ? creationDnaAlignmentRaw.alignmentParameters.split(',') : [];
        const dnaDumpParameters = (creationDnaAlignmentRaw.dumpParameters) ? creationDnaAlignmentRaw.dumpParameters.split(',') : [];
        const dnaExtractionParameters = (creationDnaAlignmentRaw.extractionParameters) ? creationDnaAlignmentRaw.extractionParameters.split(',') : [];
        const dnaIndexParameters = (creationDnaAlignmentRaw.indexParameters) ? creationDnaAlignmentRaw.indexParameters.split(',') : [];

        const rnaAlignmentParameters = (creationRnaAlignmentRaw.alignmentParameters) ? creationRnaAlignmentRaw.alignmentParameters.split(',') : [];
        const rnaDumpParameters = (creationRnaAlignmentRaw.dumpParameters) ? creationRnaAlignmentRaw.dumpParameters.split(',') : [];
        const rnaExtractionParameters = (creationRnaAlignmentRaw.extractionParameters) ? creationRnaAlignmentRaw.extractionParameters.split(',') : [];
        const rnaIndexParameters = (creationRnaAlignmentRaw.indexParameters) ? creationRnaAlignmentRaw.indexParameters.split(',') : [];

        return {
            dnaResource: {
                alignment: {
                    toolName: creationDnaAlignmentRaw.toolName,
                    parameters: dnaAlignmentParameters,
                    force: creationDnaAlignmentRaw.forceAlignment,
                },
                extraction: {
                    parameters: dnaExtractionParameters,
                    force: creationDnaAlignmentRaw.forceExtraction
                },
                fastqDump: {
                    parameters: dnaDumpParameters,
                    force: creationDnaAlignmentRaw.forceDump,
                    isPaired: creationDnaAlignmentRaw.pairedDump
                },
                index: {
                    parameters: dnaIndexParameters,
                    force: creationDnaAlignmentRaw.forceIndex,
                },
                sra: creationParametersRaw.dnaSraId as string
            },
            rnaResource: {
                alignment: {
                    toolName: creationRnaAlignmentRaw.toolName,
                    parameters: rnaAlignmentParameters,
                    force: creationRnaAlignmentRaw.forceAlignment
                },
                extraction: {
                    parameters: rnaExtractionParameters,
                    force: creationRnaAlignmentRaw.forceExtraction
                },
                fastqDump: {
                    parameters: rnaDumpParameters,
                    force: creationRnaAlignmentRaw.forceDump,
                    isPaired: creationRnaAlignmentRaw.pairedDump
                },
                index: {
                    parameters: rnaIndexParameters,
                    force: creationRnaAlignmentRaw.forceIndex
                },
                sra: creationParametersRaw.rnaSraId as string
            },
            reference: creationParametersRaw.reference
        } as GenesisProcessModel;
    }
    public eventCreateGenesisProcess(): void {
        const creationParametersRaw = FormHelper.getRawValueNotNull(this.parametersForm);
        const creationDnaAlignmentRaw = FormHelper.getRawValueNotNull(this.dnaAlignmentForm);
        const creationRnaAlignmentRaw = FormHelper.getRawValueNotNull(this.rnaAlignmentForm);
        const genesisProcess = this.buildGenesis(creationParametersRaw, creationRnaAlignmentRaw, creationDnaAlignmentRaw);
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
            extractionParameters: new FormControl(''),
            indexParameters: new FormControl(''),
            forceDump: new FormControl(false, Validators.required),
            pairedDump: new FormControl(false, Validators.required),
            forceAlignment: new FormControl(false, Validators.required),
            forceExtraction: new FormControl(false, Validators.required),
            forceIndex: new FormControl(false, Validators.required),
            toolName: new FormControl('', Validators.required)
        });
        this.rnaAlignmentForm = new FormGroup({
            alignmentParameters: new FormControl(''),
            dumpParameters: new FormControl(''),
            extractionParameters: new FormControl(''),
            indexParameters: new FormControl(''),
            forceDump: new FormControl(false, Validators.required),
            pairedDump: new FormControl(false, Validators.required),
            forceAlignment: new FormControl(false, Validators.required),
            forceExtraction: new FormControl(false, Validators.required),
            forceIndex: new FormControl(false, Validators.required),
            toolName: new FormControl('', Validators.required)
        });

        if (this.fromGenesisExecution) {
            const dnaAlignmentParameters = this.fromGenesisExecution.dnaResource.alignment.parameters;
            const dnaDumpParameters = this.fromGenesisExecution.dnaResource.fastqDump.parameters;
            const dnaExtractionParameters = this.fromGenesisExecution.dnaResource.extraction.parameters;
            const dnaIndexParameters = this.fromGenesisExecution.dnaResource.index.parameters;

            const rnaAlignmentParameters = this.fromGenesisExecution.rnaResource.alignment.parameters;
            const rnaDumpParameters = this.fromGenesisExecution.rnaResource.fastqDump.parameters;
            const rnaExtractionParameters = this.fromGenesisExecution.rnaResource.extraction.parameters;
            const rnaIndexParameters = this.fromGenesisExecution.rnaResource.index.parameters;

            this.parametersForm.setValue({
                reference: this.fromGenesisExecution.reference,
                dnaSraId: this.fromGenesisExecution.dnaResource.sra,
                rnaSraId: this.fromGenesisExecution.rnaResource.sra,
            });
            this.dnaAlignmentForm.setValue({
                alignmentParameters: (dnaAlignmentParameters) ? dnaAlignmentParameters.toString() : '',
                dumpParameters: (dnaDumpParameters) ? dnaDumpParameters.toString() : '',
                extractionParameters: (dnaExtractionParameters) ? dnaExtractionParameters.toString() : '',
                indexParameters: (dnaIndexParameters) ? dnaIndexParameters.toString() : '',
                toolName: this.fromGenesisExecution.dnaResource.alignment.toolName,
                pairedDump: this.fromGenesisExecution.dnaResource.fastqDump.isPaired,
                forceAlignment: false,
                forceDump: false,
                forceExtraction: false,
                forceIndex: false
            });
            this.rnaAlignmentForm.setValue({
                alignmentParameters: (rnaAlignmentParameters) ? rnaAlignmentParameters.toString() : '',
                dumpParameters:  (rnaDumpParameters) ? rnaDumpParameters.toString() : '',
                extractionParameters: (rnaExtractionParameters) ? rnaExtractionParameters.toString() : '',
                indexParameters: (rnaIndexParameters) ? rnaIndexParameters.toString() : '',
                toolName: this.fromGenesisExecution.rnaResource.alignment.toolName,
                pairedDump: this.fromGenesisExecution.rnaResource.fastqDump.isPaired,
                forceAlignment: false,
                forceDump: false,
                forceExtraction: false,
                forceIndex: false
            });
        }
    }
}
