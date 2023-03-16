export const GenesisStates = {
    creation: {
        name: 'genesis-creation',
        alias: 'Create',
        path: 'execution/creation',
        icon: 'fa-regular fa-file',
        profiles: [],
        permissions: null,
        subStates: null
    },
    list: {
        name: 'genesis-list',
        alias: 'Executions',
        path: 'executions',
        icon: 'fa-solid fa-diagram-project',
        profiles: [],
        permissions: null,
        subStates: null
    },
    detail: {
        name: 'genesis-detail',
        alias: 'Detail',
        path: 'executions/detail',
        icon: null,
        profiles: [],
        permissions: null,
        subStates: null
    }
};
