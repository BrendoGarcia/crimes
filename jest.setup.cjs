require('@testing-library/jest-dom');

// Mock do ResizeObserver usado pelo Recharts
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
