<script setup lang="ts">
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';

const props = withDefaults(
  defineProps<{
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    dismissible?: boolean;
    icon?: string;
  }>(),
  {
    variant: 'info',
    dismissible: false,
  }
);

const emit = defineEmits<{
  (e: 'dismiss'): void;
}>();

const defaultIcon = computed(() => {
  if (props.icon) return props.icon;
  switch (props.variant) {
    case 'success': return 'check';
    case 'warning': return 'alert';
    case 'error': return 'error';
    case 'info':
    default: return 'info';
  }
});
</script>

<template>
  <div :class="['ns-alert', `ns-alert--${props.variant}`]" role="alert">
    <div class="ns-alert__icon">
      <AppIcon :name="defaultIcon" :size="20" />
    </div>

    <div class="ns-alert__content">
      <h4 v-if="props.title" class="ns-alert__title">{{ props.title }}</h4>
      <div class="ns-alert__message">
        <slot />
      </div>
    </div>

    <button
      v-if="props.dismissible"
      class="ns-alert__close"
      type="button"
      aria-label="Dismiss alert"
      @click="emit('dismiss')"
    >
      <AppIcon name="close" :size="16" />
    </button>
  </div>
</template>

<style scoped>
.ns-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--ns-space-3, 0.75rem);
  padding: var(--ns-space-3, 0.75rem) var(--ns-space-4, 1rem);
  border-radius: var(--ns-radius-md, 8px);
  border: 1px solid transparent;
  font-family: var(--ns-font);
  font-size: var(--ns-text-sm, 0.875rem);
  line-height: var(--ns-leading-normal, 1.4);
}

.ns-alert__icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.ns-alert__content {
  flex: 1;
  min-width: 0;
}

.ns-alert__title {
  margin: 0 0 2px;
  font-weight: var(--ns-weight-bold, 700);
  font-size: var(--ns-text-sm, 0.875rem);
}

.ns-alert__message {
  margin: 0;
}

.ns-alert__close {
  all: unset;
  cursor: pointer;
  padding: 4px;
  border-radius: var(--ns-radius-xs, 4px);
  color: currentColor;
  opacity: 0.7;
  transition: opacity var(--ns-dur-fast, 100ms) ease;
}

.ns-alert__close:hover {
  opacity: 1;
}

.ns-alert--info {
  background: var(--ns-status-received-bg, #E3EEFB);
  color: var(--ns-status-received-fg, #1E4E8C);
  border-color: var(--ns-status-received-border, #BCD5F5);
}

.ns-alert--success {
  background: var(--ns-success-bg, #DCFCE7);
  color: var(--ns-success-fg, #166534);
  border-color: var(--ns-success-border, #86EFAC);
}

.ns-alert--warning {
  background: var(--ns-status-progress-bg, #FFF1CC);
  color: var(--ns-status-progress-fg, #7A4B00);
  border-color: var(--ns-status-progress-border, #F7D788);
}

.ns-alert--error {
  background: var(--ns-danger-bg, #FEE2E2);
  color: var(--ns-danger-fg, #991B1B);
  border-color: var(--ns-danger-border, #F87171);
}
</style>
