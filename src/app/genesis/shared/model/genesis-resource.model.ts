export interface GenesisResourceModel {
    alignment: {
        toolName: string;
        parameters: Array<string>;
        force: boolean;
    },
    extraction: {
        parameters: Array<string>;
        force: boolean;
    }
    index: {
        parameters: Array<string>;
        force: boolean;
    },
    fastqDump: {
        parameters: Array<string>;
        force: boolean;
        isPaired: boolean;
    };
    sra: string;
}
