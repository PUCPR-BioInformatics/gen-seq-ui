import { GenesisProcessStepEnum } from '../enum/genesis-process-step.enum';
import { GenesisProcessResultModel } from './genesis-process-result.model';

export interface GenesisProcessStepExecutionModel {
    startDate: Date | null;
    interactions: Array<{
        alias: string;
        status: 'fail' | 'ok' | 'executing',
        command: string;
    }>;
    endDate: Date | null;
    step: GenesisProcessStepEnum;
    result: GenesisProcessResultModel | null;
    type: 'dna' | 'rna' | 'global';
}
