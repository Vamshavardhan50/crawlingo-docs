import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, Check, Copy, FileCode2 } from 'lucide-react';
import { DOCS, NAV_GROUPS, type CodeExample } from '@/content/docs';

export function CodeBlock({ examples }: { examples: CodeExample[] }) {
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState('Copy');
  const current = examples[selected] ?? examples[0];
  async function copy() {
    try { await navigator.clipboard.writeText(current.code); setStatus('Copied'); }
    catch { setStatus('Select code to copy'); }
    window.setTimeout(() => setStatus('Copy'), 2500);
  }
  return <div className="code-block">
    <div className="code-toolbar"><div className="code-tabs" aria-label="Code language">
      {examples.map((example, index) => <button key={example.label} type="button" aria-pressed={selected === index} onClick={() => { setSelected(index); setStatus('Copy'); }}>{examples.length === 1 && <FileCode2 size={14} />}{example.label}</button>)}
    </div><button className="copy-code" onClick={copy} type="button" aria-label={`Copy ${current.label} code`}>{status === 'Copied' ? <Check size={14} /> : <Copy size={14} />}<span aria-live="polite">{status}</span></button></div>
    <pre tabIndex={0} aria-label={`${current.language} example`}><code>{current.code}</code></pre>
  </div>;
}

export default function DocumentationPage({ path }: { path: string }) {
  const page = DOCS[path];
  const paths = NAV_GROUPS.flatMap(group => group.paths);
  const next = paths[paths.indexOf(path) + 1];
  return <><Head><title>{page.title} · Crawlingo</title><meta name="description" content={page.description} key="description" /></Head>
    <div className="document-grid"><article className="doc-article">
      <header className="doc-heading"><span className="eyebrow">{page.category}</span><h1>{page.title}</h1><p className="lead">{page.description}</p></header>
      <div className="source-note"><span className="status-dot" />Development docs <span>·</span> New dataset APIs require the current source build.</div>
      {page.sections.map(section => <section className="doc-section" id={section.id} key={section.id}>
        <h2><a href={`#${section.id}`}>{section.title}<span aria-hidden="true" className="heading-anchor">#</span></a></h2>
        {section.paragraphs?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        {section.code && <CodeBlock examples={section.code} />}
        {section.table && <div className="table-scroll" tabIndex={0} role="region" aria-label={`${section.title} table`}><table><thead><tr>{section.table.headings.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{section.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{j === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>)}</tbody></table></div>}
        {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
        {section.links && <div className="section-links">{section.links.map(link => <Link href={link.href} key={link.href}>{link.label}<ArrowRight size={14} /></Link>)}</div>}
      </section>)}
      <footer className="doc-footer"><span>Found a mismatch? <a href="https://github.com/Vamshavardhan50/crawlingo/issues">Report a documentation issue</a>.</span>{next && <Link className="next-page" href={next}><small>Next guide</small><strong>{DOCS[next].title}<ArrowRight size={17} /></strong></Link>}</footer>
    </article><aside className="page-toc" aria-label="On this page"><span>On this page</span>{page.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}<div className="toc-tip">Start small.<br />Inspect the output.<br />Then increase the workload.</div></aside></div>
  </>;
}
