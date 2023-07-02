import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppStates } from './app.states';

import { environment } from '../environments/environment';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: AppStates.home.path,
        pathMatch: 'full',
    }, {
        path: 'pipeline',
        loadChildren: () => import('./process/process.module').then((m => m.ProcessModule))
    }, {
        path: AppStates.home.path,
        pathMatch: 'full',
        component: HomeComponent
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
