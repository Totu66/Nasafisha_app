export const TAP_BUDGET: number
export const TARGET_RATE: number
export type Row = Record<string, string>
export interface Score { pass: number; rate: number; meetsTarget: boolean; lowerBound95: number }
export interface Analysis {
  budget: number
  target: number
  participants: number
  firstTime: number
  excludedNotFirstTime: number
  inApp: Score
  strict: Score
  neededHelp: number
  medianTapsInApp: number | null
  warnings: string[]
}
export function parseCsv(text: string): Row[]
export function wilsonLower(pass: number, n: number, z?: number): number
export function analyze(rows: Row[], opts?: { budget?: number; target?: number }): Analysis
export function formatReport(r: Analysis): string