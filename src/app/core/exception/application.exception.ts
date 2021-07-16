export class ApplicationException {
    public message: string;

    constructor(public detail: string, public description: string, public code: number = null) {
        this.message = detail + ' -> ' + description;
    }
}
