import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenesisStates } from './genesis.states';
import { GenesisProcessSummaryComponent } from './genesis-process-summary/genesis-process-summary.component';
import { GenesisProcessDetailComponent } from './genesis-process-detail/genesis-process-detail.component';
import { GenesisProcessCreationComponent } from './genesis-process-creation/genesis-process-creation.component';


const routes: Routes = [
    {
        path: '',
        component: GenesisProcessSummaryComponent
    }, {
        path: GenesisStates.genesis.subStates.creation.path,
        component: GenesisProcessCreationComponent
    }, {
        path: GenesisStates.genesis.subStates.detail.path,
        component: GenesisProcessDetailComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class GenesisRoutingModule { }
