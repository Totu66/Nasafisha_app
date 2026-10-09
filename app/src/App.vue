<template>
  <div class="min-h-screen bg-slate-100 text-slate-800">
    <!-- Role layouts render here (AuthLayout / CitizenLayout / FieldLayout / AdminLayout) -->
    <router-view />

    <!-- Toast queue rendered from the shared ui store (providers/toast) -->
    <div
      class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4 sm:w-96"
      aria-live="polite"
      aria-atomic="false"
    >
      <div
        v-for="item in ui.toasts"
        :key="item.id"
        class="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
        role="status"
      >
        <span class="mt-0.5 shrink-0" :class="tone(item.variant)">
          <AppIcon :name="iconFor(item.variant)" :size="18" />
        </span>

        <div class="min-w-0 flex-1">
          <p v-if="item.title" class="text-sm font-semibold text-slate-900">{{ item.title }}</p>
          <p class="text-sm text-slate-600">{{ item.message }}</p>
        </div>

        <button
          type="button"
          class="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Dismiss notification"
          @click="ui.dismissToast(item.id)"
        >
          <AppIcon name="close" :size="15" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppIcon } from './components/common';
import { useUiStore, type ToastVariant } from './store/ui.store';

const ui = useUiStore();

function tone(variant: ToastVariant): string {
  switch (variant) {
    case 'success':
      return 'text-emerald-600';
    case 'error':
      return 'text-red-600';
    case 'warning':
      return 'text-amber-600';
    case 'info':
    default:
      return 'text-slate-500';
  }
}

function iconFor(variant: ToastVariant): string {
  switch (variant) {
    case 'success':
      return 'check';
    case 'error':
      return 'error';
    case 'warning':
      return 'alert';
    case 'info':
    default:
      return 'info';
  }
}
</script>
