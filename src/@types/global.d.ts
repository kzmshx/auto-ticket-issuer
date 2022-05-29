export {}

declare global {
    function doPost(event: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput

    function testOnLabeled(): void

    function testCreateBacklogIssue(): void

    function testUpdatePullRequest(): void
}
