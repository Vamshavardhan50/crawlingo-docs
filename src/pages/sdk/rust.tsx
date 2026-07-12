import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, TerminalBlock, Callout, DocNav } from '@/components/feature-card';

export default function RustSDKPage() {
  return (
    <>
      <Head>
        <title>Rust SDK — Crawlingo</title>
        <meta name="description" content="Crawlingo Rust SDK reference — native async Rust API with Tokio, full type safety, zero FFI overhead." />
      </Head>

      <PageMeta
        title="Rust SDK"
        description="Native Rust crate for Crawlingo — zero FFI overhead, full Tokio async/await, comprehensive type safety."
        readingTime="8 min"
        lastUpdated="July 2026"
        githubPath="sdk/rust.md"
      />

      <Callout type="info" title="Installation">
        Add to <code>Cargo.toml</code>: <code>crawlingo = "0.1"</code> or run <code>cargo add crawlingo</code>. Requires Rust 1.70+.
      </Callout>

      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Cargo.toml</h2>
      <CodeBlock
        language="toml"
        fileName="Cargo.toml"
        code={`[dependencies]
crawlingo  = "0.1"
tokio      = { version = "1", features = ["full"] }
anyhow     = "1"`}
        showLineNumbers={false}
      />

      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Complete Example</h2>
      <CodeBlock
        language="rust"
        fileName="main.rs"
        code={`use crawlingo::*;
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // ── Session ──────────────────────────────────────────────
    let session = Arc::new(Session::new());
    session.set_auto_match(true);
    session.set_fetcher_tier("stealthy");
    session.set_browser_profile("chrome");
    session.set_rate_limit(5.0);

    // ── Page ─────────────────────────────────────────────────
    let page = Page::new("https://example.com", session.clone()).await?;
    println!("Title:  {:?}", page.title());
    println!("Status: {}", page.status());
    println!("MD:     {}", &page.markdown()[..120]);

    // CSS selector
    let h1 = page.css("h1")?.first().text();

    // XPath
    let paragraphs: Vec<String> = page.xpath("//p")?
        .iter()
        .map(|el| el.text())
        .collect();

    // Text anchors (SIMD)
    let price = page.after_text("Price:")?.first().text();

    // ── Dataset ──────────────────────────────────────────────
    let result = Dataset::new("https://shop.example.com", session.clone())
        .with_field(DatasetField::new("title", "h1"))
        .with_field(
            DatasetField::new("price", ".price")
                .with_extract_type(ExtractionType::Price)
                .with_default("N/A"),
        )
        .with_field(
            DatasetField::new("stock", ".stock-badge")
                .with_extract_type(ExtractionType::Text),
        )
        .build_async()
        .await?;

    println!("{:#?}", result.fields);
    result.to_parquet("data.parquet")?;

    // ── Crawl ─────────────────────────────────────────────────
    let crawl_result = Crawl::new("https://docs.example.com", session.clone())
        .follow("a")
        .limit(100)
        .depth(3)
        .concurrency(10)
        .respect_robots(true)
        .with_field(DatasetField::new("title",   "h1"))
        .with_field(DatasetField::new("content", "article"))
        .build_async()
        .await?;

    crawl_result.to_json_file("crawl.json")?;

    // ── Watch ─────────────────────────────────────────────────
    let mut watcher = Watch::new("https://shop.example.com/p/1", session.clone())
        .with_field(
            DatasetField::new("price", ".price")
                .with_extract_type(ExtractionType::Price),
        )
        .interval(300);

    watcher.on_price_change(|event| {
        println!(
            "Price: {:?} → {:?} ({:.1}%)",
            event.old_value, event.new_value, event.percentage_change
        );
    });

    watcher.run_detached().await;

    Ok(())
}`}
        showLineNumbers
      />

      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Core Types</h2>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8">
        <table className="data-table">
          <thead><tr><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              { t: 'Session',         d: 'Central config container — Arc<Session> is cheap to clone' },
              { t: 'Page',            d: 'Parsed HTTP response with selector and extraction methods' },
              { t: 'ElementList',     d: 'Collection of ElementRef from a selector query' },
              { t: 'ElementRef',      d: 'Reference to a DOM node (text, html, attr, parent, children)' },
              { t: 'Dataset',         d: 'Multi-field extractor builder' },
              { t: 'DatasetField',    d: 'Field config (selector, extract type, default, transform)' },
              { t: 'DatasetResult',   d: 'Extraction result with to_json/csv/parquet methods' },
              { t: 'Crawl',           d: 'BFS crawler builder' },
              { t: 'CrawlResult',     d: 'All pages extracted + field data' },
              { t: 'Watch',           d: 'Polling monitor builder' },
              { t: 'ChangeEvent',     d: 'Typed change event (url, field, old/new value, type, %)' },
              { t: 'ExtractionType',  d: 'Enum: Text, Price, DateTime, Url, DataLinkUrl/Email/Phone' },
              { t: 'FetchError',      d: 'HTTP/DNS/TLS errors' },
              { t: 'SelectorError',   d: 'Invalid CSS/XPath/regex syntax' },
            ].map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs font-semibold">{r.t}</code></td>
                <td className="text-sm text-[var(--foreground-muted)]">{r.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Features flags</h2>
      <CodeBlock
        language="toml"
        fileName="Cargo.toml"
        code={`crawlingo = { version = "0.1", features = [
    "stealthy",     # TLS fingerprint rotation (default: on)
    "dataset",      # Dataset builder (default: on)
    "parquet",      # Parquet export (requires arrow2)
    "watch",        # Watch monitor (default: on)
    "crawl",        # BFS crawler (default: on)
    "metrics",      # Lock-free metrics (default: on)
]}`}
        showLineNumbers={false}
      />

      <DocNav
        prev={{ label: 'Node.js SDK', href: '/sdk/nodejs' }}
        next={{ label: 'Architecture', href: '/architecture' }}
      />
    </>
  );
}
