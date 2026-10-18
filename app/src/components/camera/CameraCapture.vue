<template>
  <div class="overflow-hidden rounded-2xl border border-[var(--ns-ash-200,#D5DBD9)] bg-white shadow-sm">
    <div class="flex items-center gap-2 px-4 py-3">
      <button
        type="button"
        class="text-[var(--ns-ash-600,#4F5B57)] transition hover:text-[var(--ns-ash-900,#17211F)]"
        aria-label="Close camera"
        @click="emit('close')"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <h2 class="text-sm font-bold text-[var(--ns-ash-900,#17211F)]">Photograph the waste</h2>
    </div>

    <div class="mx-4 rounded-xl bg-[var(--ns-status-received-bg,#E3EEFB)] px-4 py-2.5 text-xs font-medium text-[var(--ns-status-received-fg,#1E4E8C)]">
      Location found · Section 5B
    </div>

    <div class="m-4 overflow-hidden rounded-xl bg-[var(--ns-cream,#F9F6EB)]">
      <video
        v-show="ready"
        ref="videoEl"
        autoplay
        playsinline
        class="aspect-[4/3] w-full object-cover"
      />
      <div
        v-if="!ready"
        class="flex aspect-[4/3] w-full items-center justify-center text-xs text-[var(--ns-ash-600,#4F5B57)]"
      >
        viewfinder
      </div>
    </div>

    <div class="flex items-center gap-3 px-4 pb-3">
      <button
        type="button"
        class="flex-1 rounded-lg bg-[var(--ns-leaf-700,#15803D)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--ns-leaf-600,#16A34A)] disabled:opacity-50"
        :disabled="!ready"
        @click="capture"
      >
        Capture photo
      </button>
      <button
        type="button"
        class="rounded-lg border border-[var(--ns-ash-200,#D5DBD9)] px-4 py-2.5 text-sm font-medium text-[var(--ns-ash-700,#3B4743)] transition hover:bg-[var(--ns-ash-50,#F3F5F4)]"
        @click="switchCamera"
      >
        Flip
      </button>
    </div>

    <p v-if="error" class="mx-4 mb-3 rounded-xl bg-[var(--ns-danger-bg,#FEE2E2)] px-4 py-3 text-sm text-[var(--ns-danger-fg,#991B1B)]">{{ error }}</p>

    <p class="border-t border-[var(--ns-ash-100,#E6EBE9)] px-4 py-3 text-xs text-[var(--ns-ash-600,#4F5B57)]">
      Stand where the waste is. Date and time are added for you.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits<{
  (e: 'captured', dataUrl: string): void;
  (e: 'close'): void;
}>();

const videoEl = ref<HTMLVideoElement | null>(null);
const ready = ref(false);
const error = ref('');

let stream: MediaStream | null = null;
let facingMode: 'user' | 'environment' = 'environment';

async function startCamera() {
  error.value = '';
  ready.value = false;
  try {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
      audio: false,
    });
    if (videoEl.value) {
      videoEl.value.srcObject = stream;
      ready.value = true;
    }
  } catch {
    error.value = 'Camera unavailable. Check permissions or use a photo upload instead.';
  }
}

function capture() {
  if (!videoEl.value) return;
  const canvas = document.createElement('canvas');
  canvas.width = videoEl.value.videoWidth;
  canvas.height = videoEl.value.videoHeight;
  canvas.getContext('2d')?.drawImage(videoEl.value, 0, 0);
  emit('captured', canvas.toDataURL('image/jpeg', 0.85));
}

function switchCamera() {
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  startCamera();
}

onMounted(startCamera);
onBeforeUnmount(() => stream?.getTracks().forEach((t) => t.stop()));
</script>
