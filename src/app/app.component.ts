import { Component, HostBinding, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppState } from './shared/model/app-state';
import { SystemService } from './core/system.service';
import { MessageBoxService } from './shared/components/message-box/message-box.service';
import { StateGuardService } from './core/security/state-guard.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    @HostBinding('class') protected classes = 'ui-container';

    protected routeState$: BehaviorSubject<NavigationEnd> = new BehaviorSubject<NavigationEnd>(undefined);
    protected subscriptions$: Subscription = new Subscription();

    protected navBarMode: 'horizontal' | 'mobile' | 'vertical' = 'vertical';
    protected navBarRetracted = true;
    protected systemId = 'gen-seq-api';
    protected systemName = 'Genesis Seq';
    public body: HTMLElement = document.querySelector('body');
    public userStates: Array<AppState>;

    constructor(
        protected systemService: SystemService,
        protected titleService: Title,
        protected router: Router,
        protected messageBoxService: MessageBoxService,
        protected stateGuard: StateGuardService
    ) {}

    public ngOnInit(): void {
        this.titleService.setTitle(this.systemName);
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(this.routeState$);
        this.initializeApplication().subscribe((loaded: boolean) => {
            if (loaded) {
                this.loaded();
            }
        });
    }
    public ngOnDestroy(): void {
        this.subscriptions$.unsubscribe();
        this.messageBoxService.closeMessageBox(true);
    }

    private getUserStates(): void {
        this.userStates = this.stateGuard.getUserStates();
    }
    protected initializeApplication(): Observable<boolean> {
        return this.systemService.initialize(this.systemId, this.systemName, this.navBarMode, this.navBarRetracted);
    }
    public loaded(): void {
        const loadingPanel: HTMLElement = document.getElementById('loading-panel');
        const initializer: HTMLElement = document.getElementById('initialize-theme');

        if (loadingPanel) {
            loadingPanel.remove();
        }
        if (initializer) {
            initializer.remove();
        }

        this.getUserStates();

        this.watchTheme();
        this.watchUrl();
        this.watchNavBarMode();
        this.watchResize();
    }
    protected updateStateAndSubState(event: NavigationEnd): void {
        if (!this.userStates) {
            this.systemService.setState(null);
            this.systemService.setSubState(null);

            if (this.classes === 'ui-container-mobile') {
                this.classes = 'ui-container-mobile-login';
            }
            return;
        }
        const fullUrl = (event.url === '/') ? event.urlAfterRedirects : event.url;
        const urls = fullUrl.replace('/', '').replace(/\?.*/, '').split('/');
        this.systemService.setState(this.userStates.find((state: AppState) => urls[0] === state.name));
        // Todo coletar os sub states e setar na linha abaixo.
        this.systemService.setSubState(null);

        if (this.classes === 'ui-container-mobile-login') {
            this.classes = 'ui-container-mobile';
        }
    }
    protected watchNavBarMode(): void {
        this.systemService.watchNavBarMode().subscribe(
            (mode: 'horizontal' | 'mobile' | 'vertical') => {
                if (mode === 'horizontal') {
                    this.classes = 'ui-container-horizontal';
                    this.navBarMode = mode;
                } else if (mode === 'mobile') {
                    this.classes = 'ui-container-mobile';
                } else {
                    this.classes = 'ui-container';
                    this.navBarMode = mode;
                }
            }
        );
    }
    @HostListener('window:resize', ['$event'])
    protected watchResize(): void {
        const windowWidth = window.innerWidth;
        if (windowWidth < 1000) {
            this.systemService.setNavBarMode('mobile');
        } else {
            this.systemService.setNavBarMode(this.navBarMode, true);
        }
    }
    protected watchTheme(): void {
        this.subscriptions$.add(this.systemService.watchTheme().subscribe((theme: string) => {
            this.body.className = theme;
        }));
    }
    protected watchUrl(): void {
        this.routeState$.subscribe(
            (event) => {
                if (event) {
                    this.updateStateAndSubState(event as NavigationEnd);
                }
            }
        );
    }
}
