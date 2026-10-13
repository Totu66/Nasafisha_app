import { ref, onBeforeUnmount } from 'vue';

export function useCamera() {
  const stream = ref<MediaStream | null>(null);
  const ready = ref(false);
  const error = ref<string | null>(null);
  let facingMode: 'user' | 'environment' = 'environment';

  async function start() {
    error.value = null;
    ready.value = false;
    try {
      stop();
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      ready.value = true;
    } catch {
      error.value = 'Camera unavailable. Check permissions.';
    }
  }

  function stop() {
    stream.value?.getTracks().forEach((t) => t.stop());
    stream.value = null;
    ready.value = false;
  }

  function flip() {
    facingMode = facingMode === 'user' ? 'environment' : 'user';
    start();
  }

  function capture(video: HTMLVideoElement): string | null {
    if (!video.videoWidth) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.85);
  }

  onBeforeUnmount(stop);

  return { stream, ready, error, start, stop, flip, capture };
}
