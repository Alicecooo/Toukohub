import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Toukohub/',
  // WebGAL is a prebuilt static engine copied into dist by scripts/build.mjs.
  // vite preview serves that dist with the GitHub Pages base path.
  build: {
    outDir: 'dist',
    emptyOutDir: false,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
