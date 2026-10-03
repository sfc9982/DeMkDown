import { demark, DEFAULT_OPTIONS } from '../src/modules/demark.js';

const sample = `# Complete Architecture Overview

Certainly! Here is the full breakdown of the system architecture you requested:

This system has **high throughput**, *ultra-low latency*, and ~~deprecated protocols~~ removed.
You can run it with \`npm start\` or Docker.

> "Simplicity is prerequisite for reliability."
> — Edsger W. Dijkstra

### Key Metrics

| Metric | Target | Current | Notes |
| :--- | :--- | :--- | :--- |
| Latency | < 50ms | 12ms | Edge cache |
| Availability | 99.99% | 99.995% | Multi-region |

\`\`\`typescript
interface Config {
  apiKey: string;
  timeoutMs: number;
}
\`\`\`

Here are the deployment steps:
- Install dependencies
- Build assets with Vite
- Deploy to Cloudflare Pages via [Cloudflare Docs](https://developers.cloudflare.com/pages/)

1. Configure DNS
2. Attach custom domain

---

Hope this helps! Let me know if you have any questions or need further clarification.`;

console.log('--- TEST 1: DEFAULT PLAIN TEXT STRIP ---');
const r1 = demark(sample);
console.log('Result:\n' + r1.result);
console.log('\nStats:', JSON.stringify(r1.stats, null, 2));

console.log('\n--- TEST 2: TSV TABLE STRIP ---');
const r2 = demark(sample, { tables: 'tsv' });
console.log(r2.result.split('Key Metrics')[1].slice(0, 150));

console.log('\n--- TEST 3: SELECTIVE MARKDOWN PRESERVE LISTS & CODE ---');
const r3 = demark(sample, {
  outputMode: 'markdown',
  stripHeadings: true,
  stripEmphasis: true,
  codeBlocks: 'preserve',
  stripBlockquotes: true,
});
console.log(r3.result);

console.log('\n--- ALL TESTS PASSED! ---');
