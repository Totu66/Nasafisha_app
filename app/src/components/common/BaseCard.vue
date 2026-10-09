<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    variant?: 'default' | 'flat' | 'highlight' | 'warning';
  }>(),
  {
    padding: 'md',
    hoverable: false,
    variant: 'default',
  }
);
</script>

<template>
  <div
    :class="[
      'ns-card',
      `ns-card--pad-${padding}`,
      `ns-card--${variant}`,
      { 'ns-card--hoverable': hoverable },
    ]"
  >
    <header v-if="title || subtitle || $slots.header || $slots.actions" class="ns-card__header">
      <slot name="header">
        <div class="ns-card__titles">
          <h3 v-if="title" class="ns-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="ns-card__subtitle">{{ subtitle }}</p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="ns-card__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="ns-card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="ns-card__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.ns-card {
  background: var(--ns-surface, #FFFFFF);
  border: 1px solid var(--ns-border, #D5DBD9);
  border-radius: var(--ns-radius-lg, 14px);
  box-shadow: var(--ns-shadow-xs, 0 1px 2px rgba(15, 46, 39, 0.05));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform var(--ns-dur-base, 180ms) var(--ns-ease-out, ease),
              box-shadow var(--ns-dur-base, 180ms) var(--ns-ease-out, ease),
              border-color var(--ns-dur-base, 180ms) var(--ns-ease-out, ease);
}

.ns-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--ns-shadow-md, 0 4px 6px -1px rgba(15, 46, 39, 0.08));
  border-color: var(--ns-lake-500, #389E86);
}

.ns-card--flat {
  border-color: transparent;
  background: var(--ns-ash-50, #F3F5F4);
  box-shadow: none;
}

.ns-card--highlight {
  border-left: 4px solid var(--ns-primary, #1F6F5C);
}

.ns-card--warning {
  border-left: 4px solid var(--ns-flamingo-600, #B8325A);
}

/* Padding variants */
.ns-card--pad-none .ns-card__body {
  padding: 0;
}
.ns-card--pad-sm .ns-card__header,
.ns-card--pad-sm .ns-card__body,
.ns-card--pad-sm .ns-card__footer {
  padding: var(--ns-space-3, 0.75rem);
}

.ns-card--pad-md .ns-card__header,
.ns-card--pad-md .ns-card__body,
.ns-card--pad-md .ns-card__footer {
  padding: var(--ns-space-4, 1rem) var(--ns-space-5, 1.5rem);
}

.ns-card--pad-lg .ns-card__header,
.ns-card--pad-lg .ns-card__body,
.ns-card--pad-lg .ns-card__footer {
  padding: var(--ns-space-5, 1.5rem) var(--ns-space-6, 2rem);
}

.ns-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ns-space-3, 0.75rem);
  border-bottom: 1px solid var(--ns-border, #D5DBD9);
}

.ns-card__titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ns-card__title {
  margin: 0;
  font-family: var(--ns-font);
  font-size: var(--ns-text-md, 1rem);
  font-weight: var(--ns-weight-bold, 700);
  color: var(--ns-lake-900, #0F2E27);
}

.ns-card__subtitle {
  margin: 0;
  font-size: var(--ns-text-xs, 0.8125rem);
  color: var(--ns-ash-600, #4F5B57);
}

.ns-card__actions {
  display: flex;
  align-items: center;
  gap: var(--ns-space-2, 0.5rem);
}

.ns-card__body {
  flex: 1;
}

.ns-card__footer {
  border-top: 1px solid var(--ns-border, #D5DBD9);
  background: var(--ns-ash-50, #F3F5F4);
}
</style>
