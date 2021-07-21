import { ExecutionParameterModel } from './execution-parameter.model';

export interface GenesisResourceModel {
    sra: string;
    fastqDumpParameters: Array<ExecutionParameterModel>;
    alignmentParameters: {
        toolName: string;
        parameters: Array<ExecutionParameterModel>;
    }
}
