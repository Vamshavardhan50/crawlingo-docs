import Head from 'next/head';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCheck, Code2, Database, FileJson2, Layers3, ListFilter, RotateCcw, Terminal } from 'lucide-react';
import { CodeBlock } from '@/components/documentation-page';
import { RUN_EXAMPLES } from '@/content/docs';

const capabilities = [
  { icon: ListFilter, title: 'Collect the fields you need', text: 'Define a record with selectors for names, prices, identifiers or article text. Extract one row or many rows from each page.', href: '/dataset-jobs' },
  { icon: CheckCheck, title: 'Make quality explicit', text: 'Require important fields, validate values and keep rejected rows in a separate error file for review.', href: '/schema' },
  { icon: Layers3, title: 'Remove exact duplicates', text: 'Choose which fields define identity. Count repeated URLs and records instead of writing them again.', href: '/concepts#identity' },
  { icon: RotateCcw, title: 'Continue interrupted work', text: 'Keep local checkpoints with the output. Resume the same input and configuration from committed progress.', href: '/recovery' },
  { icon: FileJson2, title: 'Export data you can use', text: 'Write JSONL or CSV shards with a source URL for each accepted record. Consume records incrementally.', href: '/developer-tutorial#consume' },
  { icon: Code2, title: 'Work in your language', text: 'Control the Rust engine from Python, Node.js, Rust or the CLI. Receive a report while records are written to disk.', href: '/installation' },
];

