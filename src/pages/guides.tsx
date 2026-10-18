import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, BookOpen, Braces, Terminal } from 'lucide-react';
import { DOCS, NAV_GROUPS } from '@/content/docs';
import { API_DOCS } from '@/content/api-reference';
import { CodeBlock } from '@/components/code-block';
import type { CodeExample } from '@/content/types';

const languages = ['Python', 'Node.js', 'Rust'] as const;
const installs: CodeExample[] = [
  { label: 'Terminal · activated virtual environment', language: 'shell', code: 'python -m pip install maturin\ncd sdk/python\nmaturin develop' },
  { label: 'Terminal · repository root', language: 'shell', code: 'cd sdk/nodejs\nnpm install\nnpm run build\n# In your application, install the built local package:\n# npm install /absolute/path/to/crawlingo/sdk/nodejs' },
  { label: 'Your application · Cargo.toml', language: 'toml', code: '[dependencies]\ncrawlingo = { path = "../crawlingo" }\ntokio = { version = "1", features = ["full"] }\nserde_json = "1"' },
];
const examples = API_DOCS['/reference/dataset-job'].sections.find(section => section.id === 'example')!.code!;
const commands = ['python main.py', 'node main.mjs', 'cargo run --release'];

export default function Guides() {
  const [language, setLanguage] = useState(0);
  return <><Head><title>Developer Documentation · Crawlingo</title><meta name="description" content="Build your first Crawlingo dataset with copy-ready Python, Node.js and Rust examples, installation commands and complete SDK API references." key="description" /></Head>
    <div className="docs-hub developer-hub">
      <span className="eyebrow">Crawlingo / Developer docs</span><h1>Build your first dataset.</h1><p className="lead">From a URL to a validated record. Start with working code, then explore the SDK and the contracts behind it.</p>
      <div className="developer-shortcuts"><Link href="/quick-start"><Terminal size={17} />Quickstart<ArrowRight size={15} /></Link><Link href="/api-reference"><Braces size={17} />API Reference<ArrowRight size={15} /></Link><Link href="/examples"><BookOpen size={17} />Example projects<ArrowRight size={15} /></Link></div>
      <section className="developer-start" aria-labelledby="start-title">
        <div className="developer-start-heading"><div><span className="eyebrow">Start building</span><h2 id="start-title">Choose your language</h2></div><div className="language-picker" role="group" aria-label="Quickstart language">{languages.map((name, index) => <button type="button" key={name} onClick={() => setLanguage(index)} aria-pressed={language === index}>{name}</button>)}</div></div>
        <div className="source-note"><span className="status-dot" />Current development APIs require a matching source build. <Link href="/installation">Prerequisites & setup<ArrowRight size={12} /></Link></div>
        <div className="quickstart-workspace">
          <div className="quickstart-steps"><h3><span>01</span> Install from your checkout</h3><p>Clone the repository and follow the platform prerequisites. For Python, activate a virtual environment first. Adjust local dependency paths to your checkout.</p><CodeBlock examples={[installs[language]]} /><Link className="text-link" href={['/installation#python', '/sdk/nodejs#setup', '/sdk/rust#dependencies'][language]}>Complete {languages[language]} setup<ArrowRight size={14} /></Link><h3><span>02</span> Save the example and run</h3><p>The example creates urls.txt, defines a required title field and writes to datasets/example. Run it in a writable directory.</p><CodeBlock examples={[{ label: 'Run your example', language: 'shell', code: commands[language] }]} /><h3><span>03</span> Inspect the output</h3><p>Read the report and part-00000000.jsonl. Repeating an unchanged job resumes it; changed inputs need a fresh output directory.</p><Link className="text-link" href="/report-reference">Understand your report<ArrowRight size={14} /></Link></div>
          <div className="quickstart-code"><CodeBlock examples={[examples[language]]} /><div className="expected-output"><span className="eyebrow">Example output · after a successful fetch</span><CodeBlock examples={[{ label: 'part-00000000.jsonl', language: 'json', code: '{"title":"Example Domain","_source_url":"https://example.com/","_row":"0"}' }]} /></div><Link className="text-link" href="/reference/dataset-job">Parameters, returns & errors<ArrowRight size={14} /></Link></div>
        </div>
      </section>
      <div className="hub-paths"><Link href="/first-run"><BookOpen size={23} /><strong>Prefer a guided walkthrough?</strong><span>Run a local product catalog with expected records, duplicates and errors.</span><ArrowRight size={16} /></Link><Link href="/api-reference"><Braces size={23} /><strong>Looking up a method?</strong><span>Go directly to signatures, parameters, types and usage examples.</span><ArrowRight size={16} /></Link></div>
      <div className="directory-heading"><span className="eyebrow">Documentation directory</span><h2>Go deeper when you need to.</h2></div>
      {NAV_GROUPS.map(group => <section className="hub-group" key={group.title}><h2>{group.title}</h2><div>{group.paths.map(path => <Link href={path} key={path}><strong>{DOCS[path].title}<ArrowRight size={14} /></strong><p>{DOCS[path].description}</p></Link>)}</div></section>)}
    </div>
  </>;
}
