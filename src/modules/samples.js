/**
 * Preset sample texts to test DeMark markdown stripping features
 */
export const SAMPLES = {
  conversational: {
    title: 'Chatbot with Fluff & Lists',
    description: 'Typical LLM answer with conversational opening, bold text, transitions, disclaimers, and closing remarks.',
    content: `# Key Strategies for Sustainable Web Applications

Certainly! I'd be happy to help you with establishing sustainable web development practices.

As an AI language model, I recommend planning your architectural boundaries carefully.

Here is the comparison table of different communication protocols:

| Protocol | Latency | Complexity | Transport |
| :--- | :--- | :--- | :--- |
| gRPC | Low (<10ms) | Medium | HTTP/2 |
| REST / JSON | Medium (50ms) | Low | HTTP/1.1 |
| GraphQL | Variable | High | HTTP POST |

Below is the code snippet for the HTTP handler:

\`\`\`typescript
import { WorkerEntrypoint } from 'cloudflare:workers';

export default class EdgeHandler extends WorkerEntrypoint {
  async fetch(request: Request): Promise<Response> {
    return Response.json({ status: 'ok', timestamp: Date.now() });
  }
}
\`\`\`

The following steps are required for production deployment:
- Configure Cloudflare Pages project
- Link GitHub repository or upload dist folder
- Verify custom domains and SSL certificates

Note: Please make sure to replace API_KEY with your actual production token before deploying to production.

In conclusion, by following these industry best practices, you can ensure your system remains resilient and scalable.

Hope this helps! Let me know if you have any questions or need further clarification.`,
  },

  technicalCode: {
    title: 'Code Review & Technical Explanation',
    description: 'Contains code fences, inline code, headings, and lists.',
    content: `## Refactoring the Data Ingestion Worker

Sure thing! Here's the updated implementation and an explanation of the changes made:

We've replaced the polling mechanism with an event-driven queue consumer using \`fetch\` and standard Web Streams.

\`\`\`typescript
import { WorkerEntrypoint } from 'cloudflare:workers';

export default class IngestionWorker extends WorkerEntrypoint {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', uptime: 99.99 }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = await request.json();
    return Response.json({ success: true, processedAt: Date.now() });
  }
}
\`\`\`

### Key Observations
1. Replaced legacy node streams with standard \`ReadableStream\`.
2. Added \`JSON.stringify\` serialization safeguard for high-concurrency requests.
3. Tested against \`node v26\` and V8 runtime environments.

Feel free to ask if you'd like me to write integration tests for this!`,
  },

  tablesAndData: {
    title: 'Benchmarking & Markdown Tables',
    description: 'Complex markdown tables, strikethrough, blockquotes, and metrics comparison.',
    content: `# Performance Benchmark: Edge vs Centralized Compute

Below is the comparative analysis based on the latest staging deployment telemetry:

We tested latency across 5 global regions with 10,000 concurrent requests.
Notice that ~~legacy US-East-1 instances~~ have been completely decommissioned.

| Region | Edge Pages (ms) | Legacy Server (ms) | P99 Latency | Status |
| :--- | :---: | :---: | :---: | ---: |
| North America | 14.2 | 118.5 | 22.0ms | **Optimal** |
| Europe West | 18.7 | 142.1 | 28.4ms | **Optimal** |
| Asia Pacific | 24.1 | 215.3 | 39.8ms | **Optimal** |
| South America | 35.6 | 280.9 | 52.1ms | *Good* |
| Australia | 29.8 | 245.0 | 44.5ms | **Optimal** |

> Summary note: The global distribution of Cloudflare Pages eliminates geographic routing penalties.

Let me know if you would like me to export these numbers to CSV!`,
  },

  chinese: {
    title: '中文对话与架构表格',
    description: '包含中文客套话、加粗/斜体、双宽字符对齐表格、冗余过渡句、警示免责声明与结尾问候。',
    content: `# 云原生高并发架构设计要点

好的，很高兴为您解答！根据您的需求，下面我将为您详细介绍现代前端微服务与边缘计算架构。

针对您提出的关于微服务拆分的问题，核心在于解耦业务领域。

作为AI语言模型，我建议在实施前做好架构评估。

以下是具体的架构对比表格：

| 方案 | 优势 | 劣势 | 推荐场景 |
| :--- | :--- | :--- | :--- |
| 模块联邦 | 动态加载，独立部署 | 构建配置复杂度高 | 大型复杂单页应用 |
| iframe 隔离 | 沙箱安全，技术栈无关 | 体验差，路由通信困难 | 遗留旧系统接入 |
| 边缘计算渲染 | 零冷启动，就近响应 | 仅支持标准运行时 | 全球化高并发静态/SSR |

核心实现代码如下：

\`\`\`javascript
export default {
  async fetch(request, env) {
    return new Response("DeMkDown 服务正常运行！", {
      headers: { "content-type": "text/plain;charset=utf-8" },
    });
  }
};
\`\`\`

温馨提示：以上代码仅供参考，在部署至生产环境前请务必进行压力测试，并确保替换您的实际密钥。

总而言之，只要遵循合理的业务边界划分与领域驱动设计，就能够构建出高内聚、低耦合的企业级前端架构。

希望以上方案对您有所启发！如果您在实现过程中遇到任何其他问题，欢迎随时向我提问，祝您工作顺利！`,
  },

  messyMarkdown: {
    title: 'Heavily Nested Formatting',
    description: 'Deeply nested quotes, mixed emphasis, links, images, and horizontal rules.',
    content: `### Deeply Nested Formatting Stress Test

Here is the complex structured document:

> Outer Blockquote Level 1
> > Nested Blockquote Level 2
> > > "Deep thought here" — *Anonymous*
> Back to outer quote.

This paragraph tests ***bold and italic***, **bold with \`inline code\`**, and ~~strikethrough~~.

![Cloudflare Architecture](https://workers.cloudflare.com/resources/logo.svg)

1. First Ordered Item
   - Nested bullet A with [Google](https://google.com)
   - Nested bullet B
2. Second Ordered Item

---
***
___

I hope this helps! Happy coding!`,
  },
};
