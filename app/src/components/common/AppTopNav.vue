<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

defineProps<{ userName: string; roleLabel: string }>()
const emit = defineEmits<{ (e: 'logout'): void }>()
const { t } = useI18n()
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4">
    <span class="text-lg font-bold text-green-900">NASAFISHA</span>

    <div class="flex items-center gap-4">
      <LanguageSwitcher />
      <div class="text-right text-sm leading-tight">
        <p class="font-medium text-stone-900">{{ userName }}</p>
        <p class="text-stone-500">{{ roleLabel }}</p>
      </div>
      <button
        type="button"
        class="rounded border border-green-800 px-3 py-1 text-sm text-green-800 hover:bg-green-50"
        @click="emit('logout')"
      >
        {{ t('common.signOut') }}
      </button>
    </div>
  </header>
</template>