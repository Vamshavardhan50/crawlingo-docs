import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
  ArrowRight, Shield, Globe, Cpu, Database,
  Activity, GitBranch, Zap, Check, Code,
  Terminal, FileText, Star, Package, ExternalLink,
} from 'lucide-react';
import { TabCodeBlock, FeatureCard } from '@/components/feature-card';

/* ── SVG decorations matching brand visual style ── */
function HeroDecoration() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Soft wave bottom-right */}
      <g opacity="0.35">
        <path d="M900 500 Q960 440 1020 500 Q1080 560 1140 500 Q1200 440 1260 500 Q1320 560 1380 500" stroke="#FF6B35" strokeWidth="1.5" fill="none"/>
        <path d="M880 520 Q940 460 1000 520 Q1060 580 1120 520 Q1180 460 1240 520 Q1300 580 1360 520" stroke="#FF6B35" strokeWidth="1" fill="none" opacity="0.6"/>
        <path d="M860 540 Q920 480 980 540 Q1040 600 1100 540 Q1160 480 1220 540 Q1280 600 1340 540" stroke="#FF6B35" strokeWidth="0.8" fill="none" opacity="0.4"/>
      </g>
      {/* Indigo top-left arc */}
      <circle cx="80" cy="80" r="60" stroke="#6366F1" strokeWidth="1" fill="none" opacity="0.15"/>
      <circle cx="80" cy="80" r="40" stroke="#6366F1" strokeWidth="0.8" fill="none" opacity="0.10"/>
      {/* Floating accent dots */}
      <circle cx="120" cy="180" r="3.5" fill="#8B5CF6" opacity="0.5"/>
      <circle cx="960" cy="60"  r="5"   fill="#FF6B35" opacity="0.6"/>
      <circle cx="1080" cy="200" r="3" fill="#8B5CF6" opacity="0.35"/>
      <circle cx="200" cy="420" r="2.5" fill="#6366F1" opacity="0.4"/>
      {/* Dot grid top area */}
      <g opacity="0.12">
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={800 + col * 20}
              cy={20 + row * 20}
              r="1.5"
              fill="#6366F1"
            />
          ))
        )}
      </g>
      {/* Bottom-left dot grid */}
      <g opacity="0.10">
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => (
            <circle
              key={`bl-${row}-${col}`}
              cx={20 + col * 20}
              cy={420 + row * 20}
              r="1.5"
              fill="#6366F1"
            />
          ))
        )}
      </g>
    </svg>
  );
}

/* ── Inline logo for hero ── */
function HeroLogo() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Crawlingo">
      <path d="M52 32C52 43.046 43.046 52 32 52C20.954 52 12 43.046 12 32C12 20.954 20.954 12 32 12C38.627 12 44.52 15.12 48.35 20"
        stroke="#0B1220" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M42 32C42 37.523 37.523 42 32 42C26.477 42 22 37.523 22 32C22 26.477 26.477 22 32 22C35.314 22 38.261 23.587 40.175 26"
        stroke="#0B1220" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <circle cx="32" cy="32" r="5" fill="#FF6B35"/>
      <circle cx="32" cy="32" r="8.5" stroke="#0B1220" strokeWidth="2.5" fill="none"/>
    </svg>
  );
}

