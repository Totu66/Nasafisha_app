<!--
  FE-002 — the camera box on the report screen (wireframe: "Camera viewfinder").
    - shows the live camera + a "Take photo" button
    - after the photo: shows it with a "Retake" button
    - if the camera is blocked or missing: lets the citizen pick a photo with the phone's camera app instead
  Usage:
    <CameraCapture ref="camera" @captured="onCaptured" @cleared="onCleared" />
  Events:  captured -> { blob, capturedAt }   cleared -> the photo was removed (Retake)
  The parent can call  camera.value.retake()  (e.g. when the server says the photo is too large).
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useCamera } from '@/composables/useCamera'
import { fileToJpegBlob } from '@/helpers/image'

const emit = defineEmits<{
  captured: [photo: { blob: Blob; capturedAt: string }]
  cleared: []
}>()

const videoEl = ref<HTMLVideoElement | null>(null)
const camera = useCamera()
const previewUrl = ref<string | null>(null)
const busy = ref(false)
const problem = ref('')

onMounted(() => videoEl.value && camera.start(videoEl.value))
onBeforeUnmount(clearPreview)

function clearPreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}

function show(blob: Blob, capturedAt: string) {
  clearPreview()
  previewUrl.value = URL.createObjectURL(blob)
  emit('captured', { blob, capturedAt })
}

async function takePhoto() {
  busy.value = true
  problem.value = ''
  try {
    const capturedAt = new Date().toISOString() // time of capture, kept even if sent later
    const blob = await camera.capture()
    camera.stop()
    show(blob, capturedAt)
  } catch {
    problem.value = 'Could not take the photo. Please try again.'
  } finally {
    busy.value = false
  }
}

/** The fallback: the citizen picks / takes a photo with the phone's own camera app. */
async function onFilePicked(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  busy.value = true
  problem.value = ''
  try {
    show(await fileToJpegBlob(file), new Date().toISOString())
  } catch {
    problem.value = 'We could not read that photo. Please try another.'
  } finally {
    busy.value = false
  }
}

async function retake() {
  clearPreview()
  emit('cleared')
  if (videoEl.value && camera.status.value !== 'denied' && camera.status.value !== 'unavailable') {
    await camera.start(videoEl.value)
  }
}

defineExpose({ retake })
</script>

<template>
  <div>
    <div class="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-stone-300">
      <!-- live camera (always in the page so it can start; hidden once we have a photo) -->
      <video
        v-show="!previewUrl && camera.status.value === 'live'"
        ref="videoEl"
        class="h-full w-full object-cover"
        autoplay
        playsinline
        muted
      />

      <img v-if="previewUrl" :src="previewUrl" alt="The photo you took" class="h-full w-full object-cover" />

      <p
        v-else-if="camera.status.value === 'starting' || camera.status.value === 'idle'"
        class="absolute inset-0 grid place-items-center text-sm text-stone-600"
      >
        Opening the camera…
      </p>

      <div
        v-else-if="camera.status.value === 'denied' || camera.status.value === 'unavailable'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center text-sm text-stone-700"
      >
        <p v-if="camera.status.value === 'denied'">
          The camera is blocked. You can allow it in your browser settings, or take the photo with your phone's camera
          instead.
        </p>
        <p v-else>We could not open the camera here. Take the photo with your phone's camera instead.</p>
        <label class="cursor-pointer rounded-lg bg-green-700 px-4 py-2 font-semibold text-white">
          Take a photo
          <input type="file" accept="image/*" capture="environment" class="sr-only" @change="onFilePicked" />
        </label>
      </div>

      <span
        v-if="previewUrl || camera.status.value === 'live'"
        class="absolute bottom-2 left-2 rounded bg-stone-900/80 px-2 py-0.5 text-xs text-white"
      >
        Date and time added for you
      </span>
    </div>

    <p class="mt-2 text-sm text-stone-600">Stand where the waste is.</p>
    <p v-if="problem" class="mt-1 text-sm text-red-700" role="alert">{{ problem }}</p>

    <div class="mt-3 flex gap-2">
      <button
        v-if="!previewUrl && camera.status.value === 'live'"
        type="button"
        :disabled="busy"
        class="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
        @click="takePhoto"
      >
        Take photo
      </button>
      <button
        v-if="previewUrl"
        type="button"
        class="rounded-lg border-2 border-stone-800 px-4 py-2 font-semibold"
        @click="retake"
      >
        Retake
      </button>
    </div>
  </div>
</template>
