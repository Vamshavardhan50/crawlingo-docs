import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, DocNav } from '@/components/feature-card';

export default function SelectorsGuidePage() {
  return (
    <>
      <Head>
        <title>Selectors Guide — Crawlingo</title>
        <meta name="description" content="Comprehensive Selectors Guide for Crawlingo. CSS, XPath, Regex, and SIMD-accelerated Text Anchor selectors." />
      </Head>

      <PageMeta
        title="Selectors Guide"
        description="Crawlingo supports four selector engines: CSS, XPath, Regex, and SIMD-accelerated Text Anchors."
        readingTime="6 min"
        lastUpdated="July 2026"
        githubPath="docs/selectors.md"
      />

      {/* ── CSS Selectors ── */}
      <h2 id="css-selectors" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        CSS Selectors
      </h2>
      <CodeBlock
        language="python"
        fileName="css_syntax.py"
        code={`page.css("h1")                    # Tag name
page.css(".product-title")        # Class
page.css("#main-content")         # ID
page.css("[data-id]")             # Attribute presence
page.css("[href^=https]")         # Attribute starts-with
page.css("div > p")               # Direct child
page.css("div p")                 # Descendant
page.css("h1, h2, h3")           # Multiple selectors
page.css("ul li:first-child")     # Pseudo-class
page.css(":not(.hidden)")         # Negation`}
        showLineNumbers
      />

      {/* ── XPath Selectors ── */}
      <h2 id="xpath-selectors" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        XPath Selectors
      </h2>
      <CodeBlock
        language="python"
        fileName="xpath_syntax.py"
        code={`page.xpath("//h1")                            # All h1 elements
page.xpath("//div[@class='price']")            # Attribute filter
page.xpath("//a/@href")                        # Attribute extraction
page.xpath("//p[position()<3]")                # Positional
page.xpath("//div[contains(@class,'active')]") # Contains substring
page.xpath("//table/tbody/tr[1]/td[2]")        # Table cell navigation`}
        showLineNumbers
      />

      {/* ── Regex Selectors ── */}
      <h2 id="regex-selectors" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Regex Selectors
      </h2>
      <CodeBlock
        language="python"
        fileName="regex_syntax.py"
        code={`page.regex(r'\\b[A-Z][a-z]+ [A-Z][a-z]+\\b')        # Proper names
page.regex(r'[\\w.+-]+@[\\w-]+\\.[\\w.]+')             # Emails
page.regex(r'\\+\\d{1,3}\\s?\\(?\\d{3}\\)?\\s?\\d{3}[-.]?\\d{4}')  # Phones`}
        showLineNumbers
      />

      {/* ── Text Anchor Selectors ── */}
      <h2 id="text-anchor-selectors" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Text Anchor Selectors (SIMD-Accelerated)
      </h2>
      <CodeBlock
        language="python"
        fileName="text_anchor_syntax.py"
        code={`# Find by text content
page.find_text("Buy Now")                     # Case-sensitive
page.find_text("add to cart", case_sensitive=False)

# Text boundaries
page.after_text("Price:")                      # Element immediately following text
page.before_text(" - Product Details")         # Element preceding text`}
        showLineNumbers
      />

      {/* ── Performance Characteristics ── */}
      <h2 id="performance-characteristics" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Performance Characteristics
      </h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm text-[var(--foreground-muted)] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--foreground)] font-semibold">
              <th className="py-2 px-3">Selector Engine</th>
              <th className="py-2 px-3">Speed</th>
              <th className="py-2 px-3">Flexibility</th>
              <th className="py-2 px-3">Best Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">CSS</td>
              <td className="py-2 px-3">Fastest</td>
              <td className="py-2 px-3">Moderate</td>
              <td className="py-2 px-3">Standard HTML structures</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">XPath</td>
              <td className="py-2 px-3">Fast</td>
              <td className="py-2 px-3">Highest</td>
              <td className="py-2 px-3">Complex hierarchy & text node traversals</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">Regex</td>
              <td className="py-2 px-3">Moderate</td>
              <td className="py-2 px-3">High</td>
              <td className="py-2 px-3">Extracting unstructured text patterns</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">Text Anchor</td>
              <td className="py-2 px-3">Fastest (SIMD)</td>
              <td className="py-2 px-3">Moderate</td>
              <td className="py-2 px-3">Dynamic classes with static label text</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocNav
        prev={{ label: 'Key Features', href: '/features' }}
        next={{ label: 'Auto-Match Guide', href: '/auto-match' }}
      />
    </>
  );
}
