import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, combineLatest, interval } from 'rxjs';

import { filter, startWith, switchMap } from 'rxjs/operators';
import { SystemService } from '../../core/system.service';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { AbstractComponent } from '../../core/abstract.component';
import { GenesisProcessService } from '../genesis-process.service';
import { ProcessPaginatedModel } from '../shared/model/process-paginated.model';
import { PaginationModel } from '../../shared/model/pagination.model';
import { ProcessModel } from '../shared/model/process.model';
import { GenesisStates } from '../genesis.states';
import { ChartDataModel } from '../../shared/components/chart/model/chart-data.model';
import { ChartHelper } from '../../shared/helper/chart.helper';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent extends AbstractComponent {

    private TIMER = interval(2000).pipe(startWith(0));
    private FORCE_UPDATE = new BehaviorSubject<boolean>(true);
    private REQUESTING = false;

    public title: string;
    public subTitle: string;
    public genesisProcess: ProcessPaginatedModel;
    public pagination = {
        limit: 5,
        page: 1
    } as PaginationModel;

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService,
        public genesisProcessService: GenesisProcessService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
        this.initialize()
    }

    private handleGenesisProcessContainer(genesisProcess: ProcessPaginatedModel): void {
        this.genesisProcess = genesisProcess;
        this.title = 'Execuções';

        if (this.genesisProcess.size > 0) {
            this.subTitle = 'Encontradas ' + this.genesisProcess.size;
        } else {
            this.subTitle = 'Nenhuma Execução Encontrada';
        }
    }
    private initialize(): void {
        this.title = 'Buscando execuções';
        this.subTitle = 'Aguarde';

        this.initializeRoute();
        this.watchGenesisProcess();
    }
    private initializeRoute(): void {
        const queryParams = this.route.snapshot.queryParams;

        if (queryParams.page && queryParams.limit) {
            this.pagination = {
                limit: parseInt(queryParams.limit),
                page: parseInt(queryParams.page)
            }
        } else {
            this.pushPaginationState(true);
        }
    }
    private pushPaginationState(replace = false): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                limit: this.pagination.limit,
                page: this.pagination.page
            },
            replaceUrl: replace
        })
    }
    private trackById(index: number, item: ProcessModel): any {
        return item._id;
    }

    private watchGenesisProcess(): void {
        this.subscriptions$.add(combineLatest([
            this.TIMER,
            this.FORCE_UPDATE.pipe(filter((update) => update === true)),
        ]).pipe(
            filter((values: [number, boolean]) => {
                return !this.REQUESTING || values[1] === true
            }),
            switchMap(() => {
                this.REQUESTING = true;
                return this.genesisProcessService.getProcess({}, this.pagination);
            })
        ).subscribe(
            (genesisProcess: ProcessPaginatedModel) => {
                this.handleGenesisProcessContainer(genesisProcess);
                this.FORCE_UPDATE.next(false);
                this.REQUESTING = false;
            },
            (error: HttpErrorResponse) => {
                this.openErrorMessageBox(error);
            }
        ));
    }
    // public eventLimitChanged(limit: number): void {
    //     this.pagination.limit = limit;
    //     this.forceUpdate();
    // }
    // public eventPageChanged(page: number): void {
    //     this.pagination.page = page;
    //     this.forceUpdate();
    // }
    // public eventNavigateToDetail(genesisProcess: ProcessModel): void {
    //     this.router.navigate(['./', genesisProcess._id], {
    //         relativeTo: this.route
    //     });
    // }
    // public eventNewExecution(): void {
    //     this.router.navigate(['./' + GenesisStates.genesis.subStates.creation.path ], {
    //         relativeTo: this.route
    //     });
    // }
    // private forceUpdate(): void {
    //     this.FORCE_UPDATE.next(true);
    //     this.pushPaginationState();
    // }
    // public getExecutionCompleteState(genesisExecution: ProcessModel): string {
    //     return this.isFailed(genesisExecution) ? 'Falhou' : 'Executado';
    // }
    // public getExecutionData(execution: ProcessModel): ChartDataModel {
    //     const total = execution.executions.length;
    //     const completeness = parseFloat((execution.completeness * 100).toFixed(0));
    //     const completenessText = isNaN(completeness) ? 'Sem dados' : completeness + '%';
    //     const completenessTooltip = ChartHelper.buildTooltip('Executado ' + completenessText, 'ui-chart-tooltip');
    //     const executedTooltip = ChartHelper.buildTooltip('Executado ' + completenessText, 'ui-chart-tooltip');
    //     const plots = [
    //         ChartHelper.buildGaugeGenericPlotDataModel(
    //             total, 0, 1, 52, 54,
    //             'ui-chart-gauge-meter-default',
    //             completenessTooltip
    //         )
    //     ];
    //     if (execution.step !== GenesisProcessStepEnum.WAITING) {
    //         const cssClass = (execution.step !== GenesisProcessStepEnum.COMPLETE) ? ['ui-linear-gradient-default-initial', 'ui-linear-gradient-default-endless'] :
    //             ['ui-linear-gradient-success-initial', 'ui-linear-gradient-success-endless'];
    //         const effect = ChartHelper.buildGradientEffect(
    //             'gradient-execution-' + new Date().getTime() + execution._id,
    //             { class: cssClass[0], offset: '0%' },
    //             { class: cssClass[1], offset: '100%'},
    //             ['stroke', 'fill']
    //         );
    //         const executionPloCssClass = (execution.completedDate) ? 'ui-chart-gauge-meter-path': 'ui-chart-gauge-meter-path ui-chart-gauge-pulse';
    //         plots.push(
    //             ChartHelper.buildGaugeGenericPlotDataModel(
    //                 total, 0, 1 * execution.completeness,
    //                 50, 56, executionPloCssClass,
    //                 executedTooltip,
    //                 [effect]
    //             )
    //         );
    //     }
    //     return {
    //         tooltip: completenessTooltip,
    //         informations: {
    //             progress: ChartHelper.buildContextInformation(completenessText, 0, 10)
    //         },
    //         size: {
    //             width: 220,
    //             height: 140
    //         },
    //         plots
    //     } as ChartDataModel;
    // }
    // public getExecutionTime(execution: ProcessModel): string {
    //     let time;
    //
    //     if (!execution.completedDate) {
    //         time = new Date().getTime() - new Date(execution.creationDate).getTime()
    //     } else {
    //         time = new Date(execution.completedDate).getTime() - new Date(execution.creationDate).getTime();
    //     }
    //
    //     return (time / 1000 / 60).toFixed(2) + ' minutos'
    // }

    // private isFailed(genesisExecution: ProcessModel): boolean {
    //     return genesisExecution.result.status === 'fail';
    // }



}
