import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { AbstractComponent } from '../../core/abstract.component';
import { SystemService } from '../../core/system.service';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { GenesisProcessService } from '../genesis-process.service';
import { GenesisProcessModel } from '../shared/model/genesis-process.model';
import { HttpErrorResponse } from '@angular/common/http';
import { GenesisStates } from '../genesis.states';
import { ChartDataModel } from '../../shared/components/chart/model/chart-data.model';
import { ChartHelper } from '../../shared/helper/chart.helper';
import { GenesisProcessStepEnum } from '../shared/enum/genesis-process-step.enum';
import { GenesisProcessStepExecutionModel } from '../shared/model/genesis-process-step-execution.model';
import { MatDialog } from '@angular/material/dialog';
import { GenesisProcessExecutionDetailComponent } from './genesis-process-execution-detail/genesis-process-execution-detail.component';
import { GenesisProcessStepExecutionStatusEnum } from '../shared/enum/genesis-process-step-execution-status.enum';

@Component({
    selector: 'app-genesis-process-detail',
    templateUrl: './genesis-process-detail.component.html',
    styleUrls: ['./genesis-process-detail.component.scss']
})
export class GenesisProcessDetailComponent extends AbstractComponent {

    public TIMER = interval(2000).pipe(startWith(0));
    public genesisProcess: GenesisProcessModel;
    public genesisProcessChartData: ChartDataModel;
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
            const cssClass = (execution.step !== GenesisProcessStepEnum.COMPLETE) ? ['ui-linear-gradient-orange-initial', 'ui-linear-gradient-orange-endless'] :
                ['ui-linear-gradient-success-initial', 'ui-linear-gradient-success-endless'];
            const effect = ChartHelper.buildGradientEffect(
                'gradient-execution-' + new Date().getTime() + execution._id,
                { class: cssClass[0], offset: '0%' },
                { class: cssClass[1], offset: '100%'},
                ['stroke', 'fill']
            );
            plots.push(
                ChartHelper.buildGaugeGenericPlotDataModel(
                    total, 0, 1 * execution.completeness,
                    70, 76, 'ui-chart-gauge-meter-path',
                    executedTooltip,
                    [effect]
                )
            );
        }
        this.genesisProcessChartData = {
            tooltip: completenessTooltip,
            informations: {
                progress: ChartHelper.buildContextInformation(completenessText, 0, 10)
            },
            size: {
                width: 220,
                height: 160
            },
            plots
        } as ChartDataModel;
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
    public eventNewExecution(): void {
        this.router.navigate(['../' + GenesisStates.genesis.subStates.creation.path ], {
            relativeTo: this.route
        });
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
    public getExecutionIcon(execution: GenesisProcessStepExecutionModel): string {
        if (!execution.startDate) {
            return 'far fa-clock';
        } else if (!execution.endDate) {
            return 'fab fa-telegram-plane';
        } else {
            return 'fab fa-telegram-plane';
        }
    }
    public getExecutionTime(): string {
        let time;

        if (!this.genesisProcess.completedDate) {
            time = new Date().getTime() - new Date(this.genesisProcess.creationDate).getTime()
        } else {
            time = new Date(this.genesisProcess.completedDate).getTime() - new Date(this.genesisProcess.creationDate).getTime();
        }

        return ((time / 1000) / 60).toFixed(2) + ' minutos'
    }
    private handleGenesisProcess(genesisProcess: GenesisProcessModel): void {
        this.genesisProcess = genesisProcess;
        this.title = 'Detalhes da Execução';
        this.subTitle = this.genesisProcess._id;
        this.buildGenesisChartData(genesisProcess);
        this.lastUpdate = new Date();
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
            switchMap(() => this.genesisService.getProcessById(this.route.snapshot.params.id))
        ).subscribe(
            (genesisProcess: GenesisProcessModel) => this.handleGenesisProcess(genesisProcess),
            (error: HttpErrorResponse) => {
                this.openErrorMessageBox(error);
            }
        ));
    }
}
