import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorComponent } from './error.component';
import { SharedModule } from '../shared/components/shared.module';

@NgModule({
    declarations: [
        ErrorComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        ErrorComponent
    ]
})
export class ErrorModule { }
