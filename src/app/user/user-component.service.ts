import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Injectable } from '@angular/core';

import { UserModalComponent } from './user-modal.component';

@Injectable({
    providedIn: 'root'
})
export class UserComponentService {

    constructor(
        public dialog: MatBottomSheet,
    ) {}

    public openUserProfilePanel(): void {
        this.dialog.open(UserModalComponent, {
            panelClass: 'ui-user-profile-panel',
            backdropClass: 'ui-genesis-process-execution-detail-dark-backdrop'
        });
    }
}
