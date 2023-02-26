import { CommandResultOutputParameters } from './command-result-output.parameters';

export interface CommandResultModel {
    description: string;
    detail: string;
    outputParameters: Array<CommandResultOutputParameters>;
}
