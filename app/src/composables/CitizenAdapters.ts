// ─────────────────────────────────────────────────────────────────────────────────────────────────
// ADAPTERS for FE-022 / FE-024: the only file here that touches code I could not see.
//   [WIRE]  = stub, throws until connected.   [CHECK] = a guess that works only if it matches your router.
// ─────────────────────────────────────────────────────────────────────────────────────────────────
import type { CitizenReport } from '../helpers/reportStatus'

export function errorCode(e: unknown): string | undefined {
  return typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: unknown }).code) : undefined
}

/**
 * [WIRE] Load one report by its reference (FR-013.2: a resident can look up status by reference).
 * Connect to api/reports.api.ts. Map your report to CitizenReport (state, history with timestamps, before/after photo URLs).
 * Return null when the report does not exist. When offline, throw an error with `.code === 'NETWORK'`.
 */
export async function fetchReportByReference(_reference: string): Promise<CitizenReport | null> {
  throw new Error('TODO(wire): fetchReportByReference → api/reports.api.ts')
}

// [CHECK] Where each button goes. Compare with router/routes/citizen.routes.ts and use your route names/paths.
export const trackReportRoute = (reference: string): string => `/citizen/reports/${encodeURIComponent(reference)}`
export const resolvedRoute = (reference: string): string => `/citizen/reports/${encodeURIComponent(reference)}/resolved`
export const newReportRoute = (): string => '/citizen/report'
export const myReportsRoute = (): string => '/citizen/reports'