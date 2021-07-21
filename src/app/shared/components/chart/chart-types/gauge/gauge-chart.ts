import * as d3 from 'd3';

import { GenericChart } from '../generic-chart';
import { ChartDataModel } from '../../model/chart-data.model';
import { GaugeGenericPlotDataModel } from './model/gauge-plot-data.model';
import { PlotTooltip } from '../../model/plot-tooltip.model';

export class GaugeChart extends GenericChart {
    defs: d3.Selection<SVGDefsElement, any, any, any>;
    filter: d3.Selection<SVGFilterElement, any, any, any>;
    group: d3.Selection<SVGGElement, any, any, any>;
    plots: Array<d3.Selection<SVGPathElement, any, any, any>> = [];
    progressText: d3.Selection<SVGTextElement, any, any, any>;
    detailText: d3.Selection<SVGTextElement, any, any, any>;
    svg: d3.Selection<SVGSVGElement, any, any, any>;
    effects: Set<any> = new Set();

    constructor() {
        super();
    }

    private bindTooltip(tooltip: PlotTooltip, element: d3.Selection<any, any, any, any>, self: GaugeChart): void {
        element.on('mouseover', (event: MouseEvent) => {
            self.showTooltip(tooltip, event);
            event.stopPropagation();
            event.preventDefault();
        });
        element.on('mouseout', (event: MouseEvent) => {
            self.hideTooltip();
            event.stopPropagation();
            event.preventDefault();
        });
    }
    private buildArc(angle: number, innerRadius: number, outerRadius: number): d3.Arc<any, d3.DefaultArcObject> {
        return d3.arc()
            .startAngle(angle)
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
    }
    protected buildChart(): void {
        const viewer: d3.Selection<any, any, any, any> = d3.select(this.viewer);
        const progressPosition = this.getProgressTextPosition();

        this.svg = this.buildSvg(viewer, {
            class: 'ui-chart-svg',
            width: this.getWidth() + 'px',
            height: this.getHeight() + 'px'
        });

        this.group = this.buildGroup(this.svg,  {
            class: 'ui-chart-gauge-meter',
            transform: 'translate(' + this.getTransformX() + ', ' + this.getTransformY() + ')'
        });
        this.progressText = this.buildText(this.group, {
            class: this.getProgressTextClass(),
            dy: progressPosition.y + 'px',
            dx: progressPosition.x + 'px'
        });

        this.progressText.text(this.data.informations.progress.text);

        if (this.data.informations.detail) {
            const position = this.getDetailTextPosition();
            this.detailText = this.buildText(this.group, {
                class: this.getDetailTextClass(),
                dy: position.y + 'px',
                dx: position.x + 'px',
            });

            this.detailText.text(this.data.informations.detail.text);
        }
        this.defs = this.buildDefs(this.svg);

        if (this.data.tooltip) {
            this.bindTooltip(this.data.tooltip, this.svg, this);
        }
    }
    private getProgressTextClass(): string {
        return (!this.data.informations.progress.class) ?
            'ui-chart-gauge-meter-text' : this.data.informations.progress.class;
    }
    private getProgressTextPosition(): { x: number; y: number; } {
        if (this.data.informations.progress.position) {
            return this.data.informations.progress.position;
        } else {
            return (!this.data.informations.detail) ? {
                x: 0,
                y: 15
            } : {
                x: 0,
                y: 5
            };
        }

    }
    private getDetailTextClass(): string {
        return (!this.data.informations.detail.class) ?
            'ui-chart-gauge-meter-detail' : this.data.informations.detail.class;
    }
    private getDetailTextPosition(): { x: number; y: number; } {
        return (this.data.informations.detail.position) ?
            this.data.informations.detail.position : { x: 0, y: 25 };
    }
    private getTransformY(): number {
        const transformY = this.data.transform?.y;
        return (transformY) ? transformY : (this.getHeight() / 2);
    }
    private getTransformX(): number {
        const transformX = this.data.transform?.x;
        return (transformX) ? transformX : (this.getWidth() / 2);
    }
    public initialize(viewer: HTMLElement, data: ChartDataModel, hash: string): void {
        super.initialize(viewer, data, hash);
        this.buildChart();

        for (const plot of this.data.plots) {
            this.plot(plot as GaugeGenericPlotDataModel);
        }
    }
    public plot(plot: GaugeGenericPlotDataModel): void {
        const arc = this.buildArc(Math.PI * 2 * plot.startAngle, plot.innerRadius, plot.outerRadius);
        const d = arc.endAngle(plot.endAngle * Math.PI * 2);
        const effects = plot.effects;
        const effectsProperties: any = {};

        if (effects && effects.length > 0) {
            for (const effect of effects) {
                this.buildEffect(this.defs, effect);
                this.effects.add(effect.id);

                for (const apply of effect.applyTo) {
                    effectsProperties[apply] = 'url(#' + effect.id + ')';
                }
            }
        }

        const path = this.buildPath(this.group, {
            d,
            class: (!plot.cssClass) ? 'ui-chart-gauge-meter-default' : plot.cssClass,
            ...effectsProperties
        });

        if (plot.tooltip) {
            this.bindTooltip(plot.tooltip, path, this);
        }

        this.plots.push(path);
    }
}
