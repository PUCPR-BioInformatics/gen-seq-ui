import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, interval } from 'rxjs';
import { filter, retry, startWith, switchMap } from 'rxjs/operators';

import { AbstractComponent } from '../../core/abstract.component';
import { SystemService } from '../../core/system.service';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { GenesisProcessService } from '../genesis-process.service';
import { GenesisProcessModel } from '../shared/model/genesis-process.model';
import { GenesisStates } from '../genesis.states';
import { ChartDataModel } from '../../shared/components/chart/model/chart-data.model';
import { ChartHelper } from '../../shared/helper/chart.helper';
import { GenesisProcessStepEnum } from '../shared/enum/genesis-process-step.enum';
import { GenesisProcessStepExecutionModel } from '../shared/model/genesis-process-step-execution.model';
import { GenesisProcessExecutionDetailComponent } from './genesis-process-execution-detail/genesis-process-execution-detail.component';
import { GenesisProcessStepExecutionStatusEnum } from '../shared/enum/genesis-process-step-execution-status.enum';
import { GenesisProcessResultParametersModel } from '../shared/model/genesis-process-result-parameters.model';

@Component({
    selector: 'app-genesis-process-detail',
    templateUrl: './genesis-process-detail.component.html',
    styleUrls: ['./genesis-process-detail.component.scss']
})
export class GenesisProcessDetailComponent extends AbstractComponent {

    public TIMER = interval(2000).pipe(startWith(0));
    public genesisProcess: GenesisProcessModel;
    public genesisProcessData$: BehaviorSubject<ChartDataModel> = new BehaviorSubject(undefined) ;
    public informations: { [key: string]: string | number | undefined } = {};
    public title: string;
    public subTitle: string;
    public lastUpdate = new Date();

    constructor(
        public systemService: SystemService,
        public dialog: MatDialog,
        public messageBoxService: MessageBoxService,
        public genesisService: GenesisProcessService,
        public router: Router,
        public route: ActivatedRoute
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
        this.initialize();
    }

