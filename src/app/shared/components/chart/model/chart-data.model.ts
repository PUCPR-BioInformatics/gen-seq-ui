import { GenericGenericPlotDataModel } from './generic-plot-data.model';
import { PlotDataInformationModel } from './plot-data-information.model';
import { PlotTooltip } from './plot-tooltip.model';

export class ChartDataModel {
    public size: any;
    public plots: Array<GenericGenericPlotDataModel>;
    public informations: PlotDataInformationModel;
    public tooltip: PlotTooltip;
    public transform?: {
        x: number;
        y: number;
    };

    /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
