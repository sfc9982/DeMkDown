import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

function inlineCss() {
  return {
    name: 'inline-css',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx || !ctx.bundle) return html;
      let inlinedHtml = html;
      for (const [fileName, chunk] of Object.entries(ctx.bundle)) {
        if (fileName.endsWith('.css') && chunk.type === 'asset') {
          const cssRegex = new RegExp(`<link[^>]+href="[^"]*${fileName}"[^>]*>`, 'i');
          inlinedHtml = inlinedHtml.replace(cssRegex, `<style>\n${chunk.source}\n</style>`);
          delete ctx.bundle[fileName];
        }
      }
      return inlinedHtml;
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    inlineCss(),
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
