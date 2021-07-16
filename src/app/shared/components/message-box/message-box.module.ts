import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { MessageBoxComponent } from './message-box.component';
import { SharedModule } from '../shared.module';

@NgModule({
    declarations: [
        MessageBoxComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatDialogModule,
        RouterModule
    ],
    exports: [
        MessageBoxComponent,
        MatDialogModule
    ],
    entryComponents: [
        MessageBoxComponent
    ]
})
export class MessageBoxModule { }
