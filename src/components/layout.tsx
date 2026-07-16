import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Moon, Sun, Menu, X, Search, ChevronRight, ChevronDown,
  GitBranch, BookOpen, Terminal, Zap, Shield, Globe,
  Database, Activity, Cpu, FileText, Code, Package,
  ExternalLink, Star, ArrowRight, Command, Heart,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   CRAWLINGO LOGO (inline SVG — matches brand image)
   ═══════════════════════════════════════════════════════════ */
function CrawlingoLogo({ size = 120 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      width={size}
      height={size}
      alt="Crawlingo Logo"
      className="object-contain"
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV ITEMS
   ═══════════════════════════════════════════════════════════ */
const NAV_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Quick Start', path: '/quick-start', icon: Zap, desc: 'Up and running in 2 minutes' },
      { label: 'Installation', path: '/installation', icon: Package, desc: 'pip, npm, cargo' },
      { label: 'Configuration', path: '/configuration', icon: BookOpen, desc: 'TOML & env vars' },
    ],
  },
  {
    title: 'Core Features',
    items: [
      { label: 'Key Features', path: '/features', icon: Globe, desc: 'Self-healing, stealth & SIMD' },
    ],
  },
  {
    title: 'SDK References',
    items: [
      { label: 'Python SDK', path: '/sdk/python', icon: Terminal, desc: 'PyO3 bindings' },
      { label: 'Node.js SDK', path: '/sdk/nodejs', icon: Terminal, desc: 'napi-rs bindings' },
      { label: 'Rust SDK', path: '/sdk/rust', icon: Terminal, desc: 'Native crate' },
    ],
  },
  {
    title: 'Reference & Tools',
    items: [
      { label: 'Architecture', path: '/architecture', icon: GitBranch, desc: 'How Crawlingo works' },
      { label: 'Benchmarks', path: '/benchmarks', icon: Zap, desc: 'Performance data' },
      { label: 'API Tools & MCP', path: '/tools/fetch-page', icon: Code, desc: 'MCP server tools' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Sponsor', path: '/sponsor', icon: Heart, desc: 'Support the project' },
      { label: 'Changelog', path: '/changelog', icon: BookOpen, desc: 'What\'s new' },
      { label: 'Roadmap', path: '/roadmap', icon: GitBranch, desc: 'What\'s coming' },
      { label: 'GitHub', path: 'https://github.com/Vamshavardhan50/crawlingo', icon: ExternalLink, desc: 'Source & issues', external: true },
    ],
  },
];

const PAGE_TOC: Record<string, { label: string; hash: string }[]> = {
  '/quick-start': [
    { label: 'Basic Usage', hash: '#basic-usage' },
    { label: 'Session Config', hash: '#session' },
    { label: 'Dataset Builder', hash: '#dataset-builder' },
    { label: 'Multi-Page Crawler', hash: '#crawler' },
    { label: 'Watch Monitors', hash: '#watch-monitors' },
  ],
  '/features': [
    { label: 'Self-Healing', hash: '#self-healing' },
    { label: 'Stealth Emulation', hash: '#stealth' },
    { label: 'SIMD Text Search', hash: '#text-anchors' },
    { label: 'Reactive Watchers', hash: '#change-monitoring' },
    { label: 'Dataset Export', hash: '#datasets' },
  ],
  '/sdk/python': [
    { label: 'Session', hash: '#session' },
    { label: 'Page', hash: '#page' },
    { label: 'ElementList', hash: '#elementlist--elementref' },
    { label: 'Dataset', hash: '#dataset' },
    { label: 'Schema Config', hash: '#schema--pagination-config' },
  ],
  '/sdk/nodejs': [
    { label: 'Quick Example', hash: '#examplets' },
    { label: 'API Reference', hash: '#api-reference' },
    { label: 'TypeScript Types', hash: '#typescript-types' },
  ],
  '/architecture': [
    { label: 'Overview', hash: '#overview' },
    { label: 'Fetch Pipeline', hash: '#fetch-pipeline' },
    { label: 'Parallelism Model', hash: '#parallelism-model' },
    { label: 'Core Dependencies', hash: '#core-dependencies' },
  ],
  '/configuration': [
    { label: 'Precedence', hash: '#configuration-precedence' },
    { label: 'Specs Spec', hash: '#configuration-specs' },
    { label: 'CLI Interface', hash: '#cli-interface' },
  ],
  '/tools/fetch-page': [
    { label: 'Overview', hash: '#overview' },
    { label: 'Server Setup', hash: '#starting-the-server' },
    { label: 'Exposed Tools', hash: '#exposed-tools-reference' },
  ],
  '/sponsor': [
    { label: 'Sponsor Tiers', hash: '#sponsor-tiers' },
  ],
};

