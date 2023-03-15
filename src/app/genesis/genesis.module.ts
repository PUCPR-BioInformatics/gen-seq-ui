import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { CreationComponent } from './creation/creation.component';
import { GenesisRoutingModule } from './genesis-routing.module';
import { SharedModule } from '../shared/components/shared.module';
import { PaginationModule } from '../shared/components/pagination/pagination.module';
import { ChartModule } from '../shared/components/chart/chart.module';
import { GenesisProcessExecutionDetailComponent } from './detail/genesis-process-execution-detail/genesis-process-execution-detail.component';



@NgModule({
    declarations: [
        ListComponent,
        DetailComponent,
        CreationComponent,
        GenesisProcessExecutionDetailComponent
    ],
    imports: [
        CommonModule,
        GenesisRoutingModule,
        SharedModule,
        PaginationModule,
        ChartModule
    ],
    entryComponents: [
        GenesisProcessExecutionDetailComponent
    ]
})
export class GenesisModule { }
