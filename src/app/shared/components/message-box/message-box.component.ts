import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApplicationException } from '../../../core/exception/application.exception';
import { MessageBoxOptionsModel } from './model/message-box-options.model';

@Component({
    selector: 'app-message-box',
    templateUrl: './message-box.component.html',
    styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit, OnDestroy {
    public detail: string = null;
    public link: string = null;
    public linkMessage: string = null;
    public description: string = null;
    public exception: Error = null;
    public linkClicked = false;
    public code: number;

    constructor(
        public dialogRef: MatDialogRef<MessageBoxComponent>,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: MessageBoxOptionsModel
    ) {}

    public ngOnInit(): void {
        if (this.data.exception) {
            this.eventError(this.data.exception);
        }

        this.linkClicked = false;
        if (this.data.detail) {
            this.detail = this.data.detail;
        }
        if (this.data.description) {
            this.description = this.data.description;
        }
        if (this.data.link) {
            this.link = this.data.link;
            this.linkMessage = this.data.linkMessage;
        }
    }
    public ngOnDestroy(): void {
        if (this.linkClicked) {
            this.router.navigate([this.link]);
        }
    }

    private applicationException(applicationException: ApplicationException): void {
        this.detail = applicationException.detail;
        this.description = applicationException.description;
    }
    public getMessageBoxClass(): string {
        let cssClass = 'ui-message-box ';
        if (this.data.type === 'error') {
            cssClass += 'ui-message-box-error';
        } else if (this.data.type === 'warning') {
            cssClass += 'ui-message-box-warning';
        } else if (this.data.type === 'loading') {
            cssClass += 'ui-message-box-loading';
        } else {
            cssClass += 'ui-message-box-normal';
        }

        return cssClass;
    }
    public getThemedContainerClass(): string {
        return 'ui-themed-container ' + this.data.actualTheme;
    }
    private httpException(exception: HttpErrorResponse): void {
        if (exception.error && exception.error.detail) {
            this.detail = exception.error.detail;
            this.description = exception.error.description;
        } else if (exception.status === 504) {
            this.description = 'Timeout entre os servidores.';
            this.code = 504;
        } else if (exception.status === 404) {
            this.description = 'Não foi possível obter resposta válida.';
            this.code = 404;
        } else if (exception.status === 400) {
            this.description = 'Parâmetros inválidos';
            this.code = 400;
        } else if (exception.status === 0) {
            this.description = 'Algo deu errado!';
            this.detail = 'Estamos conectados?';
            this.code = 0;
            this.data.icon = 'fas fa-satellite-dish';
        } else {
            this.description = 'Algo deu errado!';
            console.error(exception);
        }
        this.exception = exception;
    }
    public eventClose(iteraction: string | { [key: string]: boolean | string; }): void {
        this.dialogRef.close(iteraction);
    }
    public eventErrorOnReturn(exception: Error): void {
        this.description = exception.message;
        this.exception = exception;
    }
    public eventError(exception: HttpErrorResponse | ApplicationException): void {
        if (exception instanceof HttpErrorResponse) {
            this.httpException(exception);
        } else if (exception instanceof ApplicationException) {
            this.applicationException(exception);
        } else {
            this.description = 'Erro não mapeado.';
            console.error(exception);
        }
    }
    public eventNavigateTo(): void {
        this.linkClicked = true;
        this.eventClose({ linked: true });
    }
}
