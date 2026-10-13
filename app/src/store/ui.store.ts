/**
 * Global UI state (FE-033): sidebar, theme, locale and toast queue.
 * Deliberately holds no domain data — see feature stores for that.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { STORAGE_KEYS, LOCALES, type LocaleCode } from '../config/constants';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: number;
  variant: ToastVariant;
  title?: string;
  message: string;
  /** Milliseconds before the toast auto-dismisses. 0 keeps it until dismissed. */
  duration: number;
}

const DEFAULT_TOAST_DURATION = 5000;
let toastSeq = 0;

function readStored(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode) — state still works in memory */
  }
}

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref<boolean>(false);
  const theme = ref<'light' | 'dark'>(
    readStored(STORAGE_KEYS.theme, 'light') as 'light' | 'dark'
  );
  const locale = ref<LocaleCode>(
    readStored(STORAGE_KEYS.locale, 'en') as LocaleCode
  );
  const toasts = ref<ToastItem[]>([]);
  const globalLoading = ref<boolean>(false);

  const availableLocales = computed(() => LOCALES);
  const isRtl = computed(() => false);

  function toggleSidebar(force?: boolean): void {
    sidebarOpen.value = force ?? !sidebarOpen.value;
  }

  function closeSidebar(): void {
    sidebarOpen.value = false;
  }

  function setTheme(next: 'light' | 'dark'): void {
    theme.value = next;
    writeStored(STORAGE_KEYS.theme, next);
  }

  function setLocale(next: LocaleCode): void {
    if (!LOCALES.some((l) => l.code === next)) return;
    locale.value = next;
    writeStored(STORAGE_KEYS.locale, next);
  }

  function pushToast(toast: Omit<ToastItem, 'id'>): number {
    const id = ++toastSeq;
    const duration = toast.duration ?? DEFAULT_TOAST_DURATION;
    toasts.value.push({ ...toast, id, duration });

    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration);
    }
    return id;
  }

  function toast(message: string, variant: ToastVariant = 'info', title?: string): number {
    return pushToast({ message, variant, title, duration: DEFAULT_TOAST_DURATION });
  }

  function dismissToast(id: number): void {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function clearToasts(): void {
    toasts.value = [];
  }

  function setLoading(value: boolean): void {
    globalLoading.value = value;
  }

  return {
    sidebarOpen,
    theme,
    locale,
    toasts,
    globalLoading,
    availableLocales,
    isRtl,
    toggleSidebar,
    closeSidebar,
    setTheme,
    setLocale,
    pushToast,
    toast,
    dismissToast,
    clearToasts,
    setLoading,
  };
});

export default useUiStore;
