import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: '/index.html'
  },
  resolve: {
    alias: {
      './packages/core/dist/packages/core/src/index.js': resolve(__dirname, 'packages/core/dist/packages/core/src/index.js'),
      './packages/vanilla-impl/dist/packages/vanilla-impl/src/index.js': resolve(__dirname, 'packages/vanilla-impl/dist/packages/vanilla-impl/src/index.js'),
      '@benchmark/core': resolve(__dirname, 'packages/core/dist/packages/core/src/index.js'),
      '@benchmark/vanilla-impl': resolve(__dirname, 'packages/vanilla-impl/dist/packages/vanilla-impl/src/index.js'),
      '@benchmark/types': resolve(__dirname, 'shared/types/dist/index.js'),
      '@benchmark/utils': resolve(__dirname, 'shared/utils/dist/index.js')
    }
  }
});