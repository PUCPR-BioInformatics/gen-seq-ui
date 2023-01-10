import { GenesisStates } from './genesis/genesis.states';

export const AppStates = {
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
