import { CommandParametersModel } from '../../detail/model/command-parameters.model';

export interface GenesisResourceModel {
    alignment: CommandParametersModel;
    extraction: CommandParametersModel;
    fastqDump: CommandParametersModel;
    sra: string;
}
