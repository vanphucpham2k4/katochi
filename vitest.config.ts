import { defineConfig } from 'vitest/config';

// Vitest runs unit tests under jsdom so content-script code that touches
// the DOM can be exercised without a real browser. A separate config file
// keeps the @crxjs/vite-plugin (build-only) out of the test pipeline.
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
});
