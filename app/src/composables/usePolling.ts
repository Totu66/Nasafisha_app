export interface UsePollingOptions {
  intervalMs?: number;
  immediate?: boolean;
  pauseWhenHidden?: boolean;
  onError?: (_error: unknown) => void;
}

export function usePolling<T>(
  fn: () => Promise<T> | T,
  options: UsePollingOptions = {}
) {
  const {
    intervalMs = 10000,
    immediate = false,
    pauseWhenHidden = true,
    onError,
  } = options;

  let timer: number | null = null;
  let isActive = false;
  let isStopped = false;

  const clearTimer = () => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const schedule = () => {
    clearTimer();
    if (pauseWhenHidden && document.visibilityState === 'hidden') {
      return;
    }
    timer = window.setInterval(() => {
      void fn();
    }, intervalMs);
  };

  const start = () => {
    isStopped = false;
    if (isActive) {
      return;
    }
    isActive = true;
    if (immediate) {
      void fn().catch((error) => onError?.(error));
    }
    schedule();
  };

  const stop = () => {
    isStopped = true;
    isActive = false;
    clearTimer();
  };

  if (pauseWhenHidden && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (isStopped) {
        return;
      }
      if (document.visibilityState === 'hidden') {
        clearTimer();
      } else if (isActive) {
        schedule();
      }
    });
  }

  return {
    start,
    stop,
    execute: () => fn().catch((error) => onError?.(error)),
  };
}
