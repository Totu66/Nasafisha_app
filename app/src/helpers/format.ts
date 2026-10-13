/**
 * Display formatting helpers (shared).
 * Currency defaults to Kenyan Shillings; numbers follow en-KE conventions.
 */

const NUMBER_LOCALE = 'en-KE';

/** KES 1,250.00 */
export function formatCurrency(
  amount: number | null | undefined,
  options: { currency?: string; decimals?: number; compact?: boolean } = {}
): string {
  const { currency = 'KES', decimals = 2, compact = false } = options;
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  return new Intl.NumberFormat(NUMBER_LOCALE, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...(compact ? { notation: 'compact' as const } : {}),
  }).format(amount);
}

/** 1,234 */
export function formatNumber(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(NUMBER_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** 96.4% */
export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${formatNumber(value, decimals)}%`;
}

/** "+1.4%" / "−0.8%" — signed delta for scorecard comparisons. */
export function formatDelta(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${formatNumber(Math.abs(value), decimals)}%`;
}

/** 1.2 MB */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${formatNumber(value, value < 10 ? 1 : 0)} ${units[unit]}`;
}

/** 3.2 hrs — MTTR and other duration metrics. */
export function formatDuration(hours: number | null | undefined): string {
  if (hours === null || hours === undefined || Number.isNaN(hours)) return '—';
  if (hours < 1) return `${formatNumber(hours * 60, 0)} min`;
  if (hours < 48) return `${formatNumber(hours, 1)} hrs`;
  return `${formatNumber(hours / 24, 1)} days`;
}

/** Collapses whitespace then truncates with an ellipsis. */
export function truncate(value: string | null | undefined, max = 80): string {
  if (!value) return '';
  const normalised = value.replace(/\s+/g, ' ').trim();
  return normalised.length <= max ? normalised : `${normalised.slice(0, max - 1)}…`;
}

/** "Wanjiru Mwangi" -> "W. Mwangi" */
export function initials(name: string | null | undefined): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}. ${parts[parts.length - 1]}`;
}

/** "wnjru mwangi" -> "Wnjru Mwangi" */
export function titleCase(value: string | null | undefined): string {
  if (!value) return '';
  return value.replace(
    /\w\S*/g,
    (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
  );
}

/** "CNT-NK-003" -> "cnt-nk-003" for case-insensitive searching. */
export function normaliseSearch(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

/** Splits a list into comma-separated text for exports. */
export function joinList(items: Array<string | number> | null | undefined, separator = ', '): string {
  if (!items || items.length === 0) return '';
  return items.join(separator);
}

/** Masks all but the last four characters: "****-4471". */
export function maskValue(value: string | null | undefined, visible = 4): string {
  if (!value) return '';
  if (value.length <= visible) return '*'.repeat(value.length);
  return `${'*'.repeat(value.length - visible)}${value.slice(-visible)}`;
}

export default {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDelta,
  formatFileSize,
  formatDuration,
  truncate,
  initials,
  titleCase,
  normaliseSearch,
  joinList,
  maskValue,
};
