/**
 * Minimal i18n runtime (FE-031).
 * Loads the bundled en/sw locale files and exposes t() plus locale state
 * without pulling in a heavyweight i18n dependency.
 */

import { computed, type ComputedRef } from 'vue';
import { useUiStore } from '../store/ui.store';
import { LOCALES, type LocaleCode } from '../config/constants';
import en from './locales/en.json';
import sw from './locales/sw.json';

export type Messages = Record<string, string>;

const BUNDLED: Record<LocaleCode, Messages> = {
  en: en as Messages,
  sw: sw as Messages,
};

const DEFAULT_LOCALE: LocaleCode = 'en';

/** Interpolates `{name}` placeholders inside a template string. */
function interpolate(template: string, params?: Record<string, unknown>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match
  );
}

/** Resolves a dot-path like `auth.welcomeBack` inside a nested message object. */
function lookup(messages: Messages, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
  return typeof value === 'string' ? value : undefined;
}

function resolve(locale: LocaleCode, key: string, params?: Record<string, unknown>): string {
  const template =
    lookup(BUNDLED[locale] ?? {}, key) ??
    lookup(BUNDLED[DEFAULT_LOCALE], key) ??
    key;
  return interpolate(template, params);
}

export function useI18n() {
  const ui = useUiStore();

  const locale = computed<LocaleCode>(() => ui.locale);
  const locales = computed(() => LOCALES);

  function t(key: string, params?: Record<string, unknown>): string {
    return resolve(ui.locale, key, params);
  }

  function setLocale(next: LocaleCode): void {
    ui.setLocale(next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
  }

  function toggleLocale(): void {
    setLocale(ui.locale === 'en' ? 'sw' : 'en');
  }

  return { t, locale, locales, setLocale, toggleLocale };
}

/** Non-reactive helper for modules outside the setup context. */
export function translate(key: string, params?: Record<string, unknown>): string {
  return resolve(DEFAULT_LOCALE, key, params);
}

/** Locale lookup exposed for tooling and tests. */
export const messages: ComputedRef<Messages> | Record<LocaleCode, Messages> = BUNDLED;

export default useI18n;
