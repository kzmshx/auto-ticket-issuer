import { assertIsString, assertSame } from "./assert"

type Payload = {
    [x: string]: any
}

export function handleLabeled(payload: Payload): void {
    if (!isTarget(payload)) {
        return
    }

    const title = assertIsString(payload?.pull_request?.title)
    const prUrl = assertIsString(payload?.pull_request?.html_url)
    const baseRef = assertIsString(payload?.pull_request?.base?.ref)
    const headRef = assertIsString(payload?.pull_request?.head?.ref)
}

function isTarget(payload: Payload): boolean {
    try {
        assertSame("labeled", assertIsString(payload?.action))
        assertSame(process.env.GITHUB_TARGET_REPOSITORY_OWNER_ID, assertIsString(payload?.repo?.owner?.id))
        assertSame(process.env.GITHUB_TARGET_LABEL_NAME, assertIsString(payload?.label?.name))
    } catch (e: unknown) {
        return false
    }
    return true
}
