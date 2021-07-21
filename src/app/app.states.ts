import { GenesisStates } from './genesis/genesis.states';

export const AppStates = {
    home: {
        name: 'home',
        alias: 'Início',
        path: 'home',
        icon: 'fas fa-home',
        profiles: [],
        permissions: null,
        subStates: null
    },
    ...GenesisStates,
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
