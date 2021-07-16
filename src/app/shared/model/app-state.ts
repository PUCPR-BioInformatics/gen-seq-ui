export interface AppState {
    name: string;
    alias: string;
    path: string;
    icon?: string;
    profiles: Array<string>;
    permissions?: {
        [key: string]: Array<string>;
    };
    subStates?: { [key: string]: AppState; } | Array<AppState>;
}
