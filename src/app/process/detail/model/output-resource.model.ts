export interface OutputResourceModel {
    alias: string;
    name: string;
    value: string | number | boolean;
    type?: 'string' | 'file';
}
