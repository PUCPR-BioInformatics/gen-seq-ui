import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MessageBoxService } from '../shared/components/message-box/message-box.service';
import { AbstractComponent } from '../core/abstract.component';
import { SystemService } from '../core/system.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends AbstractComponent implements OnInit {
    public message: string;
    public boldMessage: string;
    public subTitle: string;
    public title: string;
    public icon: string;

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService,
        private router: ActivatedRoute
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }
}
