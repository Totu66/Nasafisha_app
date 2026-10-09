<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'received' | 'in-progress' | 'resolved' | 'stale' | 'danger' | 'success' | 'neutral' | 'met' | 'breached';
    size?: 'sm' | 'md';
    dot?: boolean;
    label?: string;
  }>(),
  {
    variant: 'neutral',
    size: 'md',
    dot: false,
  }
);
</script>

<template>
  <span :class="['ns-badge', `ns-badge--${props.variant}`, `ns-badge--${props.size}`]">
    <span v-if="props.dot" class="ns-badge__dot" aria-hidden="true" />
    <slot>{{ props.label }}</slot>
  </span>
</template>

<style scoped>
.ns-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--ns-space-1, 0.25rem);
  padding: 0.15rem 0.55rem;
  font-family: var(--ns-font-mono, monospace);
  font-size: var(--ns-text-xs, 0.8125rem);
  font-weight: var(--ns-weight-medium, 500);
  line-height: 1.25;
  border-radius: var(--ns-radius-full, 9999px);
  border: 1px solid transparent;
  white-space: nowrap;
}

.ns-badge--sm {
  padding: 0.05rem 0.4rem;
  font-size: 0.725rem;
}

.ns-badge__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background-color: currentColor;
  flex-shrink: 0;
}

/* SRS FR-012/FR-013/FR-020 status color mapping */
.ns-badge--received {
  color: var(--ns-status-received-fg, #1E4E8C);
  background: var(--ns-status-received-bg, #E3EEFB);
  border-color: var(--ns-status-received-border, #BCD5F5);
}

.ns-badge--in-progress {
  color: var(--ns-status-progress-fg, #7A4B00);
  background: var(--ns-status-progress-bg, #FFF1CC);
  border-color: var(--ns-status-progress-border, #F7D788);
}

.ns-badge--resolved,
.ns-badge--met {
  color: var(--ns-status-resolved-fg, #14563F);
  background: var(--ns-status-resolved-bg, #DCF2E6);
  border-color: var(--ns-status-resolved-border, #A3DEC0);
}

.ns-badge--stale {
  color: var(--ns-status-stale-fg, #6B4A00);
  background: var(--ns-status-stale-bg, #FCE9B8);
  border-color: var(--ns-status-stale-border, #EDCF72);
}

.ns-badge--danger,
.ns-badge--breached {
  color: var(--ns-danger-fg, #991B1B);
  background: var(--ns-danger-bg, #FEE2E2);
  border-color: var(--ns-danger-border, #F87171);
}

.ns-badge--success {
  color: var(--ns-success-fg, #166534);
  background: var(--ns-success-bg, #DCFCE7);
  border-color: var(--ns-success-border, #86EFAC);
}

.ns-badge--neutral {
  color: var(--ns-ash-700, #3B4743);
  background: var(--ns-ash-100, #E6EBE9);
  border-color: var(--ns-ash-200, #D5DBD9);
}
</style>
