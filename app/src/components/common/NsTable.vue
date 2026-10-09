<script setup lang="ts" generic="Row extends Record<string, any>">
import { computed, ref } from 'vue';

export interface NsColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  width?: string;
}

const props = withDefaults(
  defineProps<{
    caption: string;
    columns: NsColumn[];
    rows: Row[];
    rowKey: keyof Row & string;
    state?: 'ready' | 'loading' | 'unavailable';
    emptyText?: string;
    isStale?: (row: Row) => boolean;
  }>(),
  {
    state: 'ready',
    emptyText: 'No records match the current filters.',
  }
);

const sortKey = ref<string | null>(null);
const sortDir = ref<'asc' | 'desc'>('asc');

function toggleSort(col: NsColumn) {
  if (!col.sortable) return;
  if (sortKey.value === col.key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = col.key;
    sortDir.value = 'asc';
  }
}

const sorted = computed(() => {
  if (!sortKey.value) return props.rows;
  const k = sortKey.value;
  const dir = sortDir.value === 'asc' ? 1 : -1;
  return [...props.rows].sort((a, b) =>
    String(a[k] ?? '').localeCompare(String(b[k] ?? ''), undefined, { numeric: true }) * dir
  );
});

const ariaSort = (c: NsColumn) => {
  if (sortKey.value !== c.key) return c.sortable ? 'none' : undefined;
  return sortDir.value === 'asc' ? 'ascending' : 'descending';
};
</script>

<template>
  <div class="ns-table__wrap" tabindex="0" role="region" :aria-label="`${props.caption}, scrollable table`">
    <table class="ns-table">
      <caption class="ns-table__caption">{{ props.caption }}</caption>
      <thead>
        <tr>
          <th
            v-for="c in props.columns"
            :key="c.key"
            scope="col"
            :class="['ns-table__th', `is-${c.align ?? 'start'}`]"
            :style="{ width: c.width }"
            :aria-sort="ariaSort(c)"
          >
            <button
              v-if="c.sortable"
              class="ns-table__sort"
              type="button"
              @click="toggleSort(c)"
            >
              <span>{{ c.label }}</span>
              <span class="ns-table__sort-icon" aria-hidden="true">
                {{ sortKey === c.key ? (sortDir === 'asc' ? '▲' : '▼') : '↕' }}
              </span>
            </button>
            <span v-else>{{ c.label }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="props.state === 'loading'">
          <td :colspan="props.columns.length" class="ns-table__note" role="status">
            <div class="ns-table__loading-spinner"></div>
            Loading data…
          </td>
        </tr>
        <tr v-else-if="props.state === 'unavailable'">
          <td :colspan="props.columns.length" class="ns-table__note ns-table__note--warn" role="alert">
            Data unavailable. The requested service did not respond. Live or stale data is suppressed per municipal policy (FR-030).
          </td>
        </tr>
        <tr v-else-if="!sorted.length">
          <td :colspan="props.columns.length" class="ns-table__note">
            {{ props.emptyText }}
          </td>
        </tr>
        <template v-else>
          <tr
            v-for="row in sorted"
            :key="String(row[props.rowKey])"
            :class="['ns-table__row', { 'ns-table__row--stale': props.isStale?.(row) }]"
          >
            <td
              v-for="c in props.columns"
              :key="c.key"
              :class="['ns-table__td', `is-${c.align ?? 'start'}`]"
            >
              <slot :name="`cell-${c.key}`" :row="row" :value="row[c.key]">
                {{ row[c.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.ns-table__wrap {
  overflow-x: auto;
  background: var(--ns-surface, #FFFFFF);
  border: 1px solid var(--ns-border, #D5DBD9);
  border-radius: var(--ns-radius-lg, 14px);
  box-shadow: var(--ns-shadow-xs, 0 1px 2px rgba(15, 46, 39, 0.05));
}

.ns-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--ns-font);
  font-size: var(--ns-text-sm, 0.875rem);
  font-variant-numeric: tabular-nums;
}

.ns-table__caption {
  text-align: start;
  padding: var(--ns-space-4, 1rem) var(--ns-space-5, 1.5rem);
  font-weight: var(--ns-weight-bold, 700);
  font-size: var(--ns-text-md, 1rem);
  color: var(--ns-lake-900, #0F2E27);
  border-bottom: 1px solid var(--ns-border, #D5DBD9);
}

.ns-table__th,
.ns-table__td {
  padding: var(--ns-space-3, 0.75rem) var(--ns-space-4, 1rem);
  white-space: nowrap;
}

.ns-table__th {
  background: var(--ns-lake-50, #F0F7F4);
  color: var(--ns-lake-900, #0F2E27);
  font-weight: var(--ns-weight-semibold, 600);
  font-size: var(--ns-text-xs, 0.8125rem);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1.5px solid var(--ns-border, #D5DBD9);
}

.ns-table__td {
  border-bottom: 1px solid var(--ns-border, #D5DBD9);
  color: var(--ns-text, #17211F);
}

.ns-table__row:last-child .ns-table__td {
  border-bottom: 0;
}

.is-start { text-align: start; }
.is-center { text-align: center; }
.is-end { text-align: end; }

.ns-table__sort {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--ns-space-1, 0.25rem);
  padding: 4px 6px;
  margin: -4px -6px;
  border-radius: var(--ns-radius-xs, 4px);
  color: inherit;
  transition: background 150ms ease;
}

.ns-table__sort:hover {
  background: var(--ns-lake-100, #DCEDE7);
}

.ns-table__sort:focus-visible {
  outline: 2px solid var(--ns-focus, #0B5FFF);
  outline-offset: 1px;
}

.ns-table__sort-icon {
  font-size: 0.75rem;
  opacity: 0.75;
}

.ns-table__row:hover {
  background: var(--ns-ash-50, #F3F5F4);
}

.ns-table__row--stale {
  background: var(--ns-status-stale-bg, #FCE9B8);
  box-shadow: inset 4px 0 0 var(--ns-status-stale-fg, #6B4A00);
}

.ns-table__note {
  padding: var(--ns-space-6, 2rem) var(--ns-space-4, 1rem);
  text-align: center;
  white-space: normal;
  color: var(--ns-ash-600, #4F5B57);
}

.ns-table__note--warn {
  background: var(--ns-status-stale-bg, #FCE9B8);
  color: var(--ns-status-stale-fg, #6B4A00);
  font-weight: var(--ns-weight-medium, 500);
}

.ns-table__loading-spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: var(--ns-space-2, 0.5rem);
  border: 2px solid var(--ns-primary, #1F6F5C);
  border-right-color: transparent;
  border-radius: 50%;
  animation: ns-spin 700ms linear infinite;
}

@keyframes ns-spin {
  to { transform: rotate(360deg); }
}
</style>
