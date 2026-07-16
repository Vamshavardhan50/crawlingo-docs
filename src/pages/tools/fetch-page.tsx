import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, Callout, DocNav } from '@/components/feature-card';

const TOOLS = [
  {
    name: 'fetch_page',
    desc: 'Fetches a single web page and extracts its title, HTTP response status, and trimmed body text.',
    params: [
      { name: 'url', type: 'string', req: 'Yes', desc: 'The target web page URL.' },
      { name: 'auto_match', type: 'boolean', req: 'No (default: false)', desc: 'Enable self-healing DOM fingerprint repair.' },
      { name: 'timeout', type: 'integer', req: 'No (default: 30)', desc: 'Fetch timeout in seconds.' },
    ],
    usage: `// POST request JSON-RPC payload
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "fetch_page",
    "arguments": {
      "url": "https://news.ycombinator.com",
      "auto_match": true
    }
  }
}`
  },
  {
    name: 'extract_data',
    desc: 'Extracts customized fields from a single URL using CSS or XPath selectors with optional self-healing.',
    params: [
      { name: 'url', type: 'string', req: 'Yes', desc: 'The target web page URL.' },
      { name: 'fields', type: 'array[object]', req: 'Yes', desc: 'List of extraction fields. Each object requires: { name, selector, selector_type? }.' },
      { name: 'auto_match', type: 'boolean', req: 'No (default: false)', desc: 'Enable self-healing selector recovery.' },
    ],
    usage: `// POST request JSON-RPC payload
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "extract_data",
    "arguments": {
      "url": "https://example.com",
      "auto_match": true,
      "fields": [
        { "name": "headline", "selector": "h1" },
        { "name": "cta", "selector": "//a[@class='button']", "selector_type": "xpath" }
      ]
    }
  }
}`
  },
  {
    name: 'crawl_site',
    desc: 'Starts a BFS crawler from a seed URL, following links, enqueuing pages, and extracting defined fields.',
    params: [
      { name: 'start_url', type: 'string', req: 'Yes', desc: 'The seed page to start crawling.' },
      { name: 'follow_selector', type: 'string', req: 'Yes', desc: 'CSS selector of link anchors to traverse.' },
      { name: 'fields', type: 'array[object]', req: 'Yes', desc: 'Custom fields to extract from each crawled page.' },
      { name: 'limit', type: 'integer', req: 'No (default: 10)', desc: 'Maximum number of pages to crawl.' },
      { name: 'depth', type: 'integer', req: 'No (default: 2)', desc: 'Maximum traversal hops from the seed.' },
    ],
    usage: `// POST request JSON-RPC payload
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "crawl_site",
    "arguments": {
      "start_url": "https://shop.com/products",
      "follow_selector": "a.product-link",
      "limit": 25,
      "depth": 3,
      "fields": [
        { "name": "title", "selector": "h1.product-title" },
        { "name": "price", "selector": "span.price" }
      ]
    }
  }
}`
  }
];

export default function FetchPageToolsPage() {
  return (
    <>
      <Head>
        <title>API Tools & MCP — Crawlingo</title>
        <meta name="description" content="Integrate Crawlingo with LLM Agents. Model Context Protocol (MCP) server endpoints, schemas, and SSE SSE transport protocols." />
      </Head>

      <PageMeta
        title="Model Context Protocol (MCP) Tools"
        description="Equip LLMs with high-speed stealth web search, structured data extraction, and BFS crawling capabilities via standard MCP schemas."
        readingTime="7 min"
        lastUpdated="July 2026"
        githubPath="pages/tools/fetch-page.tsx"
      />

      {/* ── Overview ── */}
      <h2 className="text-2xl font-bold mb-4 mt-8 animate-slide-up" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Overview</h2>
      <p className="text-[var(--foreground-muted)] mb-6 text-sm">
        Crawlingo includes native support for the <strong>Model Context Protocol (MCP)</strong>. By starting the server, you can interface with autonomous agents (like Claude Desktop, Gemini, or custom LLM frameworks) to let them fetch, parse, and crawl web content using Crawlingo's self-healing and stealth engines.
      </p>

      {/* ── Starting the Server ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Starting the Server</h2>
      <p className="text-[var(--foreground-muted)] mb-4 text-sm">
        The MCP server runs over an HTTP server exposing an SSE (Server-Sent Events) endpoint. Launch it via the CLI:
      </p>
      <CodeBlock
        language="bash"
        code={`# Start server on default port (http://127.0.0.1:8000/sse)
crawlingo mcp

# Bind to custom host and port
crawlingo mcp --host 0.0.0.0 --port 9000`}
        showLineNumbers={false}
      />

      {/* ── SSE Transport ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Transport Protocol</h2>
      <p className="text-[var(--foreground-muted)] mb-6 text-sm">
        Crawlingo implements the SSE transport specification for MCP client-server communication:
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] card-hover">
          <div className="text-sm font-bold text-[var(--brand-orange)] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>SSE Handshake (GET)</div>
          <code className="text-xs bg-[var(--surface)] block p-2 rounded mb-2">GET /sse</code>
          <p className="text-xs text-[var(--foreground-muted)]">
            Establishes client streaming connection. Exposes initialization event containing the message path header.
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] card-hover">
          <div className="text-sm font-bold text-[var(--brand-indigo)] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Message Endpoint (POST)</div>
          <code className="text-xs bg-[var(--surface)] block p-2 rounded mb-2">POST /message</code>
          <p className="text-xs text-[var(--foreground-muted)]">
            Clients POST JSON-RPC payloads containing commands. Responses are pushed to the SSE stream.
          </p>
        </div>
      </div>

      {/* ── Tool Specifications ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Exposed Tools Reference</h2>
      
      <div className="space-y-12">
        {TOOLS.map((t, idx) => (
          <div key={t.name} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] card-hover animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono font-bold text-white bg-[var(--brand-orange)] px-2 py-0.5 rounded">
                TOOL {idx + 1}
              </span>
              <h3 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {t.name}
              </h3>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mb-4">{t.desc}</p>

            <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-4 bg-[var(--card)]">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {t.params.map(p => (
                    <tr key={p.name}>
                      <td><code className="text-xs font-semibold">{p.name}</code></td>
                      <td><code className="text-xs text-[var(--brand-indigo)]">{p.type}</code></td>
                      <td><span className="text-xs font-mono text-[var(--foreground-subtle)]">{p.req}</span></td>
                      <td className="text-xs text-[var(--foreground-muted)]">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <span className="text-xs font-semibold text-[var(--foreground-subtle)] block mb-2">JSON-RPC Example Call</span>
            <CodeBlock
              language="json"
              code={t.usage}
              showLineNumbers={false}
            />
          </div>
        ))}
      </div>

      <DocNav
        prev={{ label: 'Configuration & CLI', href: '/configuration' }}
        next={{ label: 'Architecture', href: '/architecture' }}
      />
    </>
  );
}
