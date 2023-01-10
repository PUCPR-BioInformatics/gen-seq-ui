import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header.component';
import { HeaderTitleOptionsDirective } from './header-title-options.directive';
import { HeaderAdditionalContentDirective } from './header-additional-content.directive';

@NgModule({
    declarations: [
        HeaderComponent,
        HeaderTitleOptionsDirective,
        HeaderAdditionalContentDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        HeaderComponent,
        HeaderTitleOptionsDirective,
        HeaderAdditionalContentDirective
    ]
})
export class HeaderModule { }
