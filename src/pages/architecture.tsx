import React from 'react';
import Head from 'next/head';
import { PageMeta, DocNav, Callout } from '@/components/feature-card';
import { GitBranch } from 'lucide-react';

const DEPS = [
  { crate: 'tokio',              purpose: 'Async runtime (I/O-bound work)' },
  { crate: 'rayon',              purpose: 'Parallel iteration (CPU-bound work — DOM scoring, field extraction)' },
  { crate: 'wreq / wreq-util',   purpose: 'HTTP/2 client + TLS fingerprint emulation' },
  { crate: 'html5ever / scraper',purpose: 'Spec-conformant HTML5 parser + DOM traversal' },
  { crate: 'regex',              purpose: 'Regex selector engine' },
  { crate: 'memchr',             purpose: 'SIMD text anchor search (2.1M ops/s)' },
  { crate: 'sled',               purpose: 'Embedded fingerprint database (ACID, no external deps)' },
  { crate: 'governor',           purpose: 'Per-host token bucket rate limiter' },
  { crate: 'moka',               purpose: 'LRU response cache' },
  { crate: 'dashmap',            purpose: 'Lock-free concurrent hash maps (metrics, fingerprint store)' },
  { crate: 'serde / serde_json', purpose: 'Serialization / deserialization' },
  { crate: 'pyo3',               purpose: 'Python FFI (PyO3 bindings)' },
  { crate: 'napi / napi-derive', purpose: 'Node.js N-API FFI (auto .d.ts generation)' },
  { crate: 'tracing',            purpose: 'Structured async logging' },
  { crate: 'toml / envy',        purpose: 'Config file parsing + env var override' },
];

const DECISIONS = [
  { decision: 'Core language',    choice: 'Rust',                reason: 'Memory safety, zero-cost abstractions, excellent FFI compatibility' },
  { decision: 'HTML parser',      choice: 'html5ever + scraper', reason: 'Spec-conformant, handles malformed real-world HTML' },
  { decision: 'Async runtime',    choice: 'Tokio',               reason: 'Industry standard, work-stealing scheduler, native async/await' },
  { decision: 'CPU parallelism',  choice: 'Rayon',               reason: 'Work-stealing thread pool, simple data-parallel API' },
  { decision: 'FFI (Python)',     choice: 'PyO3',                reason: 'Mature, async-safe, maturin build tooling' },
  { decision: 'FFI (Node.js)',    choice: 'napi-rs',             reason: 'Type-safe, auto .d.ts generation, N-API stability guarantees' },
  { decision: 'Config',           choice: 'toml + envy',         reason: 'Human-readable + env var override for container deployments' },
  { decision: 'Fingerprint store',choice: 'sled',                reason: 'Embedded, ACID transactions, zero external process deps' },
  { decision: 'Rate limiting',    choice: 'governor',            reason: 'Token bucket, per-key, async-aware' },
];

