import { buildUrl, QueryParams } from "../url"

describe("buildUrl", () => {
    it("should be able to build URL without query params", () => {
        expect(buildUrl("https://example.com", "/foo")).toBe("https://example.com/foo")
    })

    test.each([
        ["https://example.com", "/foo", {}, "https://example.com/foo"],
        ["https://example.jp", "/bar", { numberParam: 1 }, "https://example.jp/bar?numberParam=1"],
        ["https://example.jp", "/bar", { stringParam: "a" }, "https://example.jp/bar?stringParam=a"],
        ["https://example.jp", "/bar", { a: 1, b: "a" }, "https://example.jp/bar?a=1&b=a"],
        ["https://example.com/", "/foo", { a: 0 }, "https://example.com/foo?a=0"],
        ["https://example.com/bar/baz", "/foo", { a: 0 }, "https://example.com/foo?a=0"],
        ["https://example.com", "foo", { a: 0 }, "https://example.com/foo?a=0"],
    ])("with (%s, %s, %o), returns %s", (baseUrl: string, path: string, queryParams: QueryParams, expected: string) => {
        expect(buildUrl(baseUrl, path, queryParams)).toBe(expected)
    })
})
