import React from 'react';
import Head from 'next/head';
import { PageMeta, CodeBlock, Callout, DocNav } from '@/components/feature-card';

export default function InstallationPage() {
  return (
    <>
      <Head>
        <title>Installation — Crawlingo</title>
        <meta name="description" content="Detailed installation instructions for Crawlingo. Install the Python SDK, Node.js (TypeScript) bindings, or native Rust crate across Linux, macOS, and Windows." />
      </Head>

      <PageMeta
        title="Installation Guide"
        description="Get up and running with Crawlingo on your preferred runtime environment. Precompiled native binaries and wheels are provided for all major platforms."
        readingTime="5 min"
        lastUpdated="July 2026"
        githubPath="pages/installation.tsx"
      />

      <h2 className="text-2xl font-bold mb-4 mt-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>System Prerequisites</h2>
      <p className="text-[var(--foreground-muted)] mb-6 text-sm">
        Crawlingo compiles to native code for maximum performance. Pre-built packages are distributed with precompiled binaries, so you do not need a Rust compiler installed locally unless you compile from source.
      </p>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] mb-8 bg-[var(--card)]">
        <table className="data-table">
          <thead>
            <tr>
              <th>OS / Platform</th>
              <th>Prerequisites</th>
              <th>Supported Architectures</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Linux</strong></td>
              <td className="text-sm">glibc 2.28+ (Debian 10+, Ubuntu 20.04+, CentOS 8+)</td>
              <td>x86_64, aarch64 (ARM64)</td>
            </tr>
            <tr className="bg-[var(--surface)]">
              <td><strong>macOS</strong></td>
              <td className="text-sm">macOS 11+ (Big Sur or newer)</td>
              <td>Intel, Apple Silicon (M1/M2/M3)</td>
            </tr>
            <tr>
              <td><strong>Windows</strong></td>
              <td className="text-sm">Windows 10+ / Server 2019+</td>
              <td>AMD64 (x64)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Python SDK ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Python SDK</h2>
      <p className="text-[var(--foreground-muted)] mb-4 text-sm">
        The Python SDK is distributed as precompiled binary wheels on PyPI. Requires Python 3.8 to 3.13.
      </p>
      <CodeBlock
        language="bash"
        fileName="terminal"
        code={`# Install via pip
pip install crawlingo

# Or use poetry
poetry add crawlingo

# Or use pipenv
pipenv install crawlingo`}
        showLineNumbers={false}
      />

      {/* ── Node.js SDK ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Node.js (TypeScript) SDK</h2>
      <p className="text-[var(--foreground-muted)] mb-4 text-sm">
        The Node.js SDK includes precompiled native bindings built via napi-rs. Requires Node.js 18 or newer.
      </p>
      <CodeBlock
        language="bash"
        fileName="terminal"
        code={`# Install via npm
npm install crawlingo

# Or use yarn
yarn add crawlingo

# Or use pnpm
pnpm add crawlingo`}
        showLineNumbers={false}
      />

      {/* ── Rust SDK ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Rust Native Crate</h2>
      <p className="text-[var(--foreground-muted)] mb-4 text-sm">
        For Rust developers, add the dependency directly to your crate. Requires Rust stable 1.70+.
      </p>
      <CodeBlock
        language="toml"
        fileName="Cargo.toml"
        code={`[dependencies]
crawlingo = "0.1.0"
tokio = { version = "1", features = ["full"] }`}
        showLineNumbers={false}
      />

      {/* ── Verification ── */}
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Verifying Your Install</h2>
      <p className="text-[var(--foreground-muted)] mb-4 text-sm">
        Verify that the native bindings load correctly by importing and reading the library version:
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[var(--brand-orange)] mb-2">Python Verification</span>
          <CodeBlock
            language="python"
            code={`import crawlingo
print(crawlingo.__version__) # "0.1.0"`}
            showLineNumbers={false}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[var(--brand-indigo)] mb-2">Node.js Verification</span>
          <CodeBlock
            language="javascript"
            code={`const { Session } = require('crawlingo');
console.log(Session.version); // "0.1.0"`}
            showLineNumbers={false}
          />
        </div>
      </div>

      <Callout type="warning" title="Linux Musl Compatibility">
        If you are deploying on lightweight Alpine Linux Docker containers, make sure to use `crawlingo-musl` or compile the native library from source, as standard wheels target glibc.
      </Callout>

      <DocNav
        prev={{ label: 'Quick Start', href: '/quick-start' }}
        next={{ label: 'Session Concept', href: '/concepts/session' }}
      />
    </>
  );
}
