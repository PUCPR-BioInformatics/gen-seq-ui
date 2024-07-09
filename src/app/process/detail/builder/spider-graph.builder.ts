
declare let Plotly: any;
export class SpiderGraphBuilder {
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
        const spiderData: any = [
            {
                type: 'scatterpolar',
                r: Object.keys(changes.sample).map(() => maxSize + (maxSize * 0.01)),
                theta: Object.keys(changes.sample),
                fill: 'toself',
                fillcolor: 'rgba(183,183,183,0.3)',
                line: {
                    color: 'rgba(0,0,0,0)'
                },
                hoverinfo: 'none',
                showlegend: false
            },
            {
                type: 'scatterpolar',
                r: Object.keys(changes.sample).map(() => maxSize - (maxSize * 0.10)),
                theta: Object.keys(changes.sample),
                fill: 'toself',
                fillcolor: 'rgba(183,183,183,0.3)',
                line: {
                    color: 'rgba(0,0,0,0)'
                },
                hoverinfo: 'none',
                showlegend: false
            },
            {
                type: 'scatterpolar',
                r: Object.keys(changes.sample).map(() => maxSize - (maxSize * 0.20)),
                theta: Object.keys(changes.sample),
                fill: 'toself',
                fillcolor: 'rgba(183,183,183,0.3)',
                line: {
                    color: 'rgba(0,0,0,0)'  // Ocultando a linha
                },
                hoverinfo: 'none',
                showlegend: false
            },
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
            title: 'Nucleotides Comparison',
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