/* ── Code examples for the 3-language tab block ── */
const CODE_EXAMPLES = [
  {
    language: 'python',
    label: '🐍 Python',
    fileName: 'main.py',
    code: `from crawlingo import Page, Session, Dataset, Crawl, Watch

# Fetch a page instantly
page = Page("https://example.com")
print(page.title())           # "Example Domain"
print(page.status)            # 200
print(page.markdown()[:80])   # Clean markdown output

# CSS, XPath, Regex, Text Anchors — all in one API
h1     = page.css("h1").text()
paras  = page.xpath("//p")
prices = page.regex(r"\\$[\\d.]+")
el     = page.find_text("Price:")   # SIMD-accelerated

# Self-healing session
with Session() as s:
    s.auto_match(True).fetcher_tier("stealthy").rate_limit(5)

    result = (Dataset("https://shop.example.com", session=s)
              .field("title",  "h1")
              .field("price",  ".price", extraction_type="price")
              .field("stock",  ".stock-badge")
              .build())

    print(result.to_dict())   # {"title": "...", "price": "99.99"}
    result.to_json("data.json")
    result.to_parquet("data.parquet")`,
  },
  {
    language: 'typescript',
    label: '📘 Node.js',
    fileName: 'index.ts',
    code: `import { Page, Session, Dataset, Crawl, Watch } from 'crawlingo';

// Fetch a page
const page = await Page.create("https://example.com");
console.log(page.title(), page.status);  // "Example Domain" 200

// Self-healing session
const session = new Session()
  .autoMatch(true)
  .fetcherTier("stealthy")
  .rateLimit(5);

// Extract structured data
const result = await new Dataset("https://shop.example.com", session)
  .field("title",  "h1")
  .field("price",  ".price", { extractType: "price" })
  .field("rating", ".star-rating")
  .build();

console.log(result.toDict());
result.toJsonFile("data.json");

// Watch for price changes
const watcher = new Watch("https://shop.example.com/p/1")
  .field("price", ".price", { extractType: "price" })
  .interval(300);

watcher.onPriceChange(e => {
  console.log(\`Price changed: \${e.oldValue} → \${e.newValue}\`);
  console.log(\`Change: \${e.percentageChange.toFixed(1)}%\`);
});

watcher.run();`,
  },
  {
    language: 'rust',
    label: '🦀 Rust',
    fileName: 'main.rs',
    code: `use crawlingo::*;
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Create a self-healing session
    let session = Arc::new(Session::new());
    session.set_auto_match(true);
    session.set_fetcher_tier("stealthy");
    session.set_rate_limit(5.0);

    // Fetch and parse
    let page = Page::new("https://example.com", session.clone()).await?;
    println!("Title:  {:?}", page.title());
    println!("Status: {}", page.status());

    // Extract structured data
    let result = Dataset::new("https://shop.example.com", session.clone())
        .with_field(DatasetField::new("title", "h1"))
        .with_field(
            DatasetField::new("price", ".price")
                .with_extract_type(ExtractionType::Price)
                .with_default("N/A"),
        )
        .build_async()
        .await?;

    println!("{:#?}", result.fields);
    result.to_parquet("data.parquet")?;
    Ok(())
}`,
  },
];

/* ── Features ── */
const FEATURES = [
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Self-Healing Selectors',
    description: 'DOM fingerprints + Jaro-Winkler similarity scoring auto-repair selectors when websites change their structure. Never write a CSS fix again.',
    accent: true,
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: 'Stealth TLS Browsing',
    description: 'Bypass Cloudflare Turnstile and bot detection via raw HTTP/2 with JA3/TLS fingerprint rotation. Chrome, Firefox, Safari profiles built-in.',
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: 'SIMD-Accelerated',
    description: 'Text anchor search runs at 2.1M ops/s using parallel CPU vectors (memchr + Rayon). Extract tables even when CSS classes are absent.',
    accent: true,
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    title: 'Proxy Rotation',
    description: 'Round-robin static pool, remote proxy list provider, or per-host rotation with exponential backoff and Retry-After header support.',
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: 'Change Monitoring',
    description: 'Poll-based DOM watchers publish typed callbacks (on_change, on_price_change, on_stock_change) and webhooks when content drifts.',
    accent: true,
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: 'Zero-Copy Rust Core',
    description: 'Compiled Rust engine with memory-mapped shared state across Python, Node.js, and Rust SDKs. 3,500+ req/s on commodity hardware.',
  },
];

/* ── Benchmarks ── */
const BENCH_ROWS = [
  { metric: 'Throughput (50 concurrent)',   crawlingo: '3,500 req/s',   scrapy: '~500 req/s',  playwright: '~50 req/s' },
  { metric: 'Memory (session idle)',        crawlingo: '2.4 MB',        scrapy: '~50 MB',       playwright: '~200 MB' },
  { metric: 'p50 latency',                 crawlingo: '12 ms',          scrapy: '120 ms',       playwright: '800 ms' },
  { metric: 'Self-healing selectors',      crawlingo: '✅ Built-in',    scrapy: '❌',            playwright: '❌' },
  { metric: 'Stealth TLS',                 crawlingo: '✅ Built-in',    scrapy: '❌',            playwright: '❌' },
  { metric: 'Change monitoring',           crawlingo: '✅ Built-in',    scrapy: '❌',            playwright: '❌' },
  { metric: 'Multi-language SDKs',         crawlingo: 'Python, Node, Rust', scrapy: 'Python', playwright: 'JS, Python, C#' },
];

