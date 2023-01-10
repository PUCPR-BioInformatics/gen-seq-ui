import { GenericGenericPlotDataModel } from '../../../model/generic-plot-data.model';

export class GaugeGenericPlotDataModel extends GenericGenericPlotDataModel {
    public total: number;
    public startAngle: number;
    public endAngle: number;
    public innerRadius: number;
    public outerRadius: number;
}
