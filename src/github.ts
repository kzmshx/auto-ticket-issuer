import { buildUrl } from "./url"

import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions

const baseUrl = "https://api.github.com"

export type IssueComment = {
    id: number
    url: string
    html_url: string
    body: string
}

export type PullRequest = {
    id: number
    url: string
    html_url: string
    number: number
    title: string
    body: string
    [key: string]: unknown
}

type CreateIssueCommentParams = {
    owner: string
    repo: string
    issue_number: number
    body: string
}

export type UpdatePullRequestParams = {
    owner: string
    repo: string
    pull_number: number
    title?: string
    body?: string
    state?: string
    base?: string
    maintainer_can_modify?: boolean
}

function createResponseError(response: HTTPResponse): Error {
    return new Error(
        JSON.stringify({
            statusCode: response.getResponseCode(),
            message: response.getContentText(),
        })
    )
}

export class GitHub {
    public constructor(private readonly accessToken: string) {}

    public createIssueComment(params: CreateIssueCommentParams): IssueComment {
        const response = this.fetch(`/repos/${params.owner}/${params.repo}/issues/${params.issue_number}/comments`, {
            method: "post",
            payload: JSON.stringify({
                body: params["body"],
            }),
        })
        if (response.getResponseCode() === 201) {
            return JSON.parse(response.getContentText())
        }
        throw createResponseError(response)
    }

    public updatePullRequest(params: UpdatePullRequestParams): PullRequest {
        const response = this.fetch(`/repos/${params.owner}/${params.repo}/pulls/${params.pull_number}`, {
            method: "patch",
            payload: JSON.stringify({
                title: params["title"],
                body: params["body"],
                state: params["state"],
                base: params["base"],
                maintainer_can_modify: params["maintainer_can_modify"],
            }),
        })
        if (response.getResponseCode() === 200) {
            return JSON.parse(response.getContentText())
        }
        throw createResponseError(response)
    }

    private fetch(path: string, options?: URLFetchRequestOptions): HTTPResponse {
        return UrlFetchApp.fetch(buildUrl(baseUrl, path), {
            contentType: "application/json",
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `token ${this.accessToken}`,
            },
            ...options,
        })
    }
}
