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

@Component({
    selector: 'app-genesis-process-detail',
    templateUrl: './genesis-process-detail.component.html',
    styleUrls: ['./genesis-process-detail.component.scss']
})
export class GenesisProcessDetailComponent extends AbstractComponent {

    public TIMER = interval(2000).pipe(startWith(0));
    public genesisProcess: GenesisProcessModel;
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
    private handleGenesisProcess(genesisProcess: GenesisProcessModel): void {
        this.genesisProcess = genesisProcess;
        this.title = 'Detalhes da Execução';
        this.subTitle = this.genesisProcess._id;
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
