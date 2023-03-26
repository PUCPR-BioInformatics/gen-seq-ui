import { InteractionModel } from '../../shared/model/interaction.model';
import { ProcessStepEnum } from '../../shared/enum/process-step-enum';
import { CommandExecutionStatusEnum } from '../../shared/enum/command-execution-status.enum';
import { CommandResultModel } from './command-result.model';
import { CommandParametersModel } from './command-parameters.model';

export interface CommandModel {
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
    parameters: CommandParametersModel;
}
