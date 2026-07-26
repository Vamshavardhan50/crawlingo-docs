import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, DocNav } from '@/components/feature-card';

export default function AdvancedPage() {
  return (
    <>
      <Head>
        <title>Advanced Features — Crawlingo</title>
        <meta name="description" content="Advanced features guide for Crawlingo. Hooks, middleware, mock transport, streaming datasets, proxy rotation, metrics, and MCP server." />
      </Head>

      <PageMeta
        title="Advanced Features"
        description="Lifecycle hooks, custom transports, streaming dataset building, proxy rotation, lock-free metrics, and built-in MCP server integration."
        readingTime="6 min"
        lastUpdated="July 2026"
        githubPath="docs/advanced.md"
      />

      {/* ── Hooks & Middleware ── */}
      <h2 id="hooks-and-middleware" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Hooks and Middleware
      </h2>
      <CodeBlock
        language="python"
        fileName="hooks.py"
        code={`from crawlingo import Page
from crawlingo.hooks import strip_whitespace, uppercase, log_request

page = (
    Page("https://example.com")
    .before_fetch(log_request)                               # Before HTTP request
    .before_parse(lambda html: html.replace("Old", "New"))   # Before parsing HTML
    .after_extract(strip_whitespace)                         # After extraction
    .after_extract(uppercase)                                # Chain multiple hooks
)`}
        showLineNumbers
      />

      {/* ── Mock Transport ── */}
      <h2 id="custom-transport-mock-for-testing" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Custom Transport (Mock for Offline Testing)
      </h2>
      <CodeBlock
        language="python"
        fileName="mock_transport.py"
        code={`from crawlingo import Session, Dataset
from crawlingo.transport import MockTransport

mock = MockTransport()
mock.with_html("https://example.com", "<h1>Hello World</h1>")

session = Session()
session.set_transport(mock)

result = Dataset("https://example.com", session=session)\\
    .field("title", "h1")\\
    .build()

print(result.to_dict())  # {"title": "Hello World"}`}
        showLineNumbers
      />

      {/* ── Streaming Dataset ── */}
      <h2 id="streaming-dataset" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Streaming Datasets
      </h2>
      <CodeBlock
        language="python"
        fileName="stream.py"
        code={`dataset = Dataset("https://example.com")
dataset.field("title", "h1")
dataset.field("price", "span.price", extraction_type="price")

stream = dataset.build_many_streamed(
    urls=["https://example.com/a", "https://example.com/b"],
    concurrency=10
)

for record in stream:
    print(record.fields)`}
        showLineNumbers
      />

      {/* ── Proxy Rotation ── */}
      <h2 id="proxy-rotation" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Proxy Rotation Schemes
      </h2>
      <CodeBlock
        language="python"
        fileName="proxy.py"
        code={`session = Session()

# 1. Static proxy
session.proxy("http://user:pass@proxy:8080")

# 2. Round-robin proxy pool
session.proxy_pool([
    "http://proxy1:8080",
    "http://proxy2:8080",
    "http://proxy3:8080",
])

# 3. Dynamic proxy provider endpoint
session.proxy_provider("https://proxy-service.example.com/get")`}
        showLineNumbers
      />

      {/* ── Metrics ── */}
      <h2 id="metrics" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Lock-Free Session Metrics
      </h2>
      <CodeBlock
        language="python"
        fileName="metrics.py"
        code={`session = Session()

# Retrieve lock-free atomic metrics
metrics = session.metrics()
print(f"Requests: {metrics.request_count}")
print(f"Success:  {metrics.success_count}")
print(f"Errors:   {metrics.error_count}")
print(f"Cache Hits: {metrics.cache_hits}")`}
        showLineNumbers
      />

      {/* ── MCP Server ── */}
      <h2 id="mcp-server" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Built-in MCP Server
      </h2>
      <p className="text-[var(--foreground-muted)] mb-4">
        Start Crawlingo's Model Context Protocol (MCP) server to connect scraping tools directly to Claude Code, Cursor, or LLM agents:
      </p>
      <CodeBlock
        language="bash"
        code={`crawlingo mcp --host 127.0.0.1 --port 8000`}
      />

      <DocNav
        prev={{ label: 'Change Detection', href: '/change-detection' }}
        next={{ label: 'Cookbook', href: '/cookbook' }}
      />
    </>
  );
}
