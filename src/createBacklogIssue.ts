import { assertNotUndefined } from "./assert"
import { Backlog, Issue } from "./backlog"

function logIssueAdded(issue: Issue): void {
    console.info("issue added", { issueKey: issue.issueKey, summary: issue.summary })
}

export function createBacklogIssue(prTitle: string, prUrl: string): Issue {
    const baseUrl = assertNotUndefined(process.env.BACKLOG_BASE_URL)
    const apiKey = assertNotUndefined(process.env.BACKLOG_API_KEY)
    const projectName = assertNotUndefined(process.env.BACKLOG_PROJECT_NAME)
    const issueTypeName = assertNotUndefined(process.env.BACKLOG_ISSUE_TYPE_NAME)
    const priorityName = assertNotUndefined(process.env.BACKLOG_PRIORITY_NAME)

    const client = new Backlog(baseUrl, apiKey)
    const project = client.getProject({ projectIdOrKey: projectName })
    const issueTypes = client.getIssueTypeList({ projectIdOrKey: projectName })
    const priorities = client.getPriorityList()

    const issueType = assertNotUndefined(issueTypes.filter((issueType) => issueType.name === issueTypeName).shift())
    const priority = assertNotUndefined(priorities.filter((priority) => priority.name === priorityName).shift())

    const issue = client.addIssue({
        projectId: project.id,
        issueTypeId: issueType.id,
        priorityId: priority.id,
        summary: prTitle,
        description: prUrl,
    })

    logIssueAdded(issue)

    return issue
}

global.testCreateBacklogIssue = (): void => {
    createBacklogIssue("Hello, world!", "https://example.com")
}
