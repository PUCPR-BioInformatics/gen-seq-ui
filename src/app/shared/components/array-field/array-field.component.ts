import { Component, ElementRef, forwardRef, Input,  ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';

import { AbstractComponent } from '../../../core/abstract.component';
import { SystemService } from '../../../core/system.service';
import { MessageBoxService } from '../message-box/message-box.service';


@Component({
    selector: 'app-array-field',
    templateUrl: './array-field.component.html',
    styleUrls: ['./array-field.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ArrayFieldComponent),
        multi: true
    }]
})
export class ArrayFieldComponent extends AbstractComponent implements ControlValueAccessor {
    @ViewChild('arrayItems', { read: ElementRef } ) arrayMenu: ElementRef;
    @ViewChild('arrayItemsTrigger',  { read: ElementRef }) arrayMenuTrigger: ElementRef;
    @ViewChild('arrayItemsTrigger') arrayMenuTriggerRef: MatMenuTrigger;

    @Input() formControlName: string;
    @Input() disabled: boolean;
    @Input() label: string;
    @Input() type: 'string' | 'number';
    @Input() value: string = '';

    addableForm: FormGroup;
    changes: (value: string) => any;
    editing = false;
    valueAsArray: Array<string | number>;

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
        this.addableForm = new FormGroup({
            addable: new FormControl()
        });
    }

    public eventAddValue(): void {
        const control = this.addableForm.get('addable');
        const value: string | number = control.value;
        if (value && value !== '') {
            this.valueAsArray.push(value);
            this.value = this.valueAsArray.toString();
            control.setValue(null);
            this.changes(this.value);
        }
    }
    public eventArrayItemsOpened(): void {
        this.editing = true;
        const menuId = this.arrayMenuTriggerRef.menu.panelId;
        const arrayTriggerDom = this.arrayMenuTrigger.nativeElement as HTMLButtonElement;
        const menuDom = document.getElementById(menuId);

        menuDom.style.width = arrayTriggerDom.offsetWidth + 'px';
    }
    public eventArrayItemsClosed(): void {
        this.editing = false;
    }
    public eventRemoveValue(index: number, event: Event): void {
        this.valueAsArray.splice(index, 1);
        this.value = this.valueAsArray.toString();

        if (this.valueAsArray.length === 0 && this.editing) {
            this.editing = false;
            this.arrayMenuTriggerRef.closeMenu();
        }

        this.changes(this.value);
        event.stopPropagation();
    }
    /* eslint-disable
       @typescript-eslint/explicit-module-boundary-types,
       @typescript-eslint/no-unused-vars,
       @typescript-eslint/no-empty-function
    */
    public registerOnChange(fn: any): void {
        this.changes = fn;
    }
    public registerOnTouched(fn: any): void {
    }
    public setDisabledState(disabled: boolean): void {
        const control = this.addableForm.get('addable');
        this.disabled = disabled;
        if (this.disabled) {
            control.disable();
        } else {
            control.enable();
        }
    }
    public writeValue(val: string): void {
        this.value = val;
        this.valueAsArray = (!this.value) ? [] :
            this.value.split(',').map((value: string) => (this.type === 'number') ? parseFloat(value) : value);
    }
}
