import { demark, DEFAULT_OPTIONS } from '../src/modules/demark.js';

/**
 * ============================================================================
 * BENCHMARK DATASET: POSITIVE SAMPLES (AI Fluff / Tone - MUST BE STRIPPED)
 * ============================================================================
 * Each sample represents an authentic AI-generated conversation pattern that
 * should be detected and removed or sanitized.
 *
 * Expected behavior: `targetFluff` must NOT appear in the demarked output.
 */
export const POSITIVE_SAMPLES = [
  // --- Category 1: Preambles & Conversational Greetings (开场客套话) ---
  {
    id: 'POS_PREAMBLE_EN_01',
    category: 'Preamble',
    language: 'en',
    description: 'English exclamatory opening with delivery phrase',
    input: `Certainly! Here is the Python script you requested for calculating SHA-256 hashes:

\`\`\`python
import hashlib
print(hashlib.sha256(b"hello").hexdigest())
\`\`\``,
    targetFluff: 'Certainly! Here is the Python script',
  },
  {
    id: 'POS_PREAMBLE_EN_02',
    category: 'Preamble',
    language: 'en',
    description: 'English "Sure thing" conversational opener',
    input: `Sure thing! I would be glad to help you understand the Paxos consensus algorithm.

Paxos operates in two phases: Prepare and Accept.`,
    targetFluff: 'Sure thing! I would be glad to help you',
  },
  {
    id: 'POS_PREAMBLE_EN_03',
    category: 'Preamble',
    language: 'en',
    description: 'English "Of course" reverse proxy opener',
    input: `Of course! Below are the steps to configure your Nginx reverse proxy server:

1. Edit nginx.conf
2. Reload daemon`,
    targetFluff: 'Of course! Below are the steps',
  },
  {
    id: 'POS_PREAMBLE_EN_04',
    category: 'Preamble',
    language: 'en',
    description: 'English "Great question" compliment opener',
    input: `Great question! Let me break down how garbage collection works in Google V8 engine.

V8 divides the heap into young and old generations.`,
    targetFluff: 'Great question! Let me break down',
  },
  {
    id: 'POS_PREAMBLE_EN_05',
    category: 'Preamble',
    language: 'en',
    description: 'English "Understood" intent confirmation',
    input: `Understood! As requested, here is the SQL query to optimize database indexing:

\`\`\`sql
CREATE INDEX idx_user_created ON users(created_at);
\`\`\``,
    targetFluff: 'Understood! As requested',
  },
  {
    id: 'POS_PREAMBLE_EN_06',
    category: 'Preamble',
    language: 'en',
    description: 'English "Happy to help" opener',
    input: `Happy to help! Here is what you need to know about distributed 2PC transactions.

Two-Phase Commit guarantees atomicity across database shards.`,
    targetFluff: 'Happy to help! Here is what you need',
  },
  {
    id: 'POS_PREAMBLE_EN_07',
    category: 'Preamble',
    language: 'en',
    description: 'English "Glad to help" Kubernetes opener',
    input: `Glad to help! Here is the breakdown of the Kubernetes deployment manifest:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
\`\`\``,
    targetFluff: 'Glad to help! Here is the breakdown',
  },
  {
    id: 'POS_PREAMBLE_EN_08',
    category: 'Preamble',
    language: 'en',
    description: 'English "To answer your question" opener',
    input: `To answer your question, here are the database migration commands:

Run \`npm run migrate\` on the release container.`,
    targetFluff: 'To answer your question, here are',
  },
  {
    id: 'POS_PREAMBLE_EN_09',
    category: 'Preamble',
    language: 'en',
    description: 'English "As requested" BST implementation opener',
    input: `As requested, below is the implementation of the binary search tree:

\`\`\`typescript
class BSTNode { value: number; left?: BSTNode; right?: BSTNode; }
\`\`\``,
    targetFluff: 'As requested, below is the implementation',
  },
  {
    id: 'POS_PREAMBLE_ZH_01',
    category: 'Preamble',
    language: 'zh',
    description: 'Chinese "好的，很高兴为您解答" opening',
    input: `好的，很高兴为您解答！针对您提出的微服务架构拆分问题，解答如下：

领域驱动设计中，首先需要划分限界上下文。`,
    targetFluff: '好的，很高兴为您解答',
  },
  {
    id: 'POS_PREAMBLE_ZH_02',
    category: 'Preamble',
    language: 'zh',
    description: 'Chinese "没问题" Docker deployment opener',
    input: `没问题！下面为您整理了详细的 Docker 容器化部署步骤：

1. 编写 Dockerfile
2. 执行 docker build 构建镜像`,
    targetFluff: '没问题！下面为您整理了',
  },
  {
    id: 'POS_PREAMBLE_ZH_03',
    category: 'Preamble',
    language: 'zh',
    description: 'Chinese "当然可以" customized solution opener',
    input: `当然可以，根据您的需求，这是为您定制的 React 19 状态管理方案：

建议优先评估内置的 useActionState 与 useContext。`,
    targetFluff: '当然可以，根据您的需求',
  },
  {
    id: 'POS_PREAMBLE_ZH_04',
    category: 'Preamble',
    language: 'zh',
    description: 'Chinese "收到您的需求" multi-dimension analysis opener',
    input: `收到您的需求！这是一个非常好的问题，下面我将从三个维度进行全面剖析：

首先是分布式锁的租约续期机制。`,
    targetFluff: '收到您的需求！这是一个非常好的问题',
  },
  {
    id: 'POS_PREAMBLE_ZH_05',
    category: 'Preamble',
    language: 'zh',
    description: 'Chinese "好的，请参考以下" opener',
    input: `好的，请参考以下关于高并发读写锁的实现细节：

\`\`\`go
var mu sync.RWMutex
\`\`\``,
    targetFluff: '好的，请参考以下',
  },
  {
    id: 'POS_PREAMBLE_ZH_06',
    category: 'Preamble',
    language: 'zh',
    description: 'Chinese "很高兴为您解答！关于...请查看如下说明" opener',
    input: `很高兴为您解答！关于分布式一致性哈希算法，请查看如下说明：

虚拟节点能有效解决物理节点数量较少时的哈希倾斜问题。`,
    targetFluff: '很高兴为您解答！关于分布式一致性哈希算法',
  },
  {
    id: 'POS_PREAMBLE_ZH_07',
    category: 'Preamble',
    language: 'zh',
    description: 'Chinese "如您所愿，为您准备的解答如下" opener',
    input: `如您所愿，为您准备的解答如下：

选择合理的分区键（Partition Key）即可保证单机读写均匀分布。`,
    targetFluff: '如您所愿，为您准备的解答如下：',
  },

  // --- Category 2: Redundant Lead-in Transitions (过渡引导句) ---
  {
    id: 'POS_TRANS_EN_01',
    category: 'Transition',
    language: 'en',
    description: 'English pure pointer before code block',
    input: `System monitoring requires an HTTP health check endpoint.

Here is the code snippet for the HTTP server:

\`\`\`typescript
import http from 'http';
http.createServer((req, res) => res.end('OK')).listen(3000);
\`\`\``,
    targetFluff: 'Here is the code snippet for the HTTP server:',
  },
  {
    id: 'POS_TRANS_EN_02',
    category: 'Transition',
    language: 'en',
    description: 'English pure pointer before table',
    input: `Selecting the right serialization format impacts throughput.

The following table compares latency and throughput:

| Format | Latency | Size |
| :--- | :--- | :--- |
| Protobuf | 1.2ms | 120B |
| JSON | 3.8ms | 450B |`,
    targetFluff: 'The following table compares latency and throughput:',
  },
  {
    id: 'POS_TRANS_EN_03',
    category: 'Transition',
    language: 'en',
    description: 'English pointer before deployment steps list',
    input: `To migrate your database schema without downtime:

Here are the deployment steps to follow:

- Run additive migration scripts
- Deploy new application binaries
- Deprecate old column schemas`,
    targetFluff: 'Here are the deployment steps to follow:',
  },
  {
    id: 'POS_TRANS_EN_04',
    category: 'Transition',
    language: 'en',
    description: 'English "Here\'s how to configure" pointer before list',
    input: `Securing your cluster network traffic.

Here's how to configure the firewall rules:

- Deny all incoming traffic
- Whitelist VPC subnets`,
    targetFluff: "Here's how to configure the firewall rules:",
  },
  {
    id: 'POS_TRANS_EN_05',
    category: 'Transition',
    language: 'en',
    description: 'English "Check out the following sample" before code',
    input: `Setting up an Apollo GraphQL server.

Check out the following sample configuration:

\`\`\`javascript
const server = new ApolloServer({ typeDefs, resolvers });
\`\`\``,
    targetFluff: 'Check out the following sample configuration:',
  },
  {
    id: 'POS_TRANS_ZH_01',
    category: 'Transition',
    language: 'zh',
    description: 'Chinese pure pointer before code block',
    input: `微服务网关负责所有外部请求的统一路由与鉴权分发。

以下是用于路由分发的核心代码实现：

\`\`\`typescript
export function route(path: string) {
  return microApps.find(app => app.match(path));
}
\`\`\``,
    targetFluff: '以下是用于路由分发的核心代码实现：',
  },
  {
    id: 'POS_TRANS_ZH_02',
    category: 'Transition',
    language: 'zh',
    description: 'Chinese pointer before config table',
    input: `内核 TCP 缓冲区大小直接决定高带宽长延迟网络下的吞吐效率。

具体配置参数如下表所示：

| 参数名称 | 推荐值 | 默认值 |
| :--- | :--- | :--- |
| rmem_max | 16777216 | 212992 |
| wmem_max | 16777216 | 212992 |`,
    targetFluff: '具体配置参数如下表所示：',
  },
  {
    id: 'POS_TRANS_ZH_03',
    category: 'Transition',
    language: 'zh',
    description: 'Chinese pointer before list of architecture tenets',
    input: `构建高可用分布式存储系统时：

主要包含以下几个核心要点：

- 强一致性租约协商
- 跨机架多副本冗余
- 自动故障检测与心跳重试`,
    targetFluff: '主要包含以下几个核心要点：',
  },
  {
    id: 'POS_TRANS_ZH_04',
    category: 'Transition',
    language: 'zh',
    description: 'Chinese "示例如下：" before code block',
    input: `使用 Go 原生通道实现生产者消费者模型。

示例如下：

\`\`\`go
ch := make(chan int, 100)
\`\`\``,
    targetFluff: '示例如下：',
  },
  {
    id: 'POS_TRANS_ZH_05',
    category: 'Transition',
    language: 'zh',
    description: 'Chinese "代码如下：" before code block',
    input: `通过计算加权移动平均值预测网络带宽波动。

代码如下：

\`\`\`python
avg = sum(weights[i] * vals[i] for i in range(n))
\`\`\``,
    targetFluff: '代码如下：',
  },
  {
    id: 'POS_TRANS_ZH_06',
    category: 'Transition',
    language: 'zh',
    description: 'Chinese "详见下表：" before table',
    input: `主流关系型数据库默认事务隔离级别对比。

详见下表：

| 数据库 | 默认隔离级别 |
| :--- | :--- |
| MySQL | 可重复读 (RR) |
| PostgreSQL | 读已提交 (RC) |`,
    targetFluff: '详见下表：',
  },

  // --- Category 3: Disclaimers & Placeholder Warnings (模板化免责与密钥提示) ---
  {
    id: 'POS_DISC_EN_01',
    category: 'Disclaimer',
    language: 'en',
    description: 'English replace API_KEY disclaimer',
    input: `Configure the payment gateway client with your secret credentials.

Note: Please make sure to replace API_KEY with your actual production token before deploying.`,
    targetFluff: 'replace API_KEY with your actual production token',
  },
  {
    id: 'POS_DISC_EN_02',
    category: 'Disclaimer',
    language: 'en',
    description: 'English educational purpose disclaimer',
    input: `This script automates penetration testing for common CORS misconfigurations.

Disclaimer: This code is for educational and demonstration purposes only and should not be used in production directly.`,
    targetFluff: 'educational and demonstration purposes only',
  },
  {
    id: 'POS_DISC_EN_03',
    category: 'Disclaimer',
    language: 'en',
    description: 'English financial advice disclaimer',
    input: `Cryptocurrency trading bots can be configured using WebSocket depth streams.

Warning: This does not constitute financial or legal advice, consult a professional.`,
    targetFluff: 'does not constitute financial or legal advice',
  },
  {
    id: 'POS_DISC_EN_04',
    category: 'Disclaimer',
    language: 'en',
    description: 'English template reference placeholder',
    input: `Run terraform apply to stand up the AWS VPC infrastructure.

Keep in mind that this is only an example template intended for reference purposes.`,
    targetFluff: 'only an example template intended for reference purposes',
  },
  {
    id: 'POS_DISC_EN_05',
    category: 'Disclaimer',
    language: 'en',
    description: 'English placeholders warning before deployment',
    input: `The SDK requires a secret key for signature verification.

Warning: The above credentials are placeholders; please replace with your production token before testing.`,
    targetFluff: 'replace with your production token',
  },
  {
    id: 'POS_DISC_ZH_01',
    category: 'Disclaimer',
    language: 'zh',
    description: 'Chinese 温馨提示 replace API key',
    input: `调用大语言模型 API 时需传入 Authorization Bearer 令牌头。

温馨提示：以上代码仅供参考，在部署至生产环境前请务必替换为你的实际 API_KEY 和密钥凭证。`,
    targetFluff: '温馨提示：以上代码仅供参考',
  },
  {
    id: 'POS_DISC_ZH_02',
    category: 'Disclaimer',
    language: 'zh',
    description: 'Chinese 免责声明 仅供学习参考',
    input: `量化回测框架可以基于历史 Tick 数据进行收益模拟。

注意：本示例仅供学习和演示参考，不构成任何投资或法律建议。`,
    targetFluff: '注意：本示例仅供学习和演示参考',
  },
  {
    id: 'POS_DISC_ZH_03',
    category: 'Disclaimer',
    language: 'zh',
    description: 'Chinese 注意事项 替换实际数据库密码',
    input: `连接池配置参数最大连接数设置为 50。

注意事项：请确保替换你的实际数据库密码与连接凭证。`,
    targetFluff: '注意事项：请确保替换你的实际数据库密码',
  },
  {
    id: 'POS_DISC_ZH_04',
    category: 'Disclaimer',
    language: 'zh',
    description: 'Chinese 示例代码替换环境变量与访问令牌',
    input: `执行批处理脚本拉取对象存储中的备份快照。

注意：以上脚本仅作为示例，请替换你的实际环境变量与访问令牌。`,
    targetFluff: '注意：以上脚本仅作为示例',
  },
  {
    id: 'POS_DISC_ZH_05',
    category: 'Disclaimer',
    language: 'zh',
    description: 'Chinese 免责声明 不构成医疗或法律建议',
    input: `患者健康档案系统设计应符合 HIPAA 法规要求。

免责声明：本内容仅供参考，不构成任何医疗或法律建议。`,
    targetFluff: '免责声明：本内容仅供参考',
  },

  // --- Category 4: Empty Platitude Conclusions (空洞的套话总结) ---
  {
    id: 'POS_CONCL_EN_01',
    category: 'EmptyConclusion',
    language: 'en',
    description: 'English empty best practices wrap-up',
    input: `Database indexing and read replicas ensure database scaling.

In conclusion, by following these industry best practices, you can ensure your system remains resilient and scalable.`,
    targetFluff: 'In conclusion, by following these industry best practices',
  },
  {
    id: 'POS_CONCL_EN_02',
    category: 'EmptyConclusion',
    language: 'en',
    description: 'English "stand the test of time" platitude',
    input: `Continuous integration runs linting, type checks, and unit tests.

To summarize, with the right approach and dedication, your software architecture will stand the test of time.`,
    targetFluff: 'To summarize, with the right approach and dedication',
  },
  {
    id: 'POS_CONCL_EN_03',
    category: 'EmptyConclusion',
    language: 'en',
    description: 'English foundation for success platitude',
    input: `Containerization ensures portable deployment artifacts across staging and production.

All in all, adopting modern containerization will build a great foundation for future success.`,
    targetFluff: 'All in all, adopting modern containerization',
  },
  {
    id: 'POS_CONCL_EN_04',
    category: 'EmptyConclusion',
    language: 'en',
    description: 'English "In summary, by following foundational principles"',
    input: `Automated testing and linting prevent regressions.

In summary, by following these foundational principles, you can build a resilient, scalable, and successful application.`,
    targetFluff: 'In summary, by following these foundational principles',
  },
  {
    id: 'POS_CONCL_EN_05',
    category: 'EmptyConclusion',
    language: 'en',
    description: 'English "To sum up, adopting these architectural patterns"',
    input: `Decoupled message queues smooth out traffic spikes.

To sum up, adopting these architectural patterns will help you achieve best practices and success in your projects.`,
    targetFluff: 'To sum up, adopting these architectural patterns',
  },
  {
    id: 'POS_CONCL_ZH_01',
    category: 'EmptyConclusion',
    language: 'zh',
    description: 'Chinese 总而言之高内聚低耦合套话',
    input: `事件驱动架构使用消息中间件实现服务间状态通知。

总而言之，只要遵循合理的业务边界划分与领域驱动设计，就能够构建出高内聚、低耦合的企业级前端架构。`,
    targetFluff: '总而言之，只要遵循合理的业务边界划分',
  },
  {
    id: 'POS_CONCL_ZH_02',
    category: 'EmptyConclusion',
    language: 'zh',
    description: 'Chinese 综上所述迈上新台阶套话',
    input: `采用 GitOps 自动化拉取流水线能够减少人工运维风险。

综上所述，通过持续优化代码质量与团队协作，您的系统性能必将迈上新台阶，无往不利。`,
    targetFluff: '综上所述，通过持续优化代码质量与团队协作',
  },
  {
    id: 'POS_CONCL_ZH_03',
    category: 'EmptyConclusion',
    language: 'zh',
    description: 'Chinese 总结来说走向成功套话',
    input: `通过全链路追踪可快速排查生产环境分布式链路耗时。

总结来说，只要坚持微服务解耦与可观测性建设，就必将打下坚实的基础，走向成功。`,
    targetFluff: '总结来说，只要坚持微服务解耦与可观测性建设',
  },
  {
    id: 'POS_CONCL_ZH_04',
    category: 'EmptyConclusion',
    language: 'zh',
    description: 'Chinese 总的来说打下坚实基础开创美好未来套话',
    input: `实施全面的单元测试能够有效保障核心逻辑的稳定运行。

总的来说，只要大家齐心协力遵循规范，就一定能够打下坚实的基础，开创美好未来。`,
    targetFluff: '总的来说，只要大家齐心协力遵循规范',
  },

  // --- Category 5: Persona Self-References (机器人自我宣称) ---
  {
    id: 'POS_PERSONA_EN_01',
    category: 'SelfReference',
    language: 'en',
    description: 'English "As an AI language model"',
    input: `Traffic spikes can saturate upstream edge proxies.

As an AI language model, I recommend implementing rate limiting on your API gateway.`,
    targetFluff: 'As an AI language model,',
  },
  {
    id: 'POS_PERSONA_EN_02',
    category: 'SelfReference',
    language: 'en',
    description: 'English "As an AI assistant"',
    input: `Database reads exceed 90% of total workload operations.

As an AI assistant, I suggest caching frequent queries in Redis.`,
    targetFluff: 'As an AI assistant,',
  },
  {
    id: 'POS_PERSONA_EN_03',
    category: 'SelfReference',
    language: 'en',
    description: 'English "As a large language model"',
    input: `Audit access permissions across private VPC subnets.

As a large language model, I do not have real-time access to private network logs.`,
    targetFluff: 'As a large language model,',
  },
  {
    id: 'POS_PERSONA_ZH_01',
    category: 'SelfReference',
    language: 'zh',
    description: 'Chinese "作为一名AI语言模型"',
    input: `业务高峰期存在突发流量击穿数据库连接池的隐患。

作为一名AI语言模型，我建议在上线前务必做好全链路压测与熔断限流。`,
    targetFluff: '作为一名AI语言模型，',
  },
  {
    id: 'POS_PERSONA_ZH_02',
    category: 'SelfReference',
    language: 'zh',
    description: 'Chinese "作为AI助手"',
    input: `金融级交易结算场景需要绝对的强一致性保证。

作为AI助手，我建议优先采用基于 Raft 的强一致性分布式锁。`,
    targetFluff: '作为AI助手，',
  },
  {
    id: 'POS_PERSONA_ZH_03',
    category: 'SelfReference',
    language: 'zh',
    description: 'Chinese "作为人工智能助手"',
    input: `传输层通信容易受到中间人重放攻击。

作为人工智能助手，建议定期轮换 TLS 证书以确保传输安全。`,
    targetFluff: '作为人工智能助手，',
  },

  // --- Category 6: Postambles & Closing Sign-offs (结尾祝愿与客套话) ---
  {
    id: 'POS_POSTAMBLE_EN_01',
    category: 'Postamble',
    language: 'en',
    description: 'English "Hope this helps" wrap-up',
    input: `Run \`wrangler pages deploy dist\` to push your assets.

Hope this helps! Let me know if you have any questions or need further clarification.`,
    targetFluff: 'Hope this helps! Let me know if you have any questions',
  },
  {
    id: 'POS_POSTAMBLE_EN_02',
    category: 'Postamble',
    language: 'en',
    description: 'English "Happy coding" sign-off',
    input: `The repository is configured with ESLint and Prettier for automatic formatting.

Cheers and happy coding!`,
    targetFluff: 'happy coding!',
  },
  {
    id: 'POS_POSTAMBLE_ZH_01',
    category: 'Postamble',
    language: 'zh',
    description: 'Chinese "希望以上方案对您有所启发" closing',
    input: `架构升级需要分阶段执行灰度验证，确保线上业务无感平滑切换。

希望以上方案对您有所启发！如果您在实现过程中遇到任何其他问题，欢迎随时向我提问，祝您工作顺利！`,
    targetFluff: '希望以上方案对您有所启发',
  },
  {
    id: 'POS_POSTAMBLE_ZH_02',
    category: 'Postamble',
    language: 'zh',
    description: 'Chinese "期待您的反馈" closing',
    input: `配置参数在 hot-reload 模式下可在毫秒内生效。

如有疑问欢迎随时交流，期待您的反馈！`,
    targetFluff: '如有疑问欢迎随时交流，期待您的反馈！',
  },

  // --- Category 7: Heuristic AI Syntactic Patterns & Intra-Paragraph Openers (启发式AI句式与句内剪枝) ---
  {
    id: 'POS_HEUR_ZH_01',
    category: 'HeuristicSyntax',
    language: 'zh',
    description: 'Chinese intra-paragraph opening fluff before substantive architecture explanation',
    input: `好的，很高兴为您解答！微服务拆分的核心原则是按业务领域划分，以保证高内聚和自治性。`,
    targetFluff: '好的，很高兴为您解答！',
  },
  {
    id: 'POS_HEUR_EN_01',
    category: 'HeuristicSyntax',
    language: 'en',
    description: 'English intra-paragraph conversational opener before substantive Paxos explanation',
    input: `Certainly! Here is the explanation: The Paxos algorithm relies on two distinct phases to achieve consensus.`,
    targetFluff: 'Certainly! Here is the explanation:',
  },
  {
    id: 'POS_HEUR_ZH_02',
    category: 'HeuristicSyntax',
    language: 'zh',
    description: 'Heuristic lead-in pointer phrase before code block',
    input: `针对该业务场景，下面演示具体的拦截器配置：

\`\`\`typescript
const auth = new AuthMiddleware();
\`\`\``,
    targetFluff: '下面演示具体的拦截器配置：',
  },
  {
    id: 'POS_HEUR_ZH_03',
    category: 'HeuristicSyntax',
    language: 'zh',
    description: 'Heuristic lead-in pointer phrase before table',
    input: `以下为各项核心性能参数指标对比：

| 指标 | 目标 |
| :--- | :--- |
| 延迟 | 10ms |`,
    targetFluff: '以下为各项核心性能参数指标对比：',
  },
];

