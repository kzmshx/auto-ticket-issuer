export function assertIsDefined<T>(value: T | undefined): T {
    if (value === undefined) {
        throw new Error("value must be defined")
    }
    return value
}
