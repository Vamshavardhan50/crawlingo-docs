import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, TabCodeBlock, Callout, DocNav } from '@/components/feature-card';

export default function WatchApiPage() {
  return (
    <>
      <Head>
        <title>Watch API — Crawlingo</title>
        <meta name="description" content="Detailed Watch API documentation for Crawlingo. Periodic page monitoring, change detection callbacks, and webhooks." />
      </Head>

      <PageMeta
        title="Watch API"
        description="The Watch class periodically polls a web page and detects changes in extracted fields. It supports typed callbacks for content, price, stock, and structural changes."
        readingTime="5 min"
        lastUpdated="July 2026"
        githubPath="docs/watch.md"
      />

      {/* ── Python ── */}
      <h2 id="python" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Python Usage
      </h2>
      <CodeBlock
        language="python"
        fileName="watch.py"
        code={`from crawlingo import Watch
import asyncio

def on_change(event):
    print(f"[{event.event_type}] '{event.field}' changed!")
    print(f"  Old: {event.old_value}")
    print(f"  New: {event.new_value}")

async def main():
    watcher = (
        Watch("https://example.com/product/1")
        .field("title", "h1")
        .field("price", "span.price", extraction_type="price")
        .interval(60)                           # Poll every 60 seconds
        .on_change(on_change)
    )

    watch_task = asyncio.create_task(watcher.run_async())
    await asyncio.sleep(3600)
    watcher.stop()
    await watch_task

asyncio.run(main())`}
        showLineNumbers
      />

      {/* ── Node.js ── */}
      <h2 id="nodejs" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Node.js Usage
      </h2>
      <CodeBlock
        language="typescript"
        fileName="watch.ts"
        code={`import { Watch } from 'crawlingo';

const watcher = new Watch('https://example.com/product/1')
  .field('title', 'h1')
  .field('price', 'span.price', { extractionType: 'price' })
  .interval(60);

watcher.run((err, event) => {
  if (err) return console.error(err);
  console.log(\`[\${event.changeType}] \${event.field} changed!\`);
  console.log(\`  Old: \${event.oldValue}\`);
  console.log(\`  New: \${event.newValue}\`);
});`}
        showLineNumbers
      />

      {/* ── Parameters ── */}
      <h2 id="parameters" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Parameters
      </h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm text-[var(--foreground-muted)] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--foreground)] font-semibold">
              <th className="py-2 px-3">Method</th>
              <th className="py-2 px-3">Default</th>
              <th className="py-2 px-3">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">field(name, selector)</td>
              <td className="py-2 px-3">—</td>
              <td className="py-2 px-3">Field to monitor for changes</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">interval(secs)</td>
              <td className="py-2 px-3"><code>300</code></td>
              <td className="py-2 px-3">Polling interval in seconds</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">on_change(callback)</td>
              <td className="py-2 px-3">—</td>
              <td className="py-2 px-3">Callback function invoked on change events</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">tolerance(pct)</td>
              <td className="py-2 px-3"><code>0.0</code></td>
              <td className="py-2 px-3">Price change percentage tolerance (e.g. 0.05 = 5%)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Change Event Properties ── */}
      <h2 id="change-event-properties" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Change Event Properties
      </h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm text-[var(--foreground-muted)] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--foreground)] font-semibold">
              <th className="py-2 px-3">Property</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">field</td>
              <td className="py-2 px-3"><code>str</code></td>
              <td className="py-2 px-3">Name of the field that changed</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">old_value</td>
              <td className="py-2 px-3"><code>str</code></td>
              <td className="py-2 px-3">Baseline extracted value</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">new_value</td>
              <td className="py-2 px-3"><code>str</code></td>
              <td className="py-2 px-3">Newly extracted value</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">event_type</td>
              <td className="py-2 px-3"><code>str</code></td>
              <td className="py-2 px-3">ContentChange, PriceChange, StockChange, ElementAdded, ElementRemoved</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocNav
        prev={{ label: 'Crawl API', href: '/crawl' }}
        next={{ label: 'Authentication', href: '/authentication' }}
      />
    </>
  );
}
