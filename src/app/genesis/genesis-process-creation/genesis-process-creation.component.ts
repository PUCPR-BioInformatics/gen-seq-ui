import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AbstractComponent } from '../../core/abstract.component';
import { SystemService } from '../../core/system.service';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { GenesisProcessService } from '../genesis-process.service';
import { GenesisProcessModel } from '../shared/model/genesis-process.model';
import { FormHelper } from '../../shared/helper/form.helper';
import { GenesisStates } from '../genesis.states';
import { AlignmentToolModel } from '../shared/model/alignment-tool.model';
import { GeneomeReferenceModel } from '../shared/model/geneome-reference.model';
import { zip } from 'rxjs';

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
    public genomeReferences: Array<GeneomeReferenceModel>
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
        this.initializeGenomeReferencesAndAlignmentTools();
        this.initializeForm();
    }

    public eventGenesisSummary(): void {
        this.router.navigate(['../'], {
            relativeTo: this.route
        });
    }
    public getDnaAlignmentTools(): Array<AlignmentToolModel> {
        return this.aligmentTools.filter((aligmentTool: AlignmentToolModel) => aligmentTool.type === 'dna')
    }
    public getRnaAlignmentTools(): Array<AlignmentToolModel> {
        return this.aligmentTools.filter((aligmentTool: AlignmentToolModel) => aligmentTool.type === 'rna')
    }
    public initializeGenomeReferencesAndAlignmentTools(): void {
        zip(
            this.genesisService.getAlignmentTools(),
            this.genesisService.getGenomeReferences()
        ).subscribe(
            (result: [Array<AlignmentToolModel>, Array<GeneomeReferenceModel>]) => {
                this.aligmentTools = result[0];
                this.genomeReferences = result[1];
                this.loading = false;
            }
        );
    }
    public initializeForm(): void {
        this.parametersForm = new FormGroup({
            reference: new FormControl('', Validators.required),
            dnaSraId: new FormControl('', Validators.required),
            rnaSraId: new FormControl('', Validators.required)
        });
        this.dnaAlignmentForm = new FormGroup({
            toolName: new FormControl('', Validators.required)
        });
        this.rnaAlignmentForm = new FormGroup({
            toolName: new FormControl('', Validators.required)
        });
    }
    public eventCreateGenesisProcess(): void {
        const creationRaw = FormHelper.getRawValueNotNull(this.parametersForm);
        const genesisProcess = {
            reference: creationRaw.reference,
            dnaResource: {
                sra: creationRaw.dnaSraId as string,
                fastqDumpParameters: [],
                alignmentParameters: {
                    toolName: 'bwa'
                }
            },
            rnaResource: {
                sra: creationRaw.rnaSraId as string,
                fastqDumpParameters: [],
                alignmentParameters: {
                    toolName: 'star'
                }
            }
        } as GenesisProcessModel
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
