import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
    @Input() boldMessage;
    @Input() message;
    @Input() completeness: string;
    @Input() completenessSize = '16px';
    @Input() height = '50px';
    @Input() type: 'semi' | 'full' = 'semi';
    @Input() width = '50px';
}
