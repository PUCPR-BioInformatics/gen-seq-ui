import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppStates } from './app.states';

import { HomeComponent } from './home/home.component';
import { environment } from '../environments/environment';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: AppStates.home.path
    }, {
        path: AppStates.home.path,
        pathMatch: 'full',
        component: HomeComponent,
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
