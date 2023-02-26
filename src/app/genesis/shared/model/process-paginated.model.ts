import { ProcessModel } from './process.model';

export interface ProcessPaginatedModel {
    process: Array<ProcessModel>;
    size: number;
}
