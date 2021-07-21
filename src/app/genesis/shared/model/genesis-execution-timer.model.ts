import { GenesisProcessStepEnum } from '../enum/genesis-process-step.enum';

export interface GenesisExecutionTimerModel {
    startDate: Date | null;
    endDate: Date | null;
    step: GenesisProcessStepEnum;
}