/* ═══════════════════════════════════════════════════════════
   SIDEBAR SECTION
   ═══════════════════════════════════════════════════════════ */
function SidebarSection({
  section,
  pathname,
  defaultOpen = true,
}: {
  section: typeof NAV_SECTIONS[0];
  pathname: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isActive = section.items.some(i => i.path === pathname);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
      >
        {section.title}
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            open ? 'rotate-0' : '-rotate-90'
          )}
        />
      </button>
      {open && (
        <ul className="mt-0.5 space-y-0.5">
          {section.items.map(item => {
            const active = pathname === item.path;
            const Icon = item.icon;
            const isExternal = (item as any).external;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'sidebar-link group',
                    active && 'active'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0 opacity-60 group-hover:opacity-100" />
                  <span className="flex-1">{item.label}</span>
                  {isExternal && <ExternalLink className="h-3 w-3 opacity-40" />}
                </Link>
                {active && PAGE_TOC[item.path] && (
                  <ul className="ml-5 mt-1 mb-2 pl-3.5 border-l border-[var(--border)]/70 space-y-1">
                    {PAGE_TOC[item.path].map(sub => (
                      <li key={sub.hash}>
                        <Link
                          href={item.path + sub.hash}
                          className="block py-1 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors hover:pl-0.5 duration-100"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOP NAVBAR
   ═══════════════════════════════════════════════════════════ */
function TopNav({
  onMenuClick,
  onSearchClick,
  pathname,
}: {
  onMenuClick: () => void;
  onSearchClick: () => void;
  pathname: string;
}) {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 flex h-16 items-center transition-all duration-200',
        scrolled
          ? 'bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="flex w-full items-center gap-4 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface)] transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-90 transition-opacity"
          aria-label="Crawlingo home"
        >
          <CrawlingoLogo size={72} />
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Crawlingo
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-6 ml-8">
          {[
            { href: '/quick-start', label: 'Docs' },
            { href: '/features', label: 'Features' },
            { href: '/benchmarks', label: 'Benchmarks' },
            { href: '/sdk/python', label: 'SDKs' },
            { href: '/changelog', label: 'Changelog' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'nav-link',
                pathname.startsWith(link.href) && link.href !== '/' && 'text-[var(--foreground)] font-semibold'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search Button (Desktop) */}
          <button
            onClick={onSearchClick}
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-sm text-[var(--foreground-subtle)] hover:border-[var(--border-strong)] hover:text-[var(--foreground-muted)] transition-colors w-44 cursor-pointer"
            aria-label="Search documentation"
          >
            <Search className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="flex-1 text-left whitespace-nowrap">Search docs…</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] font-mono bg-[var(--muted)] text-[var(--foreground-muted)]">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>

          {/* Search Button (Mobile responsive icon-only) */}
          <button
            onClick={onSearchClick}
            className="flex sm:hidden h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-subtle)] hover:border-[var(--border-strong)] hover:text-[var(--foreground-muted)] transition-colors cursor-pointer"
            aria-label="Search documentation"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* GitHub */}
          <Link
            href="https://github.com/Vamshavardhan50/crawlingo"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface)] transition-colors"
            aria-label="View on GitHub"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </Link>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun className="h-4 w-4" />
                : <Moon className="h-4 w-4" />
              }
            </button>
          )}

          {/* CTA */}
          <Link
            href="/quick-start"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-150"
            style={{ background: 'var(--brand-orange)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--brand-orange-dark)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--brand-orange)')}
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════════════ */
function Sidebar({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-[272px] transform transition-transform duration-300 ease-out-expo',
          'flex flex-col bg-[var(--card)] border-r border-[var(--border)]',
          'lg:sticky lg:top-16 lg:translate-x-0 lg:h-[calc(100vh-64px)] lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] lg:hidden">
          <div className="flex items-center gap-2">
            <CrawlingoLogo size={56} />
            <span className="font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Crawlingo</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[var(--surface)] transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Version badge */}
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--foreground-subtle)]">
              v0.1.0
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--foreground-subtle)]">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)] animate-pulse-dot" />
              Latest
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          {NAV_SECTIONS.map((section, i) => (
            <SidebarSection
              key={section.title}
              section={section}
              pathname={pathname}
              defaultOpen={i < 3}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border)] space-y-2">
          <Link
            href="https://github.com/Vamshavardhan50/crawlingo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Vamshavardhan50/crawlingo
            <ExternalLink className="h-2.5 w-2.5 ml-auto" />
          </Link>
          <p className="text-xs text-[var(--foreground-subtle)]">MIT License · Open Source</p>
        </div>
      </aside>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-16">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 hover:opacity-80 transition-opacity">
              <CrawlingoLogo size={60} />
              <span className="font-bold text-base" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Crawlingo</span>
            </Link>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-xs">
              A Rust-powered, self-healing web scraping framework for Python, Node.js, and Rust.
            </p>
            <div className="flex gap-3 mt-4">
              {/* GitHub */}
              <Link href="https://github.com/Vamshavardhan50/crawlingo" target="_blank" rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-colors"
                aria-label="GitHub">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
              </Link>
              {/* PyPI */}
              <Link href="https://pypi.org/project/crawlingo/" target="_blank" rel="noopener noreferrer"
                className="flex h-8 px-2.5 items-center gap-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-colors"
                aria-label="PyPI">
                PyPI
              </Link>
              <Link href="https://www.npmjs.com/package/crawlingo" target="_blank" rel="noopener noreferrer"
                className="flex h-8 px-2.5 items-center gap-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-colors"
                aria-label="npm">
                npm
              </Link>
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Documentation',
              links: [
                { label: 'Quick Start', href: '/quick-start' },
                { label: 'Features', href: '/features' },
                { label: 'Architecture', href: '/architecture' },
                { label: 'Benchmarks', href: '/benchmarks' },
                { label: 'Configuration', href: '/configuration' },
              ],
            },
            {
              title: 'SDKs',
              links: [
                { label: 'Python', href: '/sdk/python' },
                { label: 'Node.js', href: '/sdk/nodejs' },
                { label: 'Rust', href: '/sdk/rust' },
                { label: 'API Reference', href: '/tools/fetch-page' },
              ],
            },
            {
              title: 'Project',
              links: [
                { label: 'Changelog', href: '/changelog' },
                { label: 'Roadmap', href: '/roadmap' },
                { label: 'Contributing', href: 'https://github.com/Vamshavardhan50/crawlingo/blob/main/CONTRIBUTING.md', external: true },
                { label: 'Security', href: 'https://github.com/Vamshavardhan50/crawlingo/blob/main/SECURITY.md', external: true },
                { label: 'License (MIT)', href: 'https://github.com/Vamshavardhan50/crawlingo/blob/main/LICENSE', external: true },
              ],
            },
          ].map(col => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-subtle)] mb-3">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={(link as any).external ? '_blank' : undefined}
                      rel={(link as any).external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1"
                    >
                      {link.label}
                      {(link as any).external && <ExternalLink className="h-2.5 w-2.5 opacity-50" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--foreground-subtle)]">
            © {new Date().getFullYear()} Crawlingo Contributors · Released under the MIT License
          </p>
          <p className="text-xs text-[var(--foreground-subtle)]">
            Built with Rust ⚙️ · Powered by caffeine ☕
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN LAYOUT
   ═══════════════════════════════════════════════════════════ */
const SEARCH_INDEX = [
  // Getting started
  { title: 'Quick Start', url: '/quick-start', category: 'Getting Started', desc: 'Get up and running with Crawlingo in under 2 minutes.', keywords: 'install setup pip npm cargo hello world example' },
  { title: 'Installation Guide', url: '/installation', category: 'Getting Started', desc: 'Install Python, Node.js, and Rust SDKs.', keywords: 'pip npm cargo install wheels binary rust python nodejs' },

  // Core concepts
  { title: 'Session Configuration', url: '/quick-start#session', category: 'Core Concepts', desc: 'Connection pooling, rate limiting, and proxies.', keywords: 'session proxy rate limit auth bearer basic header api key cookies timeout pool stealth' },
  { title: 'Page & Selectors', url: '/quick-start#basic-usage', category: 'Core Concepts', desc: 'CSS, XPath, Regex, and SIMD text anchor selectors.', keywords: 'css xpath regex selector find text anchor html status title markdown' },
  { title: 'Dataset Builder', url: '/quick-start#dataset-builder', category: 'Core Concepts', desc: 'Fluent builder API for structured multi-field data.', keywords: 'dataset field build json csv parquet export extract structured schema' },
  { title: 'Multi-Page Crawling', url: '/quick-start#crawler', category: 'Core Concepts', desc: 'BFS crawling up to max depth and concurrency limit.', keywords: 'crawl spider bfs depth limit follow links concurrency pagination webhook' },
  { title: 'Change Monitoring', url: '/quick-start#watch-monitors', category: 'Core Concepts', desc: 'Active DOM polling and webhook notifications.', keywords: 'watch monitor price stock change event webhook alert interval poll' },

  // Features
  { title: 'Self-Healing Selectors', url: '/features#self-healing', category: 'Features', desc: 'DOM layout fingerprinting and Jaro-Winkler recovery.', keywords: 'auto match fingerprint healing broken selector similarity repair' },
  { title: 'Stealth Browser Emulation', url: '/features#stealth', category: 'Features', desc: 'JA3 signature and HTTP/2 profile rotation.', keywords: 'stealth cloudflare tls ja3 browser chrome firefox safari profile bypass bot detection' },
  { title: 'SIMD Text Search', url: '/features#text-anchors', category: 'Features', desc: 'memchr-based visible text anchor matching.', keywords: 'simd text anchor memchr find after before price label fast' },
  { title: 'Reactive DOM Watchers', url: '/features#change-monitoring', category: 'Features', desc: 'DOM polling with Stock/Price change listeners.', keywords: 'watch monitor react change stock price dom poll interval event callback' },
  { title: 'Parquet/CSV/JSON Export', url: '/features#datasets', category: 'Features', desc: 'Exporting datasets directly to structured files.', keywords: 'parquet csv json export dataset file pandas spark bigquery' },

  // SDKs
  { title: 'Python SDK Reference', url: '/sdk/python', category: 'SDK References', desc: 'Complete methods and attributes for the Python bindings.', keywords: 'python pyo3 session page dataset crawl watch element collection result to_json to_csv to_parquet' },
  { title: 'Node.js SDK Reference', url: '/sdk/nodejs', category: 'SDK References', desc: 'Complete TypeScript methods and models.', keywords: 'nodejs typescript napi session page dataset crawl watch element collection result toJson toCsv toParquet' },
  { title: 'Rust SDK Reference', url: '/sdk/rust', category: 'SDK References', desc: 'Crate structs and Tokio async reference.', keywords: 'rust crate tokio async struct trait crawlingo core engine' },

  // Reference
  { title: 'System Architecture', url: '/architecture', category: 'Reference', desc: 'Rust core engine FFI, threads, and safety.', keywords: 'architecture engine ffi thread safety memory async tokio rayon dom' },
  { title: 'Performance Benchmarks', url: '/benchmarks', category: 'Reference', desc: 'Latency, memory, and throughput comparison tables.', keywords: 'benchmark latency memory throughput speed comparison performance' },
  { title: 'Changelog', url: '/changelog', category: 'Project', desc: 'Latest releases and feature releases.', keywords: 'changelog release version history v1 beta' },
  { title: 'Product Roadmap', url: '/roadmap', category: 'Project', desc: 'Future features, actors, and vector DB integrations.', keywords: 'roadmap future planned features vector db actor llm' },

  // Auth
  { title: 'Authentication', url: '/quick-start#session', category: 'Core Concepts', desc: 'Basic, Bearer, Header, OAuth2, and API key auth on Session.', keywords: 'auth authentication bearer basic oauth2 api key header login token' },

  // Export
  { title: 'Export to Parquet', url: '/features#datasets', category: 'Features', desc: 'Write scraped datasets to Apache Parquet format.', keywords: 'parquet export apache arrow pandas spark bigquery warehouse' },
  { title: 'Export to JSON / CSV', url: '/features#datasets', category: 'Features', desc: 'Write scraped datasets to JSON or CSV files.', keywords: 'json csv export to_json to_csv save file' },

  // Proxy
  { title: 'Proxy & Rotation', url: '/quick-start#session', category: 'Core Concepts', desc: 'Single proxy, proxy pool rotation, and remote proxy provider.', keywords: 'proxy pool rotation provider ip rotate vpn residential datacenter' },
];

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filter items — also match against keywords
  const filtered = query.trim() === ''
    ? SEARCH_INDEX.slice(0, 6)
    : SEARCH_INDEX.filter(item => {
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        ((item as any).keywords ?? '').toLowerCase().includes(q)
      );
    }).slice(0, 10);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Key navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIndex]) {
          router.push(filtered[activeIndex].url);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filtered, activeIndex, router, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-20"
      style={{ background: 'rgba(0,0,0,0.55)' }}
    >
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[70vh] animate-fade-in">
        {/* Input area */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]/80">
          <Search className="h-4 w-4 text-[var(--foreground-subtle)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search documentation..."
            className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] text-sm border-none outline-none focus:outline-none focus:ring-0 caret-[var(--brand-orange)]"
            style={{ color: 'var(--foreground)' }}
          />
          <button
            onClick={onClose}
            className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground)] px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-raised)] cursor-pointer"
          >
            esc
          </button>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {filtered.length > 0 ? (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
                {query.trim() === '' ? 'Recommended Pages' : 'Search Results'}
              </div>
              <div className="mt-1 space-y-0.5">
                {filtered.map((item, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={item.url + idx}
                      onClick={() => {
                        router.push(item.url);
                        onClose();
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg border border-transparent transition-all flex flex-col gap-0.5 cursor-pointer",
                        active
                          ? "bg-[var(--brand-orange)]/[0.08] border-[var(--brand-orange)]/25 text-[var(--foreground)] shadow-sm"
                          : "hover:bg-[var(--surface-raised)] text-[var(--foreground-muted)]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{item.title}</span>
                        <span className="text-[10px] font-medium text-[var(--brand-indigo)] bg-[var(--brand-indigo)]/10 px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--foreground-subtle)] line-clamp-1">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-[var(--foreground-subtle)] flex flex-col items-center gap-2">
              <span>No results found for "<strong>{query}</strong>"</span>
              <span className="text-xs">Try searching for keywords like "session", "stealth", or "python".</span>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface)] text-[10px] text-[var(--foreground-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--card)]">↑↓</kbd>
            <span>to navigate</span>
            <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--card)]">↵</kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--card)]">esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;
  const isHome = pathname === '/';
  const isDoc = !isHome;

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Page transition: animate main content on route change
  const [pageKey, setPageKey] = useState(pathname);
  useEffect(() => {
    setPageKey(pathname);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      {/* Top nav always present */}
      <TopNav
        onMenuClick={() => setSidebarOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
        pathname={pathname}
      />

      {isDoc ? (
        /* ── Documentation layout: sidebar + content ── */
        <div className="flex pt-16 relative">
          {/* Subtle Ambient Doc Background Blobs */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
            <div
              className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full animate-blob-slow opacity-[0.04] dark:opacity-[0.08]"
              style={{
                background: 'radial-gradient(circle, rgba(255, 107, 53, 0.5) 0%, transparent 70%)',
                filter: 'blur(100px)',
                WebkitFilter: 'blur(100px)',
              }}
            />
            <div
              className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full animate-blob-medium opacity-[0.02] dark:opacity-[0.05]"
              style={{
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
                filter: 'blur(80px)',
                WebkitFilter: 'blur(80px)',
              }}
            />
          </div>

          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            pathname={pathname}
          />

          {/* Main content area */}
          <main className="flex-1 min-w-0 relative z-10">
            <div
              key={pageKey}
              className="mx-auto max-w-3xl px-6 py-10 lg:px-12 lg:py-12 animate-fade-in"
            >
              {children}
            </div>
          </main>
        </div>
      ) : (
        /* ── Homepage: full width ── */
        <main className="pt-16">
          {children}
        </main>
      )}

      <Footer />

      {/* Command Palette Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
