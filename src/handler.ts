import { assertIsDefined, assertIsString, assertSame } from "./assert"
import { Backlog, Issue } from "./backlog"

export function handleLabeled(payload: { [key: string]: any }): void {
    if (!isTarget(payload)) {
        return
    }

    const prTitle = assertIsString(payload?.pull_request?.title)
    const prUrl = assertIsString(payload?.pull_request?.html_url)
    const prBaseRef = assertIsString(payload?.pull_request?.base?.ref)
    const prHeadRef = assertIsString(payload?.pull_request?.head?.ref)

    // Backlog のチケットを作成する
    const backlogIssue = createBacklogIssue(prTitle, prUrl)

    // Pull Request の Head ブランチ名を変更する

    // Pull Request のタイトルを変更する
}

function isTarget(payload: { [key: string]: any }): boolean {
    try {
        assertSame("labeled", assertIsString(payload?.action))
        assertSame(process.env.GITHUB_TARGET_REPOSITORY_OWNER_ID, assertIsString(payload?.repo?.owner?.id))
        assertSame(process.env.GITHUB_TARGET_LABEL_NAME, assertIsString(payload?.label?.name))
    } catch (e: unknown) {
        return false
    }
    return true
}

export function createBacklogIssue(prTitle: string, prUrl: string): Issue {
    const baseUrl = assertIsDefined(process.env.BACKLOG_BASE_URL)
    const apiKey = assertIsDefined(process.env.BACKLOG_API_KEY)
    const projectName = assertIsDefined(process.env.BACKLOG_PROJECT_NAME)
    const issueTypeName = assertIsDefined(process.env.BACKLOG_ISSUE_TYPE_NAME)
    const priorityName = assertIsDefined(process.env.BACKLOG_PRIORITY_NAME)

    const backlog = new Backlog(baseUrl, apiKey)
    const project = backlog.getProject(projectName)
    const issueType = backlog.getIssueTypeList(projectName).filter((issueType) => issueType.name === issueTypeName)[0]
    const priority = backlog.getPriorityList().filter((priority) => priority.name === priorityName)[0]

    return backlog.addIssue({
        projectId: project.id,
        issueTypeId: issueType.id,
        priorityId: priority.id,
        summary: prTitle,
        description: prUrl,
    })
}
