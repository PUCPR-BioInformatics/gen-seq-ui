import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/components/shared.module';
import { MessageBoxModule } from './shared/components/message-box/message-box.module';
import { NavBarModule } from './nav-bar/nav-bar.module';
import { UserModule } from './user/user.module';

const providers: Array<any> = [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
];

@NgModule({
    providers,
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
        MessageBoxModule,
        NavBarModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
