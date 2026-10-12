// FE-015: counts real user taps in the page so the "≤ 3 taps" rule (NFR-030) is measured, not guessed.
// Only the page-side function is browser code; everything else here is plain, testable logic.
import type { Page } from '@playwright/test'

export interface TapEvent { kind: 'tap'; t: number; tag: string; text: string; testId: string | null }
export interface KeyEvent { kind: 'key'; t: number }
export interface MarkEvent { kind: 'mark'; t: number; name: string }
export type RecordedEvent = TapEvent | KeyEvent | MarkEvent

export const STORAGE_KEY = '__nsf_events__'

/**
 * Runs INSIDE the page, before any app code (use with page.addInitScript). It is serialised by Playwright,
 * so it must not use anything from outside this function.
 *  - Counts only trusted clicks (what a finger or Playwright's click produces), never script-made ones.
 *  - A click on a <label> makes the browser fire a second click on its input: that is ONE tap, so it is deduplicated.
 *  - Counts typed characters in text fields, to check that nothing needs typing.
 *  - Events live in sessionStorage so they survive page reloads inside the flow.
 */
export function installRecorder(): void {
  const w = window as unknown as { __nsfRecorder?: boolean; __nsfMark?: (name: string) => void }
  if (w.__nsfRecorder) return
  w.__nsfRecorder = true
  const KEY = '__nsf_events__'
  const load = (): object[] => {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  }
  const push = (ev: object): void => {
    const all = load()
    all.push(ev)
    try {
      sessionStorage.setItem(KEY, JSON.stringify(all))
    } catch {
      /* storage unavailable: nothing to record into */
    }
  }
  let lastLabel: { el: Element; t: number } | null = null

  window.addEventListener(
    'click',
    (e: MouseEvent) => {
      if (!e.isTrusted || !(e.target instanceof Element)) return
      const el = (e.target.closest('button, a, label, summary, select, input, textarea, [role="button"], [role="tab"], [role="link"]') ??
        e.target) as HTMLElement
      if (el instanceof HTMLInputElement && lastLabel && Date.now() - lastLabel.t < 150) {
        const labels = Array.from(el.labels ?? [])
        if (labels.includes(lastLabel.el as HTMLLabelElement)) return
      }
      if (el.tagName === 'LABEL') lastLabel = { el, t: Date.now() }
      const text = (el.innerText || (el as HTMLInputElement).value || el.getAttribute('aria-label') || '').trim().slice(0, 40)
      push({ kind: 'tap', t: Date.now(), tag: el.tagName.toLowerCase(), text, testId: el.getAttribute('data-testid') })
    },
    true,
  )

  window.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const t = e.target
      if (e.isTrusted && e.key.length === 1 && (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)) {
        push({ kind: 'key', t: Date.now() })
      }
    },
    true,
  )

  w.__nsfMark = (name: string): void => push({ kind: 'mark', t: Date.now(), name })
}

export async function mark(page: Page, name: string): Promise<void> {
  await page.evaluate((n) => (window as unknown as { __nsfMark: (n: string) => void }).__nsfMark(n), name)
}

export async function readEvents(page: Page): Promise<RecordedEvent[]> {
  return page.evaluate((key) => JSON.parse(sessionStorage.getItem(key) || '[]'), STORAGE_KEY)
}

/** Events strictly between two named marks. Throws if a mark is missing so a broken run cannot pass silently. */
export function between(events: readonly RecordedEvent[], from: string, to: string): RecordedEvent[] {
  const a = events.findIndex((e) => e.kind === 'mark' && e.name === from)
  const b = events.findIndex((e, i) => i > a && e.kind === 'mark' && e.name === to)
  if (a === -1 || b === -1) throw new Error(`recorder marks "${from}" / "${to}" not found`)
  return events.slice(a + 1, b)
}

export const taps = (events: readonly RecordedEvent[]): TapEvent[] => events.filter((e): e is TapEvent => e.kind === 'tap')
export const keystrokes = (events: readonly RecordedEvent[]): number => events.filter((e) => e.kind === 'key').length