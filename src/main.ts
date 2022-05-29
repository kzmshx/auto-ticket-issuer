import { onDependenciesLabeled } from "./handler/onDependenciesLabeled"

global.doPost = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
    const payload: { [x: string]: any } = JSON.parse(e.postData.contents)

    onDependenciesLabeled(payload)

    return ContentService.createTextOutput()
}
