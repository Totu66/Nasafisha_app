<template>
  <div class="min-h-screen grid lg:grid-cols-[42fr_58fr]">
    <!-- Brand panel -->
    <aside class="hidden lg:flex flex-col justify-between bg-[var(--ns-lake-900,#0F2E27)] p-12 text-white">
      <div class="flex items-center gap-2.5">
        <span
          class="h-3 w-3 rounded-full bg-[var(--ns-sun-500,#F5D142)]"
          aria-hidden="true"
        />
        <span class="text-lg font-extrabold tracking-tight">NASAFISHA</span>
      </div>

      <div class="max-w-md space-y-5">
        <h1 class="text-4xl font-bold leading-[1.15]">
          A shared, evidenced record of county waste collection.
        </h1>
        <p class="text-sm leading-relaxed text-emerald-100/75">
          Sign in with your county account to view your zones, fleet and tickets.
        </p>
      </div>

      <p class="text-xs tracking-wide text-emerald-100/60">
        Nakuru County Government
      </p>
    </aside>

    <!-- Sign-in panel -->
    <div class="flex min-h-screen flex-col bg-white">
      <header class="flex items-center justify-between px-6 py-5 lg:px-12">
        <div class="flex items-center gap-2.5 lg:hidden">
          <span
            class="h-2.5 w-2.5 rounded-full bg-[var(--ns-sun-500,#F5D142)]"
            aria-hidden="true"
          />
          <span class="text-base font-extrabold tracking-tight text-[var(--ns-lake-900,#0F2E27)]">
            NASAFISHA
          </span>
        </div>

        <div class="ml-auto flex items-center gap-2 rounded-full border border-[var(--ns-ash-200,#D5DBD9)] p-1">
          <button
            v-for="option in ['en', 'sw'] as const"
            :key="option"
            type="button"
            class="rounded-full px-3 py-1 text-xs font-semibold transition"
            :class="locale === option
              ? 'bg-[var(--ns-lake-900,#0F2E27)] text-white'
              : 'text-[var(--ns-ash-600,#4F5B57)] hover:text-[var(--ns-lake-900,#0F2E27)]'"
            :aria-pressed="locale === option"
            @click="setLocale(option)"
          >
            {{ option === 'en' ? 'EN' : 'SW' }}
          </button>
        </div>
      </header>

      <main class="flex flex-1 items-center justify-center px-6 pb-12 lg:px-12">
        <div class="w-full max-w-sm">
          <h2 class="text-3xl font-bold tracking-tight text-[var(--ns-lake-900,#0F2E27)]">
            {{ t('auth.welcomeBack') }}
          </h2>
          <p class="mt-2 text-sm text-[var(--ns-ash-600,#4F5B57)]">
            Sign in with your county account
          </p>

          <form
            class="mt-8 space-y-5"
            @submit.prevent="handleLogin"
          >
            <BaseAlert
              v-if="errorMessage"
              variant="error"
              :dismissible="false"
            >
              {{ errorMessage }}
            </BaseAlert>

            <BaseInput
              v-model="email"
              label="Work email"
              type="email"
              inputmode="email"
              autocomplete="username"
              placeholder="m.mwangi@nakuru.go.ke"
              :required="true"
            />

            <BaseInput
              v-model="password"
              label="Password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              :required="true"
            />

            <BaseButton
              type="submit"
              variant="accent"
              size="lg"
              :block="true"
              :loading="authStore.isLoading"
            >
              {{ t('common.signIn') }}
            </BaseButton>
          </form>

          <p class="mt-6 text-xs text-[var(--ns-ash-600,#4F5B57)]">
            Locked out? Contact the County ICT Administrator
          </p>

          <div class="mt-4 flex items-center gap-4 text-xs text-[var(--ns-ash-600,#4F5B57)]">
            <router-link
              class="underline underline-offset-2 hover:text-[var(--ns-lake-900,#0F2E27)]"
              to="/citizen/login"
            >
              Citizen sign-in
            </router-link>
            <router-link
              class="underline underline-offset-2 hover:text-[var(--ns-lake-900,#0F2E27)]"
              to="/field/login"
            >
              Field crew sign-in
            </router-link>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BaseAlert, BaseButton, BaseInput } from '../../components/common';
import { useAuthStore } from '../../store/auth.store';
import { useI18n } from '../../i18n';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { t, locale, setLocale } = useI18n();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleLogin(): Promise<void> {
  errorMessage.value = '';
  if (!email.value || !password.value) {
    errorMessage.value = 'Enter your work email and password';
    return;
  }

  try {
    await authStore.login({ email: email.value, password: password.value, role: 'contractor' });
    const redirect = (route.query.redirect as string) || '/contractor/scorecard';
    router.push(redirect);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Sign-in failed';
  }
}
</script>
