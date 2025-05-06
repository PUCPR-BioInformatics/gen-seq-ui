import { types } from '@angular/compiler-cli/linker/babel/src/babel_core';

declare let Plotly: any;
export class SpiderGraphBuilder {
    static buildSpiderWeb(maxSize: number, interactions: number, keys: Array<string>): Array<any> {
        const webs = [];
        for (let i = 0; i < interactions; i++) {

            webs.push({
                type: 'scatterpolar',
                r: keys.map(() => maxSize - (maxSize * (i * 0.15))),
                theta: keys,
                fill: 'toself',
                fillcolor: 'rgba(183,183,183,0.3)',
                line: {
                    color: 'rgba(0,0,0,0)'  // Ocultando a linha
                },
                hoverinfo: 'none',
                    showlegend: false
            });
        }
        return webs;
    }
    static build(container: HTMLDivElement, result: any, type: string): void {
        const changes = result.changes;
        let maxSize = 0;
        console.log(changes)
        Object.values(changes.original).forEach((value: number) => {
           maxSize = Math.max(maxSize, value);
        });
        Object.values(changes.sample).forEach((value: number) => {
            maxSize = Math.max(maxSize, value);
        });
        maxSize + (maxSize * 0.01);

        const spiderData: any = [
            ...this.buildSpiderWeb(maxSize, 6, Object.keys(changes.sample)),
            {
                type: 'scatterpolar',
                r: Object.values(changes.sample),
                theta: Object.keys(changes.sample),
                fill: 'toself',
                name: 'Alterado',
                hovertemplate: '<b>Value:</b> %{theta}<br><b>%{r}</b>',
                line: {
                    color: '#3947e5'
                },
                opacity: 0.7
            },
            {
                type: 'scatterpolar',
                r: Object.values(changes.original),
                theta: Object.keys(changes.original),
                fill: 'toself',
                name: 'Referência',
                hovertemplate: '<b>Value:</b> %{theta}<br><b>%{r}</b>',
                line: {
                    color: '#3caafc'
                },
                opacity: 0.7
            }
        ];

        const layout = {
            polar: {
                radialaxis: {
                    visible: false
                },
                angularaxis: {
                    showticklabels: true,
                    ticks: '',
                    linecolor: '#fff',
                    tickfont: {
                        color: '#4f4f4f',
                        size: 16,
                        family: 'Arial, sans-serif',
                        weight: 'bold'
                    },
                    rotation: 17
                }
            },
            showTitle: false,
            showlegend: true,
            legend: {
                x: 1,
                y: 1
            }
        };
        Plotly.newPlot(container, spiderData, layout);
    }
    static buildMultiple(container: HTMLDivElement, elements: Array<any>, types: Array<string>, colors: Array<string>): void {
        let maxSize = 0;
        elements.forEach((result) => {
            const changes = result.changes;
            Object.values(changes.sample).forEach((value: number) => {
                maxSize = Math.max(maxSize, value);
            });
            maxSize + (maxSize * 0.01);
        });

        const spiderData: any = [
            ...this.buildSpiderWeb(maxSize, 6, Object.keys(elements[0].changes.sample)),
        ];

        elements.forEach((result, index) => {
            spiderData.push({
                type: 'scatterpolar',
                r: Object.values(result.changes.sample),
                theta: Object.keys(result.changes.sample),
                fill: 'toself',
                name: types[index],
                hovertemplate: '<b>Value:</b> %{theta}<br><b>%{r}</b>',
                line: {
                    color: colors[index]
                },
                opacity: 0.7
            });
        });

        const layout = {
            polar: {
                radialaxis: {
                    visible: false
                },
                angularaxis: {
                    showticklabels: true,
                    ticks: '',
                    linecolor: '#fff',
                    tickfont: {
                        color: '#4f4f4f',
                        size: 16,
                        family: 'Arial, sans-serif',
                        weight: 'bold'
                    },
                    rotation: 17
                }
            },
            showTitle: false,
            showlegend: true,
            legend: {
                x: 1,
                y: 1
            }
        };
        Plotly.newPlot(container, spiderData, layout);
    }
}
