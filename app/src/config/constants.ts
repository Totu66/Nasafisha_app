/**
 * Application-wide constants (FE-033).
 * Values here are safe to import anywhere and must never contain secrets.
 */

import { env } from './env';

export const APP_NAME = env.appName;
export const APP_TAGLINE = 'Nakuru Municipal Waste Management';

/** localStorage keys shared across the app. */
export const STORAGE_KEYS = {
  token: 'nasafisha_auth_token',
  user: 'nasafisha_auth_user',
  locale: 'nasafisha_locale',
  theme: 'nasafisha_theme',
  offlineQueue: 'nasafisha_offline_queue',
} as const;

/** Event names dispatched on window for cross-module signalling. */
export const EVENTS = {
  unauthorized: 'nasafisha:unauthorized',
  toast: 'nasafisha:toast',
} as const;

/** SLA and operational thresholds (SRS FR-012 / FR-013 / FR-020). */
export const SLA = {
  targetComplianceRate: 95.0,
  targetMttrHours: 4.0,
  staleDataMinutes: 15,
} as const;

/** Pagination defaults for list endpoints. */
export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

/** Field-crew operational limits. */
export const FIELD = {
  /** Maximum photo attachments per report submission. */
  maxPhotosPerReport: 4,
  /** Maximum accepted photo upload size in megabytes. */
  maxPhotoSizeMb: 8,
  /** Offline queue flush interval in milliseconds. */
  syncIntervalMs: 30_000,
} as const;

/** Supported UI locales. */
export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];

export default {
  APP_NAME,
  APP_TAGLINE,
  STORAGE_KEYS,
  EVENTS,
  SLA,
  PAGINATION,
  FIELD,
  LOCALES,
};
