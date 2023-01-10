import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { AbstractComponent } from '../core/abstract.component';
import { MessageBoxService } from '../shared/components/message-box/message-box.service';
import { SystemService } from '../core/system.service';

@Component({
    selector: 'app-user',
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent extends AbstractComponent {

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService,
        public dialogRef: MatBottomSheetRef<UserModalComponent>
    ) {
        super(systemService, messageBoxService);
    }

    public eventClose(): void {
        this.dialogRef.dismiss();
    }
}
