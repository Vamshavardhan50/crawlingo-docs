import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, BookOpen, Braces, Cable } from 'lucide-react';
import { DOCS, NAV_GROUPS } from '@/content/docs';

export default function Guides() {
  return <><Head><title>The Crawlingo Guide</title><meta name="description" content="Learn what Crawlingo does, generate a dataset, integrate with Playwright and data tools, and look up the SDK API." key="description" /></Head>
    <article className="book-introduction">
      <div className="doc-breadcrumb">Documentation / Introduction</div>
      <h1>The Crawlingo Guide</h1>
      <p className="lead">Turn web pages into a dataset your application can use.</p>
      <p>Crawlingo is a Rust collection engine with Python and Node.js SDKs. Give it URLs and field rules; it fetches pages, validates records, removes exact duplicates, and writes resumable JSONL or CSV files.</p>
      <div className="book-pipeline" aria-label="Dataset pipeline"><span>URLs</span><ArrowRight size={15} /><span>Field rules</span><ArrowRight size={15} /><span>Dataset + report</span></div>
      <div className="source-note">Source edition · 1.0.0-alpha.2. Build from source for the DatasetJob API. <Link href="/publishing">Release status</Link></div>
      <section className="book-section"><h2>What is it for?</h2><p>Build research directories, document collections, product catalogs, or scheduled data imports. Use the SDK in a backend worker, or run the CLI from a terminal. Crawlingo handles collection and export; your application chooses discovery, scheduling, analysis and storage.</p><p>Start with <Link href="/dataset-design">dataset design</Link>, follow the <Link href="/research-datasets">public research-directory walkthrough</Link>, and read the <Link href="/real-world-results">measured results and limits</Link>.</p></section>
      <section className="book-section"><h2>Choose where to start</h2><div className="book-start-list">
        <Link href="/first-run"><BookOpen size={20} /><div><strong>New to Crawlingo</strong><span>Run a small local example and understand its output.</span></div><ArrowRight size={16} /></Link>
        <Link href="/integrations"><Cable size={20} /><div><strong>Add it to your stack</strong><span>Playwright, Puppeteer, pandas, DuckDB and worker services.</span></div><ArrowRight size={16} /></Link>
        <Link href="/api-reference"><Braces size={20} /><div><strong>Look up an API</strong><span>Signatures, configuration fields, return values and errors.</span></div><ArrowRight size={16} /></Link>
      </div></section>
      <section className="book-section"><h2>How to read this guide</h2><p>Read the first two chapters in order for a complete walkthrough. Use Integrations for a specific tool and API reference when you already know the workflow. Collapse a chapter in the sidebar, or hide the sidebar for more reading space. Press <kbd>Ctrl K</kbd> to search.</p></section>
      <section className="book-section"><h2>Contents</h2><ol className="book-contents">{NAV_GROUPS.map((group, index) => <li key={group.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{group.title}</h3><div>{group.paths.map(path => <Link key={path} href={path}>{DOCS[path].title}</Link>)}</div></div></li>)}</ol></section>
      <footer className="book-next"><Link href="/overview"><span>Start reading</span><strong>What is Crawlingo?<ArrowRight size={18} /></strong></Link></footer>
    </article>
  </>;
}