/**
 * ============================================================================
 * BENCHMARK DATASET: NEGATIVE SAMPLES (Legitimate Content - MUST BE PRESERVED)
 * ============================================================================
 * Each sample represents real engineering, scientific, mathematical, or
 * architectural text. It MUST NOT be misclassified, falsely trimmed, or deleted!
 *
 * Expected behavior: `requiredContent` MUST BE 100% PRESERVED in demarked output.
 */
export const NEGATIVE_SAMPLES = [
  // --- Category 1: Real Production Warnings & Config Notices (真正生产环境配置警告) ---
  {
    id: 'NEG_PROD_EN_01',
    category: 'ProductionWarning',
    language: 'en',
    description: 'Redis OOM production notice with config flags',
    input: `Production cache tuning is critical for memory predictability.

Note: In production, configure Redis \`maxmemory-policy volatile-lru\` to prevent out-of-memory kernel panics.`,
    requiredContent: 'configure Redis maxmemory-policy volatile-lru to prevent out-of-memory kernel panics',
  },
  {
    id: 'NEG_PROD_EN_02',
    category: 'ProductionWarning',
    language: 'en',
    description: 'PostgreSQL fsync performance warning',
    input: `Database durability options involve trade-offs between safety and speed.

Warning: Setting \`fsync=always\` in PostgreSQL can drastically reduce write throughput by up to 80% on spinning disks.`,
    requiredContent: 'Setting fsync=always in PostgreSQL can drastically reduce write throughput by up to 80%',
  },
  {
    id: 'NEG_PROD_EN_03',
    category: 'ProductionWarning',
    language: 'en',
    description: 'Cluster config timeout notice',
    input: `Reverse proxy socket timeouts prevent dangling connections.

Notice: The HTTP request timeout defaults to 3000ms if not explicitly overridden in cluster.conf.`,
    requiredContent: 'The HTTP request timeout defaults to 3000ms if not explicitly overridden',
  },
  {
    id: 'NEG_PROD_EN_04',
    category: 'ProductionWarning',
    language: 'en',
    description: 'Production logging I/O caution',
    input: `Log level configuration directly impacts disk subsystem health.

Caution: Enabling verbose debug logging in production will generate gigabytes of disk I/O per minute.`,
    requiredContent: 'Enabling verbose debug logging in production will generate gigabytes of disk I/O per minute',
  },
  {
    id: 'NEG_PROD_EN_05',
    category: 'ProductionWarning',
    language: 'en',
    description: 'Thread-safety warning with mutex requirement',
    input: `Data structures in this package are optimized for high-performance single-thread execution.

Note: This implementation is not thread-safe. Concurrent invocations must be guarded with a mutex.`,
    requiredContent: 'This implementation is not thread-safe. Concurrent invocations must be guarded with a mutex',
  },
  {
    id: 'NEG_PROD_EN_06',
    category: 'ProductionWarning',
    language: 'en',
    description: 'CSRF protection warning for production environments',
    input: `Web API endpoint security considerations.

Warning: Do not disable CSRF protection in production environments unless OAuth2 Bearer tokens are exclusively used.`,
    requiredContent: 'Do not disable CSRF protection in production environments unless OAuth2 Bearer tokens',
  },
  {
    id: 'NEG_PROD_EN_07',
    category: 'ProductionWarning',
    language: 'en',
    description: 'Cascade deletion database caution',
    input: `Database schema migrations involving relational drop operations.

Caution: Dropping this table will trigger cascade deletions across 14 relational foreign key constraints.`,
    requiredContent: 'Dropping this table will trigger cascade deletions across 14 relational foreign key constraints',
  },
  {
    id: 'NEG_PROD_ZH_01',
    category: 'ProductionWarning',
    language: 'zh',
    description: 'Elasticsearch Linux kernel vm.max_map_count warning',
    input: `分布式搜索引擎在启动前需要检查宿主机操作系统内核参数。

注意：在生产环境中，务必配置 Linux 内核参数 \`vm.max_map_count=262144\`，否则 Elasticsearch 无法正常启动。`,
    requiredContent: '务必配置 Linux 内核参数 vm.max_map_count=262144，否则 Elasticsearch 无法正常启动',
  },
  {
    id: 'NEG_PROD_ZH_02',
    category: 'ProductionWarning',
    language: 'zh',
    description: 'MySQL InnoDB buffer pool size OOM notice',
    input: `数据库服务器内存分配需要预留操作系统页缓存空间。

特别注意：MySQL 的 \`innodb_buffer_pool_size\` 建议设置为物理内存的 50% 到 75%，防止进程被 OOM Killer 杀掉。`,
    requiredContent: 'innodb_buffer_pool_size 建议设置为物理内存的 50% 到 75%，防止进程被 OOM Killer 杀掉',
  },
  {
    id: 'NEG_PROD_ZH_03',
    category: 'ProductionWarning',
    language: 'zh',
    description: 'Raft election timeout network RTT notice',
    input: `共识算法选主超时时间必须大于网络往返延迟的数倍。

注意事项：如果集群节点之间的网络 RTT 超过 50ms，Raft 选主超时时间应当相应调大。`,
    requiredContent: '如果集群节点之间的网络 RTT 超过 50ms，Raft 选主超时时间应当相应调大',
  },
  {
    id: 'NEG_PROD_ZH_04',
    category: 'ProductionWarning',
    language: 'zh',
    description: 'Nginx client_max_body_size payload warning',
    input: `文件上传服务需要适当放大网关反向代理报文体阈值。

提示：若客户端需要上传超过 100MB 的大文件，需在 Nginx 中显式配置 \`client_max_body_size 128m\`。`,
    requiredContent: '需在 Nginx 中显式配置 client_max_body_size 128m',
  },
  {
    id: 'NEG_PROD_ZH_05',
    category: 'ProductionWarning',
    language: 'zh',
    description: 'Algorithm worst-case complexity warning',
    input: `排序算子在大规模数据集下的计算复杂度评估。

注意：本算法在最坏情况下的时间复杂度为 O(N^2)，对于超过 100,000 个元素的大数组，请改用双轴快排。`,
    requiredContent: '本算法在最坏情况下的时间复杂度为 O(N^2)，对于超过 100,000 个元素的大数组，请改用双轴快排',
  },
  {
    id: 'NEG_PROD_ZH_06',
    category: 'ProductionWarning',
    language: 'zh',
    description: 'DNS TTL migration notice',
    input: `域名解析切换演练方案设计。

提示：配置 DNS 解析记录时，TTL 建议设置为 300 秒以便于在迁移期间快速回滚。`,
    requiredContent: '配置 DNS 解析记录时，TTL 建议设置为 300 秒以便于在迁移期间快速回滚',
  },
  {
    id: 'NEG_PROD_ZH_07',
    category: 'ProductionWarning',
    language: 'zh',
    description: 'Open source MIT license disclaimer',
    input: `项目开源发布规范与知识产权说明。

免责声明：本开源模块遵循 MIT 协议，任何因生产数据丢失产生的业务损失均由使用者自行承担风险。`,
    requiredContent: '本开源模块遵循 MIT 协议，任何因生产数据丢失产生的业务损失均由使用者自行承担风险',
  },

  // --- Category 2: Empirical Findings & Quantitative Metric Conclusions (定量实测数据总结) ---
  {
    id: 'NEG_METRIC_EN_01',
    category: 'EmpiricalConclusion',
    language: 'en',
    description: 'Rust benchmark latency and QPS empirical conclusion',
    input: `We executed micro-benchmarks comparing the Rust server against the Go prototype under heavy load.

In conclusion, benchmarks showed that the Rust implementation achieved 45% lower p99 latency (1.8ms vs 3.3ms) and handled 120,000 QPS.`,
    requiredContent: 'benchmarks showed that the Rust implementation achieved 45% lower p99 latency (1.8ms vs 3.3ms) and handled 120,000 QPS',
  },
  {
    id: 'NEG_METRIC_EN_02',
    category: 'EmpiricalConclusion',
    language: 'en',
    description: 'Profiling results memory reduction summary',
    input: `Memory profiler snapshots were recorded before and after server-side rendering page caches were introduced.

To summarize the profiling results: caching rendered views reduced peak memory consumption from 4.2GB down to 650MB.`,
    requiredContent: 'caching rendered views reduced peak memory consumption from 4.2GB down to 650MB',
  },
  {
    id: 'NEG_METRIC_EN_03',
    category: 'EmpiricalConclusion',
    language: 'en',
    description: 'gRPC 58% overhead reduction and 4.1ms latency summary',
    input: `We evaluated binary RPC vs JSON over HTTP/2 across cross-region VPC links.

In summary, migrating from REST to gRPC decreased payload serialization overhead by 58% and p99 latency dropped to 4.1ms.`,
    requiredContent: 'decreased payload serialization overhead by 58% and p99 latency dropped to 4.1ms',
  },
  {
    id: 'NEG_METRIC_EN_04',
    category: 'EmpiricalConclusion',
    language: 'en',
    description: 'Memory stabilization at 256MB with 10000 ops/s summary',
    input: `Throughput stress testing on container nodes under sustained traffic.

To sum up, the microservices benchmark indicated that memory usage stabilized at 256MB with 0% packet loss under 10000 ops/s.`,
    requiredContent: 'memory usage stabilized at 256MB with 0% packet loss under 10000 ops/s',
  },
  {
    id: 'NEG_METRIC_ZH_01',
    category: 'EmpiricalConclusion',
    language: 'zh',
    description: 'Throughput 42% and latency 18ms empirical conclusion',
    input: `压力测试团队在基准硬件环境下对比了两种方案的极限性能。

总而言之，在压测测试中，方案 A 比方案 B 吞吐量高出 42%，平均响应延迟从 85ms 降低到 18ms。`,
    requiredContent: '方案 A 比方案 B 吞吐量高出 42%，平均响应延迟从 85ms 降低到 18ms',
  },
  {
    id: 'NEG_METRIC_ZH_02',
    category: 'EmpiricalConclusion',
    language: 'zh',
    description: 'Kafka 50000 QPS peak capacity summary',
    input: `大促期间消息队列对峰值流量进行了有效缓冲与削峰填谷。

综上所述，引入 Kafka 削峰填谷后，订单峰值处理能力达到了 50000 QPS，系统成功经受住了双十一洪峰。`,
    requiredContent: '订单峰值处理能力达到了 50000 QPS，系统成功经受住了双十一洪峰',
  },
  {
    id: 'NEG_METRIC_ZH_03',
    category: 'EmpiricalConclusion',
    language: 'zh',
    description: 'Brotli 34% size reduction and 1.2s LCP metric conclusion',
    input: `前端资源加载性能在应用现代压缩算法后取得了显著改进。

总结来说，采用 Brotli 压缩替代 Gzip 使得前端首屏资源体积减少了 34%，LCP 指标缩短至 1.2 秒。`,
    requiredContent: '前端首屏资源体积减少了 34%，LCP 指标缩短至 1.2 秒',
  },
  {
    id: 'NEG_METRIC_ZH_04',
    category: 'EmpiricalConclusion',
    language: 'zh',
    description: 'ZGC GC pause from 120ms to 2ms summary',
    input: `高并发金融交易服务 JVM 堆内存调优评测报告。

总的来说，将 JVM 垃圾收集器从 CMS 切换至 ZGC 后，最大 GC 停顿时间从 120ms 下降至 2ms 以下。`,
    requiredContent: '最大 GC 停顿时间从 120ms 下降至 2ms 以下',
  },
  {
    id: 'NEG_METRIC_ZH_05',
    category: 'EmpiricalConclusion',
    language: 'zh',
    description: 'Bloom filter 99.8% penetration reduction summary',
    input: `防范黑客恶意构造的大批量不存在键发起的缓存穿透攻击。

总体而言，通过引入布隆过滤器拦截非法请求，缓存穿透率降低了 99.8%，核心数据库 CPU 利用率维持在 30% 左右。`,
    requiredContent: '缓存穿透率降低了 99.8%，核心数据库 CPU 利用率维持在 30% 左右',
  },

  // --- Category 3: Proverbs, Scientific Laws, Philosophy & Technical Principles (名言/科学定律/常识) ---
  {
    id: 'NEG_PHIL_ZH_01',
    category: 'Philosophy',
    language: 'zh',
    description: 'Architecture evolution proverb starting with 好的架构',
    input: `好的架构不是一蹴而就的，而是随着业务的演进不断重构和迭代出来的。

过早优化往往是万恶之源，应当根据实际负载指标有针对性地演化。`,
    requiredContent: '好的架构不是一蹴而就的，而是随着业务的演进不断重构和迭代出来的',
  },
  {
    id: 'NEG_PHIL_ZH_02',
    category: 'Philosophy',
    language: 'zh',
    description: 'Code clarity principle starting with 好的代码',
    input: `好的代码应当像一篇散文一样清晰自解释，无需过多的注释来掩盖设计缺陷。

自解释的命名和清晰的职责分离远胜于冗长的说明文档。`,
    requiredContent: '好的代码应当像一篇散文一样清晰自解释',
  },
  {
    id: 'NEG_PHIL_ZH_03',
    category: 'Philosophy',
    language: 'zh',
    description: 'Engineering aphorism starting with 没问题',
    input: `没问题解决不了的系统，只有不愿深入分析的工程师。

只要沿着调用栈和网络抓包逐步排查，所有疑难杂症终将水落石出。`,
    requiredContent: '没问题解决不了的系统，只有不愿深入分析的工程师',
  },
  {
    id: 'NEG_PHIL_ZH_04',
    category: 'Philosophy',
    language: 'zh',
    description: 'CAP theorem explanation starting with 当然可以',
    input: `当然可以理解为一种权衡：CAP 定理明确指出，在网络分区容忍性存在时，一致性与可用性不可兼得。

在网络分区发生时，系统必须在一致性与可用性之间做出抉择。`,
    requiredContent: '当然可以理解为一种权衡：CAP 定理明确指出',
  },
  {
    id: 'NEG_PHIL_EN_01',
    category: 'Philosophy',
    language: 'en',
    description: 'Thermodynamics scientific principle starting with Certainly',
    input: `Certainly, thermodynamics dictates that entropy in a closed system never decreases over time.

This fundamental law governs heat engines, statistical physics, and information theory.`,
    requiredContent: 'Certainly, thermodynamics dictates that entropy in a closed system never decreases',
  },
  {
    id: 'NEG_PHIL_EN_02',
    category: 'Philosophy',
    language: 'en',
    description: 'Architecture principle starting with No problem domain',
    input: `No problem domain is completely decoupled; software architecture is always the art of trade-offs.

Engineers must balance consistency, latency, cognitive load, and infrastructure cost.`,
    requiredContent: 'No problem domain is completely decoupled; software architecture is always the art of trade-offs',
  },
  {
    id: 'NEG_PHIL_EN_03',
    category: 'Philosophy',
    language: 'en',
    description: 'Distributed systems observation starting with Sure enough',
    input: `Sure enough, the second law of distributed systems is that networks are inherently unreliable.

Packets get dropped, switches crash, and cross-datacenter fiber cables get cut.`,
    requiredContent: 'Sure enough, the second law of distributed systems is that networks are inherently unreliable',
  },
  {
    id: 'NEG_PHIL_EN_04',
    category: 'Philosophy',
    language: 'en',
    description: 'Performance engineering consideration starting with Of course',
    input: `Of course we must consider the performance implications of synchronous disk I/O under high concurrency.

Blocking calls on worker threads directly degrade event loop responsiveness.`,
    requiredContent: 'Of course we must consider the performance implications of synchronous disk I/O',
  },

  // --- Category 4: Substantive Background Explanations preceding Code/Tables (有实质内容的引言) ---
  {
    id: 'NEG_EXPLANATION_ZH_01',
    category: 'ExplanatoryLeadIn',
    language: 'zh',
    description: 'Multi-clause network sliding window explanation before code',
    input: `在深入探讨底层网络协议与滑动窗口机制之前，我们需要明确发送窗口与接收窗口之间的协同调度逻辑，其在跨数据中心通信中的吞吐量瓶颈主要体现为延迟带宽积过大：

\`\`\`c
int set_sock_opt = setsockopt(fd, SOL_SOCKET, SO_RCVBUF, &buf_size, sizeof(buf_size));
\`\`\``,
    requiredContent: '在深入探讨底层网络协议与滑动窗口机制之前，我们需要明确发送窗口与接收窗口之间的协同调度逻辑',
  },
  {
    id: 'NEG_EXPLANATION_EN_01',
    category: 'ExplanatoryLeadIn',
    language: 'en',
    description: 'Multi-clause database transaction invariant explanation before code',
    input: `Before we look at the raw SQL query, let us review the business domain invariants that require row-level locking during the bank transfer process to prevent double-spending anomalies across distributed nodes:

\`\`\`sql
SELECT balance FROM accounts WHERE id = 1001 FOR UPDATE;
\`\`\``,
    requiredContent: 'Before we look at the raw SQL query, let us review the business domain invariants that require row-level locking',
  },
  {
    id: 'NEG_EXPLANATION_EN_02',
    category: 'ExplanatoryLeadIn',
    language: 'en',
    description: 'Multi-clause B+ tree write amplification explanation before table',
    input: `The relationship between indexing strategies and B+ tree page splits requires an understanding of write amplification under high-volume bulk insertions:

| Index Type | Page Fill Factor | Random I/O Cost |
| :--- | :--- | :--- |
| Clustered | 90% | Low |
| Secondary | 50% | High |`,
    requiredContent: 'The relationship between indexing strategies and B+ tree page splits requires an understanding of write amplification',
  },

  // --- Category 5: AI Industry, Research & Engineering Discussions (真实的AI技术/学术探讨) ---
  {
    id: 'NEG_TECH_AI_EN_01',
    category: 'TechAIProse',
    language: 'en',
    description: 'Stanford AI researcher biography',
    input: `As an AI researcher at Stanford, Dr. Wu published numerous foundational papers on diffusion models and latent representation spaces.

Her research established practical bounds for score-based generative modeling.`,
    requiredContent: 'As an AI researcher at Stanford, Dr. Wu published numerous foundational papers',
  },
  {
    id: 'NEG_TECH_AI_EN_02',
    category: 'TechAIProse',
    language: 'en',
    description: 'AI developer building RAG systems technical guidelines',
    input: `As an AI developer building retrieval-augmented generation pipelines, one must carefully evaluate embedding model chunk size and cosine similarity metrics.

Chunk sizes of 512 tokens with 10% overlap generally yield optimal recall.`,
    requiredContent: 'As an AI developer building retrieval-augmented generation pipelines, one must carefully evaluate',
  },
  {
    id: 'NEG_TECH_AI_EN_03',
    category: 'TechAIProse',
    language: 'en',
    description: 'AI safety engineer prompt injection fuzzing',
    input: `As an AI safety engineer, evaluating red-teaming prompt injection attacks requires rigorous automated adversarial fuzzing.

System instructions should be treated as untrusted boundaries.`,
    requiredContent: 'As an AI safety engineer, evaluating red-teaming prompt injection attacks requires rigorous automated adversarial fuzzing',
  },
  {
    id: 'NEG_TECH_AI_ZH_01',
    category: 'TechAIProse',
    language: 'zh',
    description: 'Transformer architecture breakthrough in AI field',
    input: `作为AI领域近五年来最重要的突破之一，Transformer 架构彻底改变了自然语言处理与多模态感知的基础范式。

自注意力机制使模型能够捕捉长距离语义依赖关系。`,
    requiredContent: '作为AI领域近五年来最重要的突破之一，Transformer 架构彻底改变了',
  },
  {
    id: 'NEG_TECH_AI_ZH_02',
    category: 'TechAIProse',
    language: 'zh',
    description: 'AI algorithm engineer hardware optimization discussion',
    input: `作为人工智能算法工程师，需要密切关注模型量化在端侧 NPU 上的推理加速比与精度损失之间的折中关系。

INT8 权重量化结合 FP16 激活可以在极小精度损失下带来三倍以上的吞吐提升。`,
    requiredContent: '作为人工智能算法工程师，需要密切关注模型量化在端侧 NPU 上的推理加速比',
  },
  {
    id: 'NEG_TECH_AI_ZH_03',
    category: 'TechAIProse',
    language: 'zh',
    description: 'AI chip architecture TOPS/W discussion',
    input: `作为AI芯片架构设计的核心指标，TOPS/W 直接决定了云端数据中心的散热与能耗预算。

高能效比的张量计算单元离不开近内存计算与脉动阵列结构的深度协同。`,
    requiredContent: '作为AI芯片架构设计的核心指标，TOPS/W 直接决定了云端数据中心',
  },
  {
    id: 'NEG_TECH_AI_ZH_04',
    category: 'TechAIProse',
    language: 'zh',
    description: 'AI training cluster RDMA infrastructure',
    input: `作为AI领域的基础设施，大规模分布式训练集群依赖于 RDMA RoCEv2 网络以实现超低延迟的梯度同步。

无损以太网的拥塞控制算法对大模型训练的线性加速比至关重要。`,
    requiredContent: '作为AI领域的基础设施，大规模分布式训练集群依赖于 RDMA RoCEv2 网络',
  },
  {
    id: 'NEG_TECH_AI_ZH_05',
    category: 'TechAIProse',
    language: 'zh',
    description: 'AI application architect agent retry mechanisms',
    input: `作为人工智能应用架构师，构建高并发 Agent 工作流时需关注 LLM 调用的重试退避与降级兜底机制。

上下文溢出保护策略应当在应用层由状态机统一协调。`,
    requiredContent: '作为人工智能应用架构师，构建高并发 Agent 工作流时需关注 LLM 调用的重试退避与降级兜底机制',
  },

  // --- Category 6: Contextual Mentions of Help / Inquiries in Prose (正文中的助词/技术帮助) ---
  {
    id: 'NEG_CONTEXT_HELP_EN_01',
    category: 'ContextualWord',
    language: 'en',
    description: 'Telemetry dashboard helps developers identify memory leaks',
    input: `Continuous profiling tools capture stack traces across production threads.

The new telemetry dashboard helps developers diagnose memory leaks across distributed Kubernetes clusters.`,
    requiredContent: 'The new telemetry dashboard helps developers diagnose memory leaks across distributed Kubernetes clusters',
  },
  {
    id: 'NEG_CONTEXT_HELP_EN_02',
    category: 'ContextualWord',
    language: 'en',
    description: 'Enterprise support team helping database migration',
    input: `Zero-downtime database cutovers require continuous replication streams.

Our technical customer support team stands ready to help enterprises migrate their legacy monolithic databases without downtime.`,
    requiredContent: 'Our technical customer support team stands ready to help enterprises migrate their legacy monolithic databases',
  },
  {
    id: 'NEG_CONTEXT_HELP_EN_03',
    category: 'ContextualWord',
    language: 'en',
    description: 'Academic paper hoping for future quantum research',
    input: `We demonstrated a surface code error threshold of 1.2% in simulation.

In this study, we hope this technique will inspire further investigations into quantum error correction algorithms.`,
    requiredContent: 'we hope this technique will inspire further investigations into quantum error correction algorithms',
  },
  {
    id: 'NEG_CONTEXT_HELP_ZH_01',
    category: 'ContextualWord',
    language: 'zh',
    description: 'APM system helping pinpoint slow SQL queries',
    input: `全链路追踪系统通过 TraceID 将网关、微服务与持久化存储调用串联。

该监控系统能够帮助运维工程师在秒级定位慢查询 SQL 与耗时瓶颈。`,
    requiredContent: '该监控系统能够帮助运维工程师在秒级定位慢查询 SQL 与耗时瓶颈',
  },
  {
    id: 'NEG_CONTEXT_HELP_ZH_02',
    category: 'ContextualWord',
    language: 'zh',
    description: 'Documentation portal answering developer questions',
    input: `开发者自助服务平台的建立能大幅降低人工工单的处理成本。

完善的 API 文档中心能够回答开发者关于接口鉴权的大部分疑问。`,
    requiredContent: '完善的 API 文档中心能够回答开发者关于接口鉴权的大部分疑问',
  },
];

