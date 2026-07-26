import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, DocNav } from '@/components/feature-card';

export default function ChangeDetectionPage() {
  return (
    <>
      <Head>
        <title>Change Detection — Crawlingo</title>
        <meta name="description" content="Change Detection guide for Crawlingo. Detect content, price, stock, and structural changes on web pages." />
      </Head>

      <PageMeta
        title="Change Detection"
        description="The Watch system detects changes in extracted fields over time by comparing current extraction results against stored baselines."
        readingTime="4 min"
        lastUpdated="July 2026"
        githubPath="docs/change-detection.md"
      />

      {/* ── Change Types ── */}
      <h2 id="change-types" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Change Types
      </h2>
      <div className="space-y-6 mb-8 text-[var(--foreground-muted)]">
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">ContentChange</h3>
          <p className="text-sm mb-2">Triggered when text content differs from baseline.</p>
          <CodeBlock language="python" code={`watch.field("title", "h1")`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">PriceChange</h3>
          <p className="text-sm mb-2">Specialized numeric change detection with percentage calculation and tolerance thresholds.</p>
          <CodeBlock language="python" code={`watch.field("price", "span.price", extraction_type="price")\nwatch.tolerance(0.05) # Only fires if price changes by > 5%`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">StockChange</h3>
          <p className="text-sm mb-2">Triggered when availability indicators change.</p>
          <CodeBlock language="python" code={`watch.field("stock", ".availability-badge")`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">ElementAdded / ElementRemoved</h3>
          <p className="text-sm mb-2">Triggered when a selector starts matching new elements or stops matching existing ones.</p>
          <CodeBlock language="python" code={`watch.field("items", ".product-item")`} />
        </div>
      </div>

      {/* ── Event Object ── */}
      <h2 id="event-object" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Event Object Structure
      </h2>
      <CodeBlock
        language="python"
        fileName="event.json"
        code={`{
    "field": "price",        # Changed field name
    "old_value": "299.99",   # Previous baseline value
    "new_value": "249.99",   # Current value
    "change_type": "PriceChange",
    "change_pct": -16.67,    # Percentage change (numeric fields)
    "url": "https://example.com/product/1",
    "timestamp": "2026-07-26T10:30:00Z"
}`}
        showLineNumbers
      />

      {/* ── Low-Level Detection Function ── */}
      <h2 id="change-detection-function" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Low-Level Change Detection Function
      </h2>
      <CodeBlock
        language="python"
        fileName="detect.py"
        code={`from crawlingo import detect_changes

old_data = {"price": "299.99", "title": "Widget"}
new_data = {"price": "249.99", "title": "Widget"}

changes = detect_changes("https://example.com", old_data, new_data)
for change in changes:
    print(f"{change.field}: {change.change_type} ({change.old_value} → {change.new_value})")`}
        showLineNumbers
      />

      {/* ── Webhooks ── */}
      <h2 id="integration-with-webhooks" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Integration with Webhooks
      </h2>
      <CodeBlock
        language="python"
        fileName="webhook.py"
        code={`import requests
from crawlingo import Watch

def on_change(event):
    requests.post("https://my-api.example.com/webhook", json={
        "field": event.field,
        "old_value": event.old_value,
        "new_value": event.new_value,
        "change_type": event.event_type,
        "url": event.url,
    })

Watch("https://example.com")\\
    .field("price", "span.price", extraction_type="price")\\
    .interval(300)\\
    .on_change(on_change)`}
        showLineNumbers
      />

      <DocNav
        prev={{ label: 'Auto-Match', href: '/auto-match' }}
        next={{ label: 'Advanced Features', href: '/advanced' }}
      />
    </>
  );
}
