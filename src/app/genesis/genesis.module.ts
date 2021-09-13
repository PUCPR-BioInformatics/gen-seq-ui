import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenesisProcessSummaryComponent } from './genesis-process-summary/genesis-process-summary.component';
import { GenesisProcessDetailComponent } from './genesis-process-detail/genesis-process-detail.component';
import { GenesisProcessCreationComponent } from './genesis-process-creation/genesis-process-creation.component';
import { GenesisRoutingModule } from './genesis-routing.module';
import { SharedModule } from '../shared/components/shared.module';
import { PaginationModule } from '../shared/components/pagination/pagination.module';
import { ChartModule } from '../shared/components/chart/chart.module';
import { GenesisProcessExecutionDetailComponent } from './genesis-process-detail/genesis-process-execution-detail/genesis-process-execution-detail.component';



@NgModule({
    declarations: [
        GenesisProcessSummaryComponent,
        GenesisProcessDetailComponent,
        GenesisProcessCreationComponent,
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
