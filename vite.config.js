import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('unified') ||
              id.includes('remark') ||
              id.includes('unist') ||
              id.includes('mdast') ||
              id.includes('micromark') ||
              id.includes('vfile') ||
              id.includes('bail') ||
              id.includes('trough') ||
              id.includes('character-entities') ||
              id.includes('decode-named-character-reference') ||
              id.includes('ccount')
            ) {
              return 'remark-vendor';
            }
          }
        },
      },
    },
  },
});
