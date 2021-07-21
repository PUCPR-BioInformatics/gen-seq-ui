import { GenesisProcessStepEnum } from '../enum/genesis-process-step.enum';
import { GenesisResourceModel } from './genesis-resource.model';
import { GenesisExecutionTimerModel } from './genesis-execution-timer.model';

export interface GenesisProcessModel {
    _id?: string;
    reference: string;
    dnaResource: GenesisResourceModel;
    rnaResource: GenesisResourceModel;
    completeness: number;
    step?: GenesisProcessStepEnum;
    creationDate?: Date;
    completedDate?: Date | null;
    executions?: Array<GenesisExecutionTimerModel>;
}
