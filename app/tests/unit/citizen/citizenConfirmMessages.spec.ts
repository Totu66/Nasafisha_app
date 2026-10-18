import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { citizenConfirmMessages } from '../../../src/i18n/citizenConfirm.messages'
import { REPORT_STATES } from '../../../src/helpers/reportStatus'

// jsdom's URL implementation mishandles relative file: URLs on Windows, so
// resolve the source tree from this file's real path instead.
const SRC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../../src')

type Tree = { [k: string]: string | Tree }
const flatten = (o: Tree, prefix = ''): Record<string, string> =>
  Object.entries(o).reduce<Record<string, string>>((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k
    return typeof v === 'string' ? { ...acc, [key]: v } : { ...acc, ...flatten(v, key) }
  }, {})
const en = flatten(citizenConfirmMessages.en as Tree)
const sw = flatten(citizenConfirmMessages.sw as Tree)
const params = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

const FILES = [
  'components/reports/ReportReferenceCard.vue',
  'components/reports/ReportStatusTimeline.vue',
  'components/reports/BeforeAfterPhotoPair.vue',
  'views/citizen/ReportSentView.vue',
  'views/citizen/ResolvedConfirmationView.vue',
]

describe('citizen confirmation translations (en / sw)', () => {
  it('English and Kiswahili define exactly the same keys', () => {
    expect(Object.keys(sw).sort()).toEqual(Object.keys(en).sort())
  })
  it('every translation keeps the same {placeholders}', () => {
    for (const key of Object.keys(en)) expect(params(sw[key])).toEqual(params(en[key]))
  })
  it('has a label for every report state, so a status never shows as a raw code', () => {
    for (const s of REPORT_STATES) expect(`state.${s}` in en).toBe(true)
  })
  it('every t("…") key used in the new files exists', () => {
    const missing: string[] = []
    for (const f of FILES) {
      const src = readFileSync(resolve(SRC_DIR, f), 'utf8')
      for (const m of src.matchAll(/\bt\('([\w.]+)'/g)) if (!(m[1] in en)) missing.push(`${f}: ${m[1]}`)
    }
    expect(missing).toEqual([])
  })
  it('dynamic timeline keys exist', () => {
    for (const k of ['done', 'current', 'upcoming']) expect(`timeline.${k}` in en).toBe(true)
  })
})