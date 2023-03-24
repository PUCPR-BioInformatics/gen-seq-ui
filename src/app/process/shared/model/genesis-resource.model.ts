import { CommandParametersModel } from './command-parameters.model';

export interface GenesisResourceModel {
    alignment: CommandParametersModel;
    extraction: CommandParametersModel;
    fastqDump: CommandParametersModel;
    sra: string;
}
