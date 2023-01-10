import { FormGroup, AbstractControl } from '@angular/forms';

export class FormHelper {

    public static getRawValueNotNull(form: FormGroup, excludes: Array<string> = []): any {
        const values: any = {};
        for (const field in form.controls) {
            if (form.get(field) !== null && form.get(field) !== undefined) {
                const control: AbstractControl = form.get(field);
                const controlValue: any = control.value;
                if (
                    !excludes.includes(field) && control.enabled &&
                    controlValue !== null && controlValue !== undefined &&
                    controlValue !== ''
                ) {
                    values[field] = controlValue;
                }
            }
        }
        return values;
    }

    /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
    public static setValues(form: FormGroup, values: any): void {
        for (const control in form.controls) {
            if (values[control]) {
                form.get(control).setValue(values[control]);
            } else {
                form.get(control).setValue(null);
            }
        }
    }
    /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
    public static equals(form: FormGroup, fields: any, ...ignore: Array<string>): boolean {
        if (ignore.length === 0) {
            return JSON.stringify(form.getRawValue()) === JSON.stringify(fields);
        } else {
            for (const field in fields) {
                if (form.get(field)) {
                    const control = form.get(field);
                    if (!ignore.includes(field) && (!control || control.value !== fields[field])) {
                        return false;
                    }
                }
            }
            return true;
        }
    }
}