    public buildGenesisChartData(execution: GenesisProcessModel): void {
        const total = execution.executions.length;
        const completeness = parseFloat((execution.completeness * 100).toFixed(0));
        const completenessText = isNaN(completeness) ? 'Sem dados' : completeness + '%';
        const completenessTooltip = ChartHelper.buildTooltip('Executado ' + completenessText, 'ui-chart-tooltip');
        const executedTooltip = ChartHelper.buildTooltip('Executado ' + completenessText, 'ui-chart-tooltip');
        const plots = [
            ChartHelper.buildGaugeGenericPlotDataModel(
                total, 0, 1, 72, 74,
                'ui-chart-gauge-meter-default',
                completenessTooltip
            )
        ];
        if (execution.step !== GenesisProcessStepEnum.WAITING) {
            const cssClass = (execution.step !== GenesisProcessStepEnum.COMPLETE) ? ['ui-linear-gradient-default-initial', 'ui-linear-gradient-default-endless'] :
                ['ui-linear-gradient-success-initial', 'ui-linear-gradient-success-endless'];
            const effect = ChartHelper.buildGradientEffect(
                'gradient-execution-' + new Date().getTime() + execution._id,
                { class: cssClass[0], offset: '0%' },
                { class: cssClass[1], offset: '100%'},
                ['stroke', 'fill']
            );
            const executionPloCssClass = (execution.completedDate) ? 'ui-chart-gauge-meter-path': 'ui-chart-gauge-meter-path ui-chart-gauge-pulse';
            plots.push(
                ChartHelper.buildGaugeGenericPlotDataModel(
                    total, 0, 1 * execution.completeness,
                    70, 76, executionPloCssClass,
                    executedTooltip,
                    [effect]
                )
            );
        }
        this.genesisProcessData$.next({
            tooltip: completenessTooltip,
            informations: {
                progress: ChartHelper.buildContextInformation(completenessText, 0, 10)
            },
            size: {
                width: 220,
                height: 160
            },
            plots
        } as ChartDataModel);
    }
    protected collectInformations(): void {
        const extractedDna = this.getExtractionSizes('dna');
        const extractedRna = this.getExtractionSizes('rna');

        this.informations.dnaAlignmentSize = this.getAlignmentSize('dna');
        this.informations.dnaVariantsSize = extractedDna[0];
        this.informations.dnaSnpsSize = extractedDna[1];
        this.informations.dnaIndelsSize = extractedDna[2];
        this.informations.dnaExecutionTime = this.getExecutionTime('dna');

        this.informations.rnaAlignmentSize = this.getAlignmentSize('rna');
        this.informations.rnaVariantsSize = extractedRna[0];
        this.informations.rnaSnpsSize = extractedRna[1];
        this.informations.rnaIndelsSize = extractedRna[2];
        this.informations.rnaExecutionTime = this.getExecutionTime('rna');
    }
    public eventCancelGenesisProcess(): void {
        this.loadingState('Cancelando o process...');
        this.genesisService.cancelProcess(this.genesisProcess).subscribe(
            (genesisProcess: GenesisProcessModel) => {
                this.genesisProcess = genesisProcess;
                this.loadingStateDone();
            }, (error: HttpErrorResponse) => {
                this.openErrorMessageBox(error);
                this.loadingStateDone();
            }
        );
    }
    public eventDuplicateExecution(): void {
        this.router.navigate(['../creation'], {
            relativeTo: this.route,
            queryParams: {
                from: this.genesisProcess._id
            }
        });
    }
    public eventGenesisSummary(): void {
        this.router.navigate(['../'], {
            relativeTo: this.route
        });
    }
    public eventExecutionDetail(execution: GenesisProcessStepExecutionModel): void {
        this.dialog.open(GenesisProcessExecutionDetailComponent, {
            data: {
                execution,
                process: this.genesisProcess
            },
            maxWidth: '90vw',
            maxHeight: '90vh'
        })
    }
    public eventRetryStep(step: GenesisProcessStepEnum, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.subscriptions$.add(this.genesisService.retryProcess(this.genesisProcess._id, step).subscribe(
            (updatedProcess: GenesisProcessModel) => {
                this.handleGenesisProcess(updatedProcess);
            }, (error) => {
                this.openErrorMessageBox(error);
            }
        ));
    }
    public eventNewExecution(): void {
        this.router.navigate(['../' + GenesisStates.genesis.subStates.creation.path ], {
            relativeTo: this.route
        });
    }
    protected getAlignmentSize(type: 'dna' | 'rna'): number | undefined{
        const step = (type === 'dna') ? GenesisProcessStepEnum.ALIGNING_DNA : GenesisProcessStepEnum.ALIGNING_RNA;
        const execution = this.genesisProcess.executions.find((execution) => execution.step === step);
        const parameter = execution.result?.outputParameters.find((parameter) => parameter.name === 'alignmentOutputSize');

        return (parameter) ? parseInt(parameter.value as string) : undefined;
    }
    protected getExtractionSizes(type: 'dna' | 'rna'): [number | undefined, number | undefined, number | undefined]{
        const step = (type === 'dna') ? GenesisProcessStepEnum.EXTRACT_DNA : GenesisProcessStepEnum.EXTRACT_RNA;
        const execution = this.genesisProcess.executions.find((execution) => execution.step === step);
        const parameterVariants = execution.result?.outputParameters.find((parameter) => parameter.name === 'extractedOutputSize');
        const parameterSnps = execution.result?.outputParameters.find((parameter) => parameter.name === 'extractedSnpsOutputSize');
        const parameterIndels = execution.result?.outputParameters.find((parameter) => parameter.name === 'extractedIndelsOutputSize');

        return [
            (parameterVariants) ? parseInt(parameterVariants.value as string) - 26 : undefined,
            (parameterSnps) ? parseInt(parameterSnps.value as string) - 29 : undefined,
            (parameterIndels) ? parseInt(parameterIndels.value as string) - 29 : undefined,
        ];
    }
    public getCssClass(execution: GenesisProcessStepExecutionModel): string {
        let cssClass = 'ui-process-execution ui-card ui-card-zoomed ';

        if (!execution.startDate) {
            cssClass += 'ui-process-execution-waiting';
        } else if (!execution.endDate) {
            cssClass += 'ui-process-execution-executing';
        } else if (execution.result.status === GenesisProcessStepExecutionStatusEnum.FAIL) {
            cssClass += 'ui-process-execution-fail';
        } else if (execution.result.status === GenesisProcessStepExecutionStatusEnum.SUCCESS) {
            cssClass += 'ui-process-execution-done';
        } else if (execution.result.status === GenesisProcessStepExecutionStatusEnum.SKIPPED) {
            cssClass += 'ui-process-execution-skipped';
        } else {
            console.warn(`Status não conhecido ${execution.result.status}`);
        }

        return cssClass;
    }
    public getExecutionStatus(execution: GenesisProcessStepExecutionModel): string {
        if (!execution.startDate) {
            return (this.genesisProcess.result?.status === 'fail') ? 'Não executado' : 'Agurdando';
        } else if (!execution.endDate) {
            return 'Em Execução';
        } else {
            return (execution.result.status === 'fail') ? 'Falhou' : 'Concluído';
        }
    }
    public getExecutionTime(type?: 'dna' | 'rna'): string {
        let time = 0;

        if (type) {
            if (!this.genesisProcess.completedDate) {
                return 'Executando';
            }
            this.genesisProcess.executions.filter((execution) => execution.type === type).forEach((execution) => {
                time += new Date(execution.endDate).getTime() - new Date(execution.startDate).getTime()
            });
        } else {
            let initialTime = new Date(this.genesisProcess.creationDate).getTime();
            let finalTime = new Date(this.genesisProcess.completedDate).getTime();

            if (!this.genesisProcess.completedDate) {
                finalTime = new Date().getTime();
            }
            if (this.genesisProcess.executionsHistory) {
                initialTime = new Date(this.genesisProcess.executions[0].startDate).getTime();
            }

            time = finalTime - initialTime;
        }
        const seconds = (time / 1000);
        if (seconds < 60) {
            return seconds.toFixed(2) + ' segundo(s)';
        } else if (seconds < 3600) {
            return (seconds / 60).toFixed(2) + ' minuto(s)';
        } else {
            return (seconds / 60 / 60).toFixed(2) + ' hora(s)';
        }
    }
    public getFiles(type: 'dna' | 'rna'): Array<GenesisProcessResultParametersModel> {
        const parameters = [];
        const executions = this.genesisProcess.executions.filter((execution) => execution.type === type);

        for (const execution of executions) {
            for (const parameter of execution.result.outputParameters) {
                if (parameter.type === 'file') {
                    parameters.push(parameter);
                }
            }
        }
        return parameters;
    }
    private handleGenesisProcess(genesisProcess: GenesisProcessModel): void {
        if (JSON.stringify(genesisProcess) !== JSON.stringify(this.genesisProcess)) {
            this.genesisProcess = genesisProcess;
            this.title = 'Detalhes da Execução';
            this.subTitle = this.genesisProcess._id;
            this.buildGenesisChartData(genesisProcess);
            this.lastUpdate = new Date();
            this.collectInformations();
        }
    }
    private initialize(): void {
        this.title = 'Buscando a execução';
        this.subTitle = 'Aguarde';

        this.watchGenesisProcess();
    }
    public trackExecutionByStep(index: number, execution: GenesisProcessStepExecutionModel): string {
        return execution.step;
    }
    private watchGenesisProcess(): void {
        this.subscriptions$.add(this.TIMER.pipe(
            filter(() => !this.genesisProcess || this.genesisProcess.completedDate === null),
            switchMap(() => this.genesisService.getProcessById(this.route.snapshot.params.id))
        ).subscribe(
            (genesisProcess: GenesisProcessModel) => this.handleGenesisProcess(genesisProcess),
            (error: HttpErrorResponse) => {
                this.openErrorMessageBox(error);
            }
        ));
    }
}
