export const GenesisStates = {
    genesis: {
        name: 'genesis',
        alias: 'Genesis',
        path: 'genesis',
        icon: 'fas fa-dna',
        profiles: [],
        permissions: null,
        subStates: {
            creation: {
                name: 'genesis-creation',
                alias: 'Creation',
                path: 'creation',
                icon: null,
                profiles: [],
                permissions: null,
                subStates: null
            },
            detail: {
                name: 'genesis-detail',
                alias: 'Detail',
                path: ':id',
                icon: null,
                profiles: [],
                permissions: null,
                subStates: null
            }, summary: {
                name: 'genesis-summary',
                alias: 'Summary',
                path: '',
                icon: null,
                profiles: [],
                permissions: null,
                subStates: null
            }
        }
    }
};
