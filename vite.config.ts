import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json' with { type: 'json' };

// Vite configuration for the KATOCHI Chrome extension.
// @crxjs/vite-plugin reads the manifest and compiles the referenced
// service worker and content script entry points.
export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
  },
});
