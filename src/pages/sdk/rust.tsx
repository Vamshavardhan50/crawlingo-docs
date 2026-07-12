import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, Callout, DocNav } from '@/components/feature-card';

const RUST_FEATURES = [
  { name: 'default', desc: 'Enables stealth HTTP/2 fetcher, SIMD search, and JSON/CSV dataset exports.' },
  { name: 'stealth', desc: 'Enables custom TLS fingerprinting engine (JA3 & HTTP/2 frame profiles).' },
  { name: 'simd', desc: 'Enables AVX2/NEON vector assembly implementations for text anchor indexing.' },
  { name: 'parquet', desc: 'Enables writing Apache Parquet dataset outputs via the arrow-parquet crate.' },
  { name: 'blocking', desc: 'Adds synchronous blocking APIs for non-async applications.' },
];

const ENGINE_STRUCTS = [
  { name: 'Session', desc: 'Core connection, config, and Sled-based fingerprint state manager. Thread-safe (Arc/Sync).' },
  { name: 'Page', desc: 'HTML parser containing the DOM tree. Constructed asynchronously from Page::new(url, session).' },
  { name: 'Dataset', desc: 'Fluent API for compiling multiple fields into datasets.' },
  { name: 'Crawl', desc: ' Tokio-based async crawler walking pages BFS up to depth and limits.' },
  { name: 'Watch', desc: 'Active monitoring struct for executing callbacks on DOM change events.' },
];

export default function RustSDKPage() {
  return (
    <>
      <Head>
        <title>Rust SDK — Crawlingo</title>
        <meta name="description" content="Complete Rust SDK reference for crawlingo crate — Session, Page, Dataset, Crawl, Watch, Cargo features, and async/await examples." />
      </Head>

      <PageMeta
        title="Rust SDK"
        description="Native Rust SDK (crawlingo crate). Highly parallel, async-first API built using Tokio and Rayon."
        readingTime="9 min"
        lastUpdated="July 2026"
        githubPath="sdk/rust.md"
      />

      <Callout type="info" title="Cargo dependency">
        Add to <code>Cargo.toml</code>:<br />
        <code>crawlingo = "0.1"</code> (Requires Rust 1.75+ and Tokio runtime)
      </Callout>

      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Quick Example</h2>
      <CodeBlock
        language="rust"
        fileName="main.rs"
        code={`use crawlingo::{Page, Session, Dataset, DatasetField, ExtractionType};
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // 1. Create a thread-safe Session
    let session = Arc::new(
        Session::new()
            .set_auto_match(true)
            .set_fetcher_tier("stealthy")
            .set_rate_limit(5.0)
    );

    // 2. Fetch a single page
    let page = Page::new("https://example.com", session.clone()).await?;
    println!("Title: {:?}", page.title());
    println!("Status: {}", page.status());

    // 3. Compile a Dataset from a listing page
    let result = Dataset::new("https://shop.example.com", session.clone())
        .with_field(DatasetField::new("title", "h1"))
        .with_field(
            DatasetField::new("price", ".price")
                .with_extract_type(ExtractionType::Price)
                .with_default("0.00")
        )
        .build_async()
        .await?;

    // Print values
    println!("{:#?}", result.fields);

    // Export dataset
    result.to_parquet("listings.parquet")?;
    result.to_json_file("listings.json")?;

    Ok(())
}`}
        showLineNumbers
      />

      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Core Structs</h2>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8">
        <table className="data-table">
          <thead><tr><th>Struct</th><th>Description</th></tr></thead>
          <tbody>
            {ENGINE_STRUCTS.map((s, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{s.name}</code></td>
                <td className="text-sm text-[var(--foreground-muted)]">{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Cargo Features</h2>
      <p className="text-sm text-[var(--foreground-muted)] mb-4">
        Customize the crawlingo crate footprint by toggling features in your <code>Cargo.toml</code>:
      </p>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8">
        <table className="data-table">
          <thead><tr><th>Feature Name</th><th>Description</th></tr></thead>
          <tbody>
            {RUST_FEATURES.map((f, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{f.name}</code></td>
                <td className="text-sm text-[var(--foreground-muted)]">{f.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocNav
        prev={{ label: 'Node.js SDK', href: '/sdk/nodejs' }}
        next={{ label: 'Architecture', href: '/architecture' }}
      />
    </>
  );
}
