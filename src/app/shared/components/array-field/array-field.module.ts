import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArrayFieldComponent } from './array-field.component';
import { SharedModule } from '../shared.module';

@NgModule({
    declarations: [
        ArrayFieldComponent
    ],
    exports: [
        ArrayFieldComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class ArrayFieldModule { }
