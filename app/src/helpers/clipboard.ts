export interface CopyDeps {
  clipboard?: { writeText(text: string): Promise<void> }
  /** Last resort for http pages / older browsers (textarea + execCommand). Return true if it worked. */
  fallback?: (text: string) => boolean
}

/** Copies text. Never throws; returns whether it worked, so the UI can say "Copied" or tell the user to select it. */
export async function copyText(text: string, deps: CopyDeps = defaultDeps()): Promise<boolean> {
  try {
    if (deps.clipboard) {
      await deps.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to the fallback */
  }
  try {
    return deps.fallback ? deps.fallback(text) : false
  } catch {
    return false
  }
}

function defaultDeps(): CopyDeps {
  return {
    clipboard: typeof navigator !== 'undefined' ? navigator.clipboard : undefined,
    fallback: (text) => {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      return ok
    },
  }
}