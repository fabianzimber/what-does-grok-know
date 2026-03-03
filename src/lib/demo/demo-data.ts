import type { ParsedConversation, ParsedMessage } from "../types/grok-data";

interface Topic {
  t: string;
  d: number[];
  s: boolean;
  mo: string;
  l: string;
  th: boolean;
  tu: boolean;
  q: string[];
  a: string[];
}

const topics: Topic[] = [
  {
    t: "Building a REST API with Node.js",
    d: [2025, 11, 5, 9, 15],
    s: true,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: false,
    q: ["Best project structure?", "Error handling?", "Auth rate limiting?"],
    a: [
      "Organize by feature routes controllers services. Central app.ts.",
      "Custom error class statusCode. Error middleware last. Consistent JSON.",
      "JWT jsonwebtoken auth middleware. express-rate-limit 15min 100 max.",
    ],
  },
  {
    t: "Understanding quantum computing",
    d: [2025, 11, 8, 14, 0],
    s: false,
    mo: "grok-3",
    l: "en",
    th: true,
    tu: false,
    q: ["Quantum computing simply?", "What can quantum solve?"],
    a: [
      "Qubits superposition entanglement parallel exploration vs classical bits.",
      "Breaking RSA. Molecular simulation. Optimization. ML sampling.",
    ],
  },
  {
    t: "React performance optimization",
    d: [2025, 11, 12, 11, 0],
    s: true,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: false,
    q: ["React rerenders?", "memo useMemo useCallback?", "List virtualization?"],
    a: [
      "DevTools Profiler. New objects render function refs missing keys.",
      "memo equal props. useMemo values. useCallback functions. Measured only.",
      "react-window react-virtuoso visible items only. 10-50x.",
    ],
  },
  {
    t: "Wie funktioniert Kubernetes?",
    d: [2025, 11, 15, 16, 0],
    s: false,
    mo: "grok-3-mini",
    l: "de",
    th: false,
    tu: false,
    q: ["Kubernetes erklaert?", "Lokal starten?"],
    a: [
      "Docker einzelne Container. Kubernetes dirigiert viele. Pods Deployments.",
      "minikube k3d. YAML kubectl apply.",
    ],
  },
  {
    t: "Machine learning model selection",
    d: [2025, 11, 18, 10, 30],
    s: false,
    mo: "grok-3",
    l: "en",
    th: true,
    tu: true,
    q: ["Predict churn model?", "5% imbalance?", "Explainability?"],
    a: [
      "XGBoost LightGBM tabular. Logistic baseline. Feature engineering.",
      "SMOTE scale_pos_weight F1-score stratified k-fold.",
      "SHAP global local summary waterfall plots.",
    ],
  },
  {
    t: "Writing a short sci-fi story",
    d: [2025, 11, 20, 20, 0],
    s: true,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: false,
    q: ["Sci-fi about AI memory.", "Opening paragraph."],
    a: [
      "2089 archivist Sera finds city AI editing memories. Softening pain.",
      "Sera pressed palm terminal blue glow. Fourteen years. Two versions.",
    ],
  },
  {
    t: "Docker compose best practices",
    d: [2025, 11, 22, 8, 30],
    s: false,
    mo: "grok-3-mini",
    l: "en",
    th: false,
    tu: false,
    q: ["Compose dev practices?", "Hot reload Docker?"],
    a: [
      "Env files no secrets. Separate files. Volumes. Healthchecks.",
      "Volume mount src. nodemon. dockerignore. ts-node.",
    ],
  },
  {
    t: "The philosophy of consciousness",
    d: [2025, 11, 25, 15, 0],
    s: false,
    mo: "grok-3",
    l: "en",
    th: true,
    tu: false,
    q: ["Hard problem consciousness?", "AI conscious?", "Panpsychism?"],
    a: [
      "Chalmers 1995 why brain creates experience. Red feels.",
      "Functionalism possibly. Biological never. IIT phi.",
      "Fundamental like mass. Micro-experiences. Combination problem.",
    ],
  },
  {
    t: "TypeScript generics explained",
    d: [2025, 11, 28, 13, 0],
    s: false,
    mo: "grok-3-mini",
    l: "en",
    th: false,
    tu: false,
    q: ["Generics example?", "Constrained?"],
    a: ["getFirst<T> inferred. Typed fetching hooks.", "extends limits. keyof T. Record objects."],
  },
  {
    t: "Designing a color palette",
    d: [2026, 0, 2, 11, 0],
    s: true,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: false,
    q: ["Palette productivity?", "Accessibility?", "Specific palette?"],
    a: [
      "60-30-10 neutral secondary accent. Calming blue.",
      "WCAG 4.5:1 3:1. No color-only. Grayscale.",
      "#2563EB #0F172A #F59E0B #F8FAFC #10B981 #EF4444.",
    ],
  },
  {
    t: "Python data analysis with pandas",
    d: [2026, 0, 5, 9, 0],
    s: false,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: true,
    q: ["500k CSV pandas?", "Top products region?", "Time series?"],
    a: [
      "dtype usecols category 90% memory.",
      "groupby agg head(5). Pivot heatmap.",
      "resample monthly. Rolling mean. Prophet.",
    ],
  },
  {
    t: "Erklaere mir neuronale Netze",
    d: [2026, 0, 8, 17, 0],
    s: false,
    mo: "grok-3",
    l: "de",
    th: true,
    tu: false,
    q: ["Neuronale Netze erklaert?", "Welche Arten?"],
    a: [
      "Knoten gewichten Backpropagation. Tausende Male.",
      "Feedforward CNN RNN Transformer. PyTorch MNIST.",
    ],
  },
  {
    t: "SQL query optimization tips",
    d: [2026, 0, 10, 14, 30],
    s: false,
    mo: "grok-3-mini",
    l: "en",
    th: false,
    tu: false,
    q: ["Slow SQL 10M rows?", "Which indexes?"],
    a: [
      "EXPLAIN ANALYZE. Index WHERE JOIN ORDER BY.",
      "Frequent slow queries. High cardinality. Avoid over-indexing.",
    ],
  },
  {
    t: "Building a CLI tool in Rust",
    d: [2026, 0, 13, 10, 0],
    s: false,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: false,
    q: ["Rust CLI start?", "Subcommands?", "Testing?"],
    a: [
      "clap derive cargo new. colored indicatif anyhow.",
      "Enum variants src/commands. Match dispatch.",
      "assert_cmd. Separate logic. tempfile insta.",
    ],
  },
  {
    t: "Understanding blockchain consensus",
    d: [2026, 0, 15, 16, 30],
    s: false,
    mo: "grok-2",
    l: "en",
    th: false,
    tu: false,
    q: ["PoS vs PoW?", "Tradeoffs?"],
    a: [
      "PoW puzzles energy. PoS stake proportional 99.9% less.",
      "PoW tested heavy. PoS efficient. Most choose PoS.",
    ],
  },
  {
    t: "CSS Grid vs Flexbox layout",
    d: [2026, 0, 18, 12, 0],
    s: false,
    mo: "grok-3-mini",
    l: "en",
    th: false,
    tu: false,
    q: ["Grid vs Flexbox?", "Grid example?"],
    a: [
      "Flexbox one dim. Grid two dim. OR=Flex AND=Grid.",
      "Dashboard auto-fit minmax. Span columns easy.",
    ],
  },
  {
    t: "Effective meeting strategies",
    d: [2026, 0, 20, 9, 0],
    s: false,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: false,
    q: ["Productive meetings?", "Dominant speakers?"],
    a: ["Agenda 24h. Timekeeper. Action items owners.", "Round-robin. Silent brainstorm. RACI."],
  },
  {
    t: "GraphQL vs REST comparison",
    d: [2026, 0, 23, 15, 0],
    s: true,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: false,
    q: ["GraphQL vs REST?", "When GraphQL?", "N+1?"],
    a: [
      "REST endpoints fixed. GraphQL client specifies.",
      "Multiple clients. Nested. GraphQL gateway.",
      "DataLoader batches one query. Day one.",
    ],
  },
  {
    t: "Was ist funktionale Programmierung?",
    d: [2026, 0, 25, 18, 0],
    s: false,
    mo: "grok-3-mini",
    l: "de",
    th: false,
    tu: false,
    q: ["Funktionale Programmierung?", "JavaScript nutzbar?"],
    a: [
      "Reine Funktionen Unveraenderlichkeit. Testbar.",
      "const Array-Methoden Spread. React Hooks.",
    ],
  },
  {
    t: "Investment portfolio basics",
    d: [2026, 0, 28, 10, 0],
    s: false,
    mo: "grok-2",
    l: "en",
    th: false,
    tu: false,
    q: ["Simple investing?", "Emergency fund?"],
    a: ["Three-fund US intl bonds 60/30/10. Low-cost.", "3-6 months savings. Then invest above."],
  },
  {
    t: "Debugging memory leaks in JS",
    d: [2026, 1, 1, 14, 0],
    s: false,
    mo: "grok-3",
    l: "en",
    th: true,
    tu: true,
    q: ["Node memory crash.", "Thousands listeners.", "CI detection?"],
    a: [
      "Heap snapshots DevTools. Compare. Arrays caches.",
      "Adding without removing. Pair once. listenerCount.",
      "clinic.js autocannon RSS. Assert bounds 10k.",
    ],
  },
  {
    t: "Creative writing prompts",
    d: [2026, 1, 3, 20, 30],
    s: false,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: false,
    q: ["Unique prompts.", "Develop payphone idea."],
    a: [
      "Library alive trapping books. Color vanishes. Payphone.",
      "5th Market Friday. Seven callers. Teen elderly last.",
    ],
  },
  {
    t: "Microservices architecture patterns",
    d: [2026, 1, 6, 11, 0],
    s: false,
    mo: "grok-3",
    l: "en",
    th: true,
    tu: false,
    q: ["Monolith microservices?", "Consistency?", "Monitoring?"],
    a: [
      "Strangler Fig. API gateway. Kafka. DB per Service.",
      "Saga compensating rollbacks. Choreography.",
      "OpenTelemetry. JSON logging. Health checks. mTLS.",
    ],
  },
  {
    t: "Healthy meal prep ideas",
    d: [2026, 1, 8, 8, 0],
    s: false,
    mo: "grok-3-mini",
    l: "en",
    th: false,
    tu: false,
    q: ["Meal prep busy.", "Not boring?"],
    a: ["Batch proteins grains veggies. 4-5 days.", "Four sauces. Rotate grains. Nuts chickpeas."],
  },
  {
    t: "Git branching strategies",
    d: [2026, 1, 10, 15, 0],
    s: false,
    mo: "grok-3-mini",
    l: "en",
    th: false,
    tu: false,
    q: ["Branching 5 devs?", "Hotfixes?"],
    a: [
      "GitHub Flow main deployable. Short branches squash.",
      "Hotfix branch fast merge. Feature flags.",
    ],
  },
  {
    t: "The mathematics of encryption",
    d: [2026, 1, 13, 13, 0],
    s: false,
    mo: "grok-3",
    l: "en",
    th: true,
    tu: false,
    q: ["RSA math?", "Factoring hard?", "Alternatives?"],
    a: [
      "Primes pq. Public e private d. Mod n.",
      "No efficient algorithm. 2048 universe. Quantum.",
      "ECC smaller. CRYSTALS lattice. AES-256.",
    ],
  },
  {
    t: "Web accessibility best practices",
    d: [2026, 1, 16, 10, 0],
    s: false,
    mo: "grok-2",
    l: "en",
    th: false,
    tu: false,
    q: ["Missed a11y?", "Testing?"],
    a: ["Semantic HTML keyboard alt ARIA focus.", "axe-core 30%. Tab-through. Screen readers."],
  },
  {
    t: "CI/CD with GitHub Actions",
    d: [2026, 1, 19, 9, 30],
    s: false,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: true,
    q: ["Actions CI/CD?", "Faster?", "Secrets?"],
    a: [
      "Test build deploy. Matrix. Concurrency.",
      "Cache. Sharding. Path filters.",
      "Repo secrets. Environments. OIDC.",
    ],
  },
  {
    t: "Stoic philosophy in daily life",
    d: [2026, 1, 22, 21, 0],
    s: false,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: false,
    q: ["Stoicism developers?", "Starting?"],
    a: ["Control preparation. Legacy training. Temporary.", "Premeditate. Journal. Three breaths."],
  },
  {
    t: "Next.js app router migration",
    d: [2026, 1, 25, 14, 0],
    s: false,
    mo: "grok-3",
    l: "en",
    th: false,
    tu: false,
    q: ["Pages to app router?", "Client server?", "Gotchas?"],
    a: [
      "Incremental coexist. layout.tsx. Server components.",
      "Server default. use client hooks. Push low.",
      "metadata export. Folder routes. useRouter navigation.",
    ],
  },
];

function gen(): { conversations: ParsedConversation[]; messages: ParsedMessage[] } {
  const convs: ParsedConversation[] = [];
  const msgs: ParsedMessage[] = [];
  let mi = 1;
  for (let i = 0; i < topics.length; i++) {
    const tp = topics[i];
    const cid = `demo-${String(i + 1).padStart(3, "0")}`;
    const mc = tp.q.length + tp.a.length;
    const c = new Date(tp.d[0], tp.d[1], tp.d[2], tp.d[3], tp.d[4]);
    const m = new Date(c.getTime() + 2700000);
    const all = [...tp.q, ...tp.a].join("");
    convs.push({
      id: cid,
      title: `[Demo] ${tp.t}`,
      createdAt: c,
      modifiedAt: m,
      starred: tp.s,
      messageCount: mc,
      humanMessages: tp.q.length,
      assistantMessages: tp.a.length,
      models: [tp.mo],
      hasThinkingTraces: tp.th,
      hasToolUse: tp.tu,
      avgMessageLength: Math.round(all.length / mc),
      totalCharacters: all.length,
      language: tp.l as "en" | "de" | "mixed",
    });
    for (let j = 0; j < tp.q.length; j++) {
      const qId = `msg-${String(mi).padStart(3, "0")}`;
      const aId = `msg-${String(mi + 1).padStart(3, "0")}`;
      const t = new Date(c.getTime() + j * 360000);
      msgs.push({
        id: qId,
        conversationId: cid,
        text: tp.q[j],
        sender: "human",
        createdAt: t,
        hasThinking: false,
        hasSteps: false,
        parentId: j > 0 ? `msg-${String(mi - 1).padStart(3, "0")}` : undefined,
      });
      msgs.push({
        id: aId,
        conversationId: cid,
        text: tp.a[j],
        sender: "assistant",
        createdAt: new Date(t.getTime() + 90000),
        model: tp.mo,
        hasThinking: tp.th,
        hasSteps: tp.tu,
        parentId: qId,
      });
      mi += 2;
    }
  }
  return { conversations: convs, messages: msgs };
}

const { conversations: demoConversations, messages: demoMessages } = gen();
export { demoConversations, demoMessages };
