<<<<<<< HEAD
import { computed, ref } from 'vue'
import type { QueuedAction } from '@/types/offline'

// STUB until Kelvin's IndexedDB queue lands. Keep these returned names.
export function useOfflineQueue() {
  const actions = ref<QueuedAction[]>([])
  const isSyncing = ref(false)
  const pendingCount = computed(() => actions.value.filter((a) => a.status === 'pending').length)

  async function syncNow(): Promise<void> {
    isSyncing.value = true
    // Real version: send each pending action, mark 'sent' or 'failed'.
    isSyncing.value = false
  }

  return { actions, pendingCount, isSyncing, syncNow }
}
=======
export function useOfflineQueue() { return {}; }
>>>>>>> 3e83867f61750c832e15a66ca6a81072734dabd0
