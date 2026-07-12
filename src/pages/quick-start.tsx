import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, TerminalBlock, StepCard, TabCodeBlock, Callout, DocNav } from '@/components/feature-card';

export default function QuickStartPage() {
  return (
    <>
      <Head>
        <title>Quick Start — Crawlingo</title>
        <meta name="description" content="Get up and running with Crawlingo in under 2 minutes. Install via pip, npm, or cargo and start extracting data instantly." />
      </Head>

      <PageMeta
        title="Quick Start"
        description="Get up and running with Crawlingo in under 2 minutes. No complex configuration required."
        readingTime="5 min"
        lastUpdated="July 2026"
        githubPath="quick-start.md"
      />

      {/* ── Step 1: Install ── */}
      <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Installation
      </h2>
      <p className="text-[var(--foreground-muted)] mb-6">
        Crawlingo provides pre-built binary wheels for Linux (x86_64, aarch64), macOS (Intel, Apple Silicon), and Windows (AMD64). No Rust toolchain required for installation.
      </p>

      <div className="space-y-4 mb-12">
        <TerminalBlock
          title="Python (3.8+)"
          commands={['pip install crawlingo', 'python -c "import crawlingo; print(crawlingo.__version__)"']}
        />
        <TerminalBlock
          title="Node.js (18+)"
          commands={['npm install crawlingo', 'node -e "const c = require(\'crawlingo\'); console.log(Object.keys(c))"']}
        />
        <TerminalBlock
          title="Rust (1.70+)"
          commands={['cargo add crawlingo', '# or in Cargo.toml: crawlingo = "0.1"']}
        />
      </div>

      <Callout type="tip" title="Build from source">
        To build from source (Rust 1.70+ required):{' '}
        <code>pip install crawlingo --no-binary crawlingo</code> or clone the repo and run{' '}
        <code>maturin develop</code>.
      </Callout>

      {/* ── Step 2: Basic Usage ── */}
      <h2 id="basic-usage" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Basic Usage
      </h2>
      <p className="text-[var(--foreground-muted)] mb-6">
        The <code>Page</code> class is the simplest entry point. Pass a URL, get back a parsed page object.
      </p>

      <TabCodeBlock
        tabs={[
          {
            language: 'python',
            label: '🐍 Python',
            fileName: 'basic.py',
            code: `from crawlingo import Page

# Fetch and parse in one call
page = Page("https://example.com")

print(page.title())           # "Example Domain"
print(page.status)            # 200
print(page.markdown()[:120])  # Clean GitHub-flavored markdown

# CSS selectors
h1 = page.css("h1").text()
links = [el.attr("href") for el in page.css("a")]

# XPath
paragraphs = [p.text() for p in page.xpath("//p")]

# Regex — returns raw matches
prices = page.regex(r"\\$[\\d,.]+")

# Text anchors (SIMD-accelerated)
el = page.find_text("Price:")        # exact text lookup
sibling = page.after_text("Price:")  # element after "Price:"`,
          },
          {
            language: 'typescript',
            label: '📘 Node.js',
            fileName: 'basic.ts',
            code: `import { Page } from 'crawlingo';

const page = await Page.create("https://example.com");

console.log(page.title());   // "Example Domain"
console.log(page.status);    // 200
console.log(page.markdown()); // Clean markdown

// CSS selectors
const h1 = page.css("h1").first().text();
const links = page.css("a").map(el => el.attr("href"));

// XPath
const paragraphs = page.xpath("//p").map(el => el.text());

// Text anchors
const price = page.findText("Price:").first()?.text();`,
          },
          {
            language: 'rust',
            label: '🦀 Rust',
            fileName: 'main.rs',
            code: `use crawlingo::Page;
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let session = Arc::new(crawlingo::Session::new());
    let page = Page::new("https://example.com", session).await?;

    println!("Title:  {:?}", page.title());
    println!("Status: {}", page.status());

    let h1 = page.css("h1")?.first().text();
    let paragraphs: Vec<_> = page.xpath("//p")?.iter()
        .map(|el| el.text())
        .collect();

    Ok(())
}`,
          },
        ]}
        defaultTab="python"
      />

      {/* ── Step 3: Session ── */}
      <h2 id="session" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Session Configuration
      </h2>
      <p className="text-[var(--foreground-muted)] mb-6">
        A <code>Session</code> is a reusable config container. All <code>Page</code>, <code>Dataset</code>, <code>Crawl</code>, and <code>Watch</code> operations can share a session. Configure it once and reuse across thousands of requests.
      </p>

      <CodeBlock
        language="python"
        fileName="session.py"
        code={`from crawlingo import Session, Page

with Session() as s:
    # Self-healing selectors
    s.auto_match(True)

    # Stealth mode — rotate TLS fingerprints
    s.fetcher_tier("stealthy")
    s.browser_profile("chrome")  # or "firefox", "safari"

    # Rate limiting (per-host token bucket)
    s.rate_limit(5.0)   # 5 req/s per host

    # Proxy rotation
    s.proxy_pool([
        "http://user:pass@proxy1:8080",
        "http://user:pass@proxy2:8080",
    ])

    # Auth
    s.auth_bearer("eyJhbGciOi...")

    # Retry config
    s.retry_base_delay(500).retry_max_delay(30000)

    # Reuse session across multiple fetches
    page1 = s.page("https://example.com")
    page2 = s.page("https://other-site.com")
    print(s.metrics())  # lock-free counters`}
        showLineNumbers
      />

      {/* ── Step 4: Dataset ── */}
      <h2 id="dataset-builder" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Dataset Builder
      </h2>
      <p className="text-[var(--foreground-muted)] mb-6">
        The <code>Dataset</code> API provides a fluent builder for structured multi-field extraction. Export to JSON, CSV, or Parquet in a single method call.
      </p>

      <CodeBlock
        language="python"
        fileName="dataset.py"
        code={`from crawlingo import Dataset, Session

with Session() as s:
    s.auto_match(True).rate_limit(5)

    ds = (
        Dataset("https://shop.example.com/products", session=s)
        .field("title",    "h1")
        .field("price",    ".price",      extraction_type="price")
        .field("rating",   ".star-score", extraction_type="text")
        .field("url",      "",            extraction_type="url")
        .field("email",    r"[\\w.+]+@[\\w.]+", selector_type="regex",
               extraction_type="datalink_email")
        .build()
    )

    print(ds.to_dict())        # {"title": "...", "price": "49.99"}
    ds.to_json("data.json")    # JSON file
    ds.to_csv("data.csv")      # CSV file
    ds.to_parquet("data.parquet")  # Parquet for Spark/BigQuery

# Stream a large URL list at constant memory
urls = ["https://shop.example.com/p/" + str(i) for i in range(10_000)]
for chunk in Dataset(urls).field("title", "h1").stream():
    print(chunk.data)`}
        showLineNumbers
      />

      {/* ── Step 5: Crawl ── */}
      <h2 id="crawler" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Multi-Page Crawling
      </h2>
      <CodeBlock
        language="python"
        fileName="crawl.py"
        code={`from crawlingo import Crawl

results = (
    Crawl("https://docs.example.com")
    .follow("nav a, main a")      # CSS for links to follow
    .limit(500)                    # max pages
    .depth(5)                      # max link depth
    .concurrency(10)               # concurrent fetches
    .delay(0.5)                    # polite delay
    .respect_robots(True)          # honor robots.txt
    .allowed_domains(["docs.example.com"])
    .field("title",   "h1")
    .field("content", "article")
    .field("url",     "", extraction_type="url")
    .webhook("https://api.example.com/webhooks/crawl")
    .build()
)

results.to_json_file("crawl.json")
results.to_parquet_file("crawl.parquet")`}
        showLineNumbers
      />

      {/* ── Step 6: Watch ── */}
      <h2 id="watch-monitors" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Change Monitoring
      </h2>
      <CodeBlock
        language="python"
        fileName="watch.py"
        code={`from crawlingo import Watch

def on_price(event):
    print(f"Price changed: {event.old_value} → {event.new_value}")
    print(f"Change: {event.percentage_change:.1f}%")
    print(f"URL: {event.url}  Field: {event.field}")

w = (
    Watch("https://shop.example.com/product/1")
    .field("price", ".price", extraction_type="price")
    .field("stock", ".stock-badge")
    .interval(300)                    # poll every 5 minutes
    .on_price_change(on_price)
    .on_stock_change(lambda e: print(f"Stock: {e.old_value} → {e.new_value}"))
    .on_change(lambda e: print(f"Field '{e.field}' changed"))
)

w.run(detach=True)   # non-blocking background thread
# w.stop()           # signal stop`}
        showLineNumbers
      />

      <Callout type="info" title="Change event fields">
        Every event exposes: <code>url</code>, <code>field</code>, <code>old_value</code>, <code>new_value</code>,{' '}
        <code>change_type</code> (content / price / stock / element_added / element_removed),{' '}
        <code>percentage_change</code>, and <code>timestamp</code>.
      </Callout>

      {/* ── Next steps ── */}
      <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        What's next?
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { title: 'Self-Healing Selectors', desc: 'How DOM fingerprinting auto-repairs broken selectors', href: '/features#self-healing' },
          { title: 'Stealth Browsing',       desc: 'TLS fingerprint rotation and browser profile configuration', href: '/features#stealth' },
          { title: 'Python SDK Reference',   desc: 'Complete method reference for the Python SDK', href: '/sdk/python' },
          { title: 'Architecture',           desc: 'Rust core internals, FFI layers, and parallelism model', href: '/architecture' },
        ].map(card => (
          <a
            key={card.href}
            href={card.href}
            className="group flex flex-col p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand-orange)]/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          >
            <h3 className="font-semibold text-sm text-[var(--foreground)] mb-1 group-hover:text-[var(--brand-orange)] transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {card.title}
            </h3>
            <p className="text-xs text-[var(--foreground-muted)]">{card.desc}</p>
          </a>
        ))}
      </div>

      <DocNav
        prev={{ label: 'Home', href: '/' }}
        next={{ label: 'Self-Healing Selectors', href: '/features#self-healing' }}
      />
    </>
  );
}
