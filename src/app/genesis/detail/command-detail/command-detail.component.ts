import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ProcessModel } from '../../shared/model/process.model';
import { CommandExecutionModel } from '../../shared/model/command-execution.model';

@Component({
    selector: 'app-command-detail',
    templateUrl: './command-detail.component.html',
    styleUrls: ['./command-detail.component.scss']
})
export class CommandDetailComponent {

    constructor(
        public dialogRef: MatDialogRef<CommandDetailComponent>,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: { execution: CommandExecutionModel, process: ProcessModel }
    ) {}

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
