/**
 * Toast notification provider (shared).
 *
 * Thin, dependency-free wrapper over the UI store so non-component code
 * (API interceptors, composables, service workers) can raise notifications
 * without touching Pinia directly at import time.
 *
 *   import { toast } from '../providers/toast';
 *   toast.success('Report submitted');
 */

import { useUiStore, type ToastVariant } from '../store/ui.store';

function emit(variant: ToastVariant, message: string, title?: string): number {
  // Lazy: works only once Pinia is installed (i.e. after app.use(pinia)).
  try {
    const ui = useUiStore();
    return ui.pushToast({
      variant,
      message,
      title,
      duration: variant === 'error' ? 8000 : 5000,
    });
  } catch {
    // Pinia not ready yet (e.g. import-time call) — fall back to console.
    console.warn(`[toast:${variant}]`, title ? `${title}: ${message}` : message);
    return 0;
  }
}

export const toast = {
  info: (message: string, title?: string) => emit('info', message, title),
  success: (message: string, title?: string) => emit('success', message, title),
  warning: (message: string, title?: string) => emit('warning', message, title),
  error: (message: string, title?: string) => emit('error', message, title),
  /** Alias kept for call sites that read better as `toast(message)`. */
  show: (message: string, variant: ToastVariant = 'info', title?: string) =>
    emit(variant, message, title),
};

export default toast;
