import { describe, expect, it } from 'vitest'
import { analyze, parseCsv, wilsonLower } from '../../usability/analyze.mjs'

const HEADER = 'participant_id,date,first_time,device,submitted,taps_in_app,taps_camera,taps_onboarding,seconds,needed_help,notes'
const row = (id: string, o: Partial<Record<string, string>> = {}) =>
  [id, '2026-10-10', o.first ?? 'yes', 'Tecno', o.submitted ?? 'yes', o.taps ?? '2', o.cam ?? '2', o.onb ?? '0', '40', o.help ?? 'no', o.notes ?? ''].join(',')
const csv = (rows: string[]) => [HEADER, ...rows].join('\n')

describe('FE-015 usability analyser (NFR-030)', () => {
  it('parses quoted fields and CRLF line endings', () => {
    const rows = parseCsv(`${HEADER}\r\nP1,2026-10-10,yes,Tecno,yes,2,2,0,40,no,"said ""hello"", then tapped"\r\n`)
    expect(rows.length).toBe(1)
    expect(rows[0].notes).toBe('said "hello", then tapped')
  })

  it('9 of 10 first-time users within the budget meets the 90% target', () => {
    const rows = parseCsv(csv([...Array.from({ length: 9 }, (_, i) => row(`P${i}`)), row('P9', { taps: '5' })]))
    const r = analyze(rows)
    expect(r.firstTime).toBe(10)
    expect(r.inApp.pass).toBe(9)
    expect(r.inApp.meetsTarget).toBe(true)
  })

  it('8 of 10 does not meet the target', () => {
    const rows = parseCsv(csv([...Array.from({ length: 8 }, (_, i) => row(`P${i}`)), row('P8', { taps: '4' }), row('P9', { submitted: 'no' })]))
    expect(analyze(rows).inApp.meetsTarget).toBe(false)
  })

  it('does not count people who failed to submit, even with few taps', () => {
    const r = analyze(parseCsv(csv([row('P1', { submitted: 'no', taps: '1' })])))
    expect(r.inApp.pass).toBe(0)
  })

  it('excludes returning users from the first-time rate', () => {
    const r = analyze(parseCsv(csv([row('P1'), row('P2', { first: 'no', taps: '9' })])))
    expect(r.firstTime).toBe(1)
    expect(r.excludedNotFirstTime).toBe(1)
  })

  it('strict mode adds camera and onboarding taps', () => {
    const r = analyze(parseCsv(csv([row('P1', { taps: '2', cam: '2' })]))) // 2 in-app, 4 in total
    expect(r.inApp.pass).toBe(1)
    expect(r.strict.pass).toBe(0)
  })

  it('warns when fewer than 10 first-time participants, and on bad data', () => {
    const r = analyze(parseCsv(csv([row('P1'), row('P2', { taps: 'abc' })])))
    expect(r.warnings.length).toBe(2)
  })

  it('wilson lower bound is below the observed rate for small samples', () => {
    expect(wilsonLower(9, 10)).toBeLessThan(0.9)
    expect(wilsonLower(0, 0)).toBe(0)
  })
})