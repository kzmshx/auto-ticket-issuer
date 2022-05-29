import labeledEvent from "./__tests__/data/labeled.json"
import { assertIsNumber, assertIsString, assertNotUndefined, assertSame } from "./assert"
import { createBacklogIssue } from "./createBacklogIssue"
import { updatePullRequest } from "./updatePullRequest"

global.doPost = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
    const payload: { [x: string]: any } = JSON.parse(e.postData.contents)

    onLabeled(payload)

    return ContentService.createTextOutput()
}

export function onLabeled(payload: { [key: string]: any }): void {
    if (!isOnLabeledTarget(payload)) {
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

function isOnLabeledTarget(payload: { [key: string]: any }): boolean {
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

global.testOnLabeled = (): void => {
    onLabeled(labeledEvent)
}
