import DoPost = GoogleAppsScript.Events.DoPost
import TextOutput = GoogleAppsScript.Content.TextOutput

export {}

declare global {
    function doPost(event: DoPost): TextOutput
}
