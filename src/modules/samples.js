/**
 * Preset sample texts to test DeMark markdown stripping features
 */
export const SAMPLES = {
  conversational: {
    title: 'Chatbot with Fluff & Lists',
    description: 'Typical LLM answer with conversational opening, bold text, blockquote, and closing remarks.',
    content: `# Key Strategies for Sustainable Web Applications

Certainly! Here is the breakdown of the most effective strategies you can adopt:

Modern web development demands both speed and sustainability. As engineering teams scale, adhering to **clean architecture** and *lean dependency graphs* becomes critical.

> "Premature optimization is the root of all evil, yet ignoring efficiency leads to technical bankruptcy."
> — Engineering Maxim

### Core Pillars to Consider

Here is what you should prioritize:
- **Zero-Latency Static Assets**: Utilize CDN edge networks like Cloudflare Pages.
- **Tree-Shakable Bundles**: Avoid monolithic client-side libraries.
- **Accessible HTML**: Use semantic tags and proper ARIA states.
- **AST Transformation**: Parse structured text with AST instead of brittle regex patterns.

For further reading, check out the [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/) and [Remark Ecosystem Guide](https://github.com/remarkjs/remark).

---

Hope this helps! Let me know if you have any questions or need further clarification on any of these points.`,
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
