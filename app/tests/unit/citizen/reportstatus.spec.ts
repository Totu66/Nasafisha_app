import { describe, expect, it } from 'vitest'
import { buildTimeline, formatTimestamp, resolutionView } from '../../../src/helpers/reportStatus'

const history = [
  { state: 'SUBMITTED' as const, at: '2026-10-01T06:00:00Z' },
  { state: 'VERIFIED' as const, at: '2026-10-01T07:00:00Z' },
  { state: 'ASSIGNED' as const, at: '2026-10-01T08:00:00Z' },
]

describe('FE-022/FE-024 report status model (FR-013)', () => {
  it('marks earlier states done, the current one current, later ones upcoming', () => {
    const steps = buildTimeline('ASSIGNED', history)
    expect(steps.map((s) => s.status)).toEqual(['done', 'done', 'current', 'upcoming', 'upcoming'])
  })
  it('carries the time each reached state happened, and none for upcoming ones', () => {
    const steps = buildTimeline('ASSIGNED', history)
    expect(steps[0].at).toBe('2026-10-01T06:00:00Z')
    expect(steps[2].at).toBe('2026-10-01T08:00:00Z')
    expect(steps[3].at).toBe(null)
  })
  it('a resolved report shows every step as done', () => {
    const steps = buildTimeline('RESOLVED', [...history, { state: 'IN_PROGRESS', at: '2026-10-01T09:00:00Z' }, { state: 'RESOLVED', at: '2026-10-01T10:00:00Z' }])
    expect(steps.map((s) => s.status)).toEqual(['done', 'done', 'done', 'done', 'done'])
    expect(steps[4].at).toBe('2026-10-01T10:00:00Z')
  })
  it('a freshly submitted report has one current step and no history gaps', () => {
    const steps = buildTimeline('SUBMITTED', [history[0]])
    expect(steps.map((s) => s.status)).toEqual(['current', 'upcoming', 'upcoming', 'upcoming', 'upcoming'])
  })
  it('only shows the resolution when resolved AND an after-photo exists (FR-012.1)', () => {
    expect(resolutionView({ state: 'RESOLVED', afterPhoto: 'https://x/after.jpg' })).toBe('ready')
    expect(resolutionView({ state: 'RESOLVED', afterPhoto: null })).toBe('missing-photo')
    expect(resolutionView({ state: 'IN_PROGRESS', afterPhoto: 'https://x/after.jpg' })).toBe('not-resolved')
  })
  it('formats timestamps in Nakuru time and tolerates bad input', () => {
    // 2026-10-01T06:00Z is 09:00 in Nakuru (UTC+3)
    expect(formatTimestamp('2026-10-01T06:00:00Z', 'en')).toContain('2026')
    expect(formatTimestamp('2026-10-01T06:00:00Z', 'en')).toContain('9:00')
    expect(formatTimestamp('not a date', 'en')).toBe('')
    expect(formatTimestamp(null, 'sw')).toBe('')
  })
})