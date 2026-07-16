import React from 'react';
import Head from 'next/head';
import { PageMeta, DocNav } from '@/components/feature-card';
import { Check, X } from 'lucide-react';

const BENCH_DATA = {
  throughput: [
    { mode: 'Standard (50 concurrent)', rps: '3,500', p50: '12 ms', p95: '45 ms', p99: '120 ms', mem: '2.4 MB' },
    { mode: 'Stealthy (50 concurrent)', rps: '1,800', p50: '28 ms', p95: '95 ms', p99: '250 ms', mem: '3.1 MB' },
  ],
  automatch: [
    { nodes: '100 nodes',   time: '45 μs' },
    { nodes: '1,000 nodes', time: '380 μs' },
    { nodes: '10,000 nodes',time: '3.2 ms' },
  ],
  streaming: [
    { urls: '100 URLs',     mem: '8 MB',  time: '0.8 s' },
    { urls: '1,000 URLs',   mem: '42 MB', time: '7.5 s' },
    { urls: '10,000 URLs',  mem: '85 MB', time: '72 s' },
  ],
  selectors: [
    { type: 'CSS',         speed: '850K ops/s' },
    { type: 'XPath',       speed: '310K ops/s' },
    { type: 'Regex',       speed: '1.2M ops/s' },
    { type: 'Text Anchor', speed: '2.1M ops/s' },
    { type: 'After/Before',speed: '1.8M ops/s' },
  ],
  comparison: [
    { metric: 'Throughput (50 concurrent)', crawlingo: '3,500 req/s',        scrapy: '~500 req/s',      playwright: '~50 req/s (browser)' },
    { metric: 'p50 latency',               crawlingo: '12 ms',               scrapy: '~120 ms',         playwright: '~800 ms' },
    { metric: 'p99 latency',               crawlingo: '120 ms',              scrapy: '~2 s',            playwright: '~8 s' },
    { metric: 'Memory (idle session)',      crawlingo: '2.4 MB',             scrapy: '~50 MB',          playwright: '~200 MB' },
    { metric: 'Self-healing selectors',    crawlingo: '✅ Built-in',          scrapy: '❌ Manual',       playwright: '❌ Manual' },
    { metric: 'Stealth TLS',               crawlingo: '✅ Built-in',          scrapy: '❌',              playwright: '✅ (full browser)' },
    { metric: 'Change detection',          crawlingo: '✅ Built-in',          scrapy: '❌',              playwright: '❌' },
    { metric: 'Selector types',            crawlingo: '5 (CSS/XPath/Regex/Text/Anchor)', scrapy: '2 (CSS/XPath)', playwright: '3 (CSS/XPath/text)' },
    { metric: 'Multi-SDK',                 crawlingo: 'Python, Node.js, Rust', scrapy: 'Python only',  playwright: 'JS, Python, C#, Java' },
    { metric: 'Open source',               crawlingo: '✅ MIT',               scrapy: '✅ BSD',          playwright: '✅ Apache 2.0' },
  ],
};

function formatCell(val: string) {
  if (val.startsWith('✅')) {
    const text = val.replace('✅', '').trim();
    return (
      <span className="inline-flex items-center gap-1 justify-center text-emerald-500 font-semibold">
        <Check className="h-3.5 w-3.5 stroke-[3]" />
        {text && <span className="ml-1 text-[var(--foreground)]">{text}</span>}
      </span>
    );
  }
  if (val.startsWith('❌')) {
    const text = val.replace('❌', '').trim();
    return (
      <span className="inline-flex items-center gap-1 justify-center text-slate-500/30">
        <X className="h-3.5 w-3.5 stroke-[3]" />
        {text && <span className="ml-1 text-[var(--foreground-muted)]">{text}</span>}
      </span>
    );
  }
  return val;
}

