export interface CommandParametersModel {
    toolName?: string;
    arguments?: { [key: string]: string | number | boolean };
    shellArguments: Array<string>;
    force: boolean;
}
