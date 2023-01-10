import { GenesisProcessModel } from './genesis-process.model';

export interface GenesisProcessPaginatedModel {
    process: Array<GenesisProcessModel>;
    size: number;
}
