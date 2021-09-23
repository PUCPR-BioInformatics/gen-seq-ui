import { GenesisProcessStepEnum } from '../enum/genesis-process-step.enum';
import { GenesisProcessResultModel } from './genesis-process-result.model';

export interface GenesisProcessStepExecutionModel {
    startDate: Date | null;
    endDate: Date | null;
    step: GenesisProcessStepEnum;
    result: GenesisProcessResultModel | null;
}
