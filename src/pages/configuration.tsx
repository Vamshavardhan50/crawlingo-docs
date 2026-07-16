import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, Callout, DocNav } from '@/components/feature-card';

const CONFIG_FIELDS = [
  { name: 'headers', type: 'Map<String, String>', default: '{}', desc: 'Default HTTP headers for all outgoing requests.' },
  { name: 'proxy', type: 'String', default: 'None', desc: 'Single proxy server URL (e.g., http://127.0.0.1:8080).' },
  { name: 'proxy_pool', type: 'List<String>', default: '[]', desc: 'Round-robin proxy rotation pool list.' },
  { name: 'proxy_provider_url', type: 'String', default: 'None', desc: 'HTTP endpoint returning newline-separated proxy lists to dynamically reload.' },
  { name: 'rate_limit_rps', type: 'Float', default: '0.0', desc: 'Requests-per-second limit per host (0.0 = unlimited).' },
  { name: 'auto_match', type: 'Boolean', default: 'false', desc: 'Enable self-healing selector fingerprint repair (auto-matching).' },
  { name: 'timeout_seconds', type: 'Integer', default: '30', desc: 'Request connection, handshake, and read timeout in seconds.' },
  { name: 'fingerprint_path', type: 'String', default: 'None', desc: 'Path to storage directory for sled ACID self-healing fingerprints database.' },
  { name: 'fetcher_tier', type: 'String', default: '"standard"', desc: '"standard" for raw high-speed HTTP/2; "stealthy" to activate TLS fingerprint rotation.' },
  { name: 'browser_profile', type: 'String', default: '"chrome"', desc: 'Stealth client signature profile: "chrome", "firefox", or "safari".' },
];

const POOL_FIELDS = [
  { name: 'pool.max_idle_per_host', env: 'CRAWLINGO_POOL_MAX_IDLE_PER_HOST', type: 'Integer', default: '32', desc: 'Maximum idle connections retained per host.' },
  { name: 'pool.max_clients', env: 'CRAWLINGO_POOL_MAX_CLIENTS', type: 'Integer', default: '1024', desc: 'Hard limit on concurrent in-flight clients.' },
  { name: 'pool.idle_timeout_secs', env: 'CRAWLINGO_POOL_IDLE_TIMEOUT_SECS', type: 'Integer', default: '90', desc: 'Duration in seconds after which idle connections are closed.' },
];

const RETRY_FIELDS = [
  { name: 'retry.base_delay_ms', env: 'CRAWLINGO_RETRY_BASE_DELAY_MS', type: 'Integer', default: '100', desc: 'Initial delay in milliseconds for backoff.' },
  { name: 'retry.max_delay_ms', env: 'CRAWLINGO_RETRY_MAX_DELAY_MS', type: 'Integer', default: '10000', desc: 'Maximum cap on retry backoff delays.' },
  { name: 'retry.multiplier', env: 'CRAWLINGO_RETRY_MULTIPLIER', type: 'Float', default: '2.0', desc: 'Exponential backoff rate multiplier.' },
];

