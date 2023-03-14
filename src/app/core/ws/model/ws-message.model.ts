export class WsMessageModel<T> {
    body: T;
    code?: number;
    name: string;
    uuid: string;
    version: string;

    /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
    constructor(obj?: any) {
        Object.assign(this, obj);
    }
}