/* ── Use cases ── */
const USE_CASES = [
  {
    icon: '🏷️',
    title: 'Price & Stock Monitoring',
    description: 'Track competitor prices and inventory with typed callbacks. Get alerts the moment something changes.',
    href: '/quick-start',
  },
  {
    icon: '🤖',
    title: 'LLM & RAG Datasets',
    description: 'Export clean Markdown from any site. Stream millions of URLs into Parquet for LLM fine-tuning and RAG pipelines.',
    href: '/features#datasets',
  },
  {
    icon: '🔍',
    title: 'SEO Auditing',
    description: 'Crawl 5,000+ pages, extract titles, canonical URLs, H1 counts, and meta descriptions into a structured report.',
    href: '/quick-start',
  },
  {
    icon: '🏢',
    title: 'Competitive Intelligence',
    description: 'Scrape competitor product listings using stealth profiles that bypass bot detection — without a browser.',
    href: '/features#stealth',
  },
];

function HeroVisualCard() {
  return (
    <div className="relative w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl p-6 overflow-hidden">
      {/* Card Header (Mac-style dots) */}
      <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
        </div>
        <span className="text-[10px] font-mono text-[var(--foreground-subtle)]">self_healing_selector.py</span>
      </div>

      {/* Code / Visual Demo */}
      <div className="space-y-4 font-mono text-xs">
        <div>
          <span className="text-[var(--code-comment)]"># Target selector modified on target website</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-red-500 line-through">button#submit.btn-primary</span>
            <span className="text-[var(--foreground-subtle)] text-[10px]">→</span>
            <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold">div.cta-btn-modern</span>
          </div>
        </div>

        <div className="space-y-1.5 border-t border-[var(--border)] pt-3">
          <div className="flex items-center gap-2">
            <span className="text-purple-500">from</span>
            <span className="text-blue-500">crawlingo</span>
            <span className="text-purple-500">import</span>
            <span className="text-blue-500">Session</span>
          </div>
          <div>
            <span className="text-blue-500">s</span>
            <span className="text-[var(--foreground)]"> = </span>
            <span className="text-yellow-500">Session</span>
            <span className="text-[var(--foreground)]">()</span>
          </div>
          <div>
            <span className="text-blue-500">s</span>
            <span className="text-[var(--foreground)]">.</span>
            <span className="text-blue-500">auto_match</span>
            <span className="text-[var(--foreground)]">(</span>
            <span className="text-orange-500">True</span>
            <span className="text-[var(--foreground)]">)</span>
          </div>
          <div className="text-[var(--foreground-subtle)]">...</div>
          <div>
            <span className="text-blue-500">btn</span>
            <span className="text-[var(--foreground)]"> = s.</span>
            <span className="text-blue-500">css</span>
            <span className="text-[var(--foreground)]">(</span>
            <span className="text-green-500">"button#submit"</span>
            <span className="text-[var(--foreground)]">).</span>
            <span className="text-blue-500">text</span>
            <span className="text-[var(--foreground)]">()</span>
          </div>
        </div>

        {/* Live Fingerprint Match Badge */}
        <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-3.5 flex flex-col gap-2 mt-4 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Auto-Matched Similarity: 96%</span>
          </div>
          <p className="text-[10px] text-[var(--foreground-muted)] leading-relaxed font-sans">
            Crawlingo auto-matched the drifted <code>div.cta-btn-modern</code> element based on 12 cached DOM layout weights (Jaro-Winkler distance).
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Crawlingo — Self-Healing Web Scraping Framework</title>
        <meta name="description" content="Rust-powered web scraping with self-healing selectors, stealth TLS, and Python/Node.js/Rust SDKs. Achieve 3,500+ req/s." />
      </Head>

      {/* ════════════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[calc(100vh-80px)] pt-28 pb-20 flex items-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -5%, rgba(99,102,241,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 90% 60%, rgba(255,107,53,0.07) 0%, transparent 60%), var(--background)',
        }}
      >
        <HeroDecoration />

        {/* Bulletproof Dynamic Background Blobs */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* Orange Blob */}
          <div 
            className="absolute -top-[10%] -left-[10%] w-[55%] h-[55%] rounded-full animate-blob-slow" 
            style={{
              background: 'radial-gradient(circle, rgba(255, 107, 53, 0.16) 0%, transparent 70%)',
              filter: 'blur(90px)',
              WebkitFilter: 'blur(90px)',
            }}
          />
          {/* Indigo Blob */}
          <div 
            className="absolute top-[25%] -right-[15%] w-[65%] h-[65%] rounded-full animate-blob-medium" 
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, transparent 70%)',
              filter: 'blur(110px)',
              WebkitFilter: 'blur(110px)',
            }}
          />
          {/* Violet Blob */}
          <div 
            className="absolute -bottom-[10%] left-[15%] w-[50%] h-[50%] rounded-full animate-blob-slow" 
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
              filter: 'blur(80px)',
              WebkitFilter: 'blur(80px)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 max-w-3xl">
            {/* Version pill */}
            <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] shadow-sm animate-fade-in">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="animate-pulse-dot h-2 w-2 rounded-full bg-[var(--color-success)]" />
              </span>
              <span className="text-xs font-mono font-medium text-[var(--foreground-muted)]">v0.1.0</span>
              <span className="text-xs text-[var(--foreground-subtle)]">·</span>
              <span className="text-xs text-[var(--foreground-subtle)]">Open Source · MIT License</span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--brand-navy)] animate-slide-up"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em', lineHeight: '1.08' }}
            >
              Web Scraping
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #6366F1 60%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                That Never Breaks.
              </span>
            </h1>

            {/* Sub */}
            <p className="mt-6 text-xl text-[var(--foreground-muted)] leading-relaxed max-w-2xl animate-slide-up delay-150">
              Crawlingo is a Rust-powered web scraping framework with{' '}
              <strong className="text-[var(--foreground)] font-semibold">self-healing selectors</strong>,{' '}
              <strong className="text-[var(--foreground)] font-semibold">stealth TLS</strong>, and first-class
              Python, Node.js, and Rust SDKs. Achieve{' '}
              <strong className="text-[var(--foreground)] font-semibold">3,500+ req/s</strong> with a 2.4 MB memory footprint.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-3 animate-slide-up delay-300">
              <Link
                href="/quick-start"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl text-base font-semibold text-white transition-all duration-150 shadow-orange hover:-translate-y-0.5"
                style={{ background: 'var(--brand-orange)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--brand-orange-dark)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--brand-orange)')}
              >
                <Zap className="h-4 w-4" />
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="https://github.com/Vamshavardhan50/crawlingo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl text-base font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)] transition-all duration-150"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                View on GitHub
                <Star className="h-3.5 w-3.5 opacity-60" />
              </Link>
            </div>

            {/* Quick install */}
            <div className="mt-8 animate-slide-up delay-500">
              <div className="inline-flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--brand-navy)] text-[var(--code-fg)] font-mono text-sm max-w-full">
                <span className="text-[#34D399]">$</span>
                <span className="whitespace-nowrap">pip install crawlingo</span>
                <span className="text-[var(--code-comment)] mx-1">·</span>
                <span className="text-[#34D399]">$</span>
                <span className="whitespace-nowrap">npm install crawlingo</span>
                <span className="text-[var(--code-comment)] mx-1 hidden sm:inline">·</span>
                <span className="text-[#34D399] sm:inline hidden">$</span>
                <span className="whitespace-nowrap sm:inline hidden">cargo add crawlingo</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block animate-fade-in delay-500">
            <HeroVisualCard />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          STATS BAR
          ════════════════════════════════════════════════════ */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-[var(--border)] lg:grid-cols-4">
            {[
              { value: '3,500+',   label: 'requests / second',    sub: 'Standard mode (50 concurrent)' },
              { value: '5',        label: 'selector types',        sub: 'CSS · XPath · Regex · Text · Anchor' },
              { value: '3',        label: 'language SDKs',         sub: 'Python · Node.js · Rust' },
              { value: '2.4 MB',   label: 'memory (idle session)', sub: '94× lighter than Playwright' },
            ].map(stat => (
              <div key={stat.value} className="flex flex-col items-center text-center py-8 px-4 lg:py-10">
                <div
                  className="text-3xl font-bold tabular-nums"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--brand-orange)' }}
                >
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-medium text-[var(--foreground)]">{stat.label}</div>
                <div className="mt-0.5 text-xs text-[var(--foreground-subtle)]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CODE SHOWCASE
          ════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-start">
            {/* Left: copy */}
            <div className="lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--brand-orange)]/10 border border-[var(--brand-orange)]/20">
                <Code className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
                <span className="text-xs font-semibold text-[var(--brand-orange)]">Developer First</span>
              </div>
              <h2
                className="text-4xl font-bold tracking-tight text-[var(--foreground)]"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.025em' }}
              >
                One unified API.
                <br />
                Three languages.
              </h2>
              <p className="mt-4 text-lg text-[var(--foreground-muted)] leading-relaxed">
                The same Rust core powers all three SDKs with zero-copy memory sharing and identical semantics. Switch languages without rewriting your scraping logic.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  { icon: '🔧', text: 'Self-healing selectors auto-fix when websites change' },
                  { icon: '🛡️', text: 'Stealth TLS rotates browser fingerprints per request' },
                  { icon: '📦', text: 'Export to JSON, CSV, or Parquet in one method call' },
                  { icon: '👁️', text: 'Watch monitors fire webhooks on any DOM change' },
                ].map(item => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                    <span className="text-sm text-[var(--foreground-muted)]">{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href="/quick-start"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-orange)] hover:text-[var(--brand-orange-dark)] transition-colors"
                >
                  Read the Quick Start guide <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right: code tabs */}
            <div>
              <TabCodeBlock tabs={CODE_EXAMPLES} defaultTab="python" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURES GRID
          ════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--brand-indigo)]/10 border border-[var(--brand-indigo)]/20">
              <Zap className="h-3.5 w-3.5 text-[var(--brand-indigo)]" />
              <span className="text-xs font-semibold text-[var(--brand-indigo)]">Features</span>
            </div>
            <h2
              className="text-4xl font-bold tracking-tight text-[var(--foreground)]"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.025em' }}
            >
              Built for production.
              <br />
              Designed for developers.
            </h2>
            <p className="mt-4 text-lg text-[var(--foreground-muted)]">
              Everything you need to build reliable data pipelines that survive website changes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(f => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ARCHITECTURE
          ════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--brand-orange)]/10 border border-[var(--brand-orange)]/20">
              <GitBranch className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
              <span className="text-xs font-semibold text-[var(--brand-orange)]">Architecture</span>
            </div>
            <h2
              className="text-4xl font-bold tracking-tight text-[var(--foreground)]"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.025em' }}
            >
              One engine. Zero compromises.
            </h2>
            <p className="mt-4 text-lg text-[var(--foreground-muted)]">
              A Rust core compiled once, wrapped by thin FFI layers for each language SDK.
            </p>
          </div>

          {/* Architecture diagram */}
          <div className="relative">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0">
              {/* Layer: SDKs */}
              <div className="flex flex-col gap-2 lg:mr-6">
                {['Python SDK', 'Node.js SDK', 'Rust SDK'].map(sdk => (
                  <div
                    key={sdk}
                    className="flex items-center justify-center w-32 h-12 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm text-sm font-medium text-[var(--foreground-muted)]"
                  >
                    {sdk}
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center h-12 mx-4">
                <div className="flex items-center gap-1 text-[var(--foreground-subtle)]">
                  <div className="h-px w-12 bg-gradient-to-r from-[var(--border)] to-[var(--brand-orange)]" />
                  <div className="text-xs font-mono border border-[var(--border)] bg-[var(--surface)] px-2 py-1 rounded-full whitespace-nowrap">FFI</div>
                  <div className="h-px w-12 bg-gradient-to-r from-[var(--brand-orange)] to-[var(--border)]" />
                </div>
              </div>

              {/* Core */}
              <div
                className="w-52 py-8 rounded-2xl border-2 flex flex-col items-center gap-2 shadow-lg relative"
                style={{ borderColor: 'var(--brand-orange)', background: 'linear-gradient(145deg, #fff 0%, #FAFAFA 100%)' }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ background: 'var(--brand-orange)' }}
                >
                  Rust Core
                </div>
                {['Engine', 'Parser', 'Selectors', 'Dataset', 'Crawl', 'Watch', 'Metrics'].map(c => (
                  <div
                    key={c}
                    className="text-xs px-3 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground-muted)] w-36 text-center"
                  >
                    {c}
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center h-12 mx-4">
                <div className="flex items-center gap-1 text-[var(--foreground-subtle)]">
                  <div className="h-px w-12 bg-gradient-to-r from-[var(--border)] to-[var(--brand-indigo)]" />
                  <div className="text-xs font-mono border border-[var(--border)] bg-[var(--surface)] px-2 py-1 rounded-full whitespace-nowrap">HTTP/2</div>
                  <div className="h-px w-12 bg-gradient-to-r from-[var(--brand-indigo)] to-[var(--border)]" />
                </div>
              </div>

              {/* Output */}
              <div className="flex flex-col gap-2 lg:ml-2">
                {[
                  { label: 'Stealth TLS',    color: 'var(--brand-indigo)' },
                  { label: 'Proxy Pool',     color: 'var(--brand-violet)' },
                  { label: 'Rate Limiter',   color: 'var(--brand-teal)' },
                  { label: 'Fingerprint DB', color: 'var(--brand-orange)' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 w-36 h-12 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm px-3 text-sm font-medium text-[var(--foreground-muted)]"
                  >
                    <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/architecture"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--brand-orange)] font-medium hover:text-[var(--brand-orange-dark)] transition-colors"
              >
                Explore full architecture <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          BENCHMARKS
          ════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--brand-indigo)]/10 border border-[var(--brand-indigo)]/20">
              <Zap className="h-3.5 w-3.5 text-[var(--brand-indigo)]" />
              <span className="text-xs font-semibold text-[var(--brand-indigo)]">Performance</span>
            </div>
            <h2
              className="text-4xl font-bold tracking-tight text-[var(--foreground)]"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.025em' }}
            >
              Benchmarks don't lie.
            </h2>
            <p className="mt-4 text-lg text-[var(--foreground-muted)]">
              Crawlingo outperforms pure-Python scrapers by 7×, and headless browsers by 70×.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-md">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="text-left">Metric</th>
                  <th className="text-center" style={{ color: 'var(--brand-orange)' }}>Crawlingo</th>
                  <th className="text-center">Scrapy</th>
                  <th className="text-center">Playwright</th>
                </tr>
              </thead>
              <tbody>
                {BENCH_ROWS.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bg-[var(--surface)]'}>
                    <td className="font-medium">{row.metric}</td>
                    <td className="text-center font-semibold" style={{ color: 'var(--brand-orange)' }}>{row.crawlingo}</td>
                    <td className="text-center text-[var(--foreground-muted)]">{row.scrapy}</td>
                    <td className="text-center text-[var(--foreground-muted)]">{row.playwright}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/benchmarks"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--brand-orange)] font-medium hover:text-[var(--brand-orange-dark)] transition-colors"
            >
              View full benchmark methodology <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          USE CASES
          ════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--brand-violet)]/10 border border-[var(--brand-violet)]/20">
              <FileText className="h-3.5 w-3.5 text-[var(--brand-violet)]" />
              <span className="text-xs font-semibold text-[var(--brand-violet)]">Use Cases</span>
            </div>
            <h2
              className="text-4xl font-bold tracking-tight text-[var(--foreground)]"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.025em' }}
            >
              Whatever you're extracting,
              <br />
              Crawlingo handles it.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map(uc => (
              <Link
                key={uc.title}
                href={uc.href}
                className="group p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand-orange)]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-3xl mb-4">{uc.icon}</div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {uc.title}
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{uc.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-[var(--brand-orange)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          INSTALL / SDK OVERVIEW
          ════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[var(--brand-navy)]" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div style={{
            position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: '120%', height: '200%',
            background: 'radial-gradient(ellipse, rgba(255,107,53,0.3) 0%, transparent 60%)',
          }} />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.025em' }}
          >
            Start building in{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF8A5C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              2 minutes.
            </span>
          </h2>
          <p className="text-lg text-white/60 mb-12 max-w-xl mx-auto">
            Install via your language's package manager. Pre-built wheels for Linux, macOS, and Windows.
          </p>

          {/* Install commands */}
          <div className="grid gap-3 sm:grid-cols-3 mb-12 text-left">
            {[
              { lang: 'Python', cmd: 'pip install crawlingo', color: '#3B82F6', note: 'Python 3.8+' },
              { lang: 'Node.js', cmd: 'npm install crawlingo', color: '#F59E0B', note: 'Node.js 18+' },
              { lang: 'Rust', cmd: 'cargo add crawlingo', color: '#FB923C', note: 'Rust 1.70+' },
            ].map(item => (
              <div
                key={item.lang}
                className="rounded-xl p-4 border"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: item.color }}>{item.lang}</span>
                  <span className="text-xs text-white/30">{item.note}</span>
                </div>
                <code className="text-sm text-white/80 font-mono">{item.cmd}</code>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/quick-start"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-base font-semibold text-[var(--brand-navy)] bg-white hover:bg-white/90 transition-all duration-150 shadow-lg"
            >
              <Zap className="h-4 w-4" style={{ color: 'var(--brand-orange)' }} />
              Quick Start Guide
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/Vamshavardhan50/crawlingo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl text-base font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-150"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              Star on GitHub
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
