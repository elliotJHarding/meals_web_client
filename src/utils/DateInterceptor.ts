
const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/;
const simpleDateFormat = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDateString(value: any): boolean {
    return typeof value === 'string' &&
           (isoDateFormat.test(value) || simpleDateFormat.test(value));
}

export function handleDates(body: any) {
    if (body === null || body === undefined || typeof body !== 'object') {
        return body;
    }

    for (const key of Object.keys(body)) {
        const value = body[key];
        if (isIsoDateString(value)) {
            body[key] = new Date(value);
        } else if (typeof value === 'object') {
            handleDates(value); // Recursively handle nested objects/arrays
        }
    }
}