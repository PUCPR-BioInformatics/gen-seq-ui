import { Component, Inject, TemplateRef } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormGroup } from '@angular/forms';

import { SortModel } from '../model/sort.model';
import { FilterSortModalOptionsModel } from '../model/filter-sort-modal-options.model';
import { SortedModel } from '../model/sorted.model';
import { AbstractComponent } from '../../../../core/abstract.component';
import { SystemService } from '../../../../core/system.service';
import { MessageBoxService } from '../../message-box/message-box.service';
import { FormHelper } from '../../../helper/form.helper';

@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-sort-modal.component.html',
    styleUrls: ['./filter-sort-modal.component.scss']
})
export class FilterSortModalComponent extends AbstractComponent {
    formGroup: FormGroup;
    filter: any;
    formulary: TemplateRef<any>;
    sortNames: Array<SortModel>;
    sorted: SortedModel;

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService,
        public dialogRef: MatBottomSheetRef<FilterSortModalComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: FilterSortModalOptionsModel
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
        this.formGroup = this.data.formGroup;
        this.formulary = this.data.formulary;
        this.sortNames = this.data.sortNames;
        this.sorted = (this.data.actualSorted) ? { ...this.data.actualSorted } : { name: null, ascending: false };
    }

    public eventCancelFilterSort(): void {
        this.dialogRef.dismiss(null);
    }
    public eventFilteredSortered(): void {
        if (this.formGroup && !this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }

        this.dialogRef.dismiss({
            filtered: (this.formGroup) ? FormHelper.getRawValueNotNull(this.formGroup) : null,
            sorted: (this.sorted.name) ? this.sorted : null
        });
    }
    public eventSortChange(checked: boolean, sort: SortModel): void {
        if (checked) {
            this.sorted.name = sort.name;
        } else if (this.sorted.name === sort.name) {
            this.sorted.name = null;
        }
    }
}
