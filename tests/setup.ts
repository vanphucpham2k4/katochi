/**
 * Vitest global setup.
 *
 * Provides a minimal chrome.* API mock so content-script and service-worker
 * code that calls into chrome.storage / chrome.runtime / chrome.tabs can be
 * exercised under the jsdom environment where the real APIs are unavailable.
 */

import { beforeEach, vi } from 'vitest';

// In-memory store backing chrome.storage.local.
const store = new Map<string, unknown>();

const chromeStorageLocal = {
  get: vi.fn(async (keys?: string | string[] | null) => {
    const result: Record<string, unknown> = {};
    if (keys == null) {
      store.forEach((value, key) => {
        result[key] = value;
      });
    } else if (typeof keys === 'string') {
      if (store.has(keys)) {
        result[keys] = store.get(keys);
      }
    } else {
      for (const key of keys) {
        if (store.has(key)) {
          result[key] = store.get(key);
        }
      }
    }
    return result;
  }),
  set: vi.fn(async (items: Record<string, unknown>) => {
    Object.entries(items).forEach(([key, value]) => {
      store.set(key, value);
    });
  }),
  remove: vi.fn(async (keys: string | string[]) => {
    const arr = Array.isArray(keys) ? keys : [keys];
    arr.forEach((key) => store.delete(key));
  }),
  clear: vi.fn(async () => {
    store.clear();
  }),
};

const mockChrome = {
  storage: { local: chromeStorageLocal },
  runtime: {
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListener: vi.fn(),
    },
    sendMessage: vi.fn(),
    id: 'katochi-test',
    lastError: null,
  },
  tabs: {
    sendMessage: vi.fn(),
    query: vi.fn(async () => []),
  },
  action: {
    onClicked: { addListener: vi.fn() },
  },
};

// @types/chrome declares `chrome` as a read-only global, so assign via
// defineProperty to avoid the type-level read-only conflict.
Object.defineProperty(globalThis, 'chrome', {
  value: mockChrome,
  writable: true,
  configurable: true,
});

beforeEach(() => {
  store.clear();
  vi.clearAllMocks();
});
