<template>
  <div class="space-y-3">
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
      <video ref="videoEl" autoplay playsinline class="aspect-[4/3] w-full object-cover" />
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        :disabled="!ready"
        @click="capture"
      >
        Capture photo
      </button>
      <button
        type="button"
        class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        @click="switchCamera"
      >
        Flip
      </button>
    </div>

    <p v-if="error" class="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits<{ (e: 'captured', dataUrl: string): void }>();

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
