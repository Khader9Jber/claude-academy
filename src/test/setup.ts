import '@testing-library/jest-dom'

// Polyfill localStorage for jsdom if not fully functional
// Vitest v4 + jsdom v29 can have issues with localStorage methods not being bound correctly
const storageMap = new Map<string, string>()

const localStorageMock = {
  getItem: (key: string): string | null => storageMap.get(key) ?? null,
  setItem: (key: string, value: string): void => { storageMap.set(key, String(value)) },
  removeItem: (key: string): void => { storageMap.delete(key) },
  clear: (): void => { storageMap.clear() },
  get length(): number { return storageMap.size },
  key: (index: number): string | null => {
    const keys = Array.from(storageMap.keys())
    return keys[index] ?? null
  },
}

// Test if existing localStorage works
let lsWorks = false
try {
  if (typeof globalThis.localStorage !== 'undefined') {
    globalThis.localStorage.setItem('__test__', '1')
    globalThis.localStorage.removeItem('__test__')
    lsWorks = true
  }
} catch {
  lsWorks = false
}

if (!lsWorks) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  })
  Object.defineProperty(globalThis, 'window', {
    value: {
      ...(typeof globalThis.window !== 'undefined' ? globalThis.window : {}),
      localStorage: localStorageMock,
    },
    writable: true,
    configurable: true,
  })
}
