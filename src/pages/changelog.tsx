import React from 'react';
import Head from 'next/head';
import { PageMeta, DocNav } from '@/components/feature-card';

const CHANGELOG = [
  {
    version: 'v1.0.0-beta.1',
    date: 'July 15, 2026',
    tag: 'Latest',
    tagColor: 'var(--color-success)',
    summary: 'High-performance optimizations, FFI binding completion, and sitemap decompression.',
    added: [
      'FFI Pagination Config: Python and JS client classes supporting NextLink, PageNumber, and UrlPattern selectors',
      'FFI Dataset Schema validation: dynamic field constraints check (required status and type assertions)',
      'Sitemap Gzip support: auto-decompresses gzipped sitemaps (.xml.gz) via flate2',
      'Monotonic B-Tree PersistentFrontier layout optimization ($O(1)$ writes, $O(\log n)$ LIFO reads)',
      'Non-blocking FingerprintStore writes (asynchronous flushes on session teardown)',
      'Batched Parquet serialization stream (default chunk size of 1000 records)',
      'Pre-compiled regex pattern queries in pagination to avoid hot-spot compilations',
    ],
    fixed: [
      'Resolved Python wrapper build_async coroutine compatibility running FFI tasks on event loop executor',
    ],
    changed: [],
    breaking: [
      'Removed individual rate_limit_rps field from FetchRequest (rate limiting moved to Session/FetchManager level)',
      'Converted ExtractionRule to a type alias for DatasetField to remove layer duplication',
    ],
  },
  {
    version: 'v0.1.0',
    date: 'July 12, 2026',
    tag: 'Stable',
    tagColor: 'var(--brand-teal)',
    summary: 'Initial public release of Crawlingo.',
    added: [
      'Core Rust engine with HTTP/2 standard and stealthy fetcher tiers',
      'Python SDK (PyO3) — Page, Session, Dataset, Crawl, Watch',
      'Node.js SDK (napi-rs) — full TypeScript typings, auto-generated .d.ts',
      'Rust native crate API',
      'CSS, XPath, Regex, Text Anchor, After/Before Text selectors',
      'Self-healing auto-match with DOM fingerprinting (Jaro-Winkler + Jaccard)',
      'Stealth TLS with Chrome, Firefox, Safari browser profiles',
      'SIMD-accelerated text anchor search via memchr',
      'Proxy rotation: static pool, round-robin, remote provider',
      'Per-host rate limiting via governor (token bucket)',
      'Reactive Watch monitors with typed callbacks and webhook support',
      'Dataset streaming with bounded channels (constant memory)',
      'Export to JSON, CSV, Parquet',
      'Middleware stack: MetricsLayer, CachingLayer, AuthLayer (Basic, Bearer, API Key, OAuth2)',
      'TOML config + CRAWLINGO_* env var support',
      'Lock-free metrics counters (DashMap + atomics)',
      'BFS Crawl with depth, concurrency, robots.txt, domain allowlist',
      'Pre-built wheels: Linux x86_64/aarch64, macOS x86_64/arm64, Windows AMD64',
    ],
    fixed: [],
    changed: [],
    breaking: [],
  },
  {
    version: 'v0.0.1',
    date: 'June 1, 2026',
    tag: 'Alpha',
    tagColor: 'var(--brand-indigo)',
    summary: 'Internal alpha — Rust core proof of concept.',
    added: [
      'Rust core with basic HTTP/2 fetcher',
      'HTML parser (html5ever)',
      'CSS selector support',
      'PyO3 Python bindings prototype',
    ],
    fixed: [],
    changed: [],
    breaking: [],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <Head>
        <title>Changelog — Crawlingo</title>
        <meta name="description" content="Crawlingo release history, version notes, breaking changes, and what's new in each release." />
      </Head>

      <PageMeta
        title="Changelog"
        description="Release notes for every version of Crawlingo. All notable changes, additions, bug fixes, and breaking changes."
        readingTime="3 min"
        lastUpdated="July 2026"
        githubPath="CHANGELOG.md"
      />

      <p className="text-[var(--foreground-muted)] mb-10">
        All notable changes to Crawlingo are documented here. Crawlingo follows{' '}
        <a href="https://semver.org" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-orange)]">Semantic Versioning</a>.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]" />

        <div className="space-y-12">
          {CHANGELOG.map((release) => (
            <div key={release.version} className="relative pl-12">
              {/* Timeline dot */}
              <div
                className="absolute left-0 top-1 h-8 w-8 rounded-full border-2 border-[var(--background)] flex items-center justify-center"
                style={{ background: release.tagColor }}
              />

              {/* Header */}
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2
                  className="text-xl font-bold text-[var(--foreground)]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {release.version}
                </h2>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                  style={{ background: release.tagColor }}
                >
                  {release.tag}
                </span>
                <span className="text-sm text-[var(--foreground-subtle)]">{release.date}</span>
                <a
                  href={`https://github.com/Vamshavardhan50/crawlingo/releases/tag/${release.version}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--brand-orange)] hover:underline ml-auto"
                >
                  View on GitHub →
                </a>
              </div>

              <p className="text-[var(--foreground-muted)] text-sm mb-6">{release.summary}</p>

              {release.added.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-success)]">Added</span>
                  </div>
                  <ul className="space-y-1.5 pl-4">
                    {release.added.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[var(--foreground-muted)]">
                        <span className="text-[var(--color-success)] flex-shrink-0 mt-0.5">+</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.breaking.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-error)]" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-error)]">Breaking</span>
                  </div>
                  <ul className="space-y-1.5 pl-4">
                    {release.breaking.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[var(--foreground-muted)]">
                        <span className="text-[var(--color-error)] flex-shrink-0 mt-0.5">!</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <DocNav
        prev={{ label: 'Roadmap', href: '/roadmap' }}
        next={{ label: 'Quick Start', href: '/quick-start' }}
      />
    </>
  );
}
