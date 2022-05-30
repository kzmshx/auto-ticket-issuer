import { onDependenciesLabeled } from "./onDependenciesLabeled/onDependenciesLabeled"

export type Payload = { [key: string]: any }

global.doPost = (e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput => {
    const payload: Payload = JSON.parse(e.postData.contents)

    onDependenciesLabeled(payload)

    return ContentService.createTextOutput()
}
