<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    dismissible?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  }>(),
  {
    dismissible: true,
    maxWidth: 'md',
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const dialog = ref<HTMLElement | null>(null);
let opener: HTMLElement | null = null;
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function close() {
  if (props.dismissible) emit('close');
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation();
    close();
    return;
  }
  if (e.key !== 'Tab' || !dialog.value) return;
  const items = Array.from(dialog.value.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (!items.length) {
    e.preventDefault();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      opener = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      await nextTick();
      (dialog.value?.querySelector<HTMLElement>(FOCUSABLE) ?? dialog.value)?.focus();
    } else {
      document.body.style.overflow = '';
      opener?.focus();
    }
  }
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="ns-modal">
      <div v-if="props.open" class="ns-modal__scrim" @click.self="close" @keydown="onKeydown">
        <div
          ref="dialog"
          :class="['ns-modal', `ns-modal--${props.maxWidth}`]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ns-modal-title"
          tabindex="-1"
        >
          <header class="ns-modal__header">
            <h2 id="ns-modal-title" class="ns-modal__title">{{ props.title }}</h2>
            <button
              v-if="props.dismissible"
              type="button"
              class="ns-modal__close-btn"
              aria-label="Close modal"
              @click="close"
            >
              <AppIcon name="close" :size="20" />
            </button>
          </header>

          <div class="ns-modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="ns-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ns-modal__scrim {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(15, 46, 39, 0.65);
  backdrop-filter: blur(2px);
  padding: 0;
}

.ns-modal {
  width: 100%;
  max-height: 90dvh;
  overflow-y: auto;
  background: var(--ns-surface, #FFFFFF);
  border-radius: var(--ns-radius-xl, 20px) var(--ns-radius-xl, 20px) 0 0;
  padding: var(--ns-space-5, 1.5rem);
  box-shadow: var(--ns-shadow-overlay);
  display: flex;
  flex-direction: column;
}

.ns-modal:focus {
  outline: none;
}

.ns-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ns-space-3, 0.75rem);
  margin-bottom: var(--ns-space-4, 1rem);
  padding-bottom: var(--ns-space-3, 0.75rem);
  border-bottom: 1px solid var(--ns-border, #D5DBD9);
}

.ns-modal__title {
  margin: 0;
  font-family: var(--ns-font);
  font-size: var(--ns-text-lg, 1.25rem);
  font-weight: var(--ns-weight-bold, 700);
  line-height: var(--ns-leading-tight, 1.25);
  color: var(--ns-lake-900, #0F2E27);
}

.ns-modal__close-btn {
  all: unset;
  cursor: pointer;
  padding: 6px;
  border-radius: var(--ns-radius-sm, 6px);
  color: var(--ns-ash-600, #4F5B57);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms ease, color 150ms ease;
}

.ns-modal__close-btn:hover {
  background: var(--ns-ash-100, #E6EBE9);
  color: var(--ns-lake-900, #0F2E27);
}

.ns-modal__body {
  color: var(--ns-text, #17211F);
  flex: 1;
}

.ns-modal__footer {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ns-space-3, 0.75rem);
  justify-content: flex-end;
  margin-top: var(--ns-space-5, 1.5rem);
  padding-top: var(--ns-space-4, 1rem);
  border-top: 1px solid var(--ns-border, #D5DBD9);
}

/* Modal sizes on tablet+ screens */
@media (min-width: 48em) {
  .ns-modal__scrim {
    align-items: center;
    padding: var(--ns-space-4, 1rem);
  }

  .ns-modal {
    border-radius: var(--ns-radius-lg, 14px);
    max-height: 85vh;
  }

  .ns-modal--sm { width: min(24rem, 95vw); }
  .ns-modal--md { width: min(34rem, 95vw); }
  .ns-modal--lg { width: min(44rem, 95vw); }
  .ns-modal--xl { width: min(54rem, 95vw); }
  .ns-modal--2xl { width: min(64rem, 95vw); }
}

.ns-modal-enter-active,
.ns-modal-leave-active {
  transition: opacity var(--ns-dur-base, 180ms) var(--ns-ease-out, ease);
}

.ns-modal-enter-active .ns-modal,
.ns-modal-leave-active .ns-modal {
  transition: transform var(--ns-dur-slow, 280ms) var(--ns-ease-out, ease);
}

.ns-modal-enter-from,
.ns-modal-leave-to {
  opacity: 0;
}

.ns-modal-enter-from .ns-modal,
.ns-modal-leave-to .ns-modal {
  transform: translateY(2rem);
}
</style>
