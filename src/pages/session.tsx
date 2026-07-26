import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, TabCodeBlock, Callout, DocNav } from '@/components/feature-card';

export default function SessionApiPage() {
  return (
    <>
      <Head>
        <title>Session API — Crawlingo</title>
        <meta name="description" content="Detailed Session API documentation for Crawlingo. Shared headers, proxies, rate limits, timeouts, and stealth profiles." />
      </Head>

      <PageMeta
        title="Session API"
        description="The Session object manages shared configuration across multiple Page, Dataset, Crawl, and Watch operations. It centralizes headers, cookies, proxies, and rate limits."
        readingTime="5 min"
        lastUpdated="July 2026"
        githubPath="docs/session.md"
      />

      {/* ── Python ── */}
      <h2 id="python" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Python Usage
      </h2>
      <CodeBlock
        language="python"
        fileName="session.py"
        code={`from crawlingo import Session, Page, Dataset

session = Session()
session.headers({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    "Accept-Language": "en-US,en;q=0.9"
})
session.cookies({"session_id": "abc123"})
session.proxy("http://proxy.example.com:8080")
session.rate_limit(5.0)            # 5 requests/second per host
session.timeout(30)                # 30 second timeout
session.auto_match(True)           # Enable self-healing selectors
session.fetcher_tier("stealthy")   # "standard" or "stealthy"
session.browser_profile("chrome")  # "chrome", "firefox", "safari"

# Use across multiple operations
page = Page("https://example.com", session=session)
dataset = Dataset("https://shop.example.com", session=session)`}
        showLineNumbers
      />

      {/* ── Node.js ── */}
      <h2 id="nodejs" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Node.js Usage
      </h2>
      <CodeBlock
        language="typescript"
        fileName="session.ts"
        code={`import { Session, Page } from 'crawlingo';

const session = new Session();
session.headers({ 'User-Agent': 'MyBot/1.0' });
session.rateLimit(5.0);
session.timeout(30);
session.autoMatch(true);

const page = await Page.create('https://example.com', session);`}
        showLineNumbers
      />

      {/* ── Session Methods ── */}
      <h2 id="session-methods" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Session Methods
      </h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm text-[var(--foreground-muted)] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--foreground)] font-semibold">
              <th className="py-2 px-3">Method</th>
              <th className="py-2 px-3">Parameters</th>
              <th className="py-2 px-3">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">headers(dict)</td>
              <td className="py-2 px-3">Header key-value pairs</td>
              <td className="py-2 px-3">Set default HTTP request headers</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">cookies(dict)</td>
              <td className="py-2 px-3">Cookie key-value pairs</td>
              <td className="py-2 px-3">Set default cookies for requests</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">proxy(url)</td>
              <td className="py-2 px-3">Proxy URL string</td>
              <td className="py-2 px-3">Set single HTTP/HTTPS proxy</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">proxy_pool(list)</td>
              <td className="py-2 px-3">List of proxy URLs</td>
              <td className="py-2 px-3">Enable round-robin proxy pool rotation</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">rate_limit(rps)</td>
              <td className="py-2 px-3">Requests per second (float)</td>
              <td className="py-2 px-3">Per-host rate limiting (0 = disabled)</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">timeout(secs)</td>
              <td className="py-2 px-3">Seconds (int)</td>
              <td className="py-2 px-3">Set request timeout</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">auto_match(bool)</td>
              <td className="py-2 px-3">Boolean</td>
              <td className="py-2 px-3">Enable self-healing selector recovery</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">fetcher_tier(tier)</td>
              <td className="py-2 px-3"><code>"standard"</code> | <code>"stealthy"</code></td>
              <td className="py-2 px-3">TLS fingerprint emulation level</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Precedence ── */}
      <h2 id="configuration-precedence" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Configuration Precedence
      </h2>
      <p className="text-[var(--foreground-muted)] mb-4">
        Settings are resolved in the following priority order (later steps override earlier ones):
      </p>
      <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--foreground-muted)] mb-6">
        <li>TOML configuration file (<code>crawlingo.toml</code>)</li>
        <li>Environment variables (<code>CRAWLINGO_*</code>)</li>
        <li>Session constructor options</li>
        <li>Session method calls (e.g. <code>session.rate_limit(5.0)</code>)</li>
        <li>Per-request explicit parameter overrides</li>
      </ol>

      <DocNav
        prev={{ label: 'Page API', href: '/page' }}
        next={{ label: 'Dataset API', href: '/dataset' }}
      />
    </>
  );
}