function BarChart({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-[var(--border)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono text-[var(--foreground-muted)] w-16 text-right">{value.toLocaleString()} r/s</span>
    </div>
  );
}

export default function BenchmarksPage() {
  return (
    <>
      <Head>
        <title>Benchmarks — Crawlingo</title>
        <meta name="description" content="Crawlingo performance benchmarks: 3,500+ req/s throughput, 12ms p50 latency, 2.4MB memory footprint. Compared against Scrapy and Playwright." />
      </Head>

      <PageMeta
        title="Benchmarks"
        description="Performance measurements for Crawlingo's standard and stealthy fetch modes, auto-match scoring, streaming datasets, and selector types."
        readingTime="5 min"
        lastUpdated="July 2026"
        githubPath="benchmarks.md"
      />

      {/* Methodology */}
      <div className="mb-10 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground-muted)]">
        <strong className="text-[var(--foreground)]">Methodology:</strong> All benchmarks run on a Linux x86_64 VM (8 vCPU, 16 GB RAM). HTTP target is an internal echo server with ≤1ms response time to measure Crawlingo overhead. Auto-match benchmarks use synthetic DOM trees of varying size. Streaming benchmarks use a URL list pointing to the echo server.
      </div>

      {/* ── Throughput ── */}
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Request Throughput</h2>

      <div className="mb-4 space-y-3">
        <div>
          <div className="flex justify-between text-xs text-[var(--foreground-muted)] mb-1">
            <span>Standard (HTTP/2, 50 concurrent)</span>
            <span className="font-bold text-[var(--brand-orange)]">3,500 req/s</span>
          </div>
          <BarChart value={3500} max={3500} color="var(--brand-orange)" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-[var(--foreground-muted)] mb-1">
            <span>Stealthy (TLS fingerprint, 50 concurrent)</span>
            <span className="font-bold text-[var(--brand-indigo)]">1,800 req/s</span>
          </div>
          <BarChart value={1800} max={3500} color="var(--brand-indigo)" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-[var(--foreground-muted)] mb-1">
            <span>Scrapy (Python async, 50 concurrent)</span>
            <span className="font-bold text-[var(--foreground-subtle)]">~500 req/s</span>
          </div>
          <BarChart value={500} max={3500} color="var(--border-strong)" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-[var(--foreground-muted)] mb-1">
            <span>Playwright (browser-based)</span>
            <span className="font-bold text-[var(--foreground-subtle)]">~50 req/s</span>
          </div>
          <BarChart value={50} max={3500} color="var(--border)" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-10">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mode</th>
              <th>Throughput</th>
              <th>p50</th>
              <th>p95</th>
              <th>p99</th>
              <th>Memory</th>
            </tr>
          </thead>
          <tbody>
            {BENCH_DATA.throughput.map((r, i) => (
              <tr key={i}>
                <td className="font-medium">{r.mode}</td>
                <td className="font-mono font-bold" style={{ color: 'var(--brand-orange)' }}>{r.rps}</td>
                <td className="font-mono text-[var(--foreground-muted)]">{r.p50}</td>
                <td className="font-mono text-[var(--foreground-muted)]">{r.p95}</td>
                <td className="font-mono text-[var(--foreground-muted)]">{r.p99}</td>
                <td className="font-mono text-[var(--foreground-muted)]">{r.mem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Selector speeds ── */}
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Selector Performance</h2>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-10">
        <table className="data-table">
          <thead>
            <tr>
              <th>Selector Type</th>
              <th>Throughput</th>
            </tr>
          </thead>
          <tbody>
            {BENCH_DATA.selectors.map((r, i) => (
              <tr key={i}>
                <td className="font-medium">{r.type}</td>
                <td className="font-mono font-semibold" style={{ color: 'var(--brand-orange)' }}>{r.speed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Auto-match ── */}
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Auto-Match Scoring Time</h2>
      <p className="text-[var(--foreground-muted)] mb-4 text-sm">Time to score all candidate nodes when a selector fails (Jaro-Winkler + Jaccard via Rayon parallel scoring).</p>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-10">
        <table className="data-table">
          <thead>
            <tr>
              <th>DOM Size</th>
              <th>Scoring Time</th>
            </tr>
          </thead>
          <tbody>
            {BENCH_DATA.automatch.map((r, i) => (
              <tr key={i}>
                <td className="font-medium">{r.nodes}</td>
                <td className="font-mono font-semibold" style={{ color: 'var(--brand-orange)' }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Streaming ── */}
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Streaming Dataset Memory Usage</h2>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-10">
        <table className="data-table">
          <thead>
            <tr>
              <th>URL Count</th>
              <th>Peak Memory</th>
              <th>Elapsed Time</th>
            </tr>
          </thead>
          <tbody>
            {BENCH_DATA.streaming.map((r, i) => (
              <tr key={i}>
                <td className="font-medium">{r.urls}</td>
                <td className="font-mono text-[var(--brand-indigo)]">{r.mem}</td>
                <td className="font-mono text-[var(--foreground-muted)]">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Comparison table ── */}
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Full Comparison Table</h2>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-10">
        <table className="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th style={{ color: 'var(--brand-orange)' }}>Crawlingo</th>
              <th>Scrapy</th>
              <th>Playwright</th>
            </tr>
          </thead>
          <tbody>
            {BENCH_DATA.comparison.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td className="font-medium">{r.metric}</td>
                <td className="font-semibold" style={{ color: 'var(--brand-orange)' }}>{formatCell(r.crawlingo)}</td>
                <td className="text-[var(--foreground-muted)]">{formatCell(r.scrapy)}</td>
                <td className="text-[var(--foreground-muted)]">{formatCell(r.playwright)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocNav
        prev={{ label: 'Architecture', href: '/architecture' }}
        next={{ label: 'Python SDK', href: '/sdk/python' }}
      />
    </>
  );
}
