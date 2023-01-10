import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldViewComponent } from './field-view.component';

@NgModule({
    declarations: [
        FieldViewComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        FieldViewComponent
    ]
})
export class FieldViewModule { }
