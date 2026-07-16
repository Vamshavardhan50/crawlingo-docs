import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, Callout, DocNav } from '@/components/feature-card';

export default function NodeSDKPage() {
  return (
    <>
      <Head>
        <title>Node.js SDK — Crawlingo</title>
        <meta name="description" content="Crawlingo Node.js SDK reference — TypeScript-first API for Page, Session, Dataset, Crawl, and Watch with auto-generated .d.ts typings." />
      </Head>

      <PageMeta
        title="Node.js SDK"
        description="TypeScript-first Node.js SDK for Crawlingo (napi-rs bindings). Full type definitions auto-generated from the Rust core."
        readingTime="8 min"
        lastUpdated="July 2026"
        githubPath="sdk/nodejs.md"
      />

      <Callout type="info" title="Installation">
        <code>npm install crawlingo</code> — Node.js 18+. Pre-built native binaries. Auto-generated TypeScript <code>.d.ts</code> typings included.
      </Callout>

      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Quick Example</h2>
      <CodeBlock
        language="typescript"
        fileName="example.ts"
        code={`import { Page, Session, Dataset, Crawl, Watch } from 'crawlingo';

// ── Single page ─────────────────────────────────────────────
const page = await Page.create("https://example.com");
console.log(page.title());   // "Example Domain"
console.log(page.status);    // 200

// CSS selectors
const h1 = page.css("h1").first()?.text;
const links = [...page.css("a")].map(el => el.attr("href"));

// XPath
const paragraphs = [...page.xpath("//p")].map(el => el.text);

// ── Session with stealth mode ────────────────────────────────
const session = new Session()
  .autoMatch(true)
  .fetcherTier("stealthy")
  .browserProfile("chrome")
  .rateLimit(5);

const stealthPage = await Page.create("https://protected.com", { session });

// ── Dataset ─────────────────────────────────────────────────
const result = await new Dataset("https://shop.example.com", session)
  .field("title",  "h1")
  .field("price",  ".price")
  .field("rating", ".rating")
  .build();

console.log(result.toDict());
await result.toJson("data.json");
await result.toParquet("data.parquet");

// ── Crawl ────────────────────────────────────────────────────
const results = await new Crawl("https://docs.example.com", session)
  .follow("a")
  .limit(100)
  .depth(3)
  .concurrency(8)
  .field("title",   "h1")
  .field("content", "article")
  .run();

Dataset.saveJson(results.map(r => r.toDict()), "crawl.json");

// ── Watch ────────────────────────────────────────────────────
const watcher = new Watch("https://shop.example.com/p/1", session)
  .field("price", ".price")
  .interval(300);

watcher.run((err, e) => {
  if (err) return;
  console.log(\`\${e.field}: \${e.oldValue} → \${e.newValue}\`);
});`}
        showLineNumbers
      />

      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>API Reference</h2>

      {/* Session */}
      <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Session</h3>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8">
        <table className="data-table">
          <thead><tr><th>Method</th><th>Description</th></tr></thead>
          <tbody>
            {[
              { m: 'new Session()',                          d: 'Create session with defaults' },
              { m: '.headers(dict)',                          d: 'Default HTTP headers' },
              { m: '.cookies(dict)',                          d: 'Default cookies' },
              { m: '.proxy(url: string)',                     d: 'Single proxy URL' },
              { m: '.proxyPool(urls: string[])',              d: 'Round-robin proxy rotation' },
              { m: '.proxyProvider(url)',                     d: 'Remote proxy list endpoint' },
              { m: '.rateLimit(n: number)',                   d: 'Per-host req/s' },
              { m: '.autoMatch(bool)',                        d: 'Enable self-healing selectors' },
              { m: '.autoMatchWeights(weights)',              d: 'Fingerprint similarity weights' },
              { m: '.timeout(seconds: number)',               d: 'Request timeout' },
              { m: '.fetcherTier("standard"|"stealthy")',    d: 'HTTP mode' },
              { m: '.browserProfile("chrome"|"firefox"|"safari")', d: 'TLS fingerprint browser identity' },
              { m: '.fingerprintPath(path)',                  d: 'Fingerprint storage folder' },
              { m: '.clone()',                                d: 'Clone session and its config' },
              { m: '.destroy()',                              d: 'Release all resources' },
            ].map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{r.m}</code></td>
                <td className="text-sm text-[var(--foreground-muted)]">{r.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Page */}
      <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Page</h3>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8">
        <table className="data-table">
          <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
          <tbody>
            {[
              { m: 'Page.create(url, options?)',  r: 'Promise<Page>', d: 'Async fetch and parse. options: { session?, autoMatch?, timeout?, headers?, cookies?, proxy?, browserProfile? }' },
              { m: '.title()',                    r: 'string',        d: '<title> text content' },
              { m: '.html',                       r: 'string',        d: 'Raw HTML string (getter)' },
              { m: '.url',                        r: 'string',        d: 'Fetched page URL (getter)' },
              { m: '.status',                     r: 'number',        d: 'HTTP status code (getter)' },
              { m: '.css(sel)',                   r: 'ElementCollection', d: 'CSS query' },
              { m: '.xpath(expr)',                r: 'ElementCollection', d: 'XPath query' },
              { m: '.regex(pat)',                 r: 'ElementCollection', d: 'Regex match on all text' },
              { m: '.findText(t)',                r: 'ElementCollection', d: 'SIMD text anchor exact lookup' },
              { m: '.afterText(t)',               r: 'ElementCollection', d: 'Sibling element after anchor text' },
              { m: '.beforeText(t)',              r: 'ElementCollection', d: 'Sibling element before anchor text' },
            ].map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                <td><code className="text-xs">{r.m}</code></td>
                <td className="font-mono text-xs text-[var(--brand-indigo)]">{r.r}</td>
                <td className="text-sm text-[var(--foreground-muted)]">{r.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>TypeScript Types</h2>
      <CodeBlock
        language="typescript"
        fileName="types.d.ts"
        code={`export interface WatchChangeEvent {
  url:        string;
  field:      string;
  changeType: string;
  oldValue?:  string;
  newValue?:  string;
}

export interface DatasetResult {
  toDict():               Record<string, string>;
  toJson(path: string):    Promise<void>;
  toCsv(path: string):     Promise<void>;
  toParquet(path: string): Promise<void>;
}

export interface Element {
  readonly text: string;
  readonly html: string;
  attr(name: string): string | null;
}

export interface ElementList extends Iterable<Element> {
  first(): Element | null;
  at(i: number): Element | null;
  readonly text: string[];
  readonly html: string[];
  attr(name: string): (string | null)[];
  readonly length: number;
}`}
        showLineNumbers
      />

      <DocNav
        prev={{ label: 'Python SDK', href: '/sdk/python' }}
        next={{ label: 'Rust SDK', href: '/sdk/rust' }}
      />
    </>
  );
}
