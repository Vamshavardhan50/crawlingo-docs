import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, Braces, Code2, Terminal } from 'lucide-react';
import { API_GROUPS } from '@/content/api-reference';
import { CodeBlock } from '@/components/code-block';
import { API_SNAPSHOT } from '@/content/sdk-reference';

export default function ApiReference() {
  return <><Head><title>API Reference · Crawlingo</title><meta name="description" content="Crawlingo SDK API reference: DatasetJob, JobConfig, JobField, JobReport, Session and Page. Signatures, parameters, returns, errors and copyable examples." key="description" /></Head>
    <div className="docs-hub api-hub">
      <span className="eyebrow">Developer reference</span><h1>API Reference</h1>
      <p className="lead">The contracts behind your dataset pipeline. Find a class, inspect its parameters, and copy an example into your project.</p>
      <div className="api-summary-grid"><Link href="/reference/node"><strong>Node.js / TypeScript</strong><span>{API_SNAPSHOT.node.exports.length} package exports · methods, fields, errors and examples</span></Link><Link href="/reference/python"><strong>Python</strong><span>{API_SNAPSHOT.python.exports.length} package exports · wrapper contracts and binding limitations</span></Link><Link href="/reference/rust"><strong>Rust</strong><span>Full rustdoc · modules, structs, traits and implementations</span></Link></div>
      <p><Link href="/reference/implementation-status">Read the implementation audit</Link> before choosing an integration. Source inventory counts are not runtime coverage scores. <Link href="/reference/cli">CLI reference</Link> covers all commands and flags.</p>
      <div className="api-context"><Braces size={19} /><p><strong>Local SDKs · Python, Node.js and Rust</strong><span>These APIs run in your application. Crawlingo does not currently provide a hosted REST API or API key service.</span></p></div>
      <div className="reference-languages"><Link href="/sdk/python">Python SDK<ArrowRight size={14} /></Link><Link href="/sdk/nodejs">Node.js / TypeScript<ArrowRight size={14} /></Link><Link href="/sdk/rust">Rust crate<ArrowRight size={14} /></Link></div>
      <section className="book-section"><h2>Generated Rust reference</h2><p>For the exact modules, types and trait implementations in your checkout, build the crate documentation with rustdoc. Native build prerequisites still apply. This opens the local reference for your source revision.</p><CodeBlock examples={[{ label: 'From the engine repository root', language: 'shell', code: 'cargo doc --locked --no-deps --open\n# Include the optional Chromium module:\ncargo doc --locked --no-deps --features browser --open' }]} /></section>
      {API_GROUPS.map(group => <section className="api-group" key={group.title}><h2>{group.title}</h2><div>{group.items.map(item => <Link href={item.path} className="api-entry" key={item.path}><div><span className={`api-kind kind-${item.kind}`}>{item.kind}</span><code>{item.name}</code><ArrowRight size={16} /></div><p>{item.detail}</p></Link>)}</div></section>)}
      <section className="api-lifecycle"><div><Code2 size={22} /><h2>One job. Three calls.</h2><p>Create the handle, run the job, inspect the report. Accepted records go to files in your output directory.</p><Link className="text-link" href="/reference/dataset-job">Full DatasetJob reference<ArrowRight size={14} /></Link></div><CodeBlock examples={[
        { label: 'Python', language: 'python', code: '# config is your JobConfig dictionary\njob = DatasetJob(config)\nreport = job.run()\nprint(report["records_written"])' },
        { label: 'Node.js', language: 'typescript', code: '// config is your JobConfig object\nconst job = new DatasetJob(config);\nconst report = await job.run();\nconsole.log(report.records_written);' },
        { label: 'Rust', language: 'rust', code: '// config: JobConfig, session: Arc<Session>\nlet job = DatasetJob::new(config, session)?;\nlet report = job.run().await?;\nprintln!("{}", report.records_written);' },
      ]} /></section>
      <Link href="/quick-start" className="reference-help"><Terminal size={20} /><div><strong>Need a runnable starting point?</strong><span>Install the SDK, create an input file and run your first dataset.</span></div><ArrowRight size={18} /></Link>
    </div>
  </>;
}
