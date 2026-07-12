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
const h1 = page.css("h1").first()?.text();
const links = page.css("a").map(el => el.attr("href"));

// XPath
const paragraphs = page.xpath("//p").map(el => el.text());

// ── Session with stealth mode ────────────────────────────────
const session = new Session()
  .autoMatch(true)
  .fetcherTier("stealthy")
  .browserProfile("chrome")
  .rateLimit(5);

const stealthPage = await Page.create("https://protected.com", session);

// ── Dataset ─────────────────────────────────────────────────
const result = await new Dataset("https://shop.example.com", session)
  .field("title",  "h1")
  .field("price",  ".price",  { extractType: "price" })
  .field("rating", ".rating")
  .build();

console.log(result.toDict());
result.toJsonFile("data.json");
result.toParquet("data.parquet");

// ── Crawl ────────────────────────────────────────────────────
const crawl = await new Crawl("https://docs.example.com")
  .follow("a")
  .limit(100)
  .depth(3)
  .concurrency(8)
  .field("title",   "h1")
  .field("content", "article")
  .build();

crawl.toJsonFile("crawl.json");

// ── Watch ────────────────────────────────────────────────────
const watcher = new Watch("https://shop.example.com/p/1")
  .field("price", ".price", { extractType: "price" })
  .interval(300);

watcher.onPriceChange(e => {
  console.log(\`\${e.field}: \${e.oldValue} → \${e.newValue}\`);
  console.log(\`Change: \${e.percentageChange.toFixed(1)}%\`);
});

watcher.run();`}
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
              { m: 'new Session()',                   d: 'Create session with defaults' },
              { m: '.autoMatch(bool)',                d: 'Enable self-healing selectors' },
              { m: '.fetcherTier("standard"|"stealthy")', d: 'HTTP mode' },
              { m: '.browserProfile("chrome"|...)',   d: 'TLS fingerprint browser identity' },
              { m: '.rateLimit(n: number)',           d: 'Per-host req/s' },
              { m: '.proxy(url: string)',             d: 'Single proxy URL' },
              { m: '.proxyPool(urls: string[])',      d: 'Round-robin proxy rotation' },
              { m: '.headers(dict: Record<string,string>)', d: 'Default HTTP headers' },
              { m: '.timeout(seconds: number)',       d: 'Request timeout' },
              { m: '.authBearer(token: string)',      d: 'Bearer token auth' },
              { m: '.authBasic(user, pass)',          d: 'HTTP Basic Auth' },
              { m: '.metrics()',                      d: 'Lock-free metrics snapshot' },
              { m: '.destroy()',                      d: 'Release all resources' },
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
              { m: 'Page.create(url, session?)', r: 'Promise<Page>', d: 'Async fetch and parse' },
              { m: '.title()',       r: 'string',      d: '<title> text' },
              { m: '.html()',        r: 'string',      d: 'Raw HTML' },
              { m: '.markdown()',    r: 'string',      d: 'GFM markdown' },
              { m: '.status',       r: 'number',      d: 'HTTP status code' },
              { m: '.css(sel)',      r: 'ElementList', d: 'CSS query' },
              { m: '.xpath(expr)',   r: 'ElementList', d: 'XPath query' },
              { m: '.regex(pat)',    r: 'string[]',    d: 'Regex matches' },
              { m: '.findText(t)',   r: 'ElementList', d: 'SIMD text anchor' },
              { m: '.afterText(t)',  r: 'ElementList', d: 'Sibling after anchor' },
              { m: '.beforeText(t)', r: 'ElementList', d: 'Sibling before anchor' },
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
        code={`export interface ChangeEvent {
  url:              string;
  field:            string;
  oldValue:         string | null;
  newValue:         string | null;
  changeType:       'content' | 'price' | 'stock' | 'element_added' | 'element_removed';
  percentageChange: number;
  timestamp:        Date;
}

export interface DatasetResult {
  toDict():      Record<string, string | null>;
  toJson():      string;
  toCsv():       string;
  toParquet(path: string): void;
  toJsonFile(path: string): void;
  toCsvFile(path: string): void;
}

export interface ElementRef {
  text():        string;
  html():        string;
  outerHtml():   string;
  attr(name: string): string | null;
  tag():         string;
  classes():     string[];
  parent():      ElementRef | null;
  children():    ElementRef[];
  nextSibling(): ElementRef | null;
  prevSibling(): ElementRef | null;
}

export interface ElementList extends Iterable<ElementRef> {
  first(): ElementRef | null;
  last():  ElementRef | null;
  at(i: number): ElementRef | null;
  map<T>(fn: (el: ElementRef) => T): T[];
  length: number;
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
