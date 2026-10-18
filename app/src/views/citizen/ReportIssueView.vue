<template>
  <section class="mx-auto max-w-md rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white p-5 shadow-sm">
    <router-link
      to="/citizen"
      class="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ns-ash-600,#4F5B57)] transition hover:text-[var(--ns-ash-900,#17211F)]"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Your report
    </router-link>

    <!-- Camera viewfinder (captures the report photo) -->
    <CameraCapture
      v-if="showCamera"
      class="mt-4"
      @captured="handleCaptured"
      @close="showCamera = false"
    />

    <template v-else>
      <!-- Photo + place meta -->
      <div class="mt-4 flex gap-3">
        <div
          v-if="photo"
          class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--ns-ash-200,#D5DBD9)] bg-[var(--ns-cream,#F9F6EB)]"
        >
          <img :src="photo" alt="Report photo" class="h-full w-full object-cover" />
        </div>
        <button
          v-else
          type="button"
          class="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[var(--ns-ash-400,#889490)] bg-[var(--ns-cream,#F9F6EB)] text-[10px] font-semibold text-[var(--ns-ash-600,#4F5B57)] transition hover:border-[var(--ns-leaf-600,#16A34A)] hover:text-[var(--ns-leaf-700,#15803D)]"
          @click="showCamera = true"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          Add photo
        </button>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-[var(--ns-leaf-700,#15803D)]">✓ Section 5B</p>
          <p class="mt-0.5 text-xs text-[var(--ns-ash-600,#4F5B57)]">13/08/2026, 05:14</p>
          <button
            type="button"
            class="mt-1 text-xs font-semibold text-[var(--ns-leaf-700,#15803D)] underline underline-offset-2"
            @click="showCamera = true"
          >
            {{ photo ? 'Retake' : 'Take photo' }}
          </button>
        </div>
      </div>

      <!-- Issue type -->
      <h1 class="mt-6 text-base font-bold text-[var(--ns-ash-900,#17211F)]">What happened?</h1>

      <div class="mt-3 space-y-2.5">
        <button
          v-for="option in issueOptions"
          :key="option.id"
          type="button"
          class="w-full rounded-xl border px-4 py-3 text-left transition"
          :class="issueType === option.id
            ? 'border-[var(--ns-leaf-600,#16A34A)] bg-[var(--ns-leaf-50,#F0FDF4)]'
            : 'border-[var(--ns-ash-200,#D5DBD9)] bg-white hover:border-[var(--ns-ash-400,#889490)]'"
          :aria-pressed="issueType === option.id"
          @click="issueType = option.id"
        >
          <p class="text-sm font-semibold text-[var(--ns-ash-900,#17211F)]">{{ option.title }}</p>
          <p class="mt-0.5 text-xs text-[var(--ns-ash-600,#4F5B57)]">{{ option.hint }}</p>
        </button>
      </div>

      <!-- Note -->
      <label class="mt-6 block">
        <span class="text-sm font-semibold text-[var(--ns-ash-900,#17211F)]">Add a note (optional)</span>
        <textarea
          v-model="note"
          rows="3"
          maxlength="200"
          placeholder="Behind the market gate…"
          class="mt-2 w-full resize-none rounded-xl border border-[var(--ns-ash-200,#D5DBD9)] px-3.5 py-3 text-sm text-[var(--ns-ash-900,#17211F)] outline-none transition placeholder:text-[var(--ns-ash-400,#889490)] focus:border-[var(--ns-leaf-600,#16A34A)]"
        />
      </label>
      <p class="mt-1 text-right text-xs text-[var(--ns-ash-600,#4F5B57)]">{{ note.length }} / 200</p>

      <button
        type="button"
        class="mt-4 rounded-lg bg-[var(--ns-leaf-700,#15803D)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--ns-leaf-600,#16A34A)]"
        @click="sendReport"
      >
        Send report
      </button>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CameraCapture from '../../components/camera/CameraCapture.vue';

const router = useRouter();
const photo = ref('');
const note = ref('');
const showCamera = ref(false);
const issueType = ref<'missed' | 'dumping'>('missed');

const issueOptions = [
  { id: 'missed' as const, title: "Waste wasn't collected", hint: "The truck didn't come, or skipped us" },
  { id: 'dumping' as const, title: 'Someone dumped waste here', hint: 'Empty plot, roadside, riverbank' },
];

function handleCaptured(dataUrl: string) {
  photo.value = dataUrl;
  showCamera.value = false;
}

function sendReport() {
  router.push('/citizen/reports/sent/NSF-260915-0043');
}
</script>
