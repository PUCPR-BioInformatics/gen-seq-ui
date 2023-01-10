import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationComponent } from './pagination.component';
import { SharedModule } from '../shared.module';

@NgModule({
    declarations: [
        PaginationComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        PaginationComponent
    ]
})
export class PaginationModule { }
