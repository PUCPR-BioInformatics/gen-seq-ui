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
import { GenesisExecutionTimerModel } from '../shared/model/genesis-execution-timer.model';

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
    public eventGenesisSummary(): void {
        this.router.navigate(['../'], {
            relativeTo: this.route
        });
    }
    public eventNewExecution(): void {
        this.router.navigate(['../' + GenesisStates.genesis.subStates.creation.path ], {
            relativeTo: this.route
        });
    }
    public getCssClass(execution: GenesisExecutionTimerModel): string {
        let cssClass = 'ui-process-execution ui-card ui-card-zoomed ';

        if (!execution.startDate) {
            cssClass += 'ui-process-execution-waiting';
        } else if (!execution.endDate) {
            cssClass += 'ui-process-execution-executing';
        } else {
            cssClass += 'ui-process-execution-done';
        }

        return cssClass;
    }
    public getExecutionStatus(execution: GenesisExecutionTimerModel): string {
        if (!execution.startDate) {
            return 'Agurdando';
        } else if (!execution.endDate) {
            return 'Em Execução';
        } else {
            return 'Concluído';
        }
    }
    public getExecutionIcon(execution: GenesisExecutionTimerModel): string {
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

        return (time / 1000 / 60).toFixed(2) + ' segundos'
    }
    private handleGenesisProcess(genesisProcess: GenesisProcessModel): void {
        this.genesisProcess = genesisProcess;
        this.title = 'Detalhes da Execução';
        this.subTitle = this.genesisProcess._id;
        this.buildGenesisChartData(genesisProcess);
    }
    private initialize(): void {
        this.title = 'Buscando a execução';
        this.subTitle = 'Aguarde';

        this.watchGenesisProcess();
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
