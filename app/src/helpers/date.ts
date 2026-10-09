/**
 * Date helpers (shared).
 * All helpers are locale-stable (en-KE) and tolerate invalid/empty input.
 */

const DATE_LOCALE = 'en-KE';
const TIME_LOCALE = 'en-GB';

export type DateInput = string | number | Date | null | undefined;

export function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isValidDate(value: DateInput): boolean {
  return toDate(value) !== null;
}

/** 7 Oct 2026 */
export function formatDate(value: DateInput, fallback = '—'): string {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleDateString(DATE_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** 07/10/2026 — stable, sortable form for tables and exports. */
export function formatDateIso(value: DateInput, fallback = '—'): string {
  const date = toDate(value);
  if (!date) return fallback;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

/** 14:05 */
export function formatTime(value: DateInput, fallback = '—'): string {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleTimeString(TIME_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** 7 Oct 2026, 14:05 */
export function formatDateTime(value: DateInput, fallback = '—'): string {
  const date = toDate(value);
  if (!date) return fallback;
  return `${formatDate(date)}, ${formatTime(date)}`;
}

const RELATIVE_STEPS: Array<[number, Intl.RelativeTimeFormatUnit]> = [
  [60, 'second'],
  [3600, 'minute'],
  [86400, 'hour'],
  [604800, 'day'],
  [2629800, 'week'],
  [31557600, 'month'],
  [Number.POSITIVE_INFINITY, 'year'],
];

/** "2 hours ago" / "in 3 days" — falls back to absolute date beyond a year. */
export function formatRelative(value: DateInput, fallback = '—'): string {
  const date = toDate(value);
  if (!date) return fallback;

  const deltaSeconds = (date.getTime() - Date.now()) / 1000;
  const abs = Math.abs(deltaSeconds);

  if (abs > 31557600) return formatDate(date);

  const rtf = new Intl.RelativeTimeFormat(DATE_LOCALE, { numeric: 'auto' });
  let unitSeconds = 1;
  for (const [limit, unit] of RELATIVE_STEPS) {
    if (abs < limit) return rtf.format(Math.round(deltaSeconds / unitSeconds), unit);
    unitSeconds = limit;
  }
  return formatDate(date);
}

/** Minutes since the given timestamp; null when input is unusable. */
export function minutesSince(value: DateInput): number | null {
  const date = toDate(value);
  if (!date) return null;
  return Math.floor((Date.now() - date.getTime()) / 60000);
}

/** True when a timestamp is older than the given number of minutes. */
export function isStale(value: DateInput, minutes: number): boolean {
  const age = minutesSince(value);
  return age !== null && age > minutes;
}

/** ISO-8601 string suitable for <input type="datetime-local">. */
export function toDateTimeLocalValue(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

/** Start of day at local midnight. */
export function startOfDay(value: DateInput): Date | null {
  const date = toDate(value);
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Add days to a date, returning a new Date. */
export function addDays(value: DateInput, days: number): Date | null {
  const date = toDate(value);
  if (!date) return null;
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default {
  toDate,
  isValidDate,
  formatDate,
  formatDateIso,
  formatTime,
  formatDateTime,
  formatRelative,
  minutesSince,
  isStale,
  toDateTimeLocalValue,
  startOfDay,
  addDays,
};
