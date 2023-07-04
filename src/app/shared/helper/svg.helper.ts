import * as d3 from 'd3';

export class SvgHelper {
    private static buildAttributes(element: d3.Selection<SVGElement, any, any, any>, options: any): d3.Selection<any, any, any, any> {
        for (const key in options) {
            if (options[key]) {
                element.attr(key, options[key]);
            }
        }
        return element;
    }
    public static buildSvg(parent: d3.Selection<any, any, any, any>, options?: any): d3.Selection<SVGSVGElement, any, any, any> {
        if (!parent.select('svg').empty()) {
            parent.select('svg').remove();
        }
        let element = parent.append('svg');

        if (options) {
            element = this.buildAttributes(element, options) as d3.Selection<SVGSVGElement, any, any, any>;
        }

        return element;
    }
    public static buildGroup(parent: d3.Selection<SVGElement, any, any, any>, options?: any): d3.Selection<SVGGElement, any, any, any> {
        let element = parent.append('g');

        if (options) {
            element = this.buildAttributes(element, options) as d3.Selection<SVGGElement, any, any, any>;
        }

        return element;
    }
    public static buildPath(parent: d3.Selection<SVGGElement, any, any, any>, options?: any): d3.Selection<SVGPathElement, any, any, any> {
        let element = parent.append('path');

        if (options) {
            element = this.buildAttributes(element, options) as  d3.Selection<SVGPathElement, any, any, any>;
        }

        return element;
    }
    public static buildArc(angle: number, innerRadius: number, outerRadius: number): d3.Arc<any, d3.DefaultArcObject> {
        return d3.arc()
            .startAngle(angle)
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
    }
    public static buildCircle(parent: d3.Selection<SVGGElement, any, any, any>, options: any): d3.Selection<SVGPathElement> {
        let element = parent.append('circle');

        if (options) {
            element = this.buildAttributes(element, options) as  d3.Selection<SVGPathElement, any, any, any>;
        }

        return element;
    }
    public static buildCircleWithArc(parent: d3.Selection<SVGGElement, any, any, any>, start: number, end: number, innerRadius: number, outerRadius: number): d3.Selection<SVGPathElement> {
        const arc = this.buildArc(Math.PI * 2 * start, innerRadius, outerRadius);
        const d = arc.endAngle(end * Math.PI * 2);
        return this.buildPath(parent, {
            d,
            fill: 'black'
        });
    }
}
