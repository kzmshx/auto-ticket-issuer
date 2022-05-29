import { assertIsNumber, assertIsString, assertNotUndefined, assertSame } from "./assert"
import { createBacklogIssue } from "./createBacklogIssue"
import { updatePullRequest } from "./updatePullRequest"

function isOnLabeledTarget(payload: { [key: string]: any }): boolean {
    const repositoryOwnerId = assertNotUndefined(process.env.GITHUB_PR_REPO_OWNER_NAME)
    const labelName = assertNotUndefined(process.env.GITHUB_PR_LABEL_NAME)

    try {
        assertSame("labeled", assertIsString(payload?.action))
        assertSame(repositoryOwnerId, assertIsString(payload?.repo?.owner?.id))
        assertSame(labelName, assertIsString(payload?.label?.name))
    } catch (e: unknown) {
        return false
    }
    return true
}

export function onLabeled(payload: { [key: string]: any }): void {
    if (!isOnLabeledTarget(payload)) {
        return
    }

    const repoOwner = assertIsString(payload?.repository?.owner?.login)
    const repoName = assertIsString(payload?.repository?.name)
    const pullUrl = assertIsString(payload?.pull_request?.html_url)
    const pullTitle = assertIsString(payload?.pull_request?.title)
    const pullNumber = assertIsNumber(payload?.pull_request?.number)

    const backlogIssue = createBacklogIssue(pullTitle, pullUrl)
    updatePullRequest(repoOwner, repoName, pullNumber, backlogIssue.issueKey, backlogIssue.summary)
}

global.doPost = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
    const payload: { [x: string]: any } = JSON.parse(e.postData.contents)

    onLabeled(payload)

    return ContentService.createTextOutput()
}
