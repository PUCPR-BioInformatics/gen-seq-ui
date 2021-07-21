export class PlotEffectModel {
    id: string;
    type: 'linearGradient' | 'feGaussianBlur';
    initial: {
        [key: string]: string;
    };
    endless?: {
        [key: string]: string;
    };
    applyTo: Array<string>;
}
