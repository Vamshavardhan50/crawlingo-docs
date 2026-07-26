import React from 'react';
import Head from 'next/head';
import { PageMeta, DocNav } from '@/components/feature-card';

export default function FaqPage() {
  const faqs = [
    {
      section: 'General',
      id: 'general',
      items: [
        {
          q: 'What is Crawlingo?',
          a: 'Crawlingo is a Rust-powered, high-performance web scraping and monitoring framework with native bindings for Python, Node.js (TypeScript), and Rust. It features self-healing DOM selectors, stealth TLS fingerprinting, and reactive change monitors.',
        },
        {
          q: 'Is Crawlingo free and open source?',
          a: 'Yes! Crawlingo is 100% open-source software licensed under the permissive MIT License.',
        },
      ],
    },
    {
      section: 'Installation & Build',
      id: 'installation',
      items: [
        {
          q: 'pip install fails on Linux',
          a: 'Ensure glibc 2.28+ is installed on your Linux distribution (ldd --version). Alternatively, install from source using: pip install --no-binary crawlingo crawlingo (requires Rust 1.70+).',
        },
        {
          q: 'npm install fails',
          a: 'Ensure you are using Node.js 18+. Check that platform-specific prebuilt binaries exist for your OS/architecture. If compiling from source, ensure Visual Studio Build Tools (Windows) or build-essential (Linux) are installed.',
        },
      ],
    },
    {
      section: 'Usage & Troubleshooting',
      id: 'usage',
      items: [
        {
          q: 'Getting HTTP 403 Forbidden on protected sites',
          a: 'The target website blocks generic HTTP clients. Enable stealth mode in your session: session.fetcher_tier("stealthy").browser_profile("chrome") to emulate genuine browser TLS/HTTP2 handshakes.',
        },
        {
          q: 'Selector returns empty or fails after layout changes',
          a: 'Enable Auto-Match on your Page or Session: session.auto_match(True). Crawlingo will use stored DOM fingerprints to automatically heal broken selectors in production.',
        },
      ],
    },
    {
      section: 'Performance & Benchmarks',
      id: 'performance',
      items: [
        {
          q: 'What is Crawlingo\'s throughput?',
          a: 'Crawlingo can achieve up to 3,500+ requests per second for lightweight page fetches on commodity hardware, using Tokio async I/O and Rayon parallel CPU processing.',
        },
        {
          q: 'What is the memory footprint?',
          a: 'Idle memory footprint is around ~2.4 MB. Multi-page crawls require ~85 MB constant memory when using the streaming dataset API.',
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>FAQ & Troubleshooting — Crawlingo</title>
        <meta name="description" content="Frequently Asked Questions and troubleshooting guide for Crawlingo web scraping framework." />
      </Head>

      <PageMeta
        title="FAQ & Troubleshooting"
        description="Answers to common questions about installation, usage, stealth browsing, auto-match, and performance."
        readingTime="4 min"
        lastUpdated="July 2026"
        githubPath="docs/faq.md"
      />

      <div className="space-y-12">
        {faqs.map(sec => (
          <div key={sec.id} id={sec.id}>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {sec.section}
            </h2>
            <div className="space-y-6">
              {sec.items.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                  <h3 className="font-semibold text-base text-[var(--foreground)] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Q: {item.q}
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <DocNav
        prev={{ label: 'Cookbook', href: '/cookbook' }}
        next={{ label: 'Architecture', href: '/architecture' }}
      />
    </>
  );
}
