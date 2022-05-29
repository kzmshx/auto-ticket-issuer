export function assertNotUndefined<T>(value: T | undefined): T {
    if (value === undefined) {
        throw new Error("value must not be undefined")
    }
    return value
}

export function assertIsNumber(value: any): number {
    if (typeof value === "number" || value instanceof Number) {
        return value.valueOf()
    }
    throw new Error("value must be string")
}

export function assertIsString(value: any): string {
    if (typeof value === "string" || value instanceof String) {
        return value.toString()
    }
    throw new Error("value must be string")
}

export function assertSame<T>(expected: T, value: T): T {
    if (value !== expected) {
        throw new Error(`expected ${expected}, got ${value}`)
    }
    return value
}
