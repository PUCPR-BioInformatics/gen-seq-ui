import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessStates } from './process.states';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { CreationComponent } from './creation/creation.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: ProcessStates.list.path
    }, {
        path: ProcessStates.list.path,
        component: ListComponent,
    }, {
        path: ProcessStates.detail.path + '/:id',
        component: DetailComponent,
        pathMatch: 'full'
    }, {
        path: ProcessStates.creation.path,
        component: CreationComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ProcessRoutingModule { }
