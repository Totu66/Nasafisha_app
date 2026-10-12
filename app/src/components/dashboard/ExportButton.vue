<template>
  <button
    type="button"
    class="export-button"
    :disabled="disabled"
    @click="handleExport"
  >
    {{ loading ? 'Exporting...' : 'Export CSV' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { exportToCSV } from '../../helpers/export'

interface Props {
  data: Record<string, unknown>[]
  filename?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  filename: 'dashboard-report.csv',
  disabled: false
})

const loading = ref(false)

function handleExport() {
  if (!props.data.length) {
    return
  }

  loading.value = true

  try {
    exportToCSV(props.data, props.filename)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.export-button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.export-button:hover {
  background: #1d4ed8;
}

.export-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>