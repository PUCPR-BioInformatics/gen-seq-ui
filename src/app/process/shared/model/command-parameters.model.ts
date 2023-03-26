import { CommandArgumentsMapModel } from './command-arguments.map.model';

export interface CommandParametersModel {
    toolName?: string;
    arguments: CommandArgumentsMapModel;
    force: boolean;
    sra?: string;
}
