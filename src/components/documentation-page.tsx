import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronDown, Clock3, Download } from 'lucide-react';
import { DOCS, NAV_GROUPS } from '@/content/docs';
import { docToMarkdown } from '@/content/markdown';
import { CodeBlock } from './code-block';
import CopyButton from './copy-button';
export { CodeBlock } from './code-block';

export default function DocumentationPage({ path }: { path: string }) {
  const page = DOCS[path];
  const markdown = docToMarkdown(page);
  const paths = NAV_GROUPS.flatMap(group => group.paths);
  const next = paths[paths.indexOf(path) + 1];
  const previous = paths[paths.indexOf(path) - 1];
  const words = page.sections.map(section => [section.title, ...(section.paragraphs ?? []), ...(section.bullets ?? []), ...(section.table?.rows.flat() ?? [])].join(' ')).join(' ').split(/\s+/).length;
  const minutes = Math.max(2, Math.ceil(words / 180));
  return <><Head><title>{page.title} · Crawlingo</title><meta name="description" content={page.description} key="description" /></Head>
    <div className="document-grid"><article className="doc-article">
      <header className="doc-heading"><div className="doc-breadcrumb"><Link href="/guides">Docs</Link><span>/</span><span>{page.category}</span></div><h1>{page.title}</h1><p className="lead">{page.description}</p><div className="doc-tools"><CopyButton text={markdown} label="Copy page" /><a className="download-page" href={`data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`} download={`${path.replace(/^\//, '').replaceAll('/', '-')}.md`}><Download size={14} />Download .md</a></div><div className="reading-meta"><span>{page.audience ?? 'Developers'}</span><span><Clock3 size={13} />{minutes} min read</span><span>{page.sections.length} sections</span></div></header>
      <div className="source-note"><span className="status-dot" />Development docs <span>·</span> New dataset APIs require the current source build.</div>
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
