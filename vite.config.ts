import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';
import process from 'node:process';

export default defineConfig({
  plugins: [
    tailwindcss(),
    solid(),
  ],
  // Prevent vite from obscuring rust errors
  clearScreen: false,
  // Tauri expect a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: true,
  },
  // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
  // `TAURI_BIN_NAME`, `TAURI_DEBUG` env variables
  // https://tauri.app/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
