import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, combineLatest, interval } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';

import { SystemService } from '../../core/system.service';
import { MessageBoxService } from '../../shared/components/message-box/message-box.service';
import { AbstractComponent } from '../../core/abstract.component';
import { ProcessService } from '../process.service';
import { ProcessPaginatedModel } from '../shared/model/process-paginated.model';
import { PaginationModel } from '../../shared/model/pagination.model';
import { ProcessModel } from '../shared/model/process.model';
import { ProcessStates } from '../process.states';
import { STEP_STYLE } from '../shared/const/step-styling.const';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent extends AbstractComponent {

    private TIMER = interval(2000).pipe(startWith(0));
    public FORCE_UPDATE = new BehaviorSubject<boolean>(true);
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
        public genesisProcessService: ProcessService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
        this.initialize()
    }

    public eventNavigateToDetail(genesisProcess: ProcessModel): void {
        this.router.navigate([ProcessStates.detail.path, genesisProcess._id]);
    }
    public eventNewExecution(): void {
        this.router.navigate([ ProcessStates.creation.path ]);
    }
    public eventLimitChanged(limit: number): void {
        this.pagination.limit = limit;
        this.forceUpdate();
    }
    public eventPageChanged(page: number): void {
        this.pagination.page = page;
        this.forceUpdate();
    }
    public getProcessFinalStatus(process: ProcessModel): string {
        return (process.result.status === 'FAIL') ? 'Failed' : 'Completed';
    }
    public getStepClass(process: ProcessModel): string {
        if (process.completedDate) {
            return (process.result.status === 'FAIL') ? STEP_STYLE['ERROR'].class : STEP_STYLE['COMPLETE'].class;
        } else {
            return STEP_STYLE[process.actualCommandName].class;
        }
    }
    public getStepIcon(process: ProcessModel): string {
        if (process.completedDate) {
            return (process.result.status === 'FAIL') ?
                STEP_STYLE['ERROR'].icon : STEP_STYLE['COMPLETE'].icon;
        } else {
            return STEP_STYLE[process.actualCommandName].icon;
        }
    }
    public getStepName(process: ProcessModel): string {
        if (process.completedDate) {
            return 'Completed';
        } else {
            const preName = process.actualCommandName.replace(/_/g, ' ').toLowerCase();
            return preName.substring(0, 1).toUpperCase() + preName.substring(1);
        }
    }
    private forceUpdate(): void {
        this.FORCE_UPDATE.next(true);
        this.pushPaginationState();
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
    public trackById(index: number, item: ProcessModel): any {
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
}
