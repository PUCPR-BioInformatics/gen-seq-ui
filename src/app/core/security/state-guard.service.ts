import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SystemService } from '../system.service';
import { AppState } from '../../shared/model/app-state';

@Injectable({ providedIn: 'root' })
export class StateGuardService {

    constructor(
        private systemService: SystemService
    ) {}

    public buildUserStates(state: AppState, states: Array<AppState>): void {
        const subStates = [];

        if (state.subStates && Object.keys(state.subStates).length > 0) {
            for (const subStateKey in state.subStates) {
                if (!state.subStates[subStateKey]) {
                    continue;
                }
                const subState = state.subStates[subStateKey];
                this.buildUserStates(subState, subStates);
            }
        }
        const stateForUser =  { ...state, subStates } as AppState;

        if (!stateForUser.profiles) {
            return;
        } else if (stateForUser.profiles.length === 0) {
            states.push(stateForUser);
        } else {
            states.push(stateForUser);
        }
    }
    public getUserStates(): Array<AppState> {
        const states: Array<AppState> = [];
        const appStates = this.systemService.getAppStates();

        for (const stateKey in appStates) {
            if (!appStates[stateKey]) {
                continue;
            }

            this.buildUserStates(appStates[stateKey], states);
        }
        return states;
    }
}
