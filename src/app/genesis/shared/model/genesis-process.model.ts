import { GenesisProcessStepEnum } from '../enum/genesis-process-step.enum';
import { GenesisResourceModel } from './genesis-resource.model';
import { GenesisProcessStepExecutionModel } from './genesis-process-step-execution.model';
import { GenesisProcessResultModel } from './genesis-process-result.model';

export interface GenesisProcessModel {
    _id?: string;
    dnaResource: GenesisResourceModel;
    completeness: number;
    completedDate?: Date | null;
    creationDate?: Date;
    executions?: Array<GenesisProcessStepExecutionModel>;
    reference: string;
    result: GenesisProcessResultModel | null;
    rnaResource: GenesisResourceModel;
    step?: GenesisProcessStepEnum;
}
