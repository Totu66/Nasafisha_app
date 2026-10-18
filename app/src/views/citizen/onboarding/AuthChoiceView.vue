<template>
  <CitizenOnboardLayout>
    <div class="flex flex-col items-center text-center">
      <BrandLogo size="md" />

      <h1 class="mt-4 text-2xl font-bold tracking-tight text-[var(--ns-ash-900,#17211F)]">
        {{ t('choice.title') }}
      </h1>
      <p class="mt-2 text-sm text-[var(--ns-ash-600,#4F5B57)]">{{ t('choice.subtitle') }}</p>
    </div>

    <div class="mt-8 flex flex-col gap-3">
      <button
        type="button"
        class="w-full rounded-lg bg-[var(--ns-leaf-700,#15803D)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--ns-leaf-600,#16A34A)]"
        @click="router.push('/citizen/login')"
      >
        {{ t('choice.signIn') }}
      </button>

      <button
        type="button"
        class="w-full rounded-lg border border-[var(--ns-ash-400,#889490)] bg-white px-6 py-3 text-sm font-semibold text-[var(--ns-ash-900,#17211F)] transition hover:border-[var(--ns-ash-900,#17211F)]"
        @click="router.push('/citizen/register')"
      >
        {{ t('choice.register') }}
      </button>
    </div>

    <div class="mt-8 border-t border-[var(--ns-ash-100,#E6EBE9)] pt-5 text-center">
      <p class="text-xs text-[var(--ns-ash-600,#4F5B57)]">{{ t('choice.rolesIntro') }}</p>
      <div class="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
        <router-link
          class="font-semibold text-[var(--ns-lake-800,#185746)] underline underline-offset-2"
          to="/login"
        >
          {{ t('choice.staff') }}
        </router-link>
        <router-link
          class="font-semibold text-[var(--ns-lake-800,#185746)] underline underline-offset-2"
          to="/field/login"
        >
          {{ t('choice.field') }}
        </router-link>
        <router-link
          class="font-semibold text-[var(--ns-lake-800,#185746)] underline underline-offset-2"
          to="/contractor/login"
        >
          {{ t('choice.contractor') }}
        </router-link>
      </div>
    </div>

    <div class="mt-5 flex justify-center">
      <router-link
        to="/citizen/welcome"
        class="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ns-ash-600,#4F5B57)] transition hover:text-[var(--ns-ash-900,#17211F)]"
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t('choice.back') }}
      </router-link>
    </div>
  </CitizenOnboardLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import CitizenOnboardLayout from '../../../layouts/CitizenOnboardLayout.vue';
import { BrandLogo } from '../../../components/common';
import { useOnboardingI18n } from '../../../composables/useOnboardingI18n';

const router = useRouter();
const { t } = useOnboardingI18n();
</script>
