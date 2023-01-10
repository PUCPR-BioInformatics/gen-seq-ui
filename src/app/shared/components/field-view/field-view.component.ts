import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-field-view',
    templateUrl: './field-view.component.html',
    styleUrls: ['./field-view.component.scss']
})
export class FieldViewComponent implements OnInit {
    @Input() label: string;
    @Input() value: string | boolean | Date | number;
    @Input() icon = false;
    @Input() isDate = false;

    public type: 'string' | 'date' | 'icon' | 'boolean' | 'number';

    public ngOnInit(): void {
        this.checkType();
    }

    private checkType(): void {
        const valueTypeOf = typeof this.value;
        if (this.value === undefined || this.value === null) {
            this.type = 'string';
            this.value = 'Sem valor';
        } else if (this.isDate) {
            this.type = 'date';
        } else if (this.icon) {
            if (valueTypeOf === 'boolean') {
                this.value = (this.value) ? 'check' : 'close';
            }
            this.type = 'icon';
        } else if (valueTypeOf === 'boolean') {
            this.type = 'boolean';
        } else if (this.isNumber(valueTypeOf)) {
            this.type = 'number';
        } else if (this.value instanceof Date || !isNaN(Date.parse(this.value as string))) {
            this.type = 'date';
        } else {
            this.type = 'string';
        }
    }
    /* eslint-disable-next-line  @typescript-eslint/explicit-module-boundary-types */
    public getDateFromValue(value: any): Date {
        return new Date(value);
    }
    private isNumber(valueTypeOf: string): boolean {
        return valueTypeOf === 'number' || (valueTypeOf === 'string' && (this.value as string).trim().search(/^\d+$/) > -1);
    }
}
