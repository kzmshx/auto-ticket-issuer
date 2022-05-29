import { assertNotUndefined } from "./assert"
import { GitHub, IssueComment, PullRequest } from "./github"
import { buildUrl } from "./url"

function logPullRequestUpdated(pullRequest: PullRequest): void {
    console.info("pull request updated", { url: pullRequest.html_url, title: pullRequest.title })
}

function logIssueCommentCreated(issueComment: IssueComment): void {
    console.info("review comment created", { url: issueComment.html_url, body: issueComment.body })
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

    logPullRequestUpdated(pullRequest)

    const issueComment = client.createIssueComment({
        owner: repoOwner,
        repo: repoName,
        issue_number: pullNumber,
        body: buildUrl(backlogBaseUrl, `/view/${backlogIssueKey}`),
    })

    logIssueCommentCreated(issueComment)
}

global.testUpdatePullRequest = (): void => {
    updatePullRequest("kzmshx", "auto-ticket-issuer-test", 2, "LINANIT-1", "Hello, world!")
}
