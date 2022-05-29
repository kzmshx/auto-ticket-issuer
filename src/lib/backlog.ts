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

export type GetProjectParams = {
    projectIdOrKey: string
}

export type GetIssueTypeListParams = {
    projectIdOrKey: string
}

export type AddIssueParams = {
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
    public constructor(private readonly baseUrl: string, private readonly apiKey: string) {}

    public getPriorityList(): Priority[] {
        const response = UrlFetchApp.fetch(this.buildUrl("/api/v2/priorities"))
        return JSON.parse(response.getContentText())
    }

    public getProject(params: GetProjectParams): Project {
        const response = UrlFetchApp.fetch(this.buildUrl(`/api/v2/projects/${params.projectIdOrKey}`))
        return JSON.parse(response.getContentText())
    }

    public getIssueTypeList(params: GetIssueTypeListParams): IssueType[] {
        const response = UrlFetchApp.fetch(this.buildUrl(`/api/v2/projects/${params.projectIdOrKey}/issueTypes`))
        return JSON.parse(response.getContentText())
    }

    public addIssue(params: AddIssueParams): Issue {
        const response = UrlFetchApp.fetch(this.buildUrl(`/api/v2/issues`), {
            method: "post",
            contentType: "application/x-www-form-urlencoded",
            payload: stringifyProps(params),
        })
        return JSON.parse(response.getContentText())
    }

    private buildUrl(path: string, queryParams?: QueryParams): string {
        return buildUrl(this.baseUrl, path, { apiKey: this.apiKey, ...queryParams })
    }
}
