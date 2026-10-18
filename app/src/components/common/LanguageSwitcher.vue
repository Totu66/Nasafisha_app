<script setup lang="ts">
import { useI18n } from '../../i18n'
import type { LocaleCode } from '../../config/constants'

const { locale, setLocale } = useI18n()
const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'sw', label: 'SW' },
]

function select(code: string) {
  setLocale(code as LocaleCode)
}
</script>

<template>
  <div class="flex items-center gap-1 text-sm" role="group" aria-label="Language">
    <template v-for="(lang, i) in LANGUAGES" :key="lang.code">
      <span v-if="i > 0" aria-hidden="true" class="text-stone-400">|</span>
      <button
        type="button"
        class="rounded px-1 font-medium"
        :class="locale === lang.code ? 'text-green-800 underline' : 'text-stone-600'"
        :aria-pressed="locale === lang.code"
        @click="select(lang.code)"
      >
        {{ lang.label }}
      </button>
    </template>
  </div>
</template>