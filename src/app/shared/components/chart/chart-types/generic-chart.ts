import * as d3 from 'd3';

import { ChartDataModel } from '../model/chart-data.model';
import { PlotTooltip } from '../model/plot-tooltip.model';

/*eslint-disable @typescript-eslint/explicit-module-boundary-types*/
export abstract class GenericChart {
    public data: ChartDataModel;
    public hash: string;
    public tooltip: d3.Selection<HTMLDivElement, any, any, any>;
    public viewer: HTMLElement;

    protected abstract buildChart(): void;

    private buildAttributes(element: d3.Selection<SVGElement, any, any, any>, options: any): d3.Selection<any, any, any, any> {
        for (const key in options) {
            if (options[key]) {
                element.attr(key, options[key]);
            }
        }
        return element;
    }
    protected buildDefs(parent: d3.Selection<SVGElement, any, any, any>, options?: any): d3.Selection<SVGDefsElement, any, any, any> {
        let element = parent.append('defs');

        if (options) {
            element = this.buildAttributes(element, options) as d3.Selection<SVGDefsElement, any, any, any>;
        }

        return element;
    }
    private buildEffectProperties(parent: d3.Selection<any, any, any, any>, type: string, options?: any):
        d3.Selection<SVGFEGaussianBlurElement, any, any, any> {
        let element: any = parent.append(type);

        if (options) {
            element = this.buildAttributes(element, options) as d3.Selection<SVGFEGaussianBlurElement, any, any, any>;
        }

        return element;
    }
    private buildEffectBlur(parent: d3.Selection<SVGDefsElement, any, any, any>, options: any): void {
        const filter = this.buildFilter(parent, { id: options.id });
        this.buildEffectProperties(filter, options.type,  options.initial);
    }
    private buildEffectGradient(parent: d3.Selection<SVGDefsElement, any, any, any>, options: any): void {
        const effect = this.buildEffectProperties(parent, options.type,  {
            id: options.id,
            x1: '0%',
            x2: '100%',
            y1: '0%',
            y2: '100%'
        });
        const initial = effect.append('stop');
        const endless = effect.append('stop');
        this.buildAttributes(initial, options.initial);
        this.buildAttributes(endless, options.endless);
    }
    protected buildEffect(parent: d3.Selection<SVGDefsElement, any, any, any>, options: any): any {
        if (options.type === 'feGaussianBlur') {
            this.buildEffectBlur(parent, options);
        } else if (options.type === 'linearGradient') {
            this.buildEffectGradient(parent, options);
        } else {
            throw new Error('Efeito: ' + options.type + ', não encontrado.');
        }
    }
    protected buildFilter(parent: d3.Selection<SVGDefsElement, any, any, any>, options?: any ):
        d3.Selection<SVGFilterElement, any, any, any> {
        let element = parent.append('filter');

        if (options) {
            element = this.buildAttributes(element, options) as d3.Selection<SVGFilterElement, any, any, any>;
        }

        return element;
    }
    protected buildGroup(parent: d3.Selection<SVGElement, any, any, any>, options?: any): d3.Selection<SVGGElement, any, any, any> {
        let element = parent.append('g');

        if (options) {
            element = this.buildAttributes(element, options) as d3.Selection<SVGGElement, any, any, any>;
        }

        return element;
    }
    protected buildPath(parent: d3.Selection<SVGGElement, any, any, any>, options?: any): d3.Selection<SVGPathElement, any, any, any> {
        let element = parent.append('path');

        if (options) {
            element = this.buildAttributes(element, options) as  d3.Selection<SVGPathElement, any, any, any>;
        }

        return element;
    }
    protected buildSvg(parent: d3.Selection<any, any, any, any>, options?: any): d3.Selection<SVGSVGElement, any, any, any> {
        if (!parent.select('svg').empty()) {
            parent.select('svg').remove();
        }
        let element = parent.append('svg');

        if (options) {
            element = this.buildAttributes(element, options) as d3.Selection<SVGSVGElement, any, any, any>;
        }

        return element;
    }
    protected buildText(parent: d3.Selection<SVGGElement, any, any, any>, options?: any): d3.Selection<SVGTextElement, any, any, any> {
        let element = parent.append('text');

        if (options) {
            element = this.buildAttributes(element, options) as d3.Selection<SVGTextElement, any, any, any>;
        }

        return element;
    }
    protected buildTooltip(): void {
        this.tooltip = d3.select('body').append('div')
            .attr('id', 'ui-chart-tooltip' + this.hash)
            .attr('class', 'ui-chart-tooltip ui-chart-tooltip-hidden')
    }
    protected cleanTooltip(): void {
        const selectorTooltip = d3.select('#ui-chart-tooltip' + this.hash);
        if (!selectorTooltip.empty()) {
            selectorTooltip.remove();
        }
    }
    protected getHeight(): number {
        return this.data.size.height;
    }
    protected getWidth(): number {
        return this.data.size.width;
    }
    public hideTooltip(): void {
        this.tooltip.transition()
            .duration(50)
            .style('opacity', 0);

        this.tooltip.html('');
    }
    public initialize(viewer: HTMLElement, data: ChartDataModel, hash: string): void {
        this.viewer = viewer;
        this.data = data;
        this.hash = hash;
        this.cleanTooltip();
        this.buildTooltip();
    }
    public showTooltip(tooltip: PlotTooltip, event: MouseEvent): void {
        this.tooltip.transition()
            .duration(50)
            .style('opacity', 1);
        this.tooltip
            .html(tooltip.html)
            .attr('class', tooltip.cssClass)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 15) + 'px');
    }
}
