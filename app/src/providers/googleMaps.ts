export const NAKURU_CENTER = { lat: -0.3031, lng: 36.0800 };
export const NAKURU_ZOOM = 11;

export function isMapsAvailable(): boolean {
  return Boolean((window as Window & typeof globalThis & { google?: { maps?: unknown } }).google?.maps);
}

export async function loadGoogleMaps(): Promise<typeof window.google | null> {
  const existingGoogle = (window as Window & typeof globalThis & { google?: typeof google }).google;
  if (existingGoogle?.maps) {
    return existingGoogle;
  }

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return null;
  }

  const scriptId = 'nasafisha-google-maps-script';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  await new Promise<void>((resolve, reject) => {
    const wait = () => {
      if (isMapsAvailable()) {
        resolve();
        return;
      }
      window.setTimeout(wait, 100);
    };

    const interval = window.setInterval(() => {
      if (isMapsAvailable()) {
        window.clearInterval(interval);
        resolve();
      }
    }, 100);

    window.setTimeout(() => {
      window.clearInterval(interval);
      reject(new Error('Google Maps failed to load'));
    }, 15000);

    wait();
  }).catch(() => null);

  return (window as Window & typeof globalThis & { google?: typeof google }).google ?? null;
}

export const googleMaps = {
  NAKURU_CENTER,
  NAKURU_ZOOM,
  isMapsAvailable,
  loadGoogleMaps,
};
