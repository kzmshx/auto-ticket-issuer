import DoPost = GoogleAppsScript.Events.DoPost
import TextOutput = GoogleAppsScript.Content.TextOutput

global.doPost = (e: DoPost): TextOutput => {
    return ContentService.createTextOutput()
}
