import { buildUrl, QueryParams } from "./url"

export type Priority = {
    id: number
    name: string
}

export type Project = {
    id: number
    projectKey: string
    name: string
    [x: string]: unknown
}

export type IssueType = {
    id: number
    projectId: number
    name: string
    templateSummary: string
    templateDescription: string
    [x: string]: unknown
}

export type Issue = {
    id: number
    projectId: number
    issueKey: string
    summary: string
    description: string
    [x: string]: unknown
}

export type AddIssuePayload = {
    projectId: number
    summary: string
    issueTypeId: number
    priorityId: number
    description?: string
    [x: string]: unknown
}

function stringifyProps(data: { [key: string]: any }): { [key: string]: string } {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.toString()]))
}

export class Backlog {
    constructor(private readonly baseUrl: string, private readonly apiKey: string) {}

    getPriorityList(): Priority[] {
        const response = UrlFetchApp.fetch(this.buildUrl("/api/v2/priorities"))
        return JSON.parse(response.getContentText())
    }

    getProject(projectIdOrKey: string): Project {
        const response = UrlFetchApp.fetch(this.buildUrl(`/api/v2/projects/${projectIdOrKey}`))
        return JSON.parse(response.getContentText())
    }

    getIssueTypeList(projectIdOrKey: string): IssueType[] {
        const response = UrlFetchApp.fetch(this.buildUrl(`/api/v2/projects/${projectIdOrKey}/issueTypes`))
        return JSON.parse(response.getContentText())
    }

    addIssue(payload: AddIssuePayload): Issue {
        const response = UrlFetchApp.fetch(this.buildUrl(`/api/v2/issues`), {
            method: "post",
            contentType: "application/x-www-form-urlencoded",
            payload: stringifyProps(payload),
        })
        return JSON.parse(response.getContentText())
    }

    buildUrl(path: string, queryParams?: QueryParams): string {
        return buildUrl(this.baseUrl, path, { apiKey: this.apiKey, ...queryParams })
    }
}
