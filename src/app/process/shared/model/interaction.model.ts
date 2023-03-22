export interface InteractionModel {
    command: string;
    status: 'ok' | 'fail' | 'executing' | string;
    alias: string;
}
