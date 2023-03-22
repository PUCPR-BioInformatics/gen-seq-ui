export const ProcessStates = {
    creation: {
        name: 'process-creation',
        alias: 'Create',
        path: 'execution/creation',
        icon: 'fa-regular fa-file',
        profiles: [],
        permissions: null,
        subStates: null
    },
    list: {
        name: 'process-list',
        alias: 'Executions',
        path: 'executions',
        icon: 'fa-solid fa-diagram-project',
        profiles: [],
        permissions: null,
        subStates: null
    },
    detail: {
        name: 'process-detail',
        alias: 'Detail',
        path: 'executions/detail',
        icon: null,
        profiles: [],
        permissions: null,
        subStates: null
    }
};
