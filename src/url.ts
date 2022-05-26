import parse from "url-parse"

type Key = string

type Value = string | number

export type QueryParams = { [key: Key]: Value }

function stringifyQueryParams(queryParams?: QueryParams): string {
    return Object.entries(queryParams ?? [])
        .map(([key, value]) => `${key}=${value.toString()}`)
        .join("&")
}

export function buildUrl(baseUrl: string, path: string, queryParams?: QueryParams): string {
    const url = parse(baseUrl)
    url.set("pathname", path)
    url.set("query", stringifyQueryParams(queryParams))

    return url.toString()
}
