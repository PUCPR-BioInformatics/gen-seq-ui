export interface GenesisResourceModel {
    alignmentParameters: {
        toolName: string;
        parameters: Array<string>;
        force: boolean;
    };
    fastqDumpParameters: {
        parameters: Array<string>;
        force: boolean;
    };
    sra: string;
}
