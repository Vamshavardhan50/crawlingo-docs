import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronDown, Clock3, Download } from 'lucide-react';
import { DOCS, NAV_GROUPS } from '@/content/docs';
import { docToMarkdown } from '@/content/markdown';
import { CodeBlock } from './code-block';
import CopyButton from './copy-button';
import site from '@/content/site.json';
export { CodeBlock } from './code-block';

function GuideOverview({ path }: { path: string }) {
  if (path === '/architecture') return <div className="guide-overview architecture-overview" aria-label="Dataset pipeline overview">
    <div className="overview-label">SYSTEM OVERVIEW <span>DatasetJob</span></div>
    <p>From an input list to a dataset you can inspect and resume.</p>
    <ol className="pipeline-steps">
      <li><span>01</span><strong>Input</strong><small>URL file</small></li>
      <li><span>02</span><strong>Fetch</strong><small>Policy &amp; pacing</small></li>
      <li><span>03</span><strong>Extract</strong><small>Scoped rows</small></li>
      <li><span>04</span><strong>Commit</strong><small>Shards &amp; state</small></li>
    </ol>
    <div className="overview-foot">Single-node jobs · Exact deduplication · JSONL / CSV</div>
  </div>;
  if (path === '/benchmarks') return <div className="guide-overview evidence-overview" aria-label="Measured workload overview">
    <div className="overview-label">MEASUREMENT OVERVIEW <span>Two separate experiments</span></div>
    <div className="evidence-cards">
      <a href="#result"><span>LOCAL HTTP FIXTURE</span><strong>1,000,000</strong><small>verified records · 1,094.569 s job time</small><em>Windows · small generated pages · Oct 14</em></a>
      <a href="/real-world-results"><span>PUBLIC PEP DIRECTORY</span><strong>744 rows</strong><small>one index page · 4.620 s job time</small><em>Windows · paced HTTPS · Oct 19</em></a>
    </div>
    <div className="overview-foot">Different workloads and memory scopes. These are observed results, not universal speed guarantees.</div>
  </div>;
  if (path === '/real-world-results') return <div className="guide-overview evidence-overview" aria-label="Public-site experiment overview">
    <div className="overview-label">PUBLIC-SITE EVIDENCE <span>PEP directory · 19 October 2026</span></div>
    <div className="evidence-cards">
      <a href="#results"><span>DIRECTORY</span><strong>744 rows</strong><small>1 index page · 4.620 s job time</small><em>42.0 MiB peak CLI working set</em></a>
      <a href="#results"><span>DOCUMENT SAMPLE</span><strong>20 pages</strong><small>20 records · 20.539 s job time</small><em>38.9 MiB peak CLI working set</em></a>
    </div>
    <div className="overview-foot">One paced HTTPS collection, with a documented sample and quality checks. These are not maximum-throughput results.</div>
  </div>;
  return null;
}

export default function DocumentationPage({ path }: { path: string }) {
  const page = DOCS[path];
  const markdown = docToMarkdown(page, href => href.startsWith('/') ? site.url + href : href);
  const siblingPrefix = path.match(/^\/reference\/(node|python)\//)?.[0];
  const paths = siblingPrefix ? Object.keys(DOCS).filter(route => route.startsWith(siblingPrefix)) : NAV_GROUPS.flatMap(group => group.paths);
  const next = paths[paths.indexOf(path) + 1];
  const previous = paths[paths.indexOf(path) - 1];
  const words = page.sections.map(section => [section.title, ...(section.paragraphs ?? []), ...(section.bullets ?? []), ...(section.table?.rows.flat() ?? [])].join(' ')).join(' ').split(/\s+/).length;
  const minutes = Math.max(2, Math.ceil(words / 180));
  return <><Head><title>{`${page.title} · Crawlingo`}</title><meta name="description" content={page.description} key="description" /></Head>
    <div className={`document-grid ${siblingPrefix ? 'api-reference-document' : ''}`}><article className="doc-article">
      <header className="doc-heading"><div className="doc-breadcrumb"><Link href="/guides">Docs</Link><span>/</span><span>{page.category}</span></div><h1>{page.title}</h1><p className="lead">{page.description}</p><div className="doc-tools"><CopyButton text={markdown} label="Copy page" /><a className="download-page" href={`data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`} download={`${path.replace(/^\//, '').replaceAll('/', '-')}.md`}><Download size={14} />Download .md</a></div><div className="reading-meta"><span>{page.audience ?? 'Developers'}</span><span><Clock3 size={13} />{minutes} min read</span><span>{page.sections.length} sections</span></div></header>
      <GuideOverview path={path} />
      <div className="source-note"><span className="status-dot" />Source reference <span>·</span> Match your SDK version. <Link href="/reference/implementation-status">Availability and known issues</Link></div>
      <details className="mobile-toc"><summary>In this guide<ChevronDown size={15} /></summary><nav aria-label="Guide sections">{page.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav></details>
      {page.sections.map(section => <section className="doc-section" id={section.id} key={section.id}>
        <h2><a href={`#${section.id}`}>{section.title}<span aria-hidden="true" className="heading-anchor">#</span></a></h2>
        {section.paragraphs?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        {section.code && <CodeBlock examples={section.code} />}
        {section.table && <div className="table-scroll" tabIndex={0} role="region" aria-label={`${section.title} table`}><table><thead><tr>{section.table.headings.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{section.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{j === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>)}</tbody></table></div>}
        {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
        {section.links && <div className="section-links">{section.links.map(link => <Link href={link.href} key={link.href}>{link.label}<ArrowRight size={14} /></Link>)}</div>}
      </section>)}
      <footer className="doc-footer"><span>Found a mismatch? <a href="https://github.com/Vamshavardhan50/crawlingo/issues">Report a documentation issue</a>.</span><nav className="chapter-pagination" aria-label="Chapter navigation">{previous ? <Link className="next-page previous-page" href={previous}><small>Previous</small><strong><ArrowLeft size={17} />{DOCS[previous].title}</strong></Link> : <Link className="next-page previous-page" href="/guides"><small>Introduction</small><strong><ArrowLeft size={17} />The Crawlingo Guide</strong></Link>}{next && <Link className="next-page" href={next}><small>Next</small><strong>{DOCS[next].title}<ArrowRight size={17} /></strong></Link>}</nav></footer>
    </article><aside className="page-toc" aria-label="On this page"><span>On this page</span>{page.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}<div className="toc-tip">Start small.<br />Inspect the output.<br />Then increase the workload.</div></aside></div>
  </>;
}
