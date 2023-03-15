import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppStates } from './app.states';

import { environment } from '../environments/environment';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./genesis/genesis.module').then((m => m.GenesisModule))
    }, {
        path: AppStates.error.path,
        pathMatch: 'full',
        component: ErrorComponent
    }, {
        path: '**',
        pathMatch: 'full',
        redirectTo: AppStates.error.path
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { enableTracing: environment.isEnabledRouteTracing })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