export default function ConfigurationPage() {
  return (
    <>
      <Head>
        <title>Configuration & CLI — Crawlingo</title>
        <meta name="description" content="Complete configuration guide for Crawlingo. Custom settings, pool variables, retry parameters, and environment overrides." />
      </Head>

      <PageMeta
        title="Configuration & CLI"
        description="Configure Crawlingo sessions via JSON/TOML files, CRAWLINGO_* environment variables, or launch pre-configured CLI sessions."
        readingTime="6 min"
        lastUpdated="July 2026"
        githubPath="pages/configuration.tsx"
      />

      {/* ── Precedence ── */}
      <h2 className="text-2xl font-bold mb-4 mt-8 animate-slide-up" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Configuration Precedence</h2>
      <p className="text-[var(--foreground-muted)] mb-6 text-sm">
        Crawlingo session configuration follows a strict overlay hierarchy. Values loaded from higher layers override those below:
      </p>
      <div className="flex flex-col gap-3 mb-8">
        {[
          { step: 1, name: 'Default Engine Config', desc: 'Built-in hardcoded Rust defaults.' },
          { step: 2, name: 'File Config (TOML / JSON)', desc: 'Parsed at initialization via crawlingo.toml or crawlingo.json.' },
          { step: 3, name: 'Environment Variables', desc: 'Process-wide CRAWLINGO_* overrides.' },
          { step: 4, name: 'Runtime Setters', desc: 'Explicit method calls (e.g. s.rate_limit(5)) take final precedence.' },
        ].map(item => (
          <div key={item.step} className="flex gap-4 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] card-hover animate-slide-up">
            <span className="step-number text-xs w-6 h-6">{item.step}</span>
            <div>
              <div className="text-sm font-semibold text-[var(--foreground)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{item.name}</div>
              <div className="text-xs text-[var(--foreground-subtle)]">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── File Config ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Configuration Specs</h2>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8 bg-[var(--card)]">
        <table className="data-table">
          <thead>
            <tr>
              <th>Field Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {CONFIG_FIELDS.map((f, i) => (
              <tr key={f.name} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{f.name}</code></td>
                <td><span className="text-xs font-mono text-[var(--brand-indigo)]">{f.type}</span></td>
                <td><code className="text-xs">{f.default}</code></td>
                <td className="text-xs text-[var(--foreground-muted)]">{f.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pool and Retry Specs ── */}
      <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Connection Pool Settings</h3>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8 bg-[var(--card)]">
        <table className="data-table">
          <thead>
            <tr>
              <th>Config Field</th>
              <th>Environment Variable</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {POOL_FIELDS.map((f, i) => (
              <tr key={f.name} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{f.name}</code></td>
                <td><code className="text-xs text-[var(--brand-orange)]">{f.env}</code></td>
                <td><code className="text-xs">{f.default}</code></td>
                <td className="text-xs text-[var(--foreground-muted)]">{f.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Retry Policy Settings</h3>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8 bg-[var(--card)]">
        <table className="data-table">
          <thead>
            <tr>
              <th>Config Field</th>
              <th>Environment Variable</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {RETRY_FIELDS.map((f, i) => (
              <tr key={f.name} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{f.name}</code></td>
                <td><code className="text-xs text-[var(--brand-orange)]">{f.env}</code></td>
                <td><code className="text-xs">{f.default}</code></td>
                <td className="text-xs text-[var(--foreground-muted)]">{f.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Example Files ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Example Config Files</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-[var(--foreground-subtle)] block mb-2">crawlingo.toml</span>
          <CodeBlock
            language="toml"
            code={`proxy = "http://myproxy.com:8000"
rate_limit_rps = 3.5
auto_match = true
timeout_seconds = 45
fetcher_tier = "stealthy"
browser_profile = "firefox"

[pool]
max_idle_per_host = 16
idle_timeout_secs = 60

[retry]
base_delay_ms = 250
multiplier = 1.5`}
            showLineNumbers={false}
          />
        </div>
        <div>
          <span className="text-xs font-semibold text-[var(--foreground-subtle)] block mb-2">crawlingo.json</span>
          <CodeBlock
            language="json"
            code={`{
  "proxy": "http://myproxy.com:8000",
  "rate_limit_rps": 3.5,
  "auto_match": true,
  "timeout_seconds": 45,
  "fetcher_tier": "stealthy",
  "pool": {
    "max_idle_per_host": 16
  },
  "retry": {
    "base_delay_ms": 250
  }
}`}
            showLineNumbers={false}
          />
        </div>
      </div>

      {/* ── CLI Usage ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>CLI Interface</h2>
      <p className="text-[var(--foreground-muted)] mb-4 text-sm">
        The Python SDK comes with a preconfigured command-line interface. Start standard scrapers, test query rules, or launch local agent server controllers instantly.
      </p>

      <div className="space-y-6 mb-8">
        <div>
          <span className="text-xs font-semibold text-[var(--brand-orange)] block mb-2">1. Quick Selector Extraction</span>
          <CodeBlock
            language="bash"
            code={`# Extract all H1 text content
crawlingo extract https://news.ycombinator.com --css "td.title a"

# Use XPath and output as a clean JSON map
crawlingo extract https://example.com --xpath "//h1" --json

# Run with self-healing auto-matching enabled
crawlingo extract https://shop.com --css "button.add-to-cart" --auto-match`}
            showLineNumbers={false}
          />
        </div>

        <div>
          <span className="text-xs font-semibold text-[var(--brand-orange)] block mb-2">2. Preloaded REPL Shell</span>
          <CodeBlock
            language="bash"
            code={`# Spin up Python REPL with Crawlingo Page/Session/Dataset classes pre-imported
crawlingo shell

# Fetch a page at load and place it inside the context as "page"
crawlingo shell https://example.com`}
            showLineNumbers={false}
          />
        </div>

        <div>
          <span className="text-xs font-semibold text-[var(--brand-orange)] block mb-2">3. Model Context Protocol Server</span>
          <CodeBlock
            language="bash"
            code={`# Start the local HTTP/SSE server for AI Agent integration
crawlingo mcp --host 127.0.0.1 --port 8000`}
            showLineNumbers={false}
          />
        </div>
      </div>

      <Callout type="tip" title="Pre-built Matched Binaries">
        If running inside server environments or containers, environment variables automatically take precedence over configurations loaded from TOML files, making it easy to configure proxies via K8s secrets.
      </Callout>

      <DocNav
        prev={{ label: 'TypeScript Types', href: '/sdk/nodejs' }}
        next={{ label: 'API Tools & MCP', href: '/tools/fetch-page' }}
      />
    </>
  );
}
