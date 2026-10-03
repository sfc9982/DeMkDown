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

console.log('\n--- TEST 4: MULTILINGUAL CHINESE FLUFF & CJK TABLE ALIGNMENT ---');
const zhSample = `# 云原生微服务架构

好的，根据您的需求，以下是为您整理的微服务核心方案：

降低**网络延迟**并去除~~旧版协议~~。

| 方案名称 | 平均延迟 | 可用性 |
| :--- | :--- | :--- |
| 边缘计算架构 | 15ms | 99.99% |
| 传统中心集群 | 150ms | 99.90% |

希望以上内容对您有所帮助！如有疑问欢迎随时提问！`;

const r4 = demark(zhSample);
console.log('Result:\n' + r4.result);
if (r4.result.includes('好的，根据您的需求') || r4.result.includes('希望以上内容对您有所帮助')) {
  throw new Error('Chinese fluff was not stripped!');
}
console.log('Chinese fluff stripped successfully! Word count:', r4.stats.outputWords);

console.log('\n--- TEST 5: MULTILINGUAL JAPANESE FLUFF STRIPPING ---');
const jaSample = `# システム概要

承知いたしました。以下にエッジ分散処理の利点をまとめました：

**超高速**な処理と*高可用性*を実現します。

お役に立てれば幸いです。何かご不明な点がございましたらお気軽にお知らせください！`;

const r5 = demark(jaSample);
console.log('Result:\n' + r5.result);
if (r5.result.includes('承知いたしました') || r5.result.includes('お役に立てれば幸いです')) {
  throw new Error('Japanese fluff was not stripped!');
}
console.log('Japanese fluff stripped successfully!');

console.log('\n--- ALL MULTILINGUAL TESTS PASSED! ---');
