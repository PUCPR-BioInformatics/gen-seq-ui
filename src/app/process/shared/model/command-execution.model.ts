import { InteractionModel } from './interaction.model';
import { ProcessStepEnum } from '../enum/process-step-enum';
import { CommandExecutionStatusEnum } from '../enum/command-execution-status.enum';
import { CommandResultModel } from './command-result.model';

export interface CommandExecutionModel {
    _id?: string;
    startDate: Date | null;
    endDate: Date | null;
    step: ProcessStepEnum;
    processId: string;
    order: number;
    isHistorical: boolean;
    result: CommandResultModel | null;
    interactions: Array<InteractionModel>;
    type: 'dna' | 'rna' | 'global';
    status: CommandExecutionStatusEnum;
}
