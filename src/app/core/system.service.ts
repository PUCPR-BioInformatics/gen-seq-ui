import { Injectable } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import SystemApi from 'src/assets/system-api.json';
import { environment } from 'src/environments/environment';
import { ALL_THEMES } from './themes';
import { AppStates } from '../app.states';
import { AppState } from '../shared/model/app-state';
import { ThemeModel } from '../shared/model/theme.model';

@Injectable({
    providedIn: 'root'
})
export class SystemService {

    protected static NOT_CLEANABLE = ['current-theme', 'retracted', 'navBarMode'];
    public TOKEN_VERIFICATION_TIME = 60000;
    protected WS_RECONNECT_INTERVAL = 1000;

    protected currentState$: BehaviorSubject<AppState> = new BehaviorSubject(null);
    protected currentSubState$: BehaviorSubject<AppState> = new BehaviorSubject(null);
    protected currentTheme$: BehaviorSubject<string> = new BehaviorSubject(null);
    protected initialized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
    protected isSigningOut = false;
    protected isDeviceMobile = false;
    protected retracted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(undefined);
    protected navBarMode$: BehaviorSubject<'vertical' | 'horizontal' | 'mobile'> = new BehaviorSubject(undefined);

    public systemId: string;
    public systemName: string;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute
    ) {}


    public getApiPath(api: string): string {
        return SystemApi[environment.apiProfile][api];
    }
    public getAppStates(): { [key: string]: AppState; } {
        return AppStates;
    };
    public getErrorPath(): string {
        return '/error';
    }
    public getHomePath(): string {
        return '/home';
    }
    public getNavBarMode(): 'vertical' | 'horizontal' | 'mobile' {
        return this.navBarMode$.getValue();
    }
    public getRetract(): boolean {
        return this.retracted$.getValue();
    }
    public getSessionVariable(key: string): string {
        return localStorage.getItem(key);
    }
    public getSessionVariableAsBoolean(key: string): boolean {
        return (this.getSessionVariable(key) === 'true') ? true : false;
    }
    public getSessionVariableAsJson(key: string): any {
        return JSON.parse(this.getSessionVariable(key));
    }
    public getState(): AppState {
        return this.currentState$.getValue();
    }
    public getSubState(): AppState {
        return this.currentSubState$.getValue();
    }
    public getSystemId(): string {
        return this.systemId;
    }
    public getSystemName(): string {
        return this.systemName;
    }
    public getTheme(): string {
        return this.currentTheme$.getValue();
    }
    public getThemes(): Array<ThemeModel> {
        return ALL_THEMES;
    }
    public getToken(): string {
        return this.getSessionVariable('token');
    }
    public initialize(
        systemId: string, systemName: string,
        navBarMode: 'vertical' | 'horizontal' | 'mobile', navBarRetracted: boolean
    ): Observable<boolean> {
        if (!this.initialized$.getValue()) {
            this.systemId = systemId;
            this.systemName = systemName;

            this.initializeTheme();
            this.initializeRetraction(navBarRetracted);
            this.initializeNavBarMode(navBarMode);
            this.initialized$.next(true);
        }
        return this.initialized$;
    }
    protected initializeNavBarMode(navBarMode: 'vertical' | 'horizontal' | 'mobile'): void {
        const userNavBarMode = this.getSessionVariable('navBarMode') as ('vertical' | 'horizontal' | 'mobile');
        if (!userNavBarMode) {
            this.setNavBarMode(navBarMode);
        } else {
            this.setNavBarMode(userNavBarMode);
        }
    }
    protected initializeRetraction(navBarRetracted: boolean): void {
        if (this.getSessionVariableAsBoolean('retracted')) {
            this.retracted$.next(true);
        } else {
            this.retracted$.next(navBarRetracted);
        }
    }
    protected initializeTheme(): void {
        let currentTheme = this.getSessionVariable('current-theme');

        if (!currentTheme || currentTheme === '') {
            currentTheme = 'ui-default-theme';
        }

        this.setTheme(currentTheme);
    }
    public isMobile(): boolean {
        return this.isDeviceMobile;
    }
    public isUserMandatory(): boolean {
        return true;
    }
    protected removeAllSessionVariables(): void {
        for (const storaged of Object.keys(localStorage)) {
            const found = SystemService.NOT_CLEANABLE.find((persistent: string) => {
                return storaged.includes(persistent);
            });
            if (!found) {
                this.removeSessionVariable(storaged);
            }
        }
    }
    protected removeSessionVariable(key: string): void {
        delete localStorage[key];
    }
    public setNavBarMode(mode: 'vertical' | 'horizontal' | 'mobile', force = false): void {
        const acutualMode = this.navBarMode$.getValue();
        if (mode !== 'mobile') {
            this.setSessionVariable('navBarMode', mode);
            this.isDeviceMobile = false;
        } else {
            this.isDeviceMobile = true;
        }

        if ((acutualMode === 'mobile' && force) || (acutualMode !== 'mobile')) {
            return this.navBarMode$.next(mode);
        }
    }
    public setRetraction(retracted: boolean): void {
        this.setSessionVariable('retracted', retracted.toString());
        this.retracted$.next(retracted);
    }
    public setSessionVariable(key: string, value: string): void {
        localStorage.setItem(key, value);
    }
    /* eslint-disable-next-line  @typescript-eslint/explicit-module-boundary-types */
    public setJsonAsSessionVariable(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
    public setState(state: AppState): void {
        this.currentState$.next(state);
    }
    // Todo implementar este mecanismo de substates (não mandatório na conjuntura atual)
    public setSubState(state: AppState): void {
        this.currentSubState$.next(state);
    }
    public setTheme(theme: string): void {
        this.setSessionVariable('current-theme', theme);
        this.currentTheme$.next(theme);
    }
    public watchNavBarMode(): Observable<'vertical' | 'horizontal' | 'mobile'> {
        return this.navBarMode$.pipe(
            filter((navBarMode: 'vertical' | 'horizontal' | 'mobile') => navBarMode !== undefined)
        );
    }
    public watchInitialized(): Observable<boolean> {
        return this.initialized$;
    }
    public watchRetraction(): Observable<boolean> {
        return this.retracted$.pipe(
            filter((retracted: boolean) => retracted !== undefined)
        );
    }
    public watchState(): Observable<AppState> {
        return this.currentState$;
    }
    public watchSubState(): Observable<AppState> {
        return this.currentSubState$;
    }
    public watchTheme(): Observable<string> {
        return this.currentTheme$;
    }
}
