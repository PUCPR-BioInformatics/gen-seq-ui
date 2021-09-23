import { GenesisProcessResultParametersModel } from './genesis-process-result-parameters.model';
import { GenesisProcessStepExecutionStatusEnum } from '../enum/genesis-process-step-execution-status.enum';

export interface GenesisProcessResultModel {
    status: GenesisProcessStepExecutionStatusEnum;
    description: string;
    detail: string;
    outputParameters: Array<GenesisProcessResultParametersModel>;
}
