import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { GenesisExecutionTimerModel } from '../../shared/model/genesis-execution-timer.model';
import { GenesisProcessModel } from '../../shared/model/genesis-process.model';

@Component({
    selector: 'app-genesis-process-execution-detail',
    templateUrl: './genesis-process-execution-detail.component.html',
    styleUrls: ['./genesis-process-execution-detail.component.scss']
})
export class GenesisProcessExecutionDetailComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<GenesisProcessExecutionDetailComponent>,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: { execution: GenesisExecutionTimerModel, process: GenesisProcessModel }
    ) {}

    public ngOnInit(): void {

    }

    public eventDismiss(): void {
        this.dialogRef.close();
    }
    public getExecutionDetailStatus(): string {
        if (this.data.execution.result) {
            return this.data.execution.result.detail;
        } else if (this.data.execution.startDate) {
            return 'Executando...';
        } else {
            return (this.data.process.completedDate) ? 'Não Executado' : 'Aguardando'
        }
    }
    public getExecutionTime(): string {
        let time;

        if (!this.data.execution.endDate) {
            time = new Date().getTime() - new Date(this.data.execution.startDate).getTime()
        } else {
            time = new Date(this.data.execution.endDate).getTime() - new Date(this.data.execution.startDate).getTime();
        }

        return ((time / 1000) / 60).toFixed(2) + ' minutos'
    }

}
