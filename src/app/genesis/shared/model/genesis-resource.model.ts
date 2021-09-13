import { ExecutionParameterModel } from './execution-parameter.model';

export interface GenesisResourceModel {
    alignmentParameters: {
        toolName: string;
        parameters: Array<ExecutionParameterModel>;
    };
    fastqDumpParameters: Array<ExecutionParameterModel>;
    sra: string;
    force: boolean;
}
