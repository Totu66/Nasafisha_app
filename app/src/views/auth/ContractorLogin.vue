<template>
  <div class="min-h-screen grid lg:grid-cols-[42fr_58fr]">
    <!-- Brand panel -->
    <aside class="hidden lg:flex flex-col justify-between bg-[var(--ns-lake-900,#0F2E27)] p-12 text-white">
      <BrandLogo
        size="md"
        :with-text="false"
        :on-dark="true"
      />

      <div class="max-w-md space-y-5">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ns-sun-500,#F5D142)]">
          Nakuru County
        </p>
        <h1 class="text-4xl font-bold leading-[1.15]">
          Contractor portal.
        </h1>
        <p class="text-sm leading-relaxed text-emerald-100/75">
          A signed, evidenced record of your SLA performance.
        </p>
      </div>

      <!-- Wavy-line illustration (Figma) -->
      <svg
        class="w-full max-w-xs text-white/25"
        viewBox="0 0 240 72"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 12 Q 20 0 40 12 T 80 12 T 120 12 T 160 12 T 200 12 T 240 12"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <path
          d="M0 36 Q 20 24 40 36 T 80 36 T 120 36 T 160 36 T 200 36 T 240 36"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <path
          d="M0 60 Q 20 48 40 60 T 80 60 T 120 60 T 160 60 T 200 60 T 240 60"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <circle
          cx="196"
          cy="36"
          r="5"
          fill="var(--ns-sun-500,#F5D142)"
        />
      </svg>

      <div class="space-y-1">
        <p class="text-xs font-semibold tracking-wide text-emerald-100/85">
          Nakuru County Solid Waste Management
        </p>
        <p class="text-xs tracking-wide text-emerald-100/60">
          One waste. Shared visibility.
        </p>
      </div>
    </aside>

    <!-- Sign-in panel -->
    <div class="flex min-h-screen flex-col bg-white">
      <header class="flex items-center justify-between px-6 py-5 lg:px-12">
        <div class="lg:hidden">
          <BrandLogo
            size="sm"
            :with-text="false"
          />
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
          <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ns-lake-100,#DCEDE7)] text-[var(--ns-lake-700,#1F6F5C)]">
            <AppIcon
              name="user"
              :size="22"
            />
          </div>

          <h2 class="text-3xl font-bold tracking-tight text-[var(--ns-lake-900,#0F2E27)]">
            Sign in to your account.
          </h2>
          <p class="mt-2 text-sm text-[var(--ns-ash-600,#4F5B57)]">
            View your zone's performance and the evidence behind every collection.
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
              variant="primary"
              size="lg"
              :block="true"
              :loading="authStore.isLoading"
            >
              <span class="inline-flex items-center justify-center gap-2">
                {{ t('common.signIn') }}
                <AppIcon
                  name="arrow-right"
                  :size="18"
                />
              </span>
            </BaseButton>
          </form>

          <p class="mt-6 flex items-start gap-2 rounded-xl bg-[var(--ns-cream,#F9F6EB)] px-4 py-3 text-xs leading-relaxed text-[var(--ns-ash-700,#3B4743)]">
            <AppIcon
              name="lock"
              :size="14"
              class="mt-0.5 shrink-0 text-[var(--ns-lake-900,#0F2E27)]"
            />
            Read-only access to your zone. See the performance record you already have.
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
import { AppIcon, BaseAlert, BaseButton, BaseInput, BrandLogo } from '../../components/common';
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
