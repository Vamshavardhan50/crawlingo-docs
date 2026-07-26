import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, TabCodeBlock, Callout, DocNav } from '@/components/feature-card';

export default function CrawlApiPage() {
  return (
    <>
      <Head>
        <title>Crawl API — Crawlingo</title>
        <meta name="description" content="Detailed Crawl API documentation for Crawlingo. Multi-page recursive crawling, concurrency control, polite delays, and webhooks." />
      </Head>

      <PageMeta
        title="Crawl API"
        description="The Crawl class performs multi-page recursive crawling from a starting URL. It follows links, extracts data from each page, and collects results."
        readingTime="5 min"
        lastUpdated="July 2026"
        githubPath="docs/crawl.md"
      />

      {/* ── Python ── */}
      <h2 id="python" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Python Usage
      </h2>
      <CodeBlock
        language="python"
        fileName="crawl.py"
        code={`from crawlingo import Crawl

results = (
    Crawl("https://docs.example.com")
    .follow("a[href^='/docs']")    # CSS selector for links to follow
    .limit(100)                      # Max pages to crawl
    .depth(3)                        # Max link depth
    .concurrency(5)                  # Concurrent requests
    .delay(1.0)                      # Delay between requests (seconds)
    .field("title", "h1")
    .field("content", "main p")
    .build()
)

print(f"Crawled {len(results)} pages")
results.to_json("crawl_output.json")
results.to_parquet("crawl_output.parquet")`}
        showLineNumbers
      />

      {/* ── Node.js ── */}
      <h2 id="nodejs" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Node.js Usage
      </h2>
      <CodeBlock
        language="typescript"
        fileName="crawl.ts"
        code={`import { Crawl } from 'crawlingo';

const results = await new Crawl('https://docs.example.com')
  .follow('a[href^="/docs"]')
  .limit(100)
  .depth(3)
  .concurrency(5)
  .delay(1.0)
  .field('title', 'h1')
  .run();

console.log(\`Crawled \${results.length} pages\`);`}
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
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">follow(selector)</td>
              <td className="py-2 px-3">—</td>
              <td className="py-2 px-3">CSS selector for anchor tags to follow</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">limit(n)</td>
              <td className="py-2 px-3"><code>1000</code></td>
              <td className="py-2 px-3">Maximum total pages to crawl</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">depth(n)</td>
              <td className="py-2 px-3"><code>5</code></td>
              <td className="py-2 px-3">Maximum link depth from start URL</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">concurrency(n)</td>
              <td className="py-2 px-3"><code>5</code></td>
              <td className="py-2 px-3">Maximum concurrent request count</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">delay(secs)</td>
              <td className="py-2 px-3"><code>0.5</code></td>
              <td className="py-2 px-3">Politeness delay between requests (seconds)</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">field(name, sel)</td>
              <td className="py-2 px-3">—</td>
              <td className="py-2 px-3">Extract fields from each page matched</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Politeness ── */}
      <h2 id="rate-limiting-and-politeness" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Rate Limiting and Politeness
      </h2>
      <p className="text-[var(--foreground-muted)] mb-4">
        Combine Crawl with per-host rate limiting and politeness delays:
      </p>
      <CodeBlock
        language="python"
        fileName="politeness.py"
        code={`from crawlingo import Session, Crawl

with Session() as session:
    session.rate_limit(5.0)  # 5 req/s per host
    session.proxy_pool(["http://proxy1:8080", "http://proxy2:8080"])

    results = (
        Crawl("https://example.com", session=session)
        .follow("a")
        .limit(100)
        .delay(0.5)
        .build()
    )`}
        showLineNumbers
      />

      <DocNav
        prev={{ label: 'Dataset API', href: '/dataset' }}
        next={{ label: 'Watch API', href: '/watch' }}
      />
    </>
  );
}
