export const STEP_STYLE: {
    [key: string]: {
        icon: string;
        class: string;
    }
} = {
    WAITING: {
        icon: 'fa-solid fa-clock',
        class: 'ui-process-card-waiting'
    },
    REFERENCE: {
        icon: 'fa-solid fa-book',
        class: 'ui-process-card-reference'
    },
    FASTQ_DUMP_DNA: {
        icon: 'fa-solid fa-file-arrow-down',
        class: 'ui-process-card-download'
    },
    FASTQ_DUMP_RNA: {
        icon: 'fa-solid fa-file-arrow-down',
        class: 'ui-process-card-download'
    },
    ALIGNING_DNA: {
        icon: 'fa-solid fa-receipt',
        class: 'ui-process-card-align'
    },
    ALIGNING_RNA: {
        icon: 'fa-solid fa-receipt',
        class: 'ui-process-card-align'
    },
    EXTRACT_DNA: {
        icon: 'fa-solid fa-expand',
        class: 'ui-process-card-extract'
    },
    EXTRACT_RNA: {
        icon: 'fa-solid fa-expand',
        class: 'ui-process-card-extract'
    },
    ANALYSING: {
        icon: 'fa-solid fa-chart-pie',
        class: 'ui-process-card-analysing'
    },
    COMPLETE: {
        icon: 'fa-solid fa-clipboard-check',
        class: 'ui-process-card-complete'
    },
    ERROR: {
        icon: 'fa-solid fa-clipboard-question',
        class: 'ui-process-card-error'
    }
}
