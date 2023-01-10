import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { SystemService } from '../../../core/system.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Input() title: string;
    @Input() subTitle: string;
    @Input() bullet: string;
    @Input() icon: string;

    subscriptions$: Subscription = new Subscription();

    isMobile = false;

    constructor(
        protected systemService: SystemService
    ) { }

    public ngOnInit(): void {
        this.watchNavBarMode();
    }
    public ngOnDestroy(): void {
        this.subscriptions$.unsubscribe();
    }

    protected watchNavBarMode(): void {
        this.subscriptions$.add(this.systemService.watchNavBarMode().subscribe(
            (mode: 'vertical' | 'horizontal' | 'mobile') => {
                this.isMobile = (mode === 'mobile');
            }
        ));
    }
}
