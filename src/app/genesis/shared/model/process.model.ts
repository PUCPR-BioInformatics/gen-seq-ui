import { GenesisResourceModel } from './genesis-resource.model';
import { ProcessResultModel } from './process-result.model';

export interface ProcessModel {
    _id?: string;
    actualCommandName: string;
    dnaResource: GenesisResourceModel;
    completeness: number;
    completedDate?: Date | null;
    creationDate?: Date;
    updateDate?: Date;
    reference: string;
    result: ProcessResultModel | null;
    rnaResource: GenesisResourceModel;
}
