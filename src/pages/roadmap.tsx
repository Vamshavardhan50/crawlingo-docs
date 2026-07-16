import React from 'react';
import Head from 'next/head';
import { PageMeta, DocNav } from '@/components/feature-card';
import { CheckCircle2, Hammer, Calendar } from 'lucide-react';

const ROADMAP = {
  done: [
    { title: 'Rust core engine', desc: 'HTTP/2 fetching, HTML parsing, selector engine' },
    { title: 'Python SDK (PyO3)', desc: 'Page, Session, Dataset, Crawl, Watch' },
    { title: 'Node.js SDK (napi-rs)', desc: 'Full TypeScript support, auto .d.ts' },
    { title: 'Rust native crate', desc: 'Direct Rust API with tokio async' },
    { title: 'Self-healing auto-match', desc: 'DOM fingerprinting + Jaro-Winkler scoring' },
    { title: 'Stealth TLS', desc: 'JA3 fingerprint rotation, browser profiles' },
    { title: 'Proxy rotation', desc: 'Static pool, round-robin, remote provider' },
    { title: 'Dataset streaming', desc: 'Constant-memory URL list processing' },
    { title: 'Watch monitors', desc: 'Typed callbacks, webhook support' },
    { title: 'Export: JSON/CSV/Parquet', desc: 'One-method structured export' },
    { title: 'TOML + env var config', desc: 'crawlingo.toml + CRAWLINGO_* vars' },
    { title: 'Middleware stack', desc: 'Metrics, Cache, Auth (Basic/Bearer/OAuth2)' },
    { title: 'Pre-built wheels', desc: 'Linux, macOS, Windows binaries' },
  ],
  inProgress: [
    { title: 'MCP Server', desc: 'Model Context Protocol server for AI agent integration', priority: 'high' },
    { title: 'Go SDK', desc: 'CGo bindings to Rust core for Go developers', priority: 'medium' },
    { title: 'Documentation website', desc: 'Full docs site at crawlingo-docs.vercel.app', priority: 'high' },
    { title: 'GitHub Actions CI', desc: 'Automated wheel builds and publish pipeline', priority: 'high' },
  ],
  planned: [
    { title: 'Browser rendering mode', desc: 'Headless Chromium integration for JS-heavy sites', priority: 'high' },
    { title: 'Async Python API', desc: 'asyncio-native interface for Python SDK', priority: 'high' },
    { title: 'Distributed crawl', desc: 'Redis-backed frontier for multi-machine crawls', priority: 'medium' },
    { title: 'Visual selector builder', desc: 'Browser extension to build selectors by clicking', priority: 'medium' },
    { title: 'LLM-assisted extraction', desc: 'Natural language field descriptions for schema-less extraction', priority: 'high' },
    { title: 'WASM target', desc: 'Compile Crawlingo core to WebAssembly for browser use', priority: 'low' },
    { title: 'Java / JVM SDK', desc: 'JNI bindings for Java and Kotlin', priority: 'low' },
    { title: 'Dashboard UI', desc: 'Web UI for monitoring crawl jobs and watch alerts', priority: 'medium' },
    { title: 'Cloud function templates', desc: 'AWS Lambda, Vercel, Cloudflare Worker starters', priority: 'medium' },
    { title: 'Anti-CAPTCHA integration', desc: 'Plug-in support for 2captcha, CapSolver', priority: 'high' },
  ],
};

const PRIORITY_COLORS: Record<string, string> = {
  high:   'badge-orange',
  medium: 'badge-indigo',
  low:    'badge-gray',
};

export default function RoadmapPage() {
  return (
    <>
      <Head>
        <title>Roadmap — Crawlingo</title>
        <meta name="description" content="Crawlingo development roadmap: what's done, in progress, and planned for future releases including browser rendering, Go SDK, and LLM extraction." />
      </Head>

      <PageMeta
        title="Roadmap"
        description="The Crawlingo development roadmap — what's shipped, what's in progress, and what's planned."
        readingTime="4 min"
        lastUpdated="July 2026"
        githubPath="ROADMAP.md"
      />

      <p className="text-[var(--foreground-muted)] mb-10 text-sm">
        This roadmap reflects current development priorities. Have a feature request?{' '}
        <a href="https://github.com/Vamshavardhan50/crawlingo/issues/new?template=feature_request.md" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-orange)]">
          Open an issue
        </a>{' '}
        on GitHub.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Done */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
            <h2 className="text-base font-bold text-[var(--foreground)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" /> Shipped
              </span>
            </h2>
            <span className="ml-auto text-xs badge badge-green">{ROADMAP.done.length}</span>
          </div>
          <div className="space-y-2">
            {ROADMAP.done.map(item => (
              <div
                key={item.title}
                className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]"
              >
                <div className="text-sm font-medium text-[var(--foreground)] mb-0.5 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="text-[var(--color-success)]">✓</span>
                  {item.title}
                </div>
                <div className="text-xs text-[var(--foreground-subtle)] pl-5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-orange)] animate-pulse-dot" />
            <h2 className="text-base font-bold text-[var(--foreground)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="flex items-center gap-1.5">
                <Hammer className="h-4 w-4 text-[var(--brand-orange)]" /> In Progress
              </span>
            </h2>
            <span className="ml-auto text-xs badge badge-orange">{ROADMAP.inProgress.length}</span>
          </div>
          <div className="space-y-2">
            {ROADMAP.inProgress.map(item => (
              <div
                key={item.title}
                className="p-3 rounded-xl border border-[var(--brand-orange)]/30 bg-[var(--brand-orange)]/[0.03]"
              >
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <div className="text-sm font-medium text-[var(--foreground)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {item.title}
                  </div>
                  <span className={`badge flex-shrink-0 ${PRIORITY_COLORS[item.priority]}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="text-xs text-[var(--foreground-subtle)]">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Planned */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-indigo)]" />
            <h2 className="text-base font-bold text-[var(--foreground)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[var(--brand-indigo)]" /> Planned
              </span>
            </h2>
            <span className="ml-auto text-xs badge badge-indigo">{ROADMAP.planned.length}</span>
          </div>
          <div className="space-y-2">
            {ROADMAP.planned.map(item => (
              <div
                key={item.title}
                className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]"
              >
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <div className="text-sm font-medium text-[var(--foreground)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {item.title}
                  </div>
                  <span className={`badge flex-shrink-0 ${PRIORITY_COLORS[item.priority]}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="text-xs text-[var(--foreground-subtle)]">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DocNav
        prev={{ label: 'Changelog', href: '/changelog' }}
        next={{ label: 'Python SDK', href: '/sdk/python' }}
      />
    </>
  );
}
