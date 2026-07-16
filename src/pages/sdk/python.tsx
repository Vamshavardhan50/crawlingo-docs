import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, Callout, DocNav } from '@/components/feature-card';

const SESSION_METHODS = [
  { method: 'Session() / Session.from_config(path)', returns: 'Session', desc: 'Create from defaults or TOML/env config' },
  { method: '.headers(dict)', returns: 'Self', desc: 'Default HTTP headers for all requests' },
  { method: '.cookies(dict)', returns: 'Self', desc: 'Default cookies for all requests' },
  { method: '.proxy(str)', returns: 'Self', desc: 'Single proxy URL' },
  { method: '.proxy_pool(list)', returns: 'Self', desc: 'Round-robin proxy rotation list' },
  { method: '.proxy_provider(str)', returns: 'Self', desc: 'Remote proxy list endpoint URL' },
  { method: '.rate_limit(float)', returns: 'Self', desc: 'Per-host req/s (0.0 = unlimited)' },
  { method: '.auto_match(bool)', returns: 'Self', desc: 'Enable self-healing selector repair' },
  { method: '.auto_match_weights(*floats)', returns: 'Self', desc: 'Fingerprint similarity weights (tag, class, id, attr, text, parent, pos, sibling, depth)' },
  { method: '.timeout(int)', returns: 'Self', desc: 'Request timeout in seconds' },
  { method: '.fetcher_tier(str)', returns: 'Self', desc: '"standard" or "stealthy"' },
  { method: '.browser_profile(str)', returns: 'Self', desc: '"chrome", "firefox", or "safari"' },
  { method: '.cache_enabled(bool)', returns: 'Self', desc: 'Enable response caching (Cache-Control, ETag aware)' },
  { method: '.retry_base_delay(int)', returns: 'Self', desc: 'Initial retry delay (ms)' },
  { method: '.retry_max_delay(int)', returns: 'Self', desc: 'Maximum retry delay (ms)' },
  { method: '.retry_multiplier(float)', returns: 'Self', desc: 'Exponential backoff factor' },
  { method: '.basic_auth(user, pass)', returns: 'Self', desc: 'HTTP Basic Auth' },
  { method: '.bearer_auth(token)', returns: 'Self', desc: 'Bearer token auth' },
  { method: '.header_auth(name, value)', returns: 'Self', desc: 'Custom auth header' },
  { method: '.api_key_auth(param, value)', returns: 'Self', desc: 'Query parameter API key' },
  { method: '.auth_oauth2(client_id, secret, token_url)', returns: 'Self', desc: 'OAuth2 with auto-refresh on 401' },
  { method: '.page(url)', returns: 'Page', desc: 'Fetch a page using this session' },
  { method: '.metrics()', returns: 'dict', desc: 'Lock-free metrics snapshot' },
  { method: '.clone()', returns: 'Session', desc: 'Clone session and its config' },
  { method: '.destroy()', returns: 'None', desc: 'Destroy session and release resources' },
];

const PAGE_METHODS = [
  { method: 'Page(url, session?)', returns: 'Page', desc: 'Fetch and parse URL (sync)' },
  { method: '.title()', returns: 'str', desc: '<title> text content' },
  { method: '.html()', returns: 'str', desc: 'Raw HTML string' },
  { method: '.markdown()', returns: 'str', desc: 'GitHub-flavored markdown' },
  { method: '.status', returns: 'int', desc: 'HTTP response status code' },
  { method: '.css(selector)', returns: 'ElementList', desc: 'CSS query — returns ElementList' },
  { method: '.xpath(expr)', returns: 'ElementList', desc: 'XPath query — returns ElementList' },
  { method: '.regex(pattern)', returns: 'MatchList', desc: 'Regex matches against all visible text' },
  { method: '.find_text(text)', returns: 'ElementList', desc: 'SIMD text anchor lookup' },
  { method: '.after_text(text)', returns: 'ElementList', desc: 'Sibling element after text anchor' },
  { method: '.before_text(text)', returns: 'ElementList', desc: 'Sibling element before text anchor' },
];

const ELEMENT_METHODS = [
  { method: '.text()', desc: 'Trimmed text content' },
  { method: '.html()', desc: 'Inner HTML' },
  { method: '.outer_html()', desc: 'Outer HTML including element tag' },
  { method: '.attr(name)', desc: 'Attribute value by name' },
  { method: '.tag()', desc: 'Element tag name (lowercase)' },
  { method: '.classes()', desc: 'List of CSS class names' },
  { method: '.parent()', desc: 'Parent element reference' },
  { method: '.children()', desc: 'Direct child elements' },
  { method: '.next_sibling()', desc: 'Next sibling element' },
  { method: '.prev_sibling()', desc: 'Previous sibling element' },
];

