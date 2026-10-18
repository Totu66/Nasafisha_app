<template>
  <CitizenOnboardLayout>
    <router-link
      to="/citizen/login"
      class="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ns-ash-600,#4F5B57)] transition hover:text-[var(--ns-ash-900,#17211F)]"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {{ t('otp.back') }}
    </router-link>

    <h1 class="mt-3 text-2xl font-bold tracking-tight text-[var(--ns-ash-900,#17211F)]">
      {{ t('otp.title') }}
    </h1>
    <p class="mt-2 text-sm text-[var(--ns-ash-600,#4F5B57)]">
      {{ t('otp.subtitle', { phone: maskedPhone }) }}
      <router-link to="/citizen/login" class="font-medium text-[var(--ns-leaf-700,#15803D)] underline underline-offset-2">
        {{ t('otp.wrongNumber') }}
      </router-link>
    </p>

    <div class="mt-6 flex gap-2" @paste="onPaste">
      <input
        v-for="(_, i) in digits"
        :key="i"
        :ref="(el) => setBoxRef(el, i)"
        v-model="digits[i]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :aria-label="`Digit ${i + 1}`"
        class="h-14 w-12 rounded-xl border text-center text-lg font-semibold text-[var(--ns-ash-900,#17211F)] outline-none transition"
        :class="error
          ? 'border-[var(--ns-danger-border,#F87171)] bg-[var(--ns-danger-bg,#FEE2E2)]'
          : 'border-[var(--ns-ash-200,#D5DBD9)] focus:border-[var(--ns-leaf-600,#16A34A)]'"
        @input="onInput(i)"
      />
    </div>

    <p
      v-if="error"
      role="alert"
      class="mt-4 rounded-xl bg-[var(--ns-danger-bg,#FEE2E2)] px-4 py-4 text-sm font-medium text-[var(--ns-danger-fg,#991B1B)]"
    >
      {{ error }}
    </p>

    <p class="mt-4 text-xs text-[var(--ns-ash-600,#4F5B57)]">
      {{ t('otp.resend') }} <span class="font-mono font-semibold">{{ timerLabel }}</span>
    </p>

    <button
      type="button"
      class="mt-4 rounded-lg bg-[var(--ns-leaf-700,#15803D)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--ns-leaf-600,#16A34A)] disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="code.length < 6 || confirming"
      @click="confirm"
    >
      {{ confirming ? t('otp.confirming') : t('otp.confirm') }}
    </button>
  </CitizenOnboardLayout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CitizenOnboardLayout from '../../../layouts/CitizenOnboardLayout.vue';
import { useOnboardingI18n } from '../../../composables/useOnboardingI18n';
import { useAuthStore } from '../../../store/auth.store';

const router = useRouter();
const { t } = useOnboardingI18n();
const authStore = useAuthStore();
const digits = ref<string[]>(['', '', '', '', '', '']);
const error = ref('');
const confirming = ref(false);
const triesLeft = ref(3);
const secondsLeft = ref(24);
const boxes = ref<HTMLInputElement[]>([]);

const phone = sessionStorage.getItem('ns_phone') || '+254 712 345 678';
const maskedPhone = phone;

const code = computed(() => digits.value.join(''));

const timerLabel = computed(() => {
  const m = Math.floor(secondsLeft.value / 60);
  const s = String(secondsLeft.value % 60).padStart(2, '0');
  return `${m}:${s}`;
});

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  boxes.value[0]?.focus();
  timer = setInterval(() => {
    if (secondsLeft.value > 0) secondsLeft.value -= 1;
  }, 1000);
});

onBeforeUnmount(() => clearInterval(timer));

function setBoxRef(el: unknown, i: number) {
  if (el) boxes.value[i] = el as HTMLInputElement;
}

function onInput(i: number) {
  error.value = '';
  digits.value[i] = digits.value[i].replace(/\D/g, '').slice(0, 1);
  if (digits.value[i] && i < 5) boxes.value[i + 1]?.focus();
}

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text')?.replace(/\D/g, '') ?? '';
  if (!text) return;
  e.preventDefault();
  for (let i = 0; i < 6; i++) digits.value[i] = text[i] ?? '';
}

async function confirm() {
  // Mock: accept any 6-digit code; "000000" exercises the error state.
  if (code.value === '000000') {
    triesLeft.value = Math.max(0, triesLeft.value - 1);
    error.value = t('otp.error', { tries: triesLeft.value });
    return;
  }
  confirming.value = true;
  try {
    // Mock SMS sign-in/register: establish a citizen session so the portal guards let
    // the flow continue past permissions into /citizen. Registered accounts take the
    // name entered on /citizen/register.
    const isRegister = sessionStorage.getItem('ns_auth_mode') === 'register';
    const displayName = isRegister ? sessionStorage.getItem('ns_name') || 'Citizen' : 'Citizen';
    authStore.setSession({
      token: `mock-otp-${code.value}`,
      user: {
        id: 'citizen-mock',
        name: displayName,
        phone,
        role: 'citizen',
      },
    });
    sessionStorage.removeItem('ns_auth_mode');
    await router.push('/citizen/onboarding/permissions');
  } finally {
    confirming.value = false;
  }
}
</script>
