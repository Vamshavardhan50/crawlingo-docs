import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, TabCodeBlock, Callout, DocNav } from '@/components/feature-card';

export default function PageApiPage() {
  return (
    <>
      <Head>
        <title>Page API — Crawlingo</title>
        <meta name="description" content="Detailed Page API documentation for Crawlingo. Fetch single pages, extract data using CSS, XPath, Regex, and Text Anchor selectors." />
      </Head>

      <PageMeta
        title="Page API"
        description="The Page object represents a fetched web page with a parsed DOM tree. It is the primary interface for extracting data from a single URL."
        readingTime="6 min"
        lastUpdated="July 2026"
        githubPath="docs/page.md"
      />

      {/* ── Constructor ── */}
      <h2 id="constructor" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Constructor
      </h2>
      <TabCodeBlock
        tabs={[
          {
            language: 'python',
            label: '🐍 Python',
            fileName: 'constructor.py',
            code: `from crawlingo import Page

# Basic fetch
page = Page("https://example.com")

# With shared session
from crawlingo import Session
session = Session().fetcher_tier("stealthy")
page = Page("https://example.com", session=session)`,
          },
          {
            language: 'typescript',
            label: '📘 Node.js',
            fileName: 'constructor.ts',
            code: `import { Page, Session } from 'crawlingo';

const session = new Session();
session.autoMatch(true);

const page = await Page.create("https://example.com", session);`,
          },
          {
            language: 'rust',
            label: '🦀 Rust',
            fileName: 'main.rs',
            code: `use crawlingo::{Page, Session};
use std::sync::Arc;

let session = Arc::new(Session::new());
let page = Page::new("https://example.com", session).await?;`,
          },
        ]}
        defaultTab="python"
      />

      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm text-[var(--foreground-muted)] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--foreground)] font-semibold">
              <th className="py-2 px-3">Parameter</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Default</th>
              <th className="py-2 px-3">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">url</td>
              <td className="py-2 px-3"><code>str</code></td>
              <td className="py-2 px-3">—</td>
              <td className="py-2 px-3">Target URL to fetch</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">session</td>
              <td className="py-2 px-3"><code>Session</code></td>
              <td className="py-2 px-3"><code>None</code></td>
              <td className="py-2 px-3">Shared configuration (headers, proxy, rate limit, etc.)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Properties ── */}
      <h2 id="properties" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Properties
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
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">status</td>
              <td className="py-2 px-3"><code>int</code></td>
              <td className="py-2 px-3">HTTP response status code (e.g. 200, 404)</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">url</td>
              <td className="py-2 px-3"><code>str</code></td>
              <td className="py-2 px-3">Final URL after all HTTP redirects</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">html()</td>
              <td className="py-2 px-3"><code>str</code></td>
              <td className="py-2 px-3">Raw HTML page content</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">markdown()</td>
              <td className="py-2 px-3"><code>str</code></td>
              <td className="py-2 px-3">Clean GitHub-flavored markdown conversion of page content</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── CSS Selectors ── */}
      <h2 id="css-selectors" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        CSS Selectors
      </h2>
      <CodeBlock
        language="python"
        fileName="css_selectors.py"
        code={`page = Page("https://example.com")

# Query multiple elements
elements = page.css("h1")
elements = page.css("div.price-tag")
elements = page.css("#main-container")

# Iterate results
for el in elements:
    print(el.text())       # Inner text
    print(el.html())       # Inner HTML
    print(el.attr("href")) # Attribute value`}
        showLineNumbers
      />

      {/* ── XPath Selectors ── */}
      <h2 id="xpath-selectors" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        XPath Selectors
      </h2>
      <CodeBlock
        language="python"
        fileName="xpath_selectors.py"
        code={`page = Page("https://example.com")

elements = page.xpath("//h1")
elements = page.xpath("//div[@class='price']")
elements = page.xpath("//a/@href")

for el in elements:
    print(el.text())`}
        showLineNumbers
      />

      {/* ── Regex Selectors ── */}
      <h2 id="regex-selectors" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Regex Selectors
      </h2>
      <CodeBlock
        language="python"
        fileName="regex_selectors.py"
        code={`page = Page("https://example.com")

emails = page.regex(r'[\\w.+-]+@[\\w-]+\\.[\\w.]+')
phones = page.regex(r'\\+?1?\\d{10,14}')

for match in emails:
    print(match.text())`}
        showLineNumbers
      />

      {/* ── Text Anchors ── */}
      <h2 id="text-anchors" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Text Anchor Selectors (SIMD-Accelerated)
      </h2>
      <p className="text-[var(--foreground-muted)] mb-4">
        Locate elements relative to visible text content using SIMD-accelerated string scanning.
      </p>
      <CodeBlock
        language="python"
        fileName="text_anchors.py"
        code={`# Find element by text content
el = page.find_text("Buy Now")

# Boundary text anchors
price = page.after_text("Price:")
name = page.before_text(" - Product Details")`}
        showLineNumbers
      />

      {/* ── Extraction Types ── */}
      <h2 id="extraction-types" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Extraction Types
      </h2>
      <p className="text-[var(--foreground-muted)] mb-4">
        Apply built-in transformations to clean and normalize extracted values instantly:
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm text-[var(--foreground-muted)] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--foreground)] font-semibold">
              <th className="py-2 px-3">Extraction Type</th>
              <th className="py-2 px-3">Input Example</th>
              <th className="py-2 px-3">Output Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">text</td>
              <td className="py-2 px-3"><code>"  Hello World  "</code></td>
              <td className="py-2 px-3"><code>"Hello World"</code></td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">price</td>
              <td className="py-2 px-3"><code>"$1,234.56 USD"</code></td>
              <td className="py-2 px-3"><code>"1234.56"</code></td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">datetime</td>
              <td className="py-2 px-3"><code>"Jan 15, 2024"</code></td>
              <td className="py-2 px-3"><code>"2024-01-15"</code></td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">url</td>
              <td className="py-2 px-3"><code>"/product/1"</code></td>
              <td className="py-2 px-3"><code>"https://example.com/product/1"</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocNav
        prev={{ label: 'Quick Start', href: '/quick-start' }}
        next={{ label: 'Session API', href: '/session' }}
      />
    </>
  );
}
