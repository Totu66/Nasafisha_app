<template>
  <div class="flex min-h-screen items-center justify-center bg-[var(--ns-ash-300,#B5BFBC)] px-4 py-10">
    <div class="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-sm">
      <button
        type="button"
        class="absolute right-4 top-4 rounded-lg border border-[var(--ns-ash-200,#D5DBD9)] px-2.5 py-1 text-xs font-semibold text-[var(--ns-ash-700,#3B4743)] transition hover:border-[var(--ns-ash-400,#889490)] hover:text-[var(--ns-ash-900,#17211F)]"
        :aria-label="t('common.changeLanguage')"
        @click="toggleLocale()"
      >
        {{ locale === 'en' ? 'Kiswahili' : 'English' }}
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOnboardingI18n } from '../composables/useOnboardingI18n';

const { locale, toggleLocale, t } = useOnboardingI18n();
</script>