export default function Home() {
  return <>
    <Head>
      <title>Crawlingo · Turn web pages into useful datasets</title>
      <meta name="description" content="Collect, validate and export web data with Crawlingo. A Rust dataset engine with Python and Node.js SDKs, resumable jobs and practical developer guides." key="description" />
    </Head>
    <div className="landing-content">
      <section className="landing-hero">
        <div className="landing-intro">
          <div className="home-kicker"><span className="status-dot" />Open source · Current development source</div>
          <h1>Web pages in.<br /><em>Useful datasets out.</em></h1>
          <p>Build research directories, document collections and datasets for analysis. Give Crawlingo your URLs and field rules; the Rust engine validates records, removes exact duplicates and exports JSONL or CSV.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/guides">Start building<ArrowRight size={16} /></Link>
            <Link className="button" href="/api-reference">API Reference<ArrowUpRight size={15} /></Link>
          </div>
          <div className="language-line"><span>Rust engine</span><span>Python</span><span>Node.js</span><span>CLI</span></div>
          <p className="availability-note">New dataset APIs require a source build. <Link href="/installation">Installation guide<ArrowUpRight size={12} /></Link> · <Link href="/research-datasets">Research dataset walkthrough<ArrowUpRight size={12} /></Link></p>
        </div>
        <div className="record-demo" aria-label="Illustration of the included product dataset example">
          <div className="record-demo-heading"><span className="eyebrow">A small, real example</span><span className="demo-label">Product catalog</span></div>
          <div className="source-preview"><div className="source-preview-label"><span className="status-dot" />catalog.html</div><div className="sample-product"><span className="product-mark">01</span><div><strong>Café mug</strong><small>SKU A-101</small></div><span>$12.50</span></div><div className="sample-product"><span className="product-mark">02</span><div><strong>Notebook</strong><small>SKU B-202</small></div><span>$6.00</span></div></div>
          <div className="conversion-label"><ArrowDown size={18} /><span>Extract · validate · deduplicate</span></div>
          <div className="output-preview"><div className="source-preview-label"><FileJson2 size={14} />Your dataset<span>JSONL / CSV</span></div><table><thead><tr><th>sku</th><th>name</th><th>price</th></tr></thead><tbody><tr><td>A-101</td><td>Café mug</td><td>12.5</td></tr><tr><td>B-202</td><td>Notebook</td><td>6</td></tr></tbody></table></div>
          <div className="output-quality"><span><Check size={14} />2 accepted records</span><span>1 invalid row reported separately</span></div>
          <Link className="demo-example-link" href="/examples">Run this example yourself<ArrowRight size={14} /></Link>
        </div>
      </section>

      <section className="landing-section audience-section" aria-labelledby="choose-path">
        <div className="section-heading"><span className="eyebrow">Start where you are</span><h2 id="choose-path">One tool. Two ways to get started.</h2><p>Learn the workflow first, or go straight to building it into your application.</p></div>
        <div className="audience-grid">
          <div className="audience-card"><BookOpen size={26} /><span className="audience-label">For new users</span><h3>I want to understand and use the data.</h3><p>Learn what a dataset is, what files to prepare and how to review the result. Follow the local catalog example one step at a time.</p><ol><li><Link href="/overview">Understand what Crawlingo does<ArrowUpRight size={13} /></Link></li><li><Link href="/first-run">Complete a guided first run<ArrowUpRight size={13} /></Link></li><li><Link href="/report-reference">Read your output and errors<ArrowUpRight size={13} /></Link></li></ol></div>
          <div className="audience-card"><Code2 size={26} /><span className="audience-label">For developers</span><h3>I want to build a dataset workflow.</h3><p>Define a schema, integrate an SDK and operate a bounded Rust pipeline. Follow the contract from source URLs to committed output.</p><ol><li><Link href="/installation">Build the SDK for your language<ArrowUpRight size={13} /></Link></li><li><Link href="/developer-tutorial">Build an end-to-end workflow<ArrowUpRight size={13} /></Link></li><li><Link href="/production-guide">Operate and scale the job<ArrowUpRight size={13} /></Link></li></ol></div>
        </div>
        <p className="section-footnote">Crawlingo is currently a library and command-line tool. Initial setup and extraction rules require technical work.</p>
      </section>

      <section className="landing-section" aria-labelledby="capabilities-title">
        <div className="section-heading split-heading"><div><span className="eyebrow">What it does</span><h2 id="capabilities-title">A workflow beyond downloading pages.</h2></div><Link className="text-link" href="/features">View the full feature status<ArrowRight size={14} /></Link></div>
        <div className="capability-grid">{capabilities.map(({ icon: Icon, title, text, href }) => <Link className="capability-card" href={href} key={title}><Icon size={23} /><h3>{title}</h3><p>{text}</p><ArrowUpRight className="capability-arrow" size={15} /></Link>)}</div>
      </section>

      <section className="landing-section workflow-section" aria-labelledby="workflow-title">
        <div className="section-heading"><span className="eyebrow">From input to output</span><h2 id="workflow-title">You define a record. Rust handles the pipeline.</h2><p>Start with a small sample, inspect every result, then increase the workload.</p></div>
        <div className="workflow-grid">{[
          ['01', 'Prepare the sources', 'Save one URL per line. Decide what one record represents and where the output belongs.'],
          ['02', 'Describe the fields', 'Choose row and field selectors. Set required values, validation rules and record identity.'],
          ['03', 'Run the job', 'Fetch and extract within configured bounds. Write accepted records, errors and local checkpoints.'],
          ['04', 'Review and use', 'Read the report, inspect rejected rows, and stream accepted data into your next step.'],
        ].map(([number, title, detail]) => <div key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{detail}</p></div>)}</div>
      </section>

      <section className="landing-section" aria-labelledby="use-cases-title">
        <div className="section-heading split-heading"><div><span className="eyebrow">Put it to work</span><h2 id="use-cases-title">Build around the data you need.</h2></div><Link className="text-link" href="/use-cases">Explore use cases<ArrowRight size={14} /></Link></div>
        <div className="guide-cards"><Link className="guide-card" href="/use-cases#catalogs"><Database size={25} /><h3>Catalogs and directories</h3><p>Extract consistent identifiers, names and prices from repeated entries. Choose exactly what counts as a duplicate.</p><span className="use-case-fields">sku · name · price</span></Link><Link className="guide-card" href="/use-cases#articles"><FileJson2 size={25} /><h3>Articles and documentation</h3><p>Collect titles and body text with source links. Inspect content fidelity before using the collection downstream.</p><span className="use-case-fields">title · body · source</span></Link><Link className="guide-card" href="/use-cases#applications"><Terminal size={25} /><h3>Application data workflows</h3><p>Run a backend worker, inspect its report and feed accepted records to your analysis or storage system.</p><span className="use-case-fields">input · job · report</span></Link></div>
      </section>

      <section className="landing-section integration-section" aria-labelledby="languages-title"><div><span className="eyebrow">Fits your application</span><h2 id="languages-title">Your language.<br />One dataset engine.</h2><p>Python for data workflows. Node.js for backend services. Rust for direct access to the engine.</p><p>Pass configuration into the native pipeline and receive a compact report. The records are written to disk while the job runs.</p><div className="sdk-links"><Link href="/sdk/python">Python SDK<ArrowUpRight size={13} /></Link><Link href="/sdk/nodejs">Node.js SDK<ArrowUpRight size={13} /></Link><Link href="/sdk/rust">Rust SDK<ArrowUpRight size={13} /></Link></div><Link className="text-link" href="/developer-tutorial">Follow the developer tutorial<ArrowRight size={14} /></Link></div><CodeBlock examples={RUN_EXAMPLES.slice(0, 3)} /></section>

      <section className="landing-section measurement-card"><div><span className="eyebrow">Measured, with context</span><h2>A million-record acceptance run.</h2><p>Small UTF-8 pages over local HTTP. Windows, release build, 50 concurrent requests. Every exported record checked; resume performed no refetching.</p></div><div className="measurement-values"><div><strong>1M</strong><span>pages & records verified</span></div><div><strong>0</strong><span>failed or rejected items</span></div><div><strong>181.5</strong><span>MiB peak working set</span></div></div><Link href="/benchmarks">Read the workload, results and limitations<ArrowRight size={14} /></Link></section>

      <section className="landing-section landing-faq" aria-labelledby="faq-title"><div className="section-heading"><span className="eyebrow">Before you begin</span><h2 id="faq-title">A few useful answers.</h2></div><div>{[
        ['Do I need to know Rust?', 'No. You can run the CLI or use the Python and Node.js SDKs. The current development APIs need a matching source build, which requires native build tools. The guided first run walks through the files and commands.'],
        ['Can I use it without writing code?', 'The current product is a library and command-line tool, with no hosted no-code dashboard. You can use the supplied configuration once it is built; adapting selectors and integrating a workflow require technical work.'],
        ['Does it automatically understand every website?', 'You define explicit extraction rules. Review selectors and output against representative pages. JavaScript rendering and selector recovery have separate scopes; bulk jobs do not silently repair selectors.'],
        ['Can I stop and resume a large job?', 'Yes, using the same input, configuration and local output directory with one writer. An unfinished batch may be replayed. Keep state and shards together, and resume after a hard crash before consuming final output.'],
        ['What formats can I export?', 'DatasetJob writes JSONL or CSV shards. Values are strings, including validated numbers. Existing lower-level APIs also support other exports, but checkpointed Parquet jobs and typed job output are not implemented yet.'],
        ['Is the million-page result a speed guarantee?', 'No. It is a controlled acceptance workload with verified outputs. Live-site latency, source policies, payload size, rendering and machine resources change the result. The benchmark guide includes the method and limits.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className="landing-cta"><span className="eyebrow">Start small. Make it useful.</span><h2>Your first dataset is the best place to begin.</h2><p>Run the local catalog, inspect its records and learn how the pieces fit together.</p><div className="hero-actions"><Link className="button button-primary" href="/first-run">Follow the guided example<ArrowRight size={15} /></Link><Link className="button" href="/guides">Browse all documentation<ArrowUpRight size={15} /></Link></div></section>
    </div>
  </>;
}
