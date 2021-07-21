import { FormGroup } from '@angular/forms';
import { TemplateRef } from '@angular/core';

import { SortModel } from './sort.model';
import { SortedModel } from './sorted.model';

export interface FilterSortModalOptionsModel {
    formGroup: FormGroup;
    formulary: TemplateRef<any>;
    sortNames: Array<SortModel>;
    actualSorted: SortedModel;
}
