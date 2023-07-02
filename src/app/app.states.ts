import { ProcessStates } from './process/process.states';

export const AppStates = {
    home: {
        alias: 'home',
        name: 'Home',
        path: 'home',
        icon: 'fa-solid fa-home',
        profiles: [],
        permissions: null,
        subStates: null
    },
    ...ProcessStates,
    error: {
        alias: 'error',
        name: 'Erro',
        path: 'error',
        icon: '',
        profiles: null,
        permissions: null,
        subStates: null
    }
};
