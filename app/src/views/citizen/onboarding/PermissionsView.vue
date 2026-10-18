<template>
  <CitizenOnboardLayout>
    <h1 class="text-xl font-bold tracking-tight text-[var(--ns-ash-900,#17211F)]">
      {{ t('perm.title') }}
    </h1>

    <div class="mt-6 space-y-5">
      <div class="flex gap-3">
        <span class="mt-0.5 text-[var(--ns-ash-900,#17211F)]" aria-hidden="true">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8a2 2 0 012-2h2l1.5-2h7L17 6h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="text-sm font-bold text-[var(--ns-ash-900,#17211F)]">{{ t('perm.camera') }}</p>
            <span v-if="camera !== 'idle'" :class="statusChipClass(camera)">{{ statusLabel(camera) }}</span>
          </div>
          <p class="text-sm text-[var(--ns-ash-600,#4F5B57)]">{{ t('perm.cameraDesc') }}</p>
          <p v-if="camera === 'denied'" class="mt-1 text-xs text-[var(--ns-danger-fg,#991B1B)]">
            {{ t('perm.deniedHint') }}
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <span class="mt-0.5 text-[var(--ns-ash-900,#17211F)]" aria-hidden="true">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="text-sm font-bold text-[var(--ns-ash-900,#17211F)]">{{ t('perm.location') }}</p>
            <span v-if="location !== 'idle'" :class="statusChipClass(location)">{{ statusLabel(location) }}</span>
          </div>
          <p class="text-sm text-[var(--ns-ash-600,#4F5B57)]">{{ t('perm.locationDesc') }}</p>
          <p v-if="location === 'denied'" class="mt-1 text-xs text-[var(--ns-danger-fg,#991B1B)]">
            {{ t('perm.deniedHint') }}
          </p>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="mt-7 rounded-lg bg-[var(--ns-leaf-700,#15803D)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--ns-leaf-600,#16A34A)] disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="requesting"
      @click="allow"
    >
      {{ requesting ? t('perm.requesting') : t('perm.allow') }}
    </button>

    <p class="mt-5">
      <router-link
        to="/citizen/consent"
        class="text-sm font-semibold text-[var(--ns-leaf-700,#15803D)] underline underline-offset-2"
      >
        {{ t('perm.dataPolicy') }}
      </router-link>
    </p>
  </CitizenOnboardLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import CitizenOnboardLayout from '../../../layouts/CitizenOnboardLayout.vue';
import { useOnboardingI18n } from '../../../composables/useOnboardingI18n';

type PermState = 'idle' | 'requesting' | 'granted' | 'denied';

const router = useRouter();
const { t } = useOnboardingI18n();
const camera = ref<PermState>('idle');
const location = ref<PermState>('idle');

const requesting = computed(
  () => camera.value === 'requesting' || location.value === 'requesting'
);

function statusLabel(state: PermState): string {
  if (state === 'requesting') return t('perm.requesting');
  if (state === 'granted') return t('perm.granted');
  return t('perm.denied');
}

function statusChipClass(state: PermState): string {
  const base = 'shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold';
  if (state === 'granted') {
    return `${base} bg-[var(--ns-status-resolved-bg,#DCF2E6)] text-[var(--ns-status-resolved-fg,#14563F)]`;
  }
  if (state === 'denied') {
    return `${base} bg-[var(--ns-danger-bg,#FEE2E2)] text-[var(--ns-danger-fg,#991B1B)]`;
  }
  return `${base} bg-[var(--ns-status-progress-bg,#FFF1CC)] text-[var(--ns-status-progress-fg,#7A4B00)]`;
}

async function askCamera(): Promise<void> {
  camera.value = 'requesting';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
    camera.value = 'granted';
  } catch {
    camera.value = 'denied';
  }
}

function askLocation(): Promise<void> {
  location.value = 'requesting';
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      location.value = 'denied';
      resolve();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        location.value = 'granted';
        resolve();
      },
      () => {
        location.value = 'denied';
        resolve();
      },
      { timeout: 5000 }
    );
  });
}

async function allow() {
  if (requesting.value) return;
  // Denials are not fatal: the report screen can retry before capturing.
  await Promise.all([askCamera(), askLocation()]);
  router.push('/citizen/onboarding/all-set');
}
</script>
