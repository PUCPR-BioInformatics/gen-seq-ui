import { GenesisResourceModel } from './genesis-resource.model';

export interface ProcessModel {
    _id?: string;
    dnaResource: GenesisResourceModel;
    completeness: number;
    completedDate?: Date | null;
    creationDate?: Date;
    reference: string;
    result: PromiseRejectionEvent | null;
    rnaResource: GenesisResourceModel;
}
