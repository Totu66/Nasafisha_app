/**
 * Vitest setup: jsdom in this environment does not expose a usable
 * global `localStorage`, but app code (auth/ui stores, i18n) reads it
 * directly. Install an in-memory Storage when it is missing so tests
 * can exercise session persistence and RBAC guards.
 */

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();

  return {
    get length(): number {
      return map.size;
    },
    clear(): void {
      map.clear();
    },
    getItem(key: string): string | null {
      const k = String(key);
      return map.has(k) ? (map.get(k) as string) : null;
    },
    key(index: number): string | null {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string): void {
      map.delete(String(key));
    },
    setItem(key: string, value: string): void {
      map.set(String(key), String(value));
    },
  } as Storage;
}

function hasUsableStorage(): boolean {
  try {
    const storage = globalThis.localStorage as Storage | undefined;
    if (!storage) return false;
    storage.setItem('__nasafisha_probe__', '1');
    storage.removeItem('__nasafisha_probe__');
    return true;
  } catch {
    return false;
  }
}

if (!hasUsableStorage()) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: createMemoryStorage(),
    configurable: true,
    writable: true,
  });
}
