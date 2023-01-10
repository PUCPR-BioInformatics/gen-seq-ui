export class JsonHelper {
    /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
    public static compare(object: any, objectToCompare: any, ignore?: Array<string>): boolean {
        let compare1 = object;
        let compare2 = objectToCompare;

        if (ignore) {
            compare1 = { ...compare1 };
            compare2 = { ...compare2 };
            for (const ignoreable of ignore) {
                delete compare1[ignoreable];
                delete compare2[ignoreable];
            }
        }
        return JSON.stringify(compare1) === JSON.stringify(compare2);
    }
    /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
    public static convertClassToJson(object: unknown, more?: any, ignore?: Array<string>): any {
        const jsonObject = JSON.parse(JSON.stringify(object));

        for (const key in more) {
            if (more[key] !== undefined) {
                jsonObject[key] = more[key];
            }
        }

        if (ignore) {
            for (const key of ignore) {
                delete jsonObject[key];
            }
        }
        return jsonObject;
    }
    /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
    public static sumObject(defaultObject: any, newObject: any): any {
        let finalObject = {};

        // eslint-disable-next-line guard-for-in
        for (const key in defaultObject) {
            const existsObject = newObject[key] !== undefined && newObject[key] !== null;

            if (typeof defaultObject[key] === 'object' && existsObject && !(defaultObject[key] instanceof Date)) {
                finalObject[key] = this.sumObject(defaultObject[key], newObject[key]);
            } else {
                finalObject[key] = (existsObject) ? newObject[key] : defaultObject[key];
            }
        }

        finalObject = {
            ...newObject,
            ...finalObject
        };
        return finalObject;
    }
}
