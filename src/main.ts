import { handleLabeled } from "./handler"
import labeledEvent from "./testdata/labeled.json"

global.doPost = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
    const payload: { [x: string]: any } = JSON.parse(e.postData.contents)
    handleLabeled(payload)

    return ContentService.createTextOutput()
}
