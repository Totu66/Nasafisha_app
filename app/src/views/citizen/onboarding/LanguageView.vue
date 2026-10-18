<template>
  <CitizenOnboardLayout>
    <div class="flex flex-col items-center">
      <BrandLogo size="md" />

      <p class="mt-3 text-center text-sm text-[var(--ns-ash-600,#4F5B57)]">
        {{ t('lang.tagline') }}
      </p>
    </div>

    <div class="mt-8">
      <p class="text-sm font-medium text-[var(--ns-ash-900,#17211F)]">{{ t('lang.label') }}</p>
      <div class="mt-3 flex gap-3">
        <button
          v-for="option in options"
          :key="option.id"
          type="button"
          class="rounded-lg border px-5 py-2 text-sm font-semibold transition"
          :class="selected === option.id
            ? 'border-[var(--ns-ash-900,#17211F)] bg-[var(--ns-ash-900,#17211F)] text-white'
            : 'border-[var(--ns-ash-200,#D5DBD9)] bg-white text-[var(--ns-ash-900,#17211F)] hover:border-[var(--ns-ash-400,#889490)]'"
          :aria-pressed="selected === option.id"
          @click="select(option.id)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="mt-8 flex justify-center">
      <button
        type="button"
        class="rounded-lg bg-[var(--ns-leaf-700,#15803D)] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--ns-leaf-600,#16A34A)]"
        @click="continueFlow"
      >
        {{ t('common.continue') }}
      </button>
    </div>
  </CitizenOnboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CitizenOnboardLayout from '../../../layouts/CitizenOnboardLayout.vue';
import { BrandLogo } from '../../../components/common';
import { useOnboardingI18n } from '../../../composables/useOnboardingI18n';

const router = useRouter();
const { t, setLocale } = useOnboardingI18n();
const selected = ref<'en' | 'sw'>('en');

const options = [
  { id: 'en' as const, label: 'English' },
  { id: 'sw' as const, label: 'Kiswahili' },
];

function select(id: 'en' | 'sw') {
  selected.value = id;
  setLocale(id);
}

function continueFlow() {
  setLocale(selected.value);
  router.push('/citizen/auth-choice');
}
</script>
