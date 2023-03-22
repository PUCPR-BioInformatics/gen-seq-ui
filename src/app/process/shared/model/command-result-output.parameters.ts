export interface CommandResultOutputParameters {
    alias: string;
    name: string;
    value: string | number | boolean;
    type?: 'string' | 'file';
}
