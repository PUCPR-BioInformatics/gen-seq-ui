import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterSortComponent } from './filter-sort.component';
import { FilterSortModalComponent } from './modal/filter-sort-modal.component';
import { FilterFormularyDirective } from './filter-formulary.directive';
import { SharedModule } from '../shared.module';

@NgModule({
    declarations: [
        FilterSortComponent,
        FilterSortModalComponent,
        FilterFormularyDirective
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        FilterSortComponent,
        FilterSortModalComponent,
        FilterFormularyDirective
    ]
})
export class FilterSortModule { }
