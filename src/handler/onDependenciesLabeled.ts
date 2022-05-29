import { assertIsNumber, assertIsString, assertNotUndefined, assertSame } from "../lib/assert"
import { Backlog, Issue } from "../lib/backlog"
import { GitHub } from "../lib/github"
import { buildUrl } from "../lib/url"
import labeledEvent from "../testdata/labeled.json"

export function onDependenciesLabeled(payload: { [key: string]: any }): void {
    if (!matchEvent(payload)) {
        return
    }

    console.info("handling onLabeled")

    const repoOwner = assertIsString(payload?.repository?.owner?.login)
    const repoName = assertIsString(payload?.repository?.name)
    const pullUrl = assertIsString(payload?.pull_request?.html_url)
    const pullTitle = assertIsString(payload?.pull_request?.title)
    const pullNumber = assertIsNumber(payload?.pull_request?.number)

    const backlogIssue = createBacklogIssue(pullTitle, pullUrl)
    updatePullRequest(repoOwner, repoName, pullNumber, backlogIssue.issueKey, backlogIssue.summary)
}

export function matchEvent(payload: { [key: string]: any }): boolean {
    const repoOwnerName = assertNotUndefined(process.env.GITHUB_PR_REPO_OWNER_NAME)
    const labelName = assertNotUndefined(process.env.GITHUB_PR_LABEL_NAME)

    try {
        assertSame("labeled", assertIsString(payload?.action))
        assertSame(repoOwnerName, assertIsString(payload?.repository?.owner?.login))
        assertSame(labelName, assertIsString(payload?.label?.name))
    } catch (e: unknown) {
        return false
    }
    return true
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

    console.info("issue added", { issueKey: issue.issueKey, summary: issue.summary })

    return issue
}

export function updatePullRequest(
    repoOwner: string,
    repoName: string,
    pullNumber: number,
    backlogIssueKey: string,
    backlogIssueSummary: string
): void {
    const accessToken = assertNotUndefined(process.env.GITHUB_ACCESS_TOKEN)
    const backlogBaseUrl = assertNotUndefined(process.env.BACKLOG_BASE_URL)
    const client = new GitHub(accessToken)

    const pullRequest = client.updatePullRequest({
        owner: repoOwner,
        repo: repoName,
        pull_number: pullNumber,
        title: `${backlogIssueKey} ${backlogIssueSummary}`,
    })

    console.info("pull request updated", { url: pullRequest.html_url, title: pullRequest.title })

    const issueComment = client.createIssueComment({
        owner: repoOwner,
        repo: repoName,
        issue_number: pullNumber,
        body: buildUrl(backlogBaseUrl, `/view/${backlogIssueKey}`),
    })

    console.info("review comment created", { url: issueComment.html_url, body: issueComment.body })
}

global.testOnDependenciesLabeled = (): void => {
    onDependenciesLabeled(labeledEvent)
}

global.testCreateBacklogIssue = (): void => {
    createBacklogIssue("Hello, world!", "https://example.com")
}

global.testUpdatePullRequest = (): void => {
    updatePullRequest("kzmshx", "auto-ticket-issuer-test", 2, "LINANIT-1", "Hello, world!")
}
