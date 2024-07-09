
declare let Plotly: any;
export class BarGraphBuilder {
    static build(container: HTMLDivElement, result: any): void {
        const dnaTrace = {
            x: Object.keys(result.dna.trace).map((chrom) => (chrom !== 'MT') ? 'Chrom. ' + chrom : chrom),
            y: Object.values(result.dna.trace),
            name: 'DNA Variants',
            type: 'bar',
            marker: {
                color: '#2ca3ff'
            }
        };

        const rnaTrace = {
            x: Object.keys(result.rna.trace).map((chrom) => (chrom !== 'MT') ? 'Chrom. ' + chrom : chrom),
            y: Object.values(result.rna.trace),
            name: 'RNA Variants',
            type: 'bar',
            marker: {
                color: '#5128ff'
            }
        };

        Plotly.newPlot(
            container, [dnaTrace, rnaTrace],
            {
                title: 'DNA & RNA Variants',
                barmode: 'group',
                width: container.offsetWidth - 30,
                autosize: true
            }
        );
    }
}
