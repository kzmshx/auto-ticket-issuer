export {}

declare global {
    function doPost(event: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput

    function testCreateBacklogIssue(): void
}
