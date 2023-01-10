import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { FilterSortModalComponent } from './modal/filter-sort-modal.component';
import { SortModel } from './model/sort.model';
import { SortedModel } from './model/sorted.model';
import { ApplicationException } from '../../../core/exception/application.exception';
import { FormHelper } from '../../helper/form.helper';

@Component({
    selector: 'app-filter-sort',
    templateUrl: './filter-sort.component.html',
    styleUrls: ['./filter-sort.component.scss']
})
export class FilterSortComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() openFromFilter = true;
    @Input() sortNames: Array<SortModel>;
    @Output() filtered: EventEmitter<any> = new EventEmitter<any>();
    @Output() sorted: EventEmitter<SortedModel> = new EventEmitter<any>();

    @ViewChild('formulary') formulary: TemplateRef<any>;

    filterAsString: string;
    sortAsString: string;
    actualFilter: { [key: string]: boolean | string | number; };
    actualSorted: SortedModel;

    constructor(
        public dialog: MatBottomSheet
    ) { }

    public ngOnInit(): void {
        if (!this.formGroup && !this.sortNames) {
            throw new ApplicationException(
                /*eslint-disable-next-line max-len*/
                'Para usar este componente, é necessário que seja passado o formulário de filtro e/ou valores que poderam ser usados para o sort',
                'Erro ao carregar o filtro e sort'
            );
        } else if (this.formGroup) {
            this.handleFilter(FormHelper.getRawValueNotNull(this.formGroup));
        }
    }

    private cleanFilters(): void {
        if (!this.formGroup) {
            return;
        }

        const raw = this.formGroup.getRawValue();
        for (const key in raw) {
            if (raw[key]) {
                raw[key] = null;
            }
        }
        this.formGroup.setValue(raw);
        this.filterAsString = undefined;
        this.actualFilter = undefined;
        this.filtered.emit(undefined);
    }
    private cleanSort(): void {
        if (!this.sortNames) {
            return;
        }

        this.sortAsString = undefined;
        this.actualSorted = undefined;
    }
    public eventCleanFilter(): void {
        this.cleanFilters();
        this.cleanSort();
    }
    public eventOpenModal(): void {
        const oldValues = (this.formGroup) ? this.formGroup.getRawValue() : null;
        this.dialog.open(FilterSortModalComponent, {
            backdropClass: 'ui-genesis-process-execution-detail-dark-backdrop',
            data: {
                actualSorted: this.actualSorted,
                formGroup: this.formGroup,
                formulary: this.formulary,
                sortNames: this.sortNames
            }
        }).afterDismissed().subscribe(
            (result: { sorted: SortedModel; filtered: { [key: string]: string | boolean | number; }; }) => {
                if (result) {
                    this.handleFilter(result.filtered);
                    this.handleSort(result.sorted);
                } else if (this.formGroup) {
                    this.formGroup.setValue(oldValues);
                }
            }
        );
    }
    private handleFilter(filtered: { [key: string]: string | boolean | number; }): void {
        if (!this.formGroup || JSON.stringify(filtered) === JSON.stringify(this.actualFilter)) {
            return;
        }

        let allFilterAsString;
        if (this.filtered) {
            allFilterAsString = '';
            for (const name in filtered) {
                if (filtered[name]) {
                    allFilterAsString += name + '=' + filtered[name] + ', ';
                }
            }
            allFilterAsString = allFilterAsString.replace(/, $/, '');
        }

        this.actualFilter = filtered;
        this.filterAsString = allFilterAsString;
        this.filtered.emit(this.actualFilter);
    }
    private handleSort(sorted: SortedModel): void {
        if (!this.sortNames || JSON.stringify(sorted) === JSON.stringify(this.actualSorted)) {
            return;
        }

        this.sortAsString = ((sorted) ? sorted.name + '=' + ((sorted.ascending) ? 'ascending' : 'descending') : null);
        this.actualSorted = sorted;
        this.sorted.emit(this.actualSorted);
    }
}
