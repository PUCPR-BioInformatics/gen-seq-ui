import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UserExhibitionComponent } from './user-exhibition/user-exhibition.component';
import { UserModalComponent } from './user-modal.component';
import { SharedModule } from '../shared/components/shared.module';
import { MessageBoxModule } from '../shared/components/message-box/message-box.module';

@NgModule({
    providers: [],
    declarations: [
        UserExhibitionComponent,
        UserModalComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        MessageBoxModule
    ], exports: [
        UserModalComponent
    ], entryComponents: [
        UserModalComponent
    ]
})
export class UserModule {}
