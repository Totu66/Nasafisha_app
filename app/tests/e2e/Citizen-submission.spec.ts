// FE-015 · NFR-030: "90% of first-time users submit in ≤ 3 taps".
// This spec is the AUTOMATED half: it measures the taps a first-time citizen needs on the real UI.
// The 90% figure itself comes from the human test in tests/usability/PROTOCOL.md.
import { expect, test } from '@playwright/test'
import { DEFAULT_CONFIG, runSubmission } from './support/citizenFlow'
import { between, installRecorder, mark, readEvents, taps } from './support/tapRecorder'

test.describe('FE-015 citizen submission: tap budget (NFR-030)', () => {
  test.use({
    viewport: { width: 360, height: 740 }, // low-end Android class screen
    hasTouch: true,
    isMobile: true,
    permissions: ['geolocation'],
    geolocation: { latitude: -0.3031, longitude: 36.08 }, // Nakuru; GPS is automatic, no manual location entry
  })

  test('a citizen submits a photo report in at most 3 taps and gets a reference', async ({ page }, testInfo) => {
    const result = await runSubmission(page, DEFAULT_CONFIG)

    await testInfo.attach('tap-log.json', { body: JSON.stringify(result.taps, null, 2), contentType: 'application/json' })
    testInfo.annotations.push({ type: 'taps', description: `${result.taps.length} (budget ${DEFAULT_CONFIG.tapBudget})` })

    const log = result.taps.map((t, i) => `${i + 1}. ${t.tag} "${t.text}"`).join(' | ')
    expect(result.taps.length, `taps used: ${log}`).toBeLessThanOrEqual(DEFAULT_CONFIG.tapBudget)
    expect(result.reference, 'a reference is shown after submitting (PRD UJ-001 step 2)').not.toBe('')
    expect.soft(result.keystrokes, 'nothing should need typing (no manual location entry)').toBe(0)
  })
})

// Guards the measuring tool itself, so a broken recorder can never make the test above pass by accident.
test.describe('FE-015 tap recorder self-check', () => {
  test('counts one tap per tap, once for a label that triggers a file input, and ignores script clicks', async ({ page }) => {
    await page.addInitScript(installRecorder)
    await page.route('https://recorder.test/', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: `<button id="a">A</button><button id="b">B</button>
               <label id="l">Photo<input id="f" type="file" style="position:absolute;left:-9999px"></label>
               <input id="t" type="text">`,
      }),
    )
    await page.goto('https://recorder.test/')
    await mark(page, 'start')
    await page.click('#a')
    await page.click('#b')
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.click('#l')])
    await chooser.setFiles([])
    await page.evaluate(() => document.getElementById('a')!.click()) // script click: not a tap
    await page.fill('#t', 'abc') // fill() does not type keys
    await mark(page, 'end')
    expect(taps(between(await readEvents(page), 'start', 'end')).map((t) => t.tag)).toEqual(['button', 'button', 'label'])
  })
})