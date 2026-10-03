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



console.log('\n--- TEST 6: DEEP AI FLUFF & BOILERPLATE REMOVAL (CHINESE) ---');
const deepZhSample = `好的，很高兴为您解答！根据您的需求，下面我将为您详细介绍现代前端微服务架构。

针对您提出的关于微服务拆分的问题，核心在于解耦业务领域。

作为AI语言模型，我建议在实施前做好架构评估。

以下是具体的架构对比表格：

| 方案 | 优势 | 劣势 |
| :--- | :--- | :--- |
| 模块联邦 | 动态加载，独立部署 | 构建配置复杂度高 |
| iframe 隔离 | 沙箱安全，技术栈无关 | 体验差，路由通信困难 |

以下是用于路由分发的核心代码实现：

\`\`\`typescript
export function route(path: string) {
  return microApps.find(app => app.match(path));
}
\`\`\`

温馨提示：以上代码仅供参考，在部署至生产环境前请务必进行压力测试，并确保替换您的实际密钥。

总而言之，只要遵循合理的业务边界划分与领域驱动设计，就能够构建出高内聚、低耦合的企业级前端架构。

希望以上方案对您有所启发！如果您在实现过程中遇到任何其他问题，欢迎随时向我提问，祝您工作顺利！`;

const r6 = demark(deepZhSample);
console.log('Result:\n' + r6.result);

// Assert all 6 categories are stripped or sanitized
if (r6.result.includes('好的，很高兴为您解答')) throw new Error('Preamble failed to strip');
if (r6.result.includes('希望以上方案对您有所启发')) throw new Error('Postamble failed to strip');
if (r6.result.includes('以下是具体的架构对比表格')) throw new Error('Table transition lead-in failed to strip');
if (r6.result.includes('以下是用于路由分发的核心代码实现')) throw new Error('Code transition lead-in failed to strip');
if (r6.result.includes('温馨提示：以上代码仅供参考')) throw new Error('Disclaimer failed to strip');
if (r6.result.includes('总而言之，只要遵循合理的业务边界划分')) throw new Error('Empty conclusion failed to strip');
if (r6.result.includes('作为AI语言模型')) throw new Error('AI self reference failed to sanitize');
if (!r6.result.includes('建议在实施前做好架构评估')) throw new Error('Self reference replacement text missing');
console.log('Deep Chinese AI fluff test passed! Fluff count:', r6.stats.strippedCounts.fluff);

console.log('\n--- TEST 7: DEEP AI FLUFF & BOILERPLATE REMOVAL (ENGLISH) ---');
const deepEnSample = `Certainly! I'd be happy to help you with setting up a Node.js microservice.

To answer your question, microservices allow teams to deploy independently.

As an AI language model, I recommend planning your boundaries carefully.

Here is the comparison table of different communication protocols:

| Protocol | Latency | Complexity |
| :--- | :--- | :--- |
| gRPC | Low | Medium |
| REST | Medium | Low |

Below is the code snippet for the HTTP server:

\`\`\`typescript
import http from 'http';
const server = http.createServer((req, res) => res.end('OK'));
server.listen(3000);
\`\`\`

Note: Please make sure to replace API_KEY with your actual production token before deploying to production.

In conclusion, by following these industry best practices, you can ensure your system remains resilient and scalable.

Hope this helps! Let me know if you have any questions or need further clarification.`;

const r7 = demark(deepEnSample);
console.log('Result:\n' + r7.result);

if (r7.result.includes('Certainly!')) throw new Error('English preamble failed to strip');
if (r7.result.includes('Hope this helps!')) throw new Error('English postamble failed to strip');
if (r7.result.includes('Here is the comparison table')) throw new Error('English table transition failed to strip');
if (r7.result.includes('Below is the code snippet')) throw new Error('English code transition failed to strip');
if (r7.result.includes('Note: Please make sure to replace API_KEY')) throw new Error('English disclaimer failed to strip');
if (r7.result.includes('In conclusion, by following')) throw new Error('English empty conclusion failed to strip');
if (r7.result.includes('As an AI language model')) throw new Error('English self reference failed to sanitize');
console.log('Deep English AI fluff test passed! Fluff count:', r7.stats.strippedCounts.fluff);

console.log('\n--- TEST 8: LINKS OPTIONS (URL ONLY, TEXT ONLY, TEXT AND URL, REMOVE) ---');
const linkSample = `Check out [Cloudflare Pages](https://pages.cloudflare.com) and [GitHub](https://github.com) for details.`;

// 1. url_only in plain mode
const rLinkUrlPlain = demark(linkSample, { links: 'url_only', outputMode: 'plain' });
if (!rLinkUrlPlain.result.includes('https://pages.cloudflare.com') || rLinkUrlPlain.result.includes('Cloudflare Pages')) {
  throw new Error(`url_only failed in plain mode: ${rLinkUrlPlain.result}`);
}

// 2. url_only in markdown mode
const rLinkUrlMd = demark(linkSample, { links: 'url_only', outputMode: 'markdown' });
if (!rLinkUrlMd.result.includes('https://pages.cloudflare.com') || rLinkUrlMd.result.includes('[Cloudflare Pages]')) {
  throw new Error(`url_only failed in markdown mode: ${rLinkUrlMd.result}`);
}

// 3. text_only
const rLinkText = demark(linkSample, { links: 'text_only' });
if (!rLinkText.result.includes('Cloudflare Pages') || rLinkText.result.includes('https://pages.cloudflare.com')) {
  throw new Error(`text_only failed: ${rLinkText.result}`);
}

// 4. text_and_url
const rLinkBoth = demark(linkSample, { links: 'text_and_url' });
if (!rLinkBoth.result.includes('Cloudflare Pages (https://pages.cloudflare.com)')) {
  throw new Error(`text_and_url failed: ${rLinkBoth.result}`);
}

// 5. remove
const rLinkRemove = demark(linkSample, { links: 'remove' });
if (rLinkRemove.result.includes('Cloudflare Pages') || rLinkRemove.result.includes('https://pages.cloudflare.com')) {
  throw new Error(`remove links failed: ${rLinkRemove.result}`);
}
console.log('Links options test passed! Sample url_only output:', rLinkUrlPlain.result);

console.log('\n--- TEST 9: HEURISTIC AI SENTENCE PATTERNS & INTRA-PARAGRAPH PREFIX PRUNING ---');
// 1. Chinese intra-paragraph opening fluff
const zhInlineOpening = `好的，很高兴为您解答！微服务拆分的核心原则是按业务领域划分，以保证高内聚和自治性。`;
const rZhInline = demark(zhInlineOpening);
console.log('Intra-paragraph ZH Result:\n' + rZhInline.result);
if (rZhInline.result.includes('好的，很高兴为您解答') || !rZhInline.result.includes('微服务拆分的核心原则是按业务领域划分')) {
  throw new Error('Chinese intra-paragraph opening fluff pruning failed!');
}

// 2. English intra-paragraph opening fluff
const enInlineOpening = `Certainly! Here is the explanation: The Paxos algorithm relies on two distinct phases to achieve consensus.`;
const rEnInline = demark(enInlineOpening);
console.log('Intra-paragraph EN Result:\n' + rEnInline.result);
if (rEnInline.result.includes('Certainly!') || !rEnInline.result.includes('The Paxos algorithm relies on two distinct phases')) {
  throw new Error('English intra-paragraph opening fluff pruning failed!');
}

// 3. Heuristic transition before code
const transitionCodeSample = `针对该业务场景，下面演示具体的拦截器配置：\n\n\`\`\`typescript\nconst auth = new AuthMiddleware();\n\`\`\``;
const rTrans = demark(transitionCodeSample);
console.log('Transition Result:\n' + rTrans.result);
if (rTrans.result.includes('下面演示具体的拦截器配置')) {
  throw new Error('Heuristic transition before code block failed to strip!');
}

console.log('Heuristic AI sentence pattern tests passed!');

console.log('\n--- ALL MULTILINGUAL & DEEP AI FLUFF TESTS PASSED! ---');
