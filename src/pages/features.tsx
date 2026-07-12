import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, FeatureCard, Callout, DocNav } from '@/components/feature-card';
import { Shield, Globe, Cpu, Activity, Database, FileText, Search, Layers, GitBranch, Webhook, Clock } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <>
      <Head>
        <title>Features — Crawlingo</title>
        <meta name="description" content="Explore Crawlingo's self-healing selectors, stealth TLS browsing, SIMD-accelerated text anchors, change monitoring, and dataset export features." />
      </Head>

      <PageMeta
        title="Features"
        description="A complete overview of Crawlingo's capabilities — from self-healing DOM selectors to AI-ready dataset export."
        readingTime="8 min"
        lastUpdated="July 2026"
        githubPath="features.md"
      />

      {/* ══════════════════════════════════════════════════
          SELF-HEALING DOM FINGERPRINTING
          ══════════════════════════════════════════════════ */}
      <section className="mb-16" id="self-healing">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--brand-orange)]/10 border border-[var(--brand-orange)]/20">
          <Shield className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
          <span className="text-xs font-semibold text-[var(--brand-orange)]">Self-Healing</span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
          Self-Healing DOM Fingerprinting
        </h2>
        <p className="text-[var(--foreground-muted)] mb-8 leading-relaxed">
          When websites redesign their HTML — renaming CSS classes, restructuring divs, renumbering IDs — traditional scrapers break silently.
          Crawlingo solves this by caching <strong className="text-[var(--foreground)]">element layout fingerprints</strong> and using similarity matching to self-heal drifted selectors <em>on the fly</em>, without any code changes from you.
        </p>

        {/* How it works — steps */}
        <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
            <h3 className="text-sm font-semibold text-[var(--foreground)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Auto-Match Lifecycle</h3>
          </div>
          <div className="p-5 space-y-4">
            {[
              { step: 1, color: '#6366F1', title: 'First match succeeds', desc: 'Crawlingo evaluates your selector (e.g. button#submit.btn-primary), caches a fingerprint: tag name, class set, id, attributes, text content, parent tag, sibling tags, depth, child index.' },
              { step: 2, color: '#8B5CF6', title: 'Subsequent visits update cache', desc: 'On each successful match, the fingerprint is updated to account for minor layout drift — keeping the snapshot fresh.' },
              { step: 3, color: '#FF6B35', title: 'Selector fails after redesign', desc: 'The Rust engine intercepts the mismatch. It loads the current DOM and isolates candidate nodes within the same parent coordinates as the cached element.' },
              { step: 4, color: '#10B981', title: 'Similarity scoring & rebind', desc: 'All candidates are scored in parallel (Rayon) using Jaro-Winkler + Jaccard. The best match above 50% confidence is automatically bound and the cache is updated. Your code receives the correct element.' },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold" style={{ background: s.color }}>
                  {s.step}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--foreground)] mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</div>
                  <div className="text-sm text-[var(--foreground-muted)] leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CodeBlock
          language="python"
          fileName="auto_match.py"
          code={`from crawlingo import Session, Page

with Session() as s:
    s.auto_match(True)

    # First scrape: button#submit found and fingerprinted
    page = s.page("https://example.com/checkout")
    btn = page.css("button#submit").text()   # "Place Order"

    # [Website redesigns: button becomes div.cta-button]
    # Second scrape: auto_match silently finds the new element
    page2 = s.page("https://example.com/checkout")
    btn2 = page2.css("button#submit").text()  # Still works!

    # Fine-tune fingerprint weights
    s.auto_match_weights(
        tag=1.0, class_name=0.8, id=0.6,
        attributes=0.4, parent_tag=0.5, depth=0.1
    )`}
          showLineNumbers
        />
      </section>

      {/* ══════════════════════════════════════════════════
          STEALTH BROWSING
          ══════════════════════════════════════════════════ */}
      <section className="mb-16" id="stealth">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--brand-indigo)]/10 border border-[var(--brand-indigo)]/20">
          <Globe className="h-3.5 w-3.5 text-[var(--brand-indigo)]" />
          <span className="text-xs font-semibold text-[var(--brand-indigo)]">Stealth Browsing</span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
          Stealth Browser Impersonation
        </h2>
        <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">
          Crawlingo compiles a raw HTTP/2 client inside the Rust core that rotates <strong className="text-[var(--foreground)]">JA3/TLS handshake fingerprints</strong>, user-agent headers, and request timing gaps — bypassing Cloudflare Turnstile and similar bot detection systems without a headless browser.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {[
            { icon: <Globe className="h-4 w-4" />, title: 'TLS Fingerprint Rotation', desc: 'JA3 signature emulates real Chrome, Firefox, and Safari TLS handshakes.' },
            { icon: <GitBranch className="h-4 w-4" />, title: 'Multi-Profile Support', desc: 'Switch between Chrome, Firefox, and Safari browser identity profiles per request.' },
            { icon: <Clock className="h-4 w-4" />, title: 'Timing Randomization', desc: 'Request gaps and header ordering randomized to avoid detection patterns.' },
          ].map(c => (
            <div key={c.title} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-indigo)]/10 text-[var(--brand-indigo)] mb-3">
                {c.icon}
              </div>
              <div className="text-sm font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{c.title}</div>
              <div className="text-xs text-[var(--foreground-muted)] leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>

        <CodeBlock
          language="python"
          fileName="stealth.py"
          code={`from crawlingo import Session, Page

with Session() as s:
    # Enable stealth mode
    s.fetcher_tier("stealthy")

    # Choose browser identity
    s.browser_profile("chrome")   # "chrome" | "firefox" | "safari"

    # Optional: custom headers on top
    s.headers({
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
    })

    # Now fetches look like a real browser
    page = s.page("https://cloudflare-protected-site.com")
    print(page.status)  # 200 instead of 403`}
          showLineNumbers
        />

        <Callout type="warning" title="Ethical use">
          Always respect a website's <code>robots.txt</code>, Terms of Service, and applicable laws.
          Crawlingo's stealth features are intended for legitimate data collection, research, and testing.
        </Callout>
      </section>

      {/* ══════════════════════════════════════════════════
          SIMD TEXT ANCHORS
          ══════════════════════════════════════════════════ */}
      <section className="mb-16" id="text-anchors">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--brand-violet)]/10 border border-[var(--brand-violet)]/20">
          <Cpu className="h-3.5 w-3.5 text-[var(--brand-violet)]" />
          <span className="text-xs font-semibold text-[var(--brand-violet)]">SIMD Text Anchors</span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
          SIMD-Accelerated Text Anchors
        </h2>
        <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">
          Many websites lack meaningful CSS classes or IDs. Text anchor selectors let you locate elements by their visible content — using <code>memchr</code> SIMD instructions for 2.1M ops/s throughput, making it faster than CSS selectors on large DOMs.
        </p>

        <div className="mb-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]">
            <span className="text-xs font-semibold text-[var(--foreground-muted)]">Selector Type Comparison</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>API</th>
                <th>Speed</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'CSS',         api: 'page.css("h1")',             speed: '850K/s',  use: 'Standard element targeting' },
                { type: 'XPath',       api: 'page.xpath("//p")',           speed: '310K/s',  use: 'Complex DOM traversal' },
                { type: 'Regex',       api: 'page.regex(r"\\$[\\d.]+")',   speed: '1.2M/s',  use: 'Pattern-based extraction' },
                { type: 'Text Anchor', api: 'page.find_text("Price:")',    speed: '2.1M/s',  use: 'Visible content lookup' },
                { type: 'After/Before',api: 'page.after_text("Price:")',   speed: '1.8M/s',  use: 'Table/sibling extraction' },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="font-medium">{row.type}</td>
                  <td><code className="text-xs">{row.api}</code></td>
                  <td className="font-mono text-[var(--brand-orange)]">{row.speed}</td>
                  <td className="text-[var(--foreground-muted)]">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock
          language="python"
          fileName="text_anchors.py"
          code={`from crawlingo import Page

page = Page("https://example.com/product")

# Find element by exact visible text content
title_el = page.find_text("Product Title")

# Extract sibling AFTER a label text — perfect for price tables
price = page.after_text("Price:").first().text()
# → "€49.99"

# Extract sibling BEFORE a unit label
amount = page.before_text("USD").first().text()
# → "1,234.56"

# Works great for extracting data tables without CSS classes
rows = page.after_text("Processor:").all()
for row in rows:
    print(row.text())`}
          showLineNumbers
        />
      </section>

      {/* ══════════════════════════════════════════════════
          CHANGE MONITORING
          ══════════════════════════════════════════════════ */}
      <section className="mb-16" id="change-monitoring">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--color-success)]/10 border border-[var(--color-success)]/20">
          <Activity className="h-3.5 w-3.5 text-[var(--color-success)]" />
          <span className="text-xs font-semibold text-[var(--color-success)]">Change Monitoring</span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
          Reactive Watch Monitors
        </h2>
        <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">
          <code>Watch</code> polls target DOM nodes on configurable intervals, instantly publishing typed callbacks or webhooks when content, prices, stock status, or element presence changes.
        </p>

        <CodeBlock
          language="python"
          fileName="watch.py"
          code={`from crawlingo import Watch
import requests

def alert(event):
    msg = f"[{event.field}] {event.old_value} → {event.new_value} ({event.percentage_change:.1f}%)"
    requests.post("https://hooks.slack.com/T.../...", json={"text": msg})

w = (
    Watch("https://shop.example.com/product/42")
    .field("price", ".price",      extraction_type="price")
    .field("stock", ".stock-badge")
    .interval(300)                   # every 5 minutes
    .on_price_change(alert)
    .on_stock_change(lambda e: print(f"Stock: {e.old_value} → {e.new_value}"))
    .on_element_added(lambda e: print(f"New element appeared: {e.new_value}"))
    .on_element_removed(lambda e: print(f"Element removed: {e.old_value}"))
)

# Run in background thread
w.run(detach=True)

# Or block the main thread
# w.run()

# Stop monitoring
# w.stop()`}
          showLineNumbers
        />
      </section>

      {/* ══════════════════════════════════════════════════
          DATASET EXPORT
          ══════════════════════════════════════════════════ */}
      <section className="mb-16" id="datasets">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--brand-teal)]/10 border border-[var(--brand-teal)]/20">
          <Database className="h-3.5 w-3.5 text-[var(--brand-teal)]" />
          <span className="text-xs font-semibold text-[var(--brand-teal)]">Dataset Export</span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
          Structured Dataset Export
        </h2>
        <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">
          The <code>Dataset</code> builder extracts multiple typed fields in one pass and exports them directly to JSON, CSV, or Parquet. Streaming mode processes millions of URLs at constant memory by using bounded async channels for backpressure.
        </p>

        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          {[
            { format: 'JSON',    method: '.to_json() / .to_json_file()', use: 'Web APIs, general analysis' },
            { format: 'CSV',     method: '.to_csv() / .to_csv_file()',   use: 'Spreadsheets, data import' },
            { format: 'Parquet', method: '.to_parquet("file.parquet")',   use: 'Data warehouses, Spark, BigQuery' },
          ].map(f => (
            <div key={f.format} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div className="text-sm font-bold text-[var(--brand-teal)] mb-1">{f.format}</div>
              <code className="text-xs text-[var(--foreground-muted)] block mb-2">{f.method}</code>
              <div className="text-xs text-[var(--foreground-subtle)]">{f.use}</div>
            </div>
          ))}
        </div>

        <CodeBlock
          language="python"
          fileName="dataset_export.py"
          code={`from crawlingo import Dataset

# Single-page extraction
ds = (
    Dataset("https://example.com/products")
    .field("title",    "h1")
    .field("price",    ".price",        extraction_type="price")
    .field("date",     "time.posted",   extraction_type="datetime")
    .field("url",      "",              extraction_type="url")
    .field("email",    r"[\\w.]+@[\\w]+\\.[\\w]+",
           selector_type="regex", extraction_type="datalink_email")
    .build()
)

print(ds.to_dict())
ds.to_json("data.json")
ds.to_csv("data.csv")
ds.to_parquet("data.parquet")

# ─── Streaming large URL lists ────────────────────────────────
urls = ["https://example.com/item/" + str(i) for i in range(50_000)]

for record in Dataset(urls).field("title", "h1").field("price", ".price").stream():
    # Processes at constant memory via bounded async channels
    process(record.data)`}
          showLineNumbers
        />
      </section>

      <DocNav
        prev={{ label: 'Quick Start', href: '/quick-start' }}
        next={{ label: 'Architecture', href: '/architecture' }}
      />
    </>
  );
}
