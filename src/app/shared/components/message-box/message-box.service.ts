import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import { MessageBoxComponent } from './message-box.component';
import { MessageBoxOptionsModel } from './model/message-box-options.model';

@Injectable({ providedIn: 'root' })
export class MessageBoxService {
    public closed = false;

    private isMessage = false;

    private messageBox: MatDialogRef<MessageBoxComponent, any> = null;
    private opens: Array<number> = [];

    constructor(
        public dialog: MatDialog
    ) {}

    public closeMessageBox(force?: boolean): void {
        this.opens.pop();

        if (force || this.opens.length === 0) {
            this.closed = true;
            this.opens = [];

            if (this.hasMessageBoxComponent()) {
                this.messageBox.componentInstance.eventClose(null);
                this.messageBox = null;
            }
        }
    }
    public getMessageBox(): MatDialogRef<MessageBoxComponent> {
        return this.messageBox;
    }
    public eventError(message: string): void {
        this.messageBox.componentInstance.eventErrorOnReturn(new Error(message));
    }
    public hasMessageBoxComponent(): boolean {
        return this.messageBox && this.messageBox.componentInstance != null;
    }
    public openMessageBox(options: MessageBoxOptionsModel): MatDialogRef<MessageBoxComponent> {
        if (options.type !== 'loading' && this.hasMessageBoxComponent()) {
            this.closeMessageBox(true);
            this.isMessage = true;
        }

        if (options.type !== 'loading' || this.opens.length === 0) {
            this.closed = false;
            this.messageBox = this.dialog.open(MessageBoxComponent, {
                backdropClass: (options.type === 'loading') ? 'ui-modal-backdrop' : 'ui-modal-dark-backdrop',
                panelClass: (options.type === 'loading') ? 'ui-loading-panel' : undefined,
                data: options,
                disableClose: options.disableClose,
            });
        }

        if (options.type === 'loading') {
            this.opens.push(1);
        }

        return this.messageBox;
    }
}
