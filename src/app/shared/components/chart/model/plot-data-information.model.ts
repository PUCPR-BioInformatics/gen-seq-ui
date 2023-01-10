import { PlotDataInformationContextModel } from './plot-data-information-context.model';

export interface PlotDataInformationModel {
    detail?: PlotDataInformationContextModel;
    label?: string;
    progress: PlotDataInformationContextModel;
    total?: number;
}
