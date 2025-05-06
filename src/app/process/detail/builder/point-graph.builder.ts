
declare let Plotly: any;
export class PointGraphBuilder {
    static build(container: HTMLDivElement, result: any): void {
        console.log(result.changes.both)
        var data = {
            "chr1": [100, 200, 300],
            "chr2": [150, 250, 350],
            "chr3": [120, 220, 320]
        };

        var plotData = [];
        Object.keys(data).forEach((chromosome, index) => {
            var positions = data[chromosome];
            var trace = {
                x: positions,
                y: Array(positions.length).fill(chromosome), // Repete o nome do cromossomo
                mode: 'markers',
                type: 'scatter',
                name: chromosome,
                marker: {
                    size: 10,
                    opacity: 0.8
                }
            };
            plotData.push(trace);
        });

        // Layout do gráfico
        var layout = {
            title: 'Chromosome vs Position Scatter Plot',
            xaxis: {
                title: 'Position',
                showgrid: true,
                zeroline: false
            },
            yaxis: {
                title: 'Chromosome',
                showline: true,
                type: 'category' // Para mostrar os cromossomos como categorias
            },
            showlegend: true,
            margin: {
                l: 60,
                r: 30,
                b: 50,
                t: 80
            }
        };

        // Renderizar o gráfico
        Plotly.newPlot(container, plotData, layout);
    }
}
