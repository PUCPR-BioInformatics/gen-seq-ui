export class NumberFormatHelper {
    public static transform(value: number): string {
        if (value / 1000000 > 1) {
            return (value / 1000000).toFixed(2) + 'M';
        } else if (value / 100000 > 1) {
            return (value / 100000).toFixed(2) + 'K'
        } else {
            return value.toString();
        }
    }
}
