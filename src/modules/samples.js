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

  chinese: {
    title: '中文对话与架构表格',
    description: '包含中文客套话、加粗/斜体、双宽字符对齐表格与结尾问候。',
    content: `# 云原生高并发架构设计要点

好的，根据您的需求，以下是为您整理的微服务与边缘计算架构核心方案：

在现代高可用分布式系统中，降低**端到端网络延迟**和消除*单点故障*至关重要。

> "复杂性是可靠性的死敌，保持架构简单是工程设计的最高追求。"
> —— 软件工程格言

### 核心指标对比

| 架构方案 | 全球平均延迟 | 资源消耗 | 可用性评级 | 部署模式 |
| :--- | :--- | :--- | :--- | :--- |
| Cloudflare 边缘计算 | 15ms | 极低 (无冷启动) | 99.999% | 全球 Anycast |
| 传统中心化集群 | 145ms | 高 (常驻实例) | 99.95% | 单可用区 |
| 混合多活部署 | 40ms | 中等 | 99.99% | 多区域同步 |

\`\`\`javascript
export default {
  async fetch(request, env) {
    return new Response("DeMark 净化服务正常运行！", {
      headers: { "content-type": "text/plain;charset=utf-8" },
    });
  }
};
\`\`\`

- **即时响应**：客户端 AST 零延迟就地剥离
- **安全保障**：所有文本均在浏览器本地处理，绝不上传私密数据
- **开箱即用**：支持直接粘贴或拖拽 Markdown 文件

---

希望以上架构方案对您有所帮助！如果您有任何其他疑问或需要更深入的代码实现，欢迎随时向我提问！`,
  },

  japanese: {
    title: '日本語の対話とコード解説',
    description: '日本語の挨拶文、テーブル、コードブロック、太字装飾を含みます。',
    content: `# Cloudflare Pages による高速エッジ配信設計

承知いたしました。ご質問ありがとうございます！以下にエッジ分散処理の利点と導入手順をまとめました：

現代のWebアプリケーションにおいて、**ゼロレイテンシ**と*高可用性*の両立は最重要課題です。

> 「シンプルさは信頼性の前提条件である。」
> —— エドガー・ダイクストラ

### 主要コンポーネント性能一覧

| 機能名 | 処理時間 | メモリ効率 | 動作環境 |
| :--- | :--- | :--- | :--- |
| AST構文解析 | 0.8ms | 極小 (メモリ効率大) | ブラウザ V8 |
| 正規化処理 | 0.2ms | 最小 | Web Workers |
| 文字列置換 | 0.1ms | 最適 | エッジ環境 |

\`\`\`typescript
interface DeploymentConfig {
  projectName: string;
  compatibilityDate: string;
  enableAST: boolean;
}
\`\`\`

1. **静的アセットの最適化**：Vite と Tailwind CSS によるビルド
2. **高速デプロイ**：Wrangler Direct Upload による瞬時反映

お役に立てれば幸いです。何かご不明な点や追加のご質問がございましたら、いつでもお気軽にお知らせください！`,
  },

  spanish: {
    title: 'Español - Resumen y Análisis Técnico',
    description: 'Texto en español con saludo inicial, tabla de rendimiento, citas y despedida.',
    content: `# Optimización de Rendimiento en Cloudflare Pages

¡Por supuesto! Con mucho gusto, aquí tienes el resumen detallado para optimizar el despliegue de tu aplicación:

El desarrollo web moderno exige tanto **velocidad extrema** como una *arquitectura limpia y desacoplada*.

> "La simplicidad es el requisito indispensable de la fiabilidad."
> — Edsger W. Dijkstra

### Comparativa de Tiempos de Respuesta

| Región Geográfica | Latencia en el Borde | Servidor Tradicional | Estado |
| :--- | :--- | :--- | :--- |
| Europa Occidental | 12.4ms | 135.0ms | **Excelente** |
| América del Norte | 15.1ms | 110.2ms | **Excelente** |
| Latinoamérica | 28.6ms | 240.5ms | *Óptimo* |

\`\`\`javascript
// Ejemplo de llamada en JavaScript
const response = await fetch('/api/demark', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ markdown: inputTexto })
});
\`\`\`

- **Latencia Cero**: Procesamiento AST directamente en el navegador.
- **Privacidad Total**: No se guardan ni transmiten datos sensibles.

¡Espero que esto te sea de gran ayuda! No dudes en consultar si tienes más preguntas o necesitas ampliar la información.`,
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
