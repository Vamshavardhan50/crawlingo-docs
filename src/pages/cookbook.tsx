import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, DocNav } from '@/components/feature-card';

export default function CookbookPage() {
  return (
    <>
      <Head>
        <title>Cookbook & Recipes — Crawlingo</title>
        <meta name="description" content="Production-ready Crawlingo code recipes for e-commerce, pagination, authenticated fetching, and webhooks." />
      </Head>

      <PageMeta
        title="Cookbook & Recipes"
        description="Production-ready, battle-tested code recipes for common web scraping and crawling scenarios."
        readingTime="5 min"
        lastUpdated="July 2026"
        githubPath="docs/cookbook.md"
      />

      {/* ── Recipe 1 ── */}
      <h2 id="1-e-commerce-product-scraping" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        1. E-Commerce Product Scraping
      </h2>
      <CodeBlock
        language="python"
        fileName="ecommerce.py"
        code={`import crawlingo

session = crawlingo.Session()
dataset = crawlingo.Dataset("https://example.com/products/item-1", session)

dataset.field("title", ".product-detail h1")
dataset.field("price", ".product-detail .price", extract_type="price")
dataset.field("sku", ".product-detail [data-sku]", extract_type="attr:data-sku")

result = dataset.build()
print(result.to_dict())`}
        showLineNumbers
      />

      {/* ── Recipe 2 ── */}
      <h2 id="2-pagination-all-3-schemes" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        2. Pagination (3 Schemes)
      </h2>
      <div className="space-y-6 mb-8 text-[var(--foreground-muted)]">
        <div>
          <h3 className="text-md font-semibold text-[var(--foreground)] mb-2">Scheme A: NextLink (Following the Next Button Element)</h3>
          <CodeBlock
            language="python"
            code={`import crawlingo

config = crawlingo.PaginationConfig.next_link("a.pagination-next")
crawl = crawlingo.Crawl("https://example.com/blog", crawlingo.Session())
crawl.with_pagination(config).field("title", "article h2")
results = crawl.build()`}
            showLineNumbers
          />
        </div>
        <div>
          <h3 className="text-md font-semibold text-[var(--foreground)] mb-2">Scheme B: PageNumber (Iterating numbered parameters)</h3>
          <CodeBlock
            language="python"
            code={`import crawlingo

config = crawlingo.PaginationConfig.page_number("https://example.com/list?page={page}", start_page=1, max_pages=10)
crawl = crawlingo.Crawl("https://example.com/list", crawlingo.Session())
crawl.with_pagination(config).field("title", ".item-name")
results = crawl.build()`}
            showLineNumbers
          />
        </div>
      </div>

      {/* ── Recipe 3 ── */}
      <h2 id="3-authenticated-fetching" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        3. Authenticated Fetching
      </h2>
      <CodeBlock
        language="python"
        fileName="auth_recipe.py"
        code={`import crawlingo

session = crawlingo.Session()

# 1. Bearer Token Auth
session.bearer_auth("my_secret_token_123")

# 2. HTTP Basic Auth
session.basic_auth("user", "pass")

# 3. Custom API Keys via Headers
session.headers({"X-API-Key": "my-secret-key"})

# 4. Session Cookies
session.cookies({"session_token": "abcde12345"})`}
        showLineNumbers
      />

      {/* ── Recipe 4 ── */}
      <h2 id="4-change-detection--webhooks" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        4. Change Detection & Webhooks
      </h2>
      <CodeBlock
        language="python"
        fileName="webhook_recipe.py"
        code={`import crawlingo

session = crawlingo.Session()
watcher = crawlingo.Watch("https://example.com/stock-ticker", session)

watcher.field("price", ".ticker-value", extract_type="price")
watcher.interval(10)  # poll every 10 seconds

def on_change(event):
    print(f"Price updated from {event.old_value} to {event.new_value}!")

watcher.on_change(on_change)`}
        showLineNumbers
      />

      <DocNav
        prev={{ label: 'Advanced Features', href: '/advanced' }}
        next={{ label: 'FAQ', href: '/faq' }}
      />
    </>
  );
}
