<template>
  <CitizenOnboardLayout>
    <div class="flex flex-col items-center text-center">
      <span
        class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ns-status-resolved-bg,#DCF2E6)] text-[var(--ns-status-resolved-fg,#14563F)]"
        aria-hidden="true"
      >
        <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>

      <h1 class="mt-4 text-xl font-bold tracking-tight text-[var(--ns-ash-900,#17211F)]">
        {{ t('done.title') }}
      </h1>
      <p class="mt-2 text-sm text-[var(--ns-ash-600,#4F5B57)]">{{ t('done.body') }}</p>

      <button
        type="button"
        class="mt-7 rounded-lg bg-[var(--ns-leaf-700,#15803D)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--ns-leaf-600,#16A34A)]"
        @click="start"
      >
        {{ t('done.cta') }}
      </button>
    </div>
  </CitizenOnboardLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import CitizenOnboardLayout from '../../../layouts/CitizenOnboardLayout.vue';
import { useOnboardingI18n } from '../../../composables/useOnboardingI18n';

const router = useRouter();
const { t } = useOnboardingI18n();

function start() {
  router.push('/citizen');
}
</script>
