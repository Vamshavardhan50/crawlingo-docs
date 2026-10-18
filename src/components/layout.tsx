import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { ArrowUpRight, BookOpen, Braces, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { DOCS, NAV_GROUPS, REPOSITORY, type Doc } from '@/content/docs';
import site from '@/content/site.json';

export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const home = router.pathname === '/';
  const reference = router.pathname === '/api-reference' || router.pathname.startsWith('/reference/') || ['/schema', '/report-reference'].includes(router.pathname);
  const requestSearch = useCallback(async () => {
    if (home) await router.push('/guides');
    if (window.innerWidth <= 900) setMobileOpen(true);
    window.setTimeout(() => searchRef.current?.focus(), 100);
  }, [home, router]);
  const search = query.toLowerCase().trim();
  const relevance = (page: Doc) => {
    const headings = page.sections.map(section => section.title.toLowerCase());
    return Number(page.title.toLowerCase().includes(search)) * 10
      + Number(headings.some(title => title.replace(/\(\)$/, '') === search)) * 8
      + Number(headings.some(title => title.includes(search))) * 4
      + Number(page.description.toLowerCase().includes(search))
      + Number(page.category === 'API reference') * 0.5;
  };
  const matching = Object.entries(DOCS)
    .filter(([, page]) => `${page.title} ${page.description} ${page.sections.map(s => [s.title, ...(s.paragraphs ?? []), ...(s.bullets ?? []), ...(s.table?.rows.flat() ?? []), ...(s.code?.map(example => example.code) ?? [])].join(' ')).join(' ')}`.toLowerCase().includes(search))
    .sort(([, left], [, right]) => relevance(right) - relevance(left));
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); setQuery(''); }, [router.asPath]);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (event.key === 'Escape') { setMobileOpen(false); setQuery(''); searchRef.current?.blur(); menuRef.current?.focus(); }
      if (((event.key === '/' && !['INPUT', 'TEXTAREA'].includes(target.tagName) && !target.isContentEditable) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'))) { event.preventDefault(); void requestSearch(); }
    }
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [requestSearch]);
  const canonical = `${site.url}${router.asPath.split(/[?#]/)[0]}`;
  return <>
    <Head><meta name="viewport" content="width=device-width, initial-scale=1" /><link rel="canonical" href={canonical} key="canonical" /><meta property="og:url" content={canonical} key="og:url" /><meta property="og:title" content={`${DOCS[router.pathname]?.title ?? (router.pathname === '/guides' ? 'Documentation' : router.pathname === '/api-reference' ? 'API Reference' : 'Web pages to useful datasets')} · Crawlingo`} key="og:title" /></Head>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header"><Link className="wordmark" href="/" aria-label="Crawlingo home"><img src="/brand-mark.svg" width="34" height="34" alt="" /><span>crawlingo</span><span className="header-divider" /><small>{home ? 'web data' : 'docs'}</small></Link><nav className="top-nav" aria-label="Main navigation"><Link href="/changelog">Changelog</Link><Link href="/benchmarks">Scale results</Link><a href={REPOSITORY}>GitHub<ArrowUpRight size={14} /></a></nav><div className="header-actions"><span className="version-tag">v1.0 alpha <span>· dev</span></span><button className="icon-button" type="button" aria-label="Toggle color theme" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>{mounted && resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button><button ref={menuRef} className="icon-button mobile-menu-button" type="button" aria-controls="docs-navigation" aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close documentation menu' : 'Open documentation menu'} onClick={() => setMobileOpen(value => !value)}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button></div></header>
    <nav className="developer-nav" aria-label="Developer navigation"><div><Link href="/guides" aria-current={!home && !reference && !router.pathname.startsWith('/sdk/') && router.pathname !== '/examples' ? 'page' : undefined}>Documentation</Link><Link href="/api-reference" aria-current={reference ? 'page' : undefined}>API Reference</Link><Link href="/sdk/python" aria-current={router.pathname.startsWith('/sdk/') ? 'page' : undefined}>SDKs</Link><Link href="/examples" aria-current={router.pathname === '/examples' ? 'page' : undefined}>Examples</Link></div><button type="button" onClick={() => void requestSearch()} aria-label="Search documentation"><Search size={15} /><span>Search docs</span><kbd>Ctrl K</kbd></button></nav>
    {mobileOpen && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    {(!home || mobileOpen) && <aside id="docs-navigation" className={`docs-sidebar ${mobileOpen ? 'is-open' : ''}`}>
      <div className="search-box"><Search size={16} /><input ref={searchRef} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search docs & methods" aria-label="Search documentation" /><kbd>/</kbd></div>
      {!query.trim() && <div className="sidebar-entrypoints"><Link href="/guides"><BookOpen size={15} />Documentation home</Link><Link href="/api-reference"><Braces size={15} />API Reference</Link></div>}
      {query.trim() ? <nav className="search-results" aria-label="Search results"><p className="nav-label" aria-live="polite">{matching.length} results</p>{matching.map(([path, page]) => <Link key={path} href={path}><strong>{page.title}</strong><small>{page.description}</small></Link>)}{matching.length === 0 && <p className="search-empty">No matching guides. Try “resume”, “schema” or “Python”.</p>}</nav> : <nav aria-label="Documentation">{NAV_GROUPS.map(group => <div className="nav-group" key={group.title}><p className="nav-label">{group.title}</p>{group.paths.map(path => <Link key={path} href={path} aria-current={router.pathname === path ? 'page' : undefined}>{DOCS[path].title}{path === '/dataset-jobs' && <span className="nav-new">New</span>}</Link>)}</div>)}</nav>}
      <div className="sidebar-bottom"><span className="status-dot" />Built in Rust. Used in your language.</div>
    </aside>}
    <main id="main-content" className={`site-main ${home ? 'home-main landing-main' : ''}`} tabIndex={-1}>{children}<footer className="site-footer"><span>Crawlingo · Open source under MIT</span><a href={`${REPOSITORY}/issues`}>Feedback <ArrowUpRight size={13} /></a></footer></main>
  </>;
}
