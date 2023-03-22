import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { CreationComponent } from './creation/creation.component';
import { ProcessRoutingModule } from './process-routing.module';
import { SharedModule } from '../shared/components/shared.module';
import { PaginationModule } from '../shared/components/pagination/pagination.module';
import { ChartModule } from '../shared/components/chart/chart.module';
import { CommandDetailComponent } from './detail/command-detail/command-detail.component';



@NgModule({
    declarations: [
        ListComponent,
        DetailComponent,
        CreationComponent,
        CommandDetailComponent
    ],
    imports: [
        CommonModule,
        ProcessRoutingModule,
        SharedModule,
        PaginationModule,
        ChartModule
    ],
    entryComponents: [
        CommandDetailComponent
    ]
})
export class ProcessModule { }
