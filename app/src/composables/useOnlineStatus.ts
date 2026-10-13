/**
 * Reactive online/offline status (shared).
 * Tracks the browser connectivity flag and keeps a live ref as it changes.
 *
 *   const { online, since, wasOffline } = useOnlineStatus();
 */

import { ref, computed, onMounted, onUnmounted, type ComputedRef, type Ref } from 'vue';

export interface UseOnlineStatus {
  /** Current connectivity state. */
  online: Ref<boolean>;
  /** Timestamp of the last connectivity transition, or null if never changed. */
  lastChangedAt: Ref<number | null>;
  /** True once the connection has dropped at least once this session. */
  wasOffline: ComputedRef<boolean>;
  /** Convenience label for badges and toasts. */
  label: ComputedRef<'Online' | 'Offline'>;
}

export function useOnlineStatus(): UseOnlineStatus {
  const online = ref<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine);
  const lastChangedAt = ref<number | null>(null);

  function handleOnline(): void {
    online.value = true;
    lastChangedAt.value = Date.now();
  }

  function handleOffline(): void {
    online.value = false;
    lastChangedAt.value = Date.now();
  }

  onMounted(() => {
    // Re-read in case the state changed between module load and mount.
    online.value = navigator.onLine;
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  const wasOffline = computed(() => lastChangedAt.value !== null && !online.value);
  const label = computed(() => (online.value ? ('Online' as const) : ('Offline' as const)));

  return { online, lastChangedAt, wasOffline, label };
}

export default useOnlineStatus;
