import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, TabCodeBlock, Callout, DocNav } from '@/components/feature-card';

export default function DatasetApiPage() {
  return (
    <>
      <Head>
        <title>Dataset API — Crawlingo</title>
        <meta name="description" content="Detailed Dataset API documentation for Crawlingo. Schema-driven extraction, streaming datasets, and multi-format exports (JSON, CSV, Parquet)." />
      </Head>

      <PageMeta
        title="Dataset API"
        description="The Dataset class provides schema-driven structured data extraction from web pages. It supports multiple fields, auto-match, and export to JSON, CSV, and Parquet."
        readingTime="6 min"
        lastUpdated="July 2026"
        githubPath="docs/dataset.md"
      />

      {/* ── Python ── */}
      <h2 id="python" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Python Usage
      </h2>
      <CodeBlock
        language="python"
        fileName="dataset.py"
        code={`from crawlingo import Dataset

dataset = (
    Dataset("https://example.com/product/1")
    .auto_match(True)
    .field("title", "h1.product-title")
    .field("price", "span.price-value", extraction_type="price")
    .field("description", "p.description")
    .field("availability", ".stock-status", default="unknown")
    .field("image_url", "img.main", extraction_type="url")
    .build()
)

# Access results
print(dataset.to_dict())

# Export formats
dataset.to_json("output.json")
dataset.to_csv("output.csv")
dataset.to_parquet("output.parquet")`}
        showLineNumbers
      />

      {/* ── Node.js ── */}
      <h2 id="nodejs" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Node.js Usage
      </h2>
      <CodeBlock
        language="typescript"
        fileName="dataset.ts"
        code={`import { Dataset } from 'crawlingo';

const dataset = new Dataset('https://example.com/product/1')
  .autoMatch(true)
  .field('title', 'h1.product-title')
  .field('price', 'span.price-value', { extractionType: 'price' });

const result = await dataset.build();
console.log(result.toDict());

await result.toJson('output.json');
await result.toCsv('output.csv');`}
        showLineNumbers
      />

      {/* ── Field API ── */}
      <h2 id="field-api" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Field API
      </h2>
      <CodeBlock
        language="python"
        fileName="field_spec.py"
        code={`.field(
    name: str,           # Field name in output
    selector: str,        # CSS / XPath / Regex selector
    selector_type="css",  # "css" | "xpath" | "regex" | "text"
    extraction_type=None, # "text" | "price" | "datetime" | "url" | "datalink_*"
    default=None          # Fallback value if selector finds nothing
)`}
        showLineNumbers
      />

      {/* ── Extraction Types ── */}
      <h2 id="extraction-types" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Extraction Types
      </h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm text-[var(--foreground-muted)] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--foreground)] font-semibold">
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Input → Output</th>
              <th className="py-2 px-3">Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">text</td>
              <td className="py-2 px-3"><code>"  Hello  "</code> → <code>"Hello"</code></td>
              <td className="py-2 px-3">Trim and collapse whitespace</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">price</td>
              <td className="py-2 px-3"><code>"$1,234.56"</code> → <code>"1234.56"</code></td>
              <td className="py-2 px-3">Normalize currency to float string</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">datetime</td>
              <td className="py-2 px-3"><code>"Jan 15, 2024"</code> → <code>"2024-01-15"</code></td>
              <td className="py-2 px-3">Standardize dates to ISO format</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">url</td>
              <td className="py-2 px-3"><code>"/path"</code> → <code>"https://base.com/path"</code></td>
              <td className="py-2 px-3">Resolve relative URLs to absolute</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Streaming Dataset ── */}
      <h2 id="streaming-dataset" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Streaming Dataset
      </h2>
      <p className="text-[var(--foreground-muted)] mb-4">
        Process thousands of URLs with bounded, constant memory consumption:
      </p>
      <CodeBlock
        language="python"
        fileName="stream.py"
        code={`dataset = Dataset("https://example.com")
dataset.field("title", "h1")

stream = dataset.build_many_streamed(
    urls=["https://example.com/a", "https://example.com/b", "https://example.com/c"],
    concurrency=10
)

for record in stream:
    print(record.fields)`}
        showLineNumbers
      />

      {/* ── Export Formats ── */}
      <h2 id="export-formats" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Export Formats
      </h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm text-[var(--foreground-muted)] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--foreground)] font-semibold">
              <th className="py-2 px-3">Method</th>
              <th className="py-2 px-3">Format</th>
              <th className="py-2 px-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">to_json(path)</td>
              <td className="py-2 px-3">JSON</td>
              <td className="py-2 px-3">Pretty-printed JSON object or array</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">to_csv(path)</td>
              <td className="py-2 px-3">CSV</td>
              <td className="py-2 px-3">Header row + record rows</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">to_parquet(path)</td>
              <td className="py-2 px-3">Parquet</td>
              <td className="py-2 px-3">Columnar, Snappy-compressed format</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">to_dict()</td>
              <td className="py-2 px-3">Dict</td>
              <td className="py-2 px-3">In-memory dictionary</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocNav
        prev={{ label: 'Session API', href: '/session' }}
        next={{ label: 'Crawl API', href: '/crawl' }}
      />
    </>
  );
}
