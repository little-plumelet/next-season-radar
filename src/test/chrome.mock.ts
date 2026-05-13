/**
 * In-memory fake for `chrome.storage.local` and `chrome.runtime.lastError`.
 *
 * Call `installChromeMock()` in `beforeEach` and `resetChromeMock()` in
 * `afterEach` so each test starts with a clean slate.
 */

let store: Record<string, unknown> = {}
let forcedError: string | undefined

export function installChromeMock() {
  const fake = {
    storage: {
      local: {
        get(
          keys: string | string[],
          cb: (items: Record<string, unknown>) => void,
        ) {
          if (forcedError) {
            ;(fake.runtime as { lastError: { message: string } }).lastError = {
              message: forcedError,
            }
          }
          const requested = Array.isArray(keys) ? keys : [keys]
          const result: Record<string, unknown> = {}
          for (const k of requested) {
            if (k in store) result[k] = store[k]
          }
          cb(result)
        },

        set(items: Record<string, unknown>, cb: () => void) {
          if (forcedError) {
            ;(fake.runtime as { lastError: { message: string } }).lastError = {
              message: forcedError,
            }
          }
          Object.assign(store, items)
          cb()
        },
      },
    },
    runtime: {
      lastError: undefined as { message: string } | undefined,
    },
  }

  Object.assign(globalThis, { chrome: fake })
}

export function resetChromeMock() {
  store = {}
  forcedError = undefined
  ;(globalThis as Record<string, unknown>).chrome = undefined
}

/** Make the next storage call surface a `chrome.runtime.lastError`. */
export function forceStorageError(message: string) {
  forcedError = message
}

/** Seed the in-memory store directly (bypasses the chrome API). */
export function seedStore(data: Record<string, unknown>) {
  Object.assign(store, data)
}