const DATASET_METHODS = [
  { method: 'Dataset(url, session?)', returns: 'Dataset', desc: 'Create for a URL' },
  { method: '.field(name, selector, selector_type?, transform?, default?)', returns: 'Self', desc: 'Add extraction field' },
  { method: '.with_schema(schema)', returns: 'Self', desc: 'Apply DatasetSchema validation' },
  { method: '.build()', returns: 'DatasetResult', desc: 'Execute extraction synchronously' },
  { method: '.build_async()', returns: 'Awaitable[DatasetResult]', desc: 'Execute extraction asynchronously' },
  { method: '.build_structured()', returns: 'list[dict]', desc: 'Extract multi-row table records from a page' },
  { method: '→ .to_dict()', returns: 'dict', desc: 'Fields as Python dict' },
  { method: '→ .to_json(path)', returns: 'None', desc: 'Write JSON file' },
  { method: '→ .to_csv(path)', returns: 'None', desc: 'Write CSV file' },
  { method: '→ .to_parquet(path)', returns: 'None', desc: 'Write Apache Parquet file' },
  { method: '→ .df()', returns: 'DataFrame', desc: 'Return as Pandas DataFrame' },
];

export default function PythonSDKPage() {
  return (
    <>
      <Head>
        <title>Python SDK — Crawlingo</title>
        <meta name="description" content="Complete Python SDK reference for Crawlingo — Session, Page, ElementList, Dataset, Crawl, Watch method tables with examples." />
      </Head>

      <PageMeta
        title="Python SDK"
        description="Complete method reference for the Crawlingo Python SDK (PyO3 bindings). Requires Python 3.8+."
        readingTime="12 min"
        lastUpdated="July 2026"
        githubPath="sdk/python.md"
      />

      <Callout type="info" title="Installation">
        <code>pip install crawlingo</code> — Python 3.8+. Pre-built wheels for Linux (x86_64, aarch64), macOS (Intel, Apple Silicon), Windows AMD64.
      </Callout>

      {/* ── Session ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Session</h2>
      <p className="text-[var(--foreground-muted)] mb-4 text-sm">
        Central config container. All operations bind to a <code>Session</code> and share its FetchManager, rate limiter, connection pool, middleware stack, and fingerprint store. Use as a context manager for automatic cleanup.
      </p>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8">
        <table className="data-table">
          <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
          <tbody>
            {SESSION_METHODS.map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{m.method}</code></td>
                <td className="font-mono text-xs text-[var(--brand-indigo)]">{m.returns}</td>
                <td className="text-sm text-[var(--foreground-muted)]">{m.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Page ── */}
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Page</h2>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8">
        <table className="data-table">
          <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
          <tbody>
            {PAGE_METHODS.map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{m.method}</code></td>
                <td className="font-mono text-xs text-[var(--brand-indigo)]">{m.returns}</td>
                <td className="text-sm text-[var(--foreground-muted)]">{m.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── ElementList ── */}
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>ElementList & ElementRef</h2>
      <CodeBlock
        language="python"
        fileName="element_ref.py"
        code={`els = page.css("div")
els.first()     # First match or None
els.last()      # Last match or None
els.at(i)       # i-th match
len(els)        # Count of matches
for e in els:   # Iterable
    pass

e = els.first()
e.text()            # Trimmed text content
e.html()            # Inner HTML
e.outer_html()      # Including element tag
e.attr("href")      # Attribute value
e.tag()             # Tag name (lowercase)
e.classes()         # ["class-a", "class-b"]
e.parent()          # Parent ElementRef
e.children()        # Direct children
e.next_sibling()    # Next sibling
e.prev_sibling()    # Previous sibling`}
        showLineNumbers
      />

      {/* ── Dataset ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Dataset</h2>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8">
        <table className="data-table">
          <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
          <tbody>
            {DATASET_METHODS.map((m, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{m.method}</code></td>
                <td className="font-mono text-xs text-[var(--brand-indigo)]">{m.returns}</td>
                <td className="text-sm text-[var(--foreground-muted)]">{m.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extraction types */}
      <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Extraction Types</h3>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8">
        <table className="data-table">
          <thead><tr><th>Type</th><th>Input → Output</th><th>Use Case</th></tr></thead>
          <tbody>
            {[
              { type: 'text',          io: '"  Hello  " → "Hello"',                    use: 'General text trimming (default)' },
              { type: 'price',         io: '"$1,234.56" → "1234.56"',                  use: 'Currency normalization' },
              { type: 'datetime',      io: '"Jan 15, 2024" → "2024-01-15"',            use: 'Date standardization to ISO 8601' },
              { type: 'url',           io: '"/path" → "https://base.com/path"',        use: 'Relative URL resolution' },
              { type: 'datalink_url',  io: '<a href="..."> → href value',              use: 'Link extraction' },
              { type: 'datalink_email',io: '"mailto:a@b.com" → "a@b.com"',            use: 'Email extraction' },
              { type: 'datalink_phone',io: '"tel:+1234" → "+1234"',                   use: 'Phone number extraction' },
            ].map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{r.type}</code></td>
                <td className="font-mono text-xs text-[var(--foreground-muted)]">{r.io}</td>
                <td className="text-sm text-[var(--foreground-muted)]">{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Schema and Pagination ── */}
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Schema & Pagination Config</h2>
      <p className="text-sm text-[var(--foreground-muted)] mb-4">
        New in v1.0.0-beta.1: Configure crawl pagination loops and validate extracted datasets against strict schemas.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="font-bold text-sm mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>PaginationConfig</div>
          <p className="text-xs text-[var(--foreground-muted)] mb-2">Exposes factory methods to configure crawl navigation:</p>
          <ul className="space-y-1.5 text-xs text-[var(--foreground-muted)]">
            <li><code>crawlingo.PaginationConfig.next_link(selector: str)</code></li>
            <li><code>crawlingo.PaginationConfig.page_number(template: str, start: int, max: int)</code></li>
            <li><code>crawlingo.PaginationConfig.url_pattern(regex: str, max_page: int)</code></li>
            <li>Configure on Crawl: <code>crawl.with_pagination(config)</code></li>
            <li>Resumable crawls: <code>Crawl.resumable(url, session, db_path)</code></li>
          </ul>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="font-bold text-sm mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>DatasetSchema</div>
          <p className="text-xs text-[var(--foreground-muted)] mb-2">Validate types and required fields on datasets:</p>
          <ul className="space-y-1.5 text-xs text-[var(--foreground-muted)]">
            <li><code>schema = crawlingo.DatasetSchema()</code></li>
            <li><code>schema.add_field(name: str, field_type: FieldType, required: bool)</code></li>
            <li><code>FieldType</code> options: <code>String</code>, <code>Integer</code>, <code>Float</code>, <code>Boolean</code></li>
            <li>Attach to Dataset: <code>dataset.with_schema(schema)</code></li>
            <li>Run async: <code>await dataset.build_async()</code></li>
          </ul>
        </div>
      </div>

      {/* ── Crawl & Watch summary ── */}
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Crawl & Watch</h2>
      <p className="text-sm text-[var(--foreground-muted)] mb-4">
        See the <a href="/quick-start" className="text-[var(--brand-orange)]">Quick Start</a> for full Crawl and Watch examples. Key builder methods:
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="font-bold text-sm mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Crawl</div>
          <ul className="space-y-1 text-xs text-[var(--foreground-muted)]">
            {['.follow(css)', '.limit(n)', '.depth(n)', '.concurrency(n)', '.delay(secs)', '.field(name, sel, selector_type?, default?)', '.with_pagination(config)', '.webhook(url)', '.build() → CrawlResults', 'CrawlResults.to_json(path)', 'CrawlResults.to_csv(path)', 'CrawlResults.to_parquet(path)'].map(m => (
              <li key={m}><code>{m}</code></li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="font-bold text-sm mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Watch</div>
          <ul className="space-y-1 text-xs text-[var(--foreground-muted)]">
            {['.field(name, sel, selector_type?, transform?, default?)', '.interval(secs)', '.on_change(fn)', '.on_price_change(fn)', '.on_stock_change(fn)', '.on_element_added(fn)', '.on_element_removed(fn)', '.run()  # blocking', '.run_async()  # awaitable', '.stop()'].map(m => (
              <li key={m}><code>{m}</code></li>
            ))}
          </ul>
        </div>
      </div>

      <DocNav
        prev={{ label: 'Benchmarks', href: '/benchmarks' }}
        next={{ label: 'Node.js SDK', href: '/sdk/nodejs' }}
      />
    </>
  );
}
