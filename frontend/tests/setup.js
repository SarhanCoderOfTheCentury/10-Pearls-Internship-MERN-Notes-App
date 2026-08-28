import '@testing-library/jest-dom';
import React from 'react';

// Mock Lineicons wrapper — avoids ESM resolution issues in Vitest workers
vi.mock('../src/components/Icon.jsx', () => ({
  default: ({ className }) =>
    React.createElement('span', { 'data-testid': 'icon', className }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Suppress noisy console.error / console.log in test output
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorageMock.clear();
});
