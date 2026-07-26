import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, Callout, DocNav } from '@/components/feature-card';

export default function AutoMatchPage() {
  return (
    <>
      <Head>
        <title>Auto-Match — Self-Healing Selectors — Crawlingo</title>
        <meta name="description" content="Auto-Match guide for Crawlingo. How self-healing DOM selector fingerprinting automatically recovers broken selectors when page layouts change." />
      </Head>

      <PageMeta
        title="Auto-Match — Self-Healing Selectors"
        description="Auto-Match automatically repairs broken CSS or XPath selectors in production using multi-dimensional DOM fingerprints stored in an embedded Sled database."
        readingTime="5 min"
        lastUpdated="July 2026"
        githubPath="docs/auto-match.md"
      />

      {/* ── How It Works ── */}
      <h2 id="how-it-works" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        How It Works
      </h2>
      <ol className="list-decimal list-inside space-y-3 text-[var(--foreground-muted)] mb-8">
        <li><strong className="text-[var(--foreground)]">First Match:</strong> When a selector matches an element, Auto-Match generates a multi-dimensional DOM fingerprint (tag, classes, ID, parent tags, depth, text hash).</li>
        <li><strong className="text-[var(--foreground)]">Fingerprint Cached:</strong> The fingerprint is cached in an embedded Sled database (<code>.crawlingo/</code>).</li>
        <li><strong className="text-[var(--foreground)]">Auto-Healing:</strong> If a website redesign breaks the selector, Auto-Match scans candidate nodes, runs Jaro-Winkler similarity comparisons against stored fingerprints, and binds the correct element.</li>
      </ol>

      {/* ── Usage ── */}
      <h2 id="usage" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Usage
      </h2>
      <CodeBlock
        language="python"
        fileName="auto_match.py"
        code={`from crawlingo import Page, Session, Dataset

# Enable on Page
page = Page("https://example.com").auto_match(True)

# Enable on Dataset
dataset = Dataset("https://example.com").auto_match(True)

# Enable on Session (applies to all pages/datasets sharing session)
session = Session().auto_match(True)
page = Page("https://example.com", session=session)`}
        showLineNumbers
      />

      {/* ── Fingerprint Components ── */}
      <h2 id="fingerprint-components" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Fingerprint Components & Default Weights
      </h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left text-sm text-[var(--foreground-muted)] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--foreground)] font-semibold">
              <th className="py-2 px-3">Feature</th>
              <th className="py-2 px-3">Default Weight</th>
              <th className="py-2 px-3">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">tag</td>
              <td className="py-2 px-3"><code>1.0</code></td>
              <td className="py-2 px-3">HTML element tag (div, span, h1, etc.)</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">class_name</td>
              <td className="py-2 px-3"><code>0.8</code></td>
              <td className="py-2 px-3">CSS class list comparison</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">id</td>
              <td className="py-2 px-3"><code>0.6</code></td>
              <td className="py-2 px-3">Element ID attribute</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">attributes</td>
              <td className="py-2 px-3"><code>0.4</code></td>
              <td className="py-2 px-3">All key-value attribute pairs</td>
            </tr>
            <tr className="border-b border-[var(--border)]/50">
              <td className="py-2 px-3 font-mono text-xs text-[var(--brand-orange)]">parent_tag</td>
              <td className="py-2 px-3"><code>0.5</code></td>
              <td className="py-2 px-3">Parent DOM node tag name</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Custom Weights ── */}
      <h2 id="custom-weights" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Custom Similarity Weights
      </h2>
      <CodeBlock
        language="python"
        fileName="weights.py"
        code={`session.auto_match_weights({
    "tag": 1.0,
    "class_name": 0.9,
    "id": 0.7,
    "attributes": 0.5,
    "parent_tag": 0.6,
})`}
        showLineNumbers
      />

      <DocNav
        prev={{ label: 'Selectors Guide', href: '/selectors' }}
        next={{ label: 'Change Detection', href: '/change-detection' }}
      />
    </>
  );
}
