import { ref } from 'vue';

const MAX_BYTES = 5 * 1024 * 1024;

export function usePhotoUpload() {
  const file = ref<File | null>(null);
  const preview = ref<string | null>(null);
  const error = ref<string | null>(null);

  function select(f: File) {
    error.value = null;
    if (!f.type.startsWith('image/')) {
      error.value = 'Please choose an image file.';
      return;
    }
    if (f.size > MAX_BYTES) {
      error.value = 'Image must be under 5 MB.';
      return;
    }
    file.value = f;
    const reader = new FileReader();
    reader.onload = () => (preview.value = reader.result as string);
    reader.readAsDataURL(f);
  }

  function clear() {
    file.value = null;
    preview.value = null;
    error.value = null;
  }

  return { file, preview, error, select, clear };
}
