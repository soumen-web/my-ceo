type Listener = () => void;

const listeners = new Set<Listener>();
const MIN_VISIBLE_MS = 450;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let pendingRequestCount = 0;
let visibleSince = 0;

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const decrementRequestCount = () => {
  pendingRequestCount = Math.max(0, pendingRequestCount - 1);
};

export const globalLoaderService = {
  beginRequest() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    if (pendingRequestCount === 0) {
      visibleSince = Date.now();
    }

    pendingRequestCount += 1;
    notifyListeners();
  },
  endRequest() {
    decrementRequestCount();

    if (pendingRequestCount > 0) {
      notifyListeners();
      return;
    }

    const elapsedMs = Date.now() - visibleSince;
    const remainingMs = Math.max(0, MIN_VISIBLE_MS - elapsedMs);

    if (remainingMs === 0) {
      notifyListeners();
      return;
    }

    hideTimer = setTimeout(() => {
      hideTimer = null;
      notifyListeners();
    }, remainingMs);
  },
  getPendingRequestCount() {
    return pendingRequestCount;
  },
  getSnapshot() {
    return pendingRequestCount > 0;
  },
  reset() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    pendingRequestCount = 0;
    visibleSince = 0;
    notifyListeners();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};
