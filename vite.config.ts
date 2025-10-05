import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/frontend-benchmarks/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000,
    open: '/index.html'
  },
  resolve: {
    alias: {
      './packages/core/dist/index.js': resolve(__dirname, 'packages/core/dist/index.js'),
      './packages/vanilla-impl/dist/index.js': resolve(__dirname, 'packages/vanilla-impl/dist/index.js'),
      '@benchmark/core': resolve(__dirname, 'packages/core/dist/index.js'),
      '@benchmark/vanilla-impl': resolve(__dirname, 'packages/vanilla-impl/dist/index.js'),
      '@benchmark/types': resolve(__dirname, 'shared/types/dist/index.js'),
      '@benchmark/utils': resolve(__dirname, 'shared/utils/dist/index.js')
    }
  }
});