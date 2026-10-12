#!/usr/bin/env node
// FE-015 · NFR-030: turns the usability results CSV into the pass rate.
//   node tests/usability/analyze.mjs results.csv            (exit code 1 if the headline result is below target)
// Headline = in-app taps only. The strict figure (camera + onboarding taps included) is always shown too,
// because the team has not yet decided what counts toward the 3 taps (see PROTOCOL.md, "Decide first").
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const TAP_BUDGET = 3
export const TARGET_RATE = 0.9

/** Minimal CSV parser: handles quoted fields, escaped quotes, CRLF. */
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field); field = ''
      if (row.some((x) => x.trim() !== '')) rows.push(row)
      row = []
    } else field += c
  }
  row.push(field)
  if (row.some((x) => x.trim() !== '')) rows.push(row)
  const [header, ...data] = rows
  if (!header) return []
  const keys = header.map((h) => h.trim())
  return data.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])))
}

const num = (v) => (v === '' || Number.isNaN(Number(v)) ? NaN : Number(v))
const yes = (v) => v.toLowerCase() === 'yes'

/** 95% Wilson interval lower bound: what the result supports given how few people were tested. */
export function wilsonLower(pass, n, z = 1.96) {
  if (n === 0) return 0
  const p = pass / n
  const denom = 1 + (z * z) / n
  const centre = p + (z * z) / (2 * n)
  const margin = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))
  return Math.max(0, (centre - margin) / denom)
}

export function analyze(rows, { budget = TAP_BUDGET, target = TARGET_RATE } = {}) {
  const issues = []
  const eligible = rows.filter((r) => yes(r.first_time ?? ''))
  eligible.forEach((r) => {
    if (Number.isNaN(num(r.taps_in_app))) issues.push(`${r.participant_id || '(no id)'}: taps_in_app is missing or not a number`)
  })
  const valid = eligible.filter((r) => !Number.isNaN(num(r.taps_in_app)))
  const score = (r, strict) => {
    const taps = num(r.taps_in_app) + (strict ? (num(r.taps_camera) || 0) + (num(r.taps_onboarding) || 0) : 0)
    return yes(r.submitted ?? '') && taps <= budget
  }
  const build = (strict) => {
    const pass = valid.filter((r) => score(r, strict)).length
    const rate = valid.length ? pass / valid.length : 0
    return { pass, rate, meetsTarget: valid.length > 0 && rate >= target, lowerBound95: wilsonLower(pass, valid.length) }
  }
  const sorted = valid.map((r) => num(r.taps_in_app)).sort((a, b) => a - b)
  return {
    budget,
    target,
    participants: rows.length,
    firstTime: valid.length,
    excludedNotFirstTime: rows.length - eligible.length,
    inApp: build(false),
    strict: build(true),
    neededHelp: valid.filter((r) => yes(r.needed_help ?? '')).length,
    medianTapsInApp: sorted.length ? sorted[Math.floor((sorted.length - 1) / 2)] : null,
    warnings: [
      ...(valid.length < 10 ? [`Only ${valid.length} first-time participants: aim for at least 10. Treat this result as indicative.`] : []),
      ...issues,
    ],
  }
}

const pct = (x) => `${Math.round(x * 100)}%`

export function formatReport(r) {
  const line = (label, s) =>
    `${label}: ${s.pass}/${r.firstTime} = ${pct(s.rate)}  → ${s.meetsTarget ? 'MEETS' : 'DOES NOT MEET'} the ${pct(r.target)} target  (95% lower bound ${pct(s.lowerBound95)})`
  return [
    `NFR-030 usability result: submit in ≤ ${r.budget} taps`,
    `First-time participants counted: ${r.firstTime} (excluded, not first-time: ${r.excludedNotFirstTime})`,
    line('HEADLINE  in-app taps only            ', r.inApp),
    line('STRICT    + camera + onboarding taps  ', r.strict),
    `Median in-app taps: ${r.medianTapsInApp ?? 'n/a'} · needed help: ${r.neededHelp}`,
    ...r.warnings.map((w) => `WARNING: ${w}`),
  ].join('\n')
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const file = process.argv[2]
  if (!file) {
    console.error('usage: node tests/usability/analyze.mjs results.csv')
    process.exit(2)
  }
  const result = analyze(parseCsv(readFileSync(file, 'utf8')))
  console.log(formatReport(result))
  process.exit(result.inApp.meetsTarget ? 0 : 1)
}