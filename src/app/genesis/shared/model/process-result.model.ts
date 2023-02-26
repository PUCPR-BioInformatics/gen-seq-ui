import { ProcessStatusEnum } from '../enum/process-status-enum';

export interface ProcessResultModel {
    description: string;
    detail: string;
    status:ProcessStatusEnum;
}
