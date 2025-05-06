
declare let Plotly: any;
export class HorizontalBarGraphBuilder {
    static build(container: HTMLDivElement, result: any): void {
        console.log(result.changes);

        const trace = {
            x: [result.changes.rnaOnlyAmount, result.changes.bothAmount, result.changes.dnaOnlyAmount ],
            y: ['DNA Apenas', 'Igual', 'RNA Apenas'],
            orientation: 'h',
            type: 'bar',
            marker: {
                color: ['#5760ce', '#25009a', '#0062fa']
            }
        };

        const layout = {
            xaxis: {
                title: 'Quantidade'
            },
            yaxis: {
                title: 'Tipo'
            }
        };

        Plotly.newPlot(container, [trace], layout);
    }
}
