import { ProcessStates } from './process/process.states';

export const AppStates = {
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