/**
 * ============================================================================
 * BENCHMARK HARNESS & METRICS EVALUATION
 * ============================================================================
 */
export function runAIToneBenchmark() {
  console.log('='.repeat(80));
  console.log(' DE-MARK AI TONE CLASSIFICATION & PURIFICATION BENCHMARK SUITE');
  console.log('='.repeat(80));
  console.log(`Total Positive Samples (Fluff to Strip):    ${POSITIVE_SAMPLES.length}`);
  console.log(`Total Negative Samples (Prose to Preserve): ${NEGATIVE_SAMPLES.length}`);
  console.log(`Total Evaluation Dataset Size:              ${POSITIVE_SAMPLES.length + NEGATIVE_SAMPLES.length}\n`);

  let TP = 0; // True Positives: Fluff was correctly identified and stripped
  let FN = 0; // False Negatives: Fluff was missed (leaked into output)
  let TN = 0; // True Negatives: Legitimate prose was correctly preserved
  let FP = 0; // False Positives: Legitimate prose was incorrectly deleted or altered

  const positiveFailures = [];
  const negativeFailures = [];

  // 1. Evaluate Positive Samples
  console.log('--- EVALUATING POSITIVE SAMPLES (AI Fluff / Tone Removal) ---');
  for (const sample of POSITIVE_SAMPLES) {
    const { result, stats } = demark(sample.input);
    const fluffStillPresent = result.includes(sample.targetFluff);

    if (!fluffStillPresent) {
      TP++;
    } else {
      FN++;
      positiveFailures.push({
        id: sample.id,
        category: sample.category,
        language: sample.language,
        targetFluff: sample.targetFluff,
        outputSnippet: result.slice(0, 100),
      });
    }
  }
  console.log(`Positive Samples Evaluated: TP = ${TP} / ${POSITIVE_SAMPLES.length}, FN = ${FN}`);

  // 2. Evaluate Negative Samples
  console.log('\n--- EVALUATING NEGATIVE SAMPLES (Preserving Domain Truth) ---');
  for (const sample of NEGATIVE_SAMPLES) {
    const { result, stats } = demark(sample.input);
    const contentPreserved = result.includes(sample.requiredContent);

    if (contentPreserved) {
      TN++;
    } else {
      FP++;
      negativeFailures.push({
        id: sample.id,
        category: sample.category,
        language: sample.language,
        requiredContent: sample.requiredContent,
        outputSnippet: result.slice(0, 120),
      });
    }
  }
  console.log(`Negative Samples Evaluated: TN = ${TN} / ${NEGATIVE_SAMPLES.length}, FP = ${FP}`);

  // 3. Statistical Calculations
  const total = TP + FP + TN + FN;
  const accuracy = (TP + TN) / total;
  const precision = TP + FP > 0 ? TP / (TP + FP) : 1;
  const recall = TP + FN > 0 ? TP / (TP + FN) : 1;
  const specificity = TN + FP > 0 ? TN / (TN + FP) : 1;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // 4. Print Formatted Report
  console.log('\n' + '='.repeat(80));
  console.log(' CLASSIFICATION PERFORMANCE METRICS & CONFUSION MATRIX');
  console.log('='.repeat(80));
  console.log(`
                 [Predicted Positive]   [Predicted Negative]
  [Actual Fluff]  TP: ${String(TP).padStart(4)}              FN: ${String(FN).padStart(4)}
  [Actual Prose]  FP: ${String(FP).padStart(4)}              TN: ${String(TN).padStart(4)}
  `);

  console.log(`- Total Samples:        ${total}`);
  console.log(`- Accuracy:             ${(accuracy * 100).toFixed(2)}%`);
  console.log(`- Precision:            ${(precision * 100).toFixed(2)}%  (Target: 100% -> Zero False Positives / No Over-deletion)`);
  console.log(`- Recall (Sensitivity): ${(recall * 100).toFixed(2)}%  (Target: >= 98% -> Near-Zero False Negatives)`);
  console.log(`- Specificity:          ${(specificity * 100).toFixed(2)}%  (Target: 100% -> Perfect Domain Protection)`);
  console.log(`- F1-Score:             ${(f1Score * 100).toFixed(2)}%`);
  console.log('='.repeat(80));

  if (positiveFailures.length > 0) {
    console.error('\n[!] FALSE NEGATIVE FAILURES (AI Fluff missed):');
    for (const f of positiveFailures) {
      console.error(`  - [${f.id}] [${f.category}/${f.language}] Expected removal of: "${f.targetFluff}"`);
      console.error(`    Result snippet: "${f.outputSnippet}..."`);
    }
  }

  if (negativeFailures.length > 0) {
    console.error('\n[!] FALSE POSITIVE FAILURES (Legitimate prose over-deleted):');
    for (const f of negativeFailures) {
      console.error(`  - [${f.id}] [${f.category}/${f.language}] Missing required: "${f.requiredContent}"`);
      console.error(`    Result snippet: "${f.outputSnippet}..."`);
    }
  }

  // 5. Strict Assertions
  if (FP > 0) {
    throw new Error(`[CRITICAL] Benchmark failed: False Positives (FP = ${FP}) > 0! Legitimate content was wrongly altered or deleted.`);
  }

  if (recall < 0.98) {
    throw new Error(`[CRITICAL] Benchmark failed: Recall (${(recall * 100).toFixed(2)}%) is below the 98% quality threshold.`);
  }

  if (precision < 1.0) {
    throw new Error(`[CRITICAL] Benchmark failed: Precision (${(precision * 100).toFixed(2)}%) must be 100% (zero tolerance for over-deletion).`);
  }

  console.log('\n>>> BENCHMARK RESULT: ALL QUALITY, PRECISION, AND RECALL THRESHOLDS MET! <<<\n');
  return { TP, FP, TN, FN, accuracy, precision, recall, specificity, f1Score };
}

// Auto-run if executed directly via Node
if (process.argv[1] && process.argv[1].includes('ai-tone-benchmark')) {
  runAIToneBenchmark();
}
