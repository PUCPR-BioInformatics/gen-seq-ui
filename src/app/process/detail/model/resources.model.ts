import { ProcessStepEnum } from '../../shared/enum/process-step-enum';
import { OutputResourceModel } from './output-resource.model';

export class ResourceModel {
    _id?: string;
    processId: string;
    commandId?: string;
    step?: ProcessStepEnum;
    outputResources: Array<OutputResourceModel>;
    fromResource: string;
}
