
declare let Plotly: any;
export class Human3dBuilder {
    static build(container: HTMLDivElement): void {
        Plotly.d3.json('assets/man_free.obj', ((data) => {
            var trace = {
                type: 'mesh3d',
                x: data.vertices.map(v => v[0]),
                y: data.vertices.map(v => v[1]),
                z: data.vertices.map(v => v[2]),
                i: data.faces.map(f => f[0]),
                j: data.faces.map(f => f[1]),
                k: data.faces.map(f => f[2]),
                intensity: data.vertices.map(v => v[2]),
                colorscale: 'Viridis'
            };

            var layout = {
                title: '3D Human Body',
                scene: {
                    xaxis: {title: 'X'},
                    yaxis: {title: 'Y'},
                    zaxis: {title: 'Z'}
                }
            };

            Plotly.newPlot(container, [trace], layout);
        }))
    }
}
