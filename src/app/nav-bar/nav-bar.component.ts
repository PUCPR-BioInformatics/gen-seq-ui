import { Component, Input, HostBinding, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

import { BehaviorSubject } from 'rxjs';

import { AbstractComponent } from '../core/abstract.component';
import { AppState } from '../shared/model/app-state';
import { MessageBoxService } from '../shared/components/message-box/message-box.service';
import { SystemService } from '../core/system.service';
import { UserComponentService } from '../user/user-component.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent extends AbstractComponent implements AfterViewInit {
    @HostBinding('class') classes;

    @Input() userStates: Array<AppState>;

    initialized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    mode: 'vertical' | 'horizontal' | 'mobile' = 'vertical';
    retracted: boolean;
    actualState: AppState;
    actualSubState: AppState;
    systemSubtitle = 'from PUCPR Bioinformatics Lab';
    menu: MatMenuTrigger;

    constructor(
        public systemService: SystemService,
        public messageBoxService: MessageBoxService,
        public userComponentService: UserComponentService,
        public router: Router
    ) {
        super(systemService, messageBoxService);
    }

    public ngOnInit(): void {
        this.watchNavBarMode();
        this.watchState();
        this.watchRetraction();
    }

    public ngAfterViewInit(): void {
        this.initialized$.next(true);
        if (this.mode === 'mobile' || this.retracted) {
            this.disableOptionsAlias();
        } else {
            this.enableOptionsAlias();
        }
    }
    private disableOptionsAlias(): void {
        if (this.initialized$.getValue()) {
            const navBarStates: HTMLElement = document.getElementsByClassName('ui-nav-bar-states').item(0) as HTMLElement;
            const statesAlias = navBarStates.getElementsByClassName('ui-nav-bar-state-alias');
            for (const stateAlias of Object.keys(statesAlias)) {
                (statesAlias[stateAlias] as HTMLElement).hidden =  true;
            }
        }
    }
    private enableOptionsAlias(): void {
        if (this.initialized$.getValue()) {
            const navBarStates: HTMLElement = document.getElementsByClassName('ui-nav-bar-states').item(0) as HTMLElement;
            const statesAlias = navBarStates.getElementsByClassName('ui-nav-bar-state-alias');
            for (const stateAlias of Object.keys(statesAlias)) {
                (statesAlias[stateAlias] as HTMLElement).hidden =  false;
            }
        }
    }
    public eventNavigateToHome(): void {
        this.router.navigate([this.systemService.getHomePath()]);
    }
    public eventNavigateTo(state: AppState): void {
        this.actualState = state;
        this.router.navigate([state.path]);
    }
    public eventRetract(): void {
        this.systemService.setRetraction(!this.retracted);
    }
    public eventUserProfilePanel(): void {
        this.userComponentService.openUserProfilePanel();
    }
    public getSystemName(): string {
        return this.systemService.getSystemName();
    }
    protected watchNavBarMode(): void {
        this.subscriptions$.add(this.systemService.watchNavBarMode().subscribe(
            (mode: 'vertical' | 'horizontal' | 'mobile') => {
                this.mode = mode;
                this.classes = 'ui-nav-bar';

                if (this.mode === 'mobile') {
                    this.classes += ' ui-nav-bar-mobile';
                } else if (this.mode === 'horizontal') {
                    this.classes += ' ui-nav-bar-horizontal';
                } else if (this.mode === 'vertical') {
                    this.classes += ` ui-nav-bar-vertical ${(this.retracted) ? 'ui-nav-bar-retracted' : ''}`;
                }

                if (this.retracted || this.mode === 'mobile') {
                    this.disableOptionsAlias();
                } else {
                    this.enableOptionsAlias();
                }
            }
        ));
    }
    protected watchRetraction(): void {
        this.subscriptions$.add(this.systemService.watchRetraction().subscribe(
            (retracted: boolean) => {
                this.retracted = retracted;

                if (retracted) {
                    if (this.mode === 'vertical') {
                        this.classes = 'ui-nav-bar ui-nav-bar-vertical ui-nav-bar-retracted';
                    }
                    this.disableOptionsAlias();
                } else if (this.mode !== 'mobile') {
                    if (this.mode === 'vertical') {
                        this.classes = 'ui-nav-bar ui-nav-bar-vertical';
                    }
                    this.enableOptionsAlias();
                }
            })
        );
    }
    private watchState(): void {
        this.subscriptions$.add(this.systemService.watchState().subscribe(
            (state: AppState) => this.actualState = state
        ));
        this.subscriptions$.add(this.systemService.watchSubState().subscribe(
            (state: AppState) => this.actualSubState = state
        ));
    }
}
