import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { CreationComponent } from './creation/creation.component';
import { ProcessRoutingModule } from './process-routing.module';
import { SharedModule } from '../shared/components/shared.module';
import { PaginationModule } from '../shared/components/pagination/pagination.module';
import { ChartModule } from '../shared/components/svg-component/chart/chart.module';
import { CommandDetailComponent } from './detail/command-detail/command-detail.component';
import { SequenceNodeModule } from '../shared/components/svg-component/sequence-node/sequence-node.module';

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
        SequenceNodeModule,
        SharedModule,
        PaginationModule,
        ChartModule
    ],
    entryComponents: [
        CommandDetailComponent
    ]
})
export class ProcessModule { }
