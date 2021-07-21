import { Component } from '@angular/core';

import { SystemService } from '../core/system.service';
import { AbstractComponent } from '../core/abstract.component';
import { MessageBoxService } from '../shared/components/message-box/message-box.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends AbstractComponent {
    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService
    ) {
        super(systemService, messageBoxService);
    }
}
