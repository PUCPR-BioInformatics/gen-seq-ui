import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenesisStates } from './genesis.states';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { CreationComponent } from './creation/creation.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: GenesisStates.list.path
    }, {
        path: GenesisStates.list.path,
        component: ListComponent,
    }, {
        path: GenesisStates.detail.path + '/:id',
        component: DetailComponent,
        pathMatch: 'full'
    }, {
        path: GenesisStates.creation.path,
        component: CreationComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class GenesisRoutingModule { }
