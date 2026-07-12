import { Html, Head, Main, NextScript } from 'next/document';

const SITE_URL = 'https://crawlingo.dev';
const SITE_NAME = 'Crawlingo';
const SITE_DESC = 'Crawlingo is a Rust-powered, self-healing web scraping framework with Python, Node.js, and Rust SDKs. Achieve 3,500+ req/s with auto-repairing selectors, stealth TLS, proxy rotation, and AI-ready data extraction.';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        {/* ── Charset & Viewport ── */}
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#FF6B35" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0B1220" media="(prefers-color-scheme: dark)" />

        {/* ── Primary SEO ── */}
        <meta name="description" content={SITE_DESC} />
        <meta name="keywords" content="Crawlingo, Rust web crawler, web scraping framework, Python web scraper, Node.js scraping, self-healing scraper, browser automation, data extraction, proxy rotation, AI scraper, RAG data collection, LLM dataset generation, HTML parser, SIMD web crawler, stealth TLS, change monitoring" />
        <meta name="author" content="Crawlingo Contributors" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="google-site-verification" content="2-zTpn3SPBWwB369vAfc9yYPnjYuTvffXoxnlRHVJMo" />
        <link rel="canonical" href={SITE_URL} />

        {/* ── Open Graph ── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content="Crawlingo — Self-Healing Web Scraping Framework" />
        <meta property="og:description" content={SITE_DESC} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Crawlingo — Rust-Powered Self-Healing Web Scraping" />
        <meta property="og:locale" content="en_US" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@crawlingo" />
        <meta name="twitter:creator" content="@crawlingo" />
        <meta name="twitter:title" content="Crawlingo — Self-Healing Web Scraping Framework" />
        <meta name="twitter:description" content={SITE_DESC} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Crawlingo — Rust-Powered Self-Healing Web Scraping" />

        {/* ── Favicon / Icons ── */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ── Google Fonts ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* ── Structured Data: SoftwareApplication ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Crawlingo',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Linux, macOS, Windows',
              description: SITE_DESC,
              url: SITE_URL,
              downloadUrl: 'https://pypi.org/project/crawlingo/',
              softwareVersion: '0.1.0',
              license: 'https://github.com/Vamshavardhan50/crawlingo/blob/main/LICENSE',
              programmingLanguage: ['Rust', 'Python', 'TypeScript'],
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Organization',
                name: 'Crawlingo Contributors',
                url: SITE_URL,
              },
              maintainer: {
                '@type': 'Organization',
                name: 'Crawlingo Contributors',
                url: SITE_URL,
              },
              codeRepository: 'https://github.com/Vamshavardhan50/crawlingo',
              keywords: 'web scraping, crawler, Rust, Python, Node.js, self-healing, stealth',
              featureList: [
                'Self-healing DOM selectors',
                'Stealth TLS fingerprint emulation',
                'SIMD-accelerated text anchors',
                'Proxy rotation',
                'Change monitoring & webhooks',
                'Dataset export (JSON, CSV, Parquet)',
                'Python, Node.js, and Rust SDKs',
                'AI/LLM-ready markdown output',
              ],
            }),
          }}
        />

        {/* ── Structured Data: Organization ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Crawlingo',
              url: SITE_URL,
              logo: `${SITE_URL}/logo.svg`,
              sameAs: [
                'https://github.com/Vamshavardhan50/crawlingo',
                'https://pypi.org/project/crawlingo/',
                'https://www.npmjs.com/package/crawlingo',
                'https://crates.io/crates/crawlingo',
              ],
            }),
          }}
        />

        {/* ── Structured Data: BreadcrumbList (home) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Documentation', item: `${SITE_URL}/quick-start` },
              ],
            }),
          }}
        />

        {/* ── Structured Data: FAQ ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is Crawlingo?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Crawlingo is a Rust-powered web scraping framework with self-healing selectors, stealth TLS emulation, and Python, Node.js, and Rust SDKs. It achieves 3,500+ req/s with zero-copy architecture.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How does self-healing work in Crawlingo?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Crawlingo caches DOM element fingerprints (tag, class, id, text, structure). When a selector fails after a website redesign, the Rust engine scores all candidate nodes using Jaro-Winkler and Jaccard similarity, automatically binding the best match above 94% confidence.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do I install Crawlingo?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Install via pip: `pip install crawlingo` (Python 3.8+), npm: `npm install crawlingo` (Node.js 18+), or cargo: `cargo add crawlingo` (Rust 1.70+).',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is Crawlingo free and open source?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Crawlingo is fully open source under the MIT License. You can use it freely in personal and commercial projects.',
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
