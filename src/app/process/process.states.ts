export const ProcessStates = {
    creation: {
        name: 'process-creation',
        alias: 'Create',
        path: 'pipeline/creation',
        icon: 'fa-regular fa-file',
        profiles: [],
        permissions: null,
        subStates: null
    },
    list: {
        name: 'pipeline',
        alias: 'Executions',
        path: 'pipeline/executions',
        icon: 'fa-solid fa-diagram-project',
        profiles: [],
        permissions: null,
        subStates: null
    },
    detail: {
        name: 'pipeline',
        alias: 'Detail',
        path: 'pipeline/detail',
        icon: null,
        profiles: [],
        permissions: null,
        subStates: null
    }
};
