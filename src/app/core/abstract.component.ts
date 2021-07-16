import { OnInit, OnDestroy, HostBinding, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { SystemService } from './system.service';
import { MessageBoxService } from '../shared/components/message-box/message-box.service';
import { MessageBoxComponent } from '../shared/components/message-box/message-box.component';
import { ApplicationException } from './exception/application.exception';
import { MessageBoxLoaderOptionsModel } from '../shared/components/message-box/model/message-box-loader-options.model';

@Component({
    template: ''
})
export abstract class AbstractComponent implements OnInit, OnDestroy {
    @HostBinding('class') classes = 'ui-themed-container';

    public subscriptions$: Subscription = new Subscription();
    public loading: boolean;

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService
    ) {}

    /*eslint-disable-next-line @typescript-eslint/no-empty-function*/
    public ngOnInit(): void {
    }
    public ngOnDestroy(): void {
        this.subscriptions$.unsubscribe();
        this.messageBoxService.closeMessageBox(true);
    }

    public openErrorMessageBox(
        exception: HttpErrorResponse | ApplicationException, several?: boolean
    ): MatDialogRef<MessageBoxComponent> {
        return this.messageBoxService.openMessageBox({
            actualTheme: this.systemService.getTheme(),
            iteraction: (several) ? 'several' : 'confirm',
            disableClose: true,
            type: 'error',
            exception,
            icon: 'fas fa-bomb'
        });
    }
    public openSuccessMessageBox(
        detail: string, description: string,
        link?: string, linkMessage?: string
    ): MatDialogRef<MessageBoxComponent> {
        return this.messageBoxService.openMessageBox({
            description,
            detail,
            link,
            linkMessage,
            iteraction: 'confirm',
            disableClose: false,
            type: 'normal',
            icon: 'far fa-thumbs-up',
            actualTheme: this.systemService.getTheme()
        });
    }
    public openWarningMessageBox(
        detail: string, description: string, iteraction: 'choice' | 'confirm'
    ): MatDialogRef<MessageBoxComponent>  {
        return this.messageBoxService.openMessageBox({
            iteraction,
            disableClose: true,
            type: 'warning',
            icon: 'fas fa-shield-alt',
            detail,
            description,
            actualTheme: this.systemService.getTheme()
        });
    }
    protected loadingState(description?: string): void {
        this.loading = true;
        this.messageBoxService.openMessageBox({
            iteraction: 'none',
            type: 'loading',
            disableClose: true,
            description,
            actualTheme: this.systemService.getTheme()
        });
    }
    protected loadingStateWithLoaderOptions(loaderOptions?: MessageBoxLoaderOptionsModel): void {
        this.loading = true;
        this.messageBoxService.openMessageBox({
            iteraction: 'none',
            type: 'loading',
            disableClose: true,
            loaderOptions,
            actualTheme: this.systemService.getTheme()
        });
    }
    protected loadingStateDone(): void {
        if (this.loading) {
            this.loading = false;
            this.messageBoxService.closeMessageBox();
        }
    }
}
