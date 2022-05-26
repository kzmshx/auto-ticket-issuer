import { createBacklogIssue, handleLabeled } from "./handler"

global.doPost = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
    const payload: { [x: string]: any } = JSON.parse(e.postData.contents)

    handleLabeled(payload)

    return ContentService.createTextOutput()
}

global.testCreateBacklogIssue = (): void => {
    createBacklogIssue("Hello, world!", "https://example.com")
}
