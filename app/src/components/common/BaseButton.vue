<script setup lang="ts">
import AppIcon from './AppIcon.vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
    icon?: string;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    block: false,
  }
);
</script>

<template>
  <button
    :type="props.type"
    :class="[
      'ns-btn',
      `ns-btn--${props.variant}`,
      `ns-btn--${props.size}`,
      { 'ns-btn--block': props.block },
    ]"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading || undefined"
  >
    <span v-if="props.loading" class="ns-btn__spin" aria-hidden="true" />
    <AppIcon v-else-if="props.icon" :name="props.icon" :size="props.size === 'sm' ? 16 : props.size === 'lg' ? 22 : 18" />
    <slot />
  </button>
</template>

<style scoped>
.ns-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ns-space-2, 0.5rem);
  min-height: var(--ns-touch, 2.75rem);
  padding: 0 var(--ns-space-4, 1rem);
  font-family: var(--ns-font);
  font-weight: var(--ns-weight-medium, 500);
  font-size: var(--ns-text-md, 1rem);
  line-height: 1;
  border: 2px solid transparent;
  border-radius: var(--ns-radius-md, 8px);
  cursor: pointer;
  text-decoration: none;
  transition: background var(--ns-dur-base, 180ms) var(--ns-ease-out, ease),
              border-color var(--ns-dur-base, 180ms) var(--ns-ease-out, ease),
              transform var(--ns-dur-fast, 100ms) var(--ns-ease-out, ease);
}

.ns-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.ns-btn--sm {
  min-height: 2.25rem;
  padding: 0 var(--ns-space-3, 0.75rem);
  font-size: var(--ns-text-sm, 0.875rem);
}

.ns-btn--lg {
  min-height: 3.5rem;
  padding: 0 var(--ns-space-6, 2rem);
  font-size: var(--ns-text-lg, 1.25rem);
}

.ns-btn--block {
  display: flex;
  width: 100%;
}

.ns-btn--primary {
  background: var(--ns-primary, #1F6F5C);
  color: var(--ns-white, #FFFFFF);
}

.ns-btn--primary:hover:not(:disabled) {
  background: var(--ns-lake-800, #185746);
}

.ns-btn--secondary {
  background: var(--ns-surface, #FFFFFF);
  color: var(--ns-lake-900, #0F2E27);
  border-color: var(--ns-border, #D5DBD9);
}

.ns-btn--secondary:hover:not(:disabled) {
  background: var(--ns-lake-50, #F0F7F4);
  border-color: var(--ns-primary, #1F6F5C);
  color: var(--ns-primary, #1F6F5C);
}

.ns-btn--ghost {
  background: transparent;
  color: var(--ns-lake-800, #185746);
}

.ns-btn--ghost:hover:not(:disabled) {
  background: var(--ns-lake-100, #DCEDE7);
}

.ns-btn--danger {
  background: var(--ns-danger-fg, #991B1B);
  color: var(--ns-white, #FFFFFF);
}

.ns-btn--danger:hover:not(:disabled) {
  background: #7F1D1D;
}

.ns-btn--success {
  background: var(--ns-success-fg, #166534);
  color: var(--ns-white, #FFFFFF);
}

.ns-btn--success:hover:not(:disabled) {
  background: #14532D;
}

.ns-btn--accent {
  background: var(--ns-sun-500, #F5D142);
  color: var(--ns-lake-950, #081B17);
}

.ns-btn--accent:hover:not(:disabled) {
  background: var(--ns-sun-600, #E4BE2E);
}

.ns-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.ns-btn__spin {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ns-spin 700ms linear infinite;
}

@keyframes ns-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .ns-btn__spin {
    animation-duration: 2s;
  }
}
</style>
