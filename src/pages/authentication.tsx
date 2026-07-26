import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, DocNav } from '@/components/feature-card';

export default function AuthenticationPage() {
  return (
    <>
      <Head>
        <title>Authentication — Crawlingo</title>
        <meta name="description" content="Authentication guide for Crawlingo. Basic auth, Bearer tokens, custom headers, API key query params, cookies, and dynamic OAuth2 refresh." />
      </Head>

      <PageMeta
        title="Authentication"
        description="Crawlingo provides built-in authentication helpers for common web authentication schemes including Basic, Bearer, API Keys, Cookies, and Dynamic OAuth2 tokens."
        readingTime="4 min"
        lastUpdated="July 2026"
        githubPath="docs/authentication.md"
      />

      {/* ── Basic Auth ── */}
      <h2 id="basic-auth" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Basic Auth
      </h2>
      <CodeBlock
        language="python"
        fileName="basic_auth.py"
        code={`from crawlingo.auth import BasicAuth

auth = BasicAuth("username", "password")
session.headers(auth.headers())
# Automatically sets: Authorization: Basic base64(username:password)`}
        showLineNumbers
      />

      {/* ── Bearer Token ── */}
      <h2 id="bearer-token" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Bearer Token
      </h2>
      <CodeBlock
        language="python"
        fileName="bearer_token.py"
        code={`from crawlingo.auth import BearerAuth

auth = BearerAuth("your-secret-token")
session.headers(auth.headers())
# Automatically sets: Authorization: Bearer your-secret-token`}
        showLineNumbers
      />

      {/* ── Custom Header Auth ── */}
      <h2 id="custom-header-auth" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Custom Header Auth
      </h2>
      <CodeBlock
        language="python"
        fileName="header_auth.py"
        code={`from crawlingo.auth import HeaderAuth

auth = HeaderAuth("X-API-Key", "abc123456")
session.headers(auth.headers())
# Sets: X-API-Key: abc123456`}
        showLineNumbers
      />

      {/* ── API Key Query Param ── */}
      <h2 id="api-key-auth-query-parameter" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        API Key Query Parameter
      </h2>
      <CodeBlock
        language="python"
        fileName="query_auth.py"
        code={`from crawlingo.auth import ApiKeyQueryAuth

# Appends ?api_key=xyz to every request URL
auth = ApiKeyQueryAuth("api_key", "xyz123")
# Session automatically appends query params on dispatch`}
        showLineNumbers
      />

      {/* ── Dynamic Auth ── */}
      <h2 id="dynamic-auth-oauth2--token-refresh" className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-12 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Dynamic Auth (OAuth2 / Token Refresh)
      </h2>
      <CodeBlock
        language="python"
        fileName="dynamic_auth.py"
        code={`from crawlingo.auth import DynamicAuth
import requests

def refresh_token():
    response = requests.post("https://auth.example.com/oauth/token", json={
        "grant_type": "client_credentials",
        "client_id": "my_client_id",
        "client_secret": "my_client_secret"
    })
    return response.json()["access_token"]

# Refreshes automatically 60s before token expiration
auth = DynamicAuth(refresh_token, min_validity_secs=60)
session.headers(auth.headers())`}
        showLineNumbers
      />

      <DocNav
        prev={{ label: 'Watch API', href: '/watch' }}
        next={{ label: 'Key Features', href: '/features' }}
      />
    </>
  );
}
