// FE-015: drives the citizen photo-report flow (PRD UJ-001) exactly as a first-time user would,
// and measures the taps. No assertions on test frameworks in here, so it also runs outside @playwright/test.
import type { Locator, Page } from '@playwright/test'
import { between, installRecorder, keystrokes, mark, readEvents, taps, type TapEvent } from './tapRecorder'

/** How to find an element. Several hints are combined (first one that exists wins). */
export interface LocatorSpec {
  testId?: string
  role?: { role: 'button' | 'link' | 'tab'; name: RegExp }
  text?: RegExp
}

export interface CitizenFlowConfig {
  /** Page where the flow starts (after sign-in and consent). CHECK against router/routes/citizen.routes.ts. */
  startPath: string
  /** NFR-030: a first-time user submits in this many taps or fewer. */
  tapBudget: number
  /** Optional first tap on a home screen ("Report an issue") if the photo step is not on the start page. */
  startReport?: LocatorSpec
  /** The control that opens the camera / file chooser. */
  takePhoto: LocatorSpec
  /** 'file-chooser': a native file/camera input (default). 'camera-stream': an in-page camera with its own shutter. */
  photoMode: 'file-chooser' | 'camera-stream'
  /** Shutter button for 'camera-stream'. */
  shutter?: LocatorSpec
  submit: LocatorSpec
  /** The place where the report reference is shown after submitting (UJ-001 step 2). */
  reference: LocatorSpec
  /** Run after the start page loads and before measuring starts: sign in, accept consent, etc. Not counted. */
  beforeFlow?: (page: Page) => Promise<void>
  timeoutMs: number
}

// ── CHECK THESE against the real screens. Adding data-testid attributes is the most robust fix. ──────────
export const DEFAULT_CONFIG: CitizenFlowConfig = {
  startPath: '/report',
  tapBudget: 3,
  photoMode: 'file-chooser',
  takePhoto: { testId: 'report-take-photo', role: { role: 'button', name: /photo|camera|picha/i } },
  submit: { testId: 'report-submit', role: { role: 'button', name: /submit|send|tuma/i } },
  reference: { testId: 'report-reference', text: /\b(ref|reference|rufaa)\b/i },
  timeoutMs: 10000,
}

export function locate(page: Page, spec: LocatorSpec): Locator {
  const found: Locator[] = []
  if (spec.testId) found.push(page.getByTestId(spec.testId))
  if (spec.role) found.push(page.getByRole(spec.role.role, { name: spec.role.name }))
  if (spec.text) found.push(page.getByText(spec.text))
  if (!found.length) throw new Error('LocatorSpec needs at least one of testId / role / text')
  return found.reduce((a, b) => a.or(b)).first()
}

// 1x1 PNG: any image will do; the test is about taps, not the picture.
const PHOTO = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

async function waitUntil(check: () => Promise<boolean>, timeoutMs: number, what: string): Promise<void> {
  const end = Date.now() + timeoutMs
  while (Date.now() < end) {
    if (await check().catch(() => false)) return
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error(`Timed out waiting for ${what}`)
}

export interface FlowResult {
  taps: TapEvent[]
  keystrokes: number
  reference: string
}

export async function runSubmission(page: Page, config: CitizenFlowConfig): Promise<FlowResult> {
  await page.addInitScript(installRecorder) // must be registered before the app loads
  await page.goto(config.startPath)
  await config.beforeFlow?.(page)

  await mark(page, 'flow-start')

  if (config.startReport) await locate(page, config.startReport).click({ timeout: config.timeoutMs })

  const takePhoto = locate(page, config.takePhoto)
  if (config.photoMode === 'camera-stream') {
    await takePhoto.click({ timeout: config.timeoutMs })
    if (config.shutter) await locate(page, config.shutter).click({ timeout: config.timeoutMs })
  } else {
    const [chooser] = await Promise.all([page.waitForEvent('filechooser', { timeout: config.timeoutMs }), takePhoto.click({ timeout: config.timeoutMs })])
    await chooser.setFiles({ name: 'uncollected-waste.png', mimeType: 'image/png', buffer: PHOTO })
  }

  // Submit becomes enabled once the photo is processed and GPS has a fix: no extra tap is allowed in between.
  const submit = locate(page, config.submit)
  await waitUntil(() => submit.isEnabled(), config.timeoutMs, 'the Submit button to become enabled (photo + GPS ready)')
  await submit.click({ timeout: config.timeoutMs })

  const reference = locate(page, config.reference)
  await reference.waitFor({ state: 'visible', timeout: config.timeoutMs })
  const referenceText = (await reference.innerText()).trim()

  await mark(page, 'flow-end')
  const flow = between(await readEvents(page), 'flow-start', 'flow-end')
  return { taps: taps(flow), keystrokes: keystrokes(flow), reference: referenceText }
}