export default function ArchitecturePage() {
  return (
    <>
      <Head>
        <title>Architecture — Crawlingo</title>
        <meta name="description" content="Deep dive into the Crawlingo Rust core architecture: FFI layers, parallelism model, fetch pipeline, dependency rationale, and design decisions." />
      </Head>

      <PageMeta
        title="Architecture"
        description="How Crawlingo's Rust core works under the hood — FFI layers, the fetch pipeline, parallelism model, and the reasoning behind every design decision."
        readingTime="10 min"
        lastUpdated="July 2026"
        githubPath="architecture.md"
      />

      {/* ── High-level overview ── */}
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Overview</h2>
      <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">
        Crawlingo is structured as a single compiled Rust library that exposes thin FFI boundaries for Python (via PyO3) and Node.js (via napi-rs). All heavy computation — HTTP/2 fetching, HTML parsing, selector evaluation, DOM fingerprinting, and dataset streaming — happens inside the Rust process with zero-copy shared memory.
      </p>

      {/* ── ASCII architecture diagram ── */}
      <div className="mb-8 overflow-hidden rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)]">
        <div className="px-4 py-2 border-b border-[var(--code-border)] text-xs text-[var(--code-comment)] font-mono">
          System Architecture
        </div>
        <pre className="p-5 text-xs text-[var(--code-fg)] font-mono leading-relaxed overflow-x-auto">
{`User Code (Python / Node.js / Rust)
         │
         ▼
  ┌──────────────────────────────┐
  │     FFI Boundary (PyO3 / napi-rs)     │
  └──────────────┬───────────────┘
                 │
         ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                        RUST CORE                             │
  │                                                              │
  │  Session ──► FetchManager ──► [Standard | Stealthy] Fetcher  │
  │      │           │                     │                      │
  │      │           ▼                     ▼                      │
  │      │    Rate Limiter          HTTP/2 + TLS                  │
  │      │    (governor)            Fingerprint                   │
  │      │           │                     │                      │
  │      │           ▼                     ▼                      │
  │      │      CachingLayer        Retry (backoff)               │
  │      │           │                     │                      │
  │      │           ▼                     ▼                      │
  │      │       Middleware          html5ever                    │
  │      │    (Metrics, Auth)         Parser                      │
  │      │                               │                        │
  │      │                               ▼                        │
  │      │                    DOM (scraper crate)                 │
  │      │                               │                        │
  │      ├──── Selectors ────────────────┤                        │
  │      │   CSS │ XPath │ Regex │ Text Anchor │ After/Before     │
  │      │                               │                        │
  │      ├──── Dataset Builder ──────────┤                        │
  │      │   Fields │ Extraction Types │ Streaming                │
  │      │                               │                        │
  │      ├──── Crawl (BFS) ─────────────┤                        │
  │      │   Frontier │ Concurrency │ robots.txt                  │
  │      │                               │                        │
  │      ├──── Watch ────────────────────┤                        │
  │      │   Polling │ Diff │ Callbacks                           │
  │      │                               │                        │
  │      └──── Fingerprint Store ────────┘                        │
  │            (sled embedded DB)                                 │
  │                                                              │
  │   Metrics: DashMap + atomics (lock-free)                     │
  └──────────────────────────────────────────────────────────────┘`}
        </pre>
      </div>

      {/* ── Fetch pipeline ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Fetch Pipeline</h2>
      <p className="text-[var(--foreground-muted)] mb-6">Every request flows through a layered middleware stack before hitting the wire:</p>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        {[
          'Page("url")', 'Cache?', 'Middleware', 'Rate Limit', 'Transport',
          'HTTP/2', 'Retry', 'html5ever Parser', 'DOM',
        ].map((step, i, arr) => (
          <React.Fragment key={step}>
            <div className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-mono text-[var(--foreground-muted)]">
              {step}
            </div>
            {i < arr.length - 1 && <span className="text-[var(--foreground-subtle)]">→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* ── Parallelism model ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Parallelism Model</h2>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          {
            title: 'Rayon (CPU-bound)',
            color: 'var(--brand-orange)',
            items: [
              'DOM fingerprint scoring during auto-match',
              'Parallel field extraction per document',
              'Dataset streaming chunks',
              'Work-stealing scheduler across all CPU cores',
            ],
          },
          {
            title: 'Tokio (I/O-bound)',
            color: 'var(--brand-indigo)',
            items: [
              'HTTP/2 fetching (concurrent requests)',
              'Crawl task management (Semaphore)',
              'Watch polling intervals',
              'Async task pool with work-stealing',
            ],
          },
          {
            title: 'DashMap + Atomics',
            color: 'var(--brand-violet)',
            items: [
              'Metrics counters (lock-free reads)',
              'Connection pool cache (moka LRU)',
              'Session config (copy-on-write)',
              'Fingerprint hot-path cache',
            ],
          },
        ].map(section => (
          <div key={section.title} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
            <div className="text-sm font-bold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', color: section.color }}>
              {section.title}
            </div>
            <ul className="space-y-1.5">
              {section.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-xs text-[var(--foreground-muted)]">
                  <span style={{ color: section.color }} className="mt-0.5 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Callout type="info" title="Backpressure in streaming">
        The streaming dataset uses bounded Tokio channels. Producers block when the consumer channel is full, preventing unbounded memory growth when processing millions of URLs. The crawl engine uses a Tokio <code>Semaphore</code> to cap concurrent in-flight requests.
      </Callout>

      {/* ── Dependencies ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Core Dependencies</h2>

      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        <table className="data-table">
          <thead>
            <tr>
              <th>Crate</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {DEPS.map((d, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{d.crate}</code></td>
                <td className="text-[var(--foreground-muted)]">{d.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Design decisions ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Design Decisions</h2>

      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        <table className="data-table">
          <thead>
            <tr>
              <th>Decision</th>
              <th>Choice</th>
              <th>Reasoning</th>
            </tr>
          </thead>
          <tbody>
            {DECISIONS.map((d, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td className="font-medium">{d.decision}</td>
                <td><code className="text-xs">{d.choice}</code></td>
                <td className="text-[var(--foreground-muted)]">{d.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Error types ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Error Types</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          { type: 'FetchError',      desc: 'HTTP errors, DNS failures, TLS handshake, timeouts' },
          { type: 'ParseError',      desc: 'Invalid HTML, unknown encoding' },
          { type: 'SelectorError',   desc: 'Invalid CSS/XPath/regex syntax' },
          { type: 'ExtractionError', desc: 'Value normalization failure, unknown extraction type' },
          { type: 'ConfigError',     desc: 'Missing file, parse error, invalid value' },
          { type: 'IoError',         desc: 'File read/write failure (export methods)' },
          { type: 'SdkError',        desc: 'Serialization, FFI callback exceptions' },
        ].map(e => (
          <div key={e.type} className="flex gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <code className="text-xs text-[var(--brand-orange)] flex-shrink-0 font-semibold">{e.type}</code>
            <span className="text-xs text-[var(--foreground-muted)]">{e.desc}</span>
          </div>
        ))}
      </div>

      <DocNav
        prev={{ label: 'Features', href: '/features' }}
        next={{ label: 'Benchmarks', href: '/benchmarks' }}
      />
    </>
  );
}
