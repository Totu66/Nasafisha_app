<template>
  <section class="-mx-4 -my-6 min-h-[calc(100vh-4rem)] bg-[var(--ns-forest,#20372F)] px-4 py-6 sm:-mx-6 sm:px-6">
    <div class="mx-auto max-w-xl">
      <router-link
        to="/citizen/reports"
        class="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ns-lake-100,#DCEDE7)] transition hover:text-white"
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-mono">{{ reference || 'NSF-260915-0042' }}</span>
      </router-link>

      <div class="mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <!-- Summary -->
        <div class="flex gap-4">
          <div class="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--ns-cream,#F9F6EB)]">
            <img v-if="photo" :src="photo" alt="Report photo" class="h-full w-full object-cover" />
            <span v-else class="flex h-full w-full items-center justify-center text-[10px] text-[var(--ns-ash-600,#4F5B57)]">your photo</span>
          </div>
          <div class="min-w-0">
            <h1 class="text-base font-bold text-[var(--ns-ash-900,#17211F)]">{{ title }}</h1>
            <p class="mt-1 text-sm text-[var(--ns-ash-700,#3B4743)]">{{ place }}</p>
            <p class="mt-0.5 text-xs text-[var(--ns-ash-600,#4F5B57)]">{{ submittedAt }}</p>
          </div>
        </div>

        <!-- Progress -->
        <h2 class="mt-6 text-sm font-bold text-[var(--ns-ash-900,#17211F)]">Progress</h2>
        <div class="mt-3">
          <ReportStatusTimeline :steps="steps" :locale="locale" />
        </div>

        <!-- Neighbour note -->
        <p class="mt-6 rounded-xl bg-[var(--ns-ash-100,#E6EBE9)] px-4 py-3 text-xs text-[var(--ns-ash-700,#3B4743)]">
          3 other neighbours reported the same spot. They'll all be told when it's done.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import ReportStatusTimeline from '../../components/reports/ReportStatusTimeline.vue';
import { useCitizenConfirmI18n } from '../../composables/useCitizenConfirmI18n';
import { buildTimeline } from '../../helpers/reportStatus';

const route = useRoute();
const { locale } = useCitizenConfirmI18n();

const reference = computed(() => (typeof route.params.reference === 'string' ? route.params.reference : ''));
const photo = ref('');
const title = ref('Missed collection');
const place = ref('Blessed 5B');
const submittedAt = ref('15/09/2026, 08:14');

// Fallback timeline matching the Figma frame; replaced by real history when the API is wired.
const steps = ref(
  buildTimeline('IN_PROGRESS', [
    { state: 'SUBMITTED', at: '2026-09-15T08:14:00+03:00' },
    { state: 'VERIFIED', at: '2026-09-15T08:40:00+03:00' },
    { state: 'ASSIGNED', at: '2026-09-15T09:05:00+03:00' },
    { state: 'IN_PROGRESS', at: '2026-09-15T09:20:00+03:00' },
  ])
);
</script>
