
import { GaugeGenericPlotDataModel } from '../components/chart/chart-types/gauge/model/gauge-plot-data.model';
import { PlotEffectModel } from '../components/chart/model/plot-effect.model';
import { PlotTooltip } from '../components/chart/model/plot-tooltip.model';
import { PlotDataInformationContextModel } from '../components/chart/model/plot-data-information-context.model';

export class ChartHelper {
    static buildBlurEffect(id: string, initial: { [key: string]: string; }, applyTo: Array<string>): PlotEffectModel {
        return { id, type: 'feGaussianBlur', initial, applyTo };
    }
    static buildContextInformation(text: string, x?: number, y?: number, cssClass?: string): PlotDataInformationContextModel {
        return {
            text,
            position: {
                x,
                y
            },
            class: cssClass
        };
    }
    static buildGaugeGenericPlotDataModel(
        total: number, startAngle: number, endAngle: number, innerRadius: number,
        outerRadius: number, cssClass: string, tooltip: PlotTooltip, effects?: Array<PlotEffectModel>
    ): GaugeGenericPlotDataModel {
        return new GaugeGenericPlotDataModel({
            total,
            startAngle,
            endAngle,
            innerRadius,
            outerRadius,
            cssClass,
            tooltip,
            effects
        });
    }
    static buildGradientEffect(
        id: string, initial: { [key: string]: string; },
        endless: { [key: string]: string; }, applyTo: Array<string>
    ): PlotEffectModel {
        return { id, type: 'linearGradient', initial, endless, applyTo };
    }
    static buildTooltip(html: string, cssClass: string): PlotTooltip {
        return { html, cssClass };
    }
}
