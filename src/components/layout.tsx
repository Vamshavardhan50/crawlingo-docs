import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Moon, Sun, Menu, X, Search, ChevronRight, ChevronDown,
  GitBranch, BookOpen, Terminal, Zap, Shield, Globe,
  Database, Activity, Cpu, FileText, Code, Package,
  ExternalLink, Star, ArrowRight, Command,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   CRAWLINGO LOGO (inline SVG — matches brand image)
   ═══════════════════════════════════════════════════════════ */
function CrawlingoLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Crawlingo">
      {/* Outer C arc */}
      <path
        d="M52 32C52 43.046 43.046 52 32 52C20.954 52 12 43.046 12 32C12 20.954 20.954 12 32 12C38.627 12 44.52 15.12 48.35 20"
        stroke="#0B1220"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner arc */}
      <path
        d="M42 32C42 37.523 37.523 42 32 42C26.477 42 22 37.523 22 32C22 26.477 26.477 22 32 22C35.314 22 38.261 23.587 40.175 26"
        stroke="#0B1220"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Orange center dot */}
      <circle cx="32" cy="32" r="5" fill="#FF6B35" />
      {/* Small inner ring */}
      <circle cx="32" cy="32" r="8.5" stroke="#0B1220" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV ITEMS
   ═══════════════════════════════════════════════════════════ */
const NAV_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Quick Start',      path: '/quick-start',           icon: Zap,      desc: 'Up and running in 2 minutes' },
      { label: 'Installation',     path: '/installation',          icon: Package,  desc: 'pip, npm, cargo' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { label: 'Session',          path: '/quick-start#session',      icon: Shield,   desc: 'Config & connection pool' },
      { label: 'Page & Selectors', path: '/quick-start#basic-usage',  icon: Code,     desc: 'CSS, XPath, Regex, Anchors' },
      { label: 'Dataset Builder',  path: '/quick-start#dataset-builder', icon: Database, desc: 'Fluent extraction API' },
      { label: 'Crawler',          path: '/quick-start#crawler',      icon: Globe,    desc: 'BFS multi-page crawling' },
      { label: 'Watch Monitors',   path: '/quick-start#watch-monitors', icon: Activity, desc: 'Change detection & webhooks' },
    ],
  },
  {
    title: 'Features',
    items: [
      { label: 'Self-Healing',     path: '/features#self-healing',   icon: Shield,   desc: 'DOM fingerprint repair' },
      { label: 'Stealth Browsing', path: '/features#stealth',        icon: Globe,    desc: 'TLS fingerprint rotation' },
      { label: 'SIMD Text Anchors',path: '/features#text-anchors',   icon: Cpu,      desc: 'Parallel CPU text search' },
      { label: 'Change Monitors',  path: '/features#change-monitoring', icon: Activity, desc: 'Reactive DOM polling' },
      { label: 'Dataset Export',   path: '/features#datasets',       icon: FileText, desc: 'JSON, CSV, Parquet' },
    ],
  },
  {
    title: 'SDKs',
    items: [
      { label: 'Python SDK',       path: '/sdk/python',            icon: Terminal, desc: 'PyO3 bindings' },
      { label: 'Node.js SDK',      path: '/sdk/nodejs',            icon: Terminal, desc: 'napi-rs bindings' },
      { label: 'Rust SDK',         path: '/sdk/rust',              icon: Terminal, desc: 'Native crate' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { label: 'Architecture',     path: '/architecture',          icon: GitBranch, desc: 'How Crawlingo works' },
      { label: 'Benchmarks',       path: '/benchmarks',            icon: Zap,       desc: 'Performance data' },
      { label: 'API Tools',        path: '/tools/fetch-page',      icon: Code,      desc: 'MCP server tools' },
      { label: 'Configuration',    path: '/configuration',         icon: BookOpen,  desc: 'TOML & env vars' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Changelog',        path: '/changelog',             icon: BookOpen,  desc: 'What\'s new' },
      { label: 'Roadmap',          path: '/roadmap',               icon: GitBranch, desc: 'What\'s coming' },
      { label: 'GitHub',           path: 'https://github.com/Vamshavardhan50/crawlingo', icon: ExternalLink, desc: 'Source & issues', external: true },
    ],
  },
];

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
  pathname,
}: {
  onMenuClick: () => void;
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
          <CrawlingoLogo size={30} />
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--brand-navy)' }}
          >
            Crawlingo
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-6 ml-8">
          {[
            { href: '/quick-start',  label: 'Docs' },
            { href: '/features',     label: 'Features' },
            { href: '/benchmarks',   label: 'Benchmarks' },
            { href: '/sdk/python',   label: 'SDKs' },
            { href: '/changelog',    label: 'Changelog' },
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
          {/* Search */}
          <button
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground-subtle)] hover:border-[var(--border-strong)] hover:text-[var(--foreground-muted)] transition-colors w-44"
            aria-label="Search documentation"
          >
            <Search className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="flex-1 text-left whitespace-nowrap">Search docs…</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] font-mono bg-[var(--card)]">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
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
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
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
            <CrawlingoLogo size={24} />
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
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
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
              <CrawlingoLogo size={28} />
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
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
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
export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;
  const isHome = pathname === '/';
  const isDoc = !isHome;

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      {/* Top nav always present */}
      <TopNav onMenuClick={() => setSidebarOpen(true)} pathname={pathname} />

      {isDoc ? (
        /* ── Documentation layout: sidebar + content ── */
        <div className="flex pt-16">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            pathname={pathname}
          />

          {/* Main content area */}
          <main className="flex-1 min-w-0">
            <div className="mx-auto max-w-3xl px-6 py-10 lg:px-12 lg:py-12">
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
    </div>
  );
}
