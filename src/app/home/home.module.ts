import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './error.component';
import { SharedModule } from '../shared/components/shared.module';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        HomeComponent
    ]
})
export class HomeModule { }
