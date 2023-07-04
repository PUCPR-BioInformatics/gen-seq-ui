import { PlotTooltip } from './plot-tooltip.model';
import { PlotEffectModel } from './plot-effect.model';

export class GenericGenericPlotDataModel {
    public cssClass: string;
    public effects: Array<PlotEffectModel>;
    public tooltip: PlotTooltip;

    /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
