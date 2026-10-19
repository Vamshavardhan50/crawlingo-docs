import type { Doc } from './types';

export const API_DOCS: Record<string, Doc> = {
  '/reference/dataset-job': {
    title: 'DatasetJob', category: 'API reference',
    description: 'Stream a URL file into validated JSONL or CSV shards. Construct a job, run it, inspect its report, and resume committed progress.',
    sections: [
      { id: 'workflow', title: 'Use this API to build a dataset', paragraphs: ['Start by defining the unit of observation, source identity and required fields. The research walkthrough runs this API through the CLI against a public directory, then collects a fixed sample of documents.'], links: [{ label: 'Research dataset walkthrough', href: '/research-datasets' }, { label: 'Dataset design and quality', href: '/dataset-design' }, { label: 'Public-site measurements', href: '/real-world-results' }] },
      { id: 'import', title: 'Import', code: [
        { label: 'Python', language: 'python', code: 'from crawlingo import DatasetJob, Session' },
        { label: 'Node.js', language: 'typescript', code: "import { DatasetJob, Session, type JobConfig, type JobReport } from 'crawlingo';" },
        { label: 'Rust', language: 'rust', code: 'use crawlingo::dataset::{DatasetJob, JobConfig, JobReport};\nuse crawlingo::engine::session::Session;\nuse std::sync::Arc;' },
      ], links: [{ label: 'Build and install the SDK', href: '/installation' }] },
      { id: 'constructor', title: 'Constructor', paragraphs: ['Validates the extraction configuration and creates a job handle. Fetching starts when run is called. Python and Node.js create a default session when one is omitted; Rust requires an Arc<Session>. These are signatures, followed by a complete usage example below.'], code: [
        { label: 'Python signature', language: 'python', code: 'DatasetJob(config: dict, session: Optional[Session] = None)' },
        { label: 'Node.js signature', language: 'typescript', code: 'new DatasetJob(config: JobConfig, session?: Session)' },
        { label: 'Rust signature', language: 'rust', code: 'pub fn new(config: JobConfig, session: Arc<Session>) -> Result<Self>' },
      ], table: { headings: ['Parameter', 'Required', 'Contract'], rows: [
        ['config', 'Yes', 'JobConfig: URL file, output directory, at least one field, and optional execution limits.'],
        ['session', 'Rust: yes; Python / Node: optional', 'Request headers, timeout, per-host pacing and transport configuration. Configure it before starting the job.'],
      ] }, links: [{ label: 'All JobConfig fields', href: '/reference/job-config' }, { label: 'Session methods', href: '/reference/session' }] },
      { id: 'run', title: 'run()', paragraphs: ['Runs a new job or resumes the same input and configuration. Records stay in the Rust pipeline and are written to disk; the method returns counters rather than a list of every record. The output directory permits one writer at a time.'], code: [
        { label: 'Python signature', language: 'python', code: 'def run(self) -> dict: ...\nasync def run_async(self) -> dict: ...' },
        { label: 'Node.js signature', language: 'typescript', code: 'run(): Promise<JobReport>' },
        { label: 'Rust signature', language: 'rust', code: 'pub async fn run(&self) -> Result<JobReport>' },
      ], table: { headings: ['Binding', 'Execution', 'Return value'], rows: [
        ['Python run()', 'Blocking; native work releases the GIL.', 'Dictionary with JobReport keys.'],
        ['Python run_async()', 'Runs the blocking job on an executor.', 'Awaitable yielding the same report dictionary.'],
        ['Node.js run()', 'Asynchronous native job.', 'Promise<JobReport>.'],
        ['Rust run().await', 'Async handle; filesystem work uses a blocking worker.', 'Result<JobReport, CrawlingoError>.'],
      ] }, links: [{ label: 'Every JobReport field', href: '/report-reference' }, { label: 'Committed output and resume', href: '/recovery' }] },
      { id: 'example', title: 'Complete usage example', paragraphs: ['Build the matching SDK, then run one example in a writable working directory. This example writes its one-line URL input and extracts the heading from example.com. Repeating it with the same configuration resumes the existing output. Use a new directory if you change the input or schema.'], code: [
        { label: 'Python · main.py', language: 'python', code: `from pathlib import Path
from crawlingo import DatasetJob

Path("urls.txt").write_text("https://example.com/\\n", encoding="utf-8")
job = DatasetJob({
    "urls_file": "urls.txt",
    "output_dir": "datasets/example",
    "fields": [{"name": "title", "selector": "h1", "required": True}],
    "format": "jsonl",
})
report = job.run()
print(report)
if not report["complete"] or report["pages_failed"] or report["records_rejected"]:
    raise RuntimeError("Review the report and error shards before using this dataset")` },
        { label: 'Node.js · main.mjs', language: 'javascript', code: `import { writeFileSync } from 'node:fs';
import { DatasetJob } from 'crawlingo';

writeFileSync('urls.txt', 'https://example.com/\\n', 'utf8');
const job = new DatasetJob({
  urls_file: 'urls.txt',
  output_dir: 'datasets/example',
  fields: [{ name: 'title', selector: 'h1', required: true }],
  format: 'jsonl',
});
const report = await job.run();
console.log(report);
if (!report.complete || report.pages_failed || report.records_rejected) {
  throw new Error('Review the report and error shards before using this dataset');
}` },
        { label: 'Rust · src/main.rs', language: 'rust', code: `use crawlingo::dataset::{DatasetJob, JobConfig};
use crawlingo::engine::session::Session;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    std::fs::write("urls.txt", "https://example.com/\\n")?;
    let config: JobConfig = serde_json::from_value(serde_json::json!({
        "urls_file": "urls.txt",
        "output_dir": "datasets/example",
        "fields": [{"name": "title", "selector": "h1", "required": true}],
        "format": "jsonl"
    }))?;
    let report = DatasetJob::new(config, Arc::new(Session::new()))?.run().await?;
    println!("{report:?}");
    if !report.complete || report.pages_failed > 0 || report.records_rejected > 0 {
        return Err("Review the report and error shards".into());
    }
    Ok(())
}` },
      ] },
      { id: 'output', title: 'Output record', paragraphs: ['After a successful fetch of the current example page, a data shard contains a record with this shape. Values are strings; _source_url and _row are provenance fields. Read report.shards to find the committed shard boundary. This is an illustrative result, not a live request from the documentation.'], code: [{ label: 'part-00000000.jsonl', language: 'json', code: '{"title":"Example Domain","_source_url":"https://example.com/","_row":"0"}' }] },
      { id: 'cancel', title: 'cancel()', paragraphs: ['Requests cancellation and returns immediately: None in Python, void in Node.js and () in Rust. It does not wait for the worker to release the directory. The uncommitted batch is discarded and can be replayed by a new instance. Keep the same URL file, configuration and output directory when resuming.', 'When a Python run_async task is cancelled, the wrapper requests native cancellation and re-raises CancelledError. The executor worker may still be shutting down. Wait for directory ownership to be released before launching a replacement. A cancelled handle stays cancelled; construct a new one to resume.'], code: [
        { label: 'Node.js · cancellation pattern', language: 'javascript', code: `const stop = () => job.cancel();
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
try {
  const report = await job.run();
  console.log({ cancelled: report.cancelled, shards: report.shards });
} finally {
  process.removeListener('SIGINT', stop);
  process.removeListener('SIGTERM', stop);
}` },
        { label: 'Rust · cancellation pattern', language: 'rust', code: `let running_job = job.clone();
let task = tokio::spawn(async move { running_job.run().await });
// Call this from your application's shutdown path:
job.cancel();
let report = task.await??;` },
      ], links: [{ label: 'Production shutdown and recovery', href: '/production-guide' }] },
      { id: 'errors', title: 'Errors and failure handling', paragraphs: ['Constructor and run failures throw in Python / Node.js and return Err in Rust. They include invalid configuration, inaccessible files, locked state and input changes. DatasetJob does not currently expose a portable structured error-code enum through the bindings; avoid treating message text as a stable machine API.'], table: { headings: ['Condition', 'Where to look', 'Next action'], rows: [
        ['Invalid config or unsupported format', 'Constructor exception / Err', 'Check required fields, accepted values and positive resource limits.'],
        ['Input file missing or output not writable', 'run exception / rejected promise / Err', 'Resolve paths against the worker’s current directory and check access.'],
        ['Another writer owns output_dir', 'run failure while opening state', 'Wait for the previous worker; use one owner per directory.'],
        ['Input or config changed on resume', 'run failure', 'Start a new job directory for the changed dataset.'],
        ['HTTP failure, robots denial, missing row container', 'pages_failed and error shards', 'Review failed sources. A completed job will not retry them automatically.'],
        ['Required field missing or invalid value', 'records_rejected and error shards', 'Inspect the affected row and correct the extraction rules.'],
      ] } },
    ],
  },
  '/reference/job-config': {
    title: 'JobConfig', category: 'API reference',
    description: 'The shared configuration contract for Python, Node.js, Rust and the CLI. JSON keys use snake_case in every binding.',
    sections: [
      { id: 'minimal', title: 'Minimal configuration', paragraphs: ['Save this as job.json and create urls.txt with one HTTP(S) URL per line. Paths are relative to the process working directory. Unknown keys are rejected.'], code: [{ label: 'job.json', language: 'json', code: '{\n  "urls_file": "urls.txt",\n  "output_dir": "datasets/pages",\n  "fields": [{ "name": "title", "selector": "h1", "required": true }]\n}' }] },
      { id: 'input', title: 'Input and extraction', table: { headings: ['Property', 'Type', 'Default', 'Behavior'], rows: [
        ['urls_file', 'string / Rust PathBuf', 'Required', 'UTF-8 input, one URL per line; maximum line size 8192 bytes.'],
        ['output_dir', 'string / Rust PathBuf', 'Required', 'Job-owned state, data, errors and report directory. One active writer.'],
        ['fields', 'JobField[] / Vec<JobField>', 'Required', 'At least one field. Names must be unique, nonempty and cannot begin with _.'],
        ['row_selector', 'string / Option<String>', 'Omitted', 'CSS container for each record. Omit for one record per page.'],
      ] }, links: [{ label: 'JobField options and validation', href: '/schema' }, { label: 'Row container example', href: '/dataset-jobs#row-containers' }] },
      { id: 'limits', title: 'Concurrency and resource limits', table: { headings: ['Property', 'Type', 'Default', 'Constraint / scope'], rows: [
        ['concurrency', 'integer', '16', '1–1024 concurrent pages; actual active work is also limited by the checkpoint batch size.'],
        ['checkpoint_pages', 'integer', '256', '1–10000 input lines per batch. The unfinished batch can replay after interruption.'],
        ['checkpoint_bytes', 'integer', '33554432 (32 MiB)', 'Positive byte budget for pending exact dedup keys and values.'],
        ['max_response_bytes', 'integer', '2097152 (2 MiB)', 'Positive per-page body limit checked before parsing.'],
        ['max_records_per_page', 'integer', '1000', 'Positive maximum row containers per page.'],
        ['max_record_bytes', 'integer', '262144 (256 KiB)', 'Positive maximum serialized extracted field bytes per record.'],
      ] }, paragraphs: ['These limits apply to separate buffers; their sum is not a total memory guarantee. The default HTTP transport also bounds bodies while streaming at 16 MiB. A custom transport needs its own streaming limit.'], links: [{ label: 'Capacity planning', href: '/production-guide' }] },
      { id: 'export', title: 'Identity, source policy and output', table: { headings: ['Property', 'Type', 'Default', 'Behavior'], rows: [
        ['deduplicate', 'boolean', 'true', 'Compare exact record identity against the on-disk index. URL deduplication is separate.'],
        ['dedup_fields', 'string[]', '[]', 'Empty means all extracted fields; otherwise every name must be declared in fields. Metadata is excluded.'],
        ['respect_robots', 'boolean', 'true', 'Apply robots rules and crawl delay using the session User-Agent.'],
        ['format', '"jsonl" | "csv"', '"jsonl"', 'Fixed-schema shards. CSV includes a header in every data shard.'],
      ] }, paragraphs: ['Changing any serialized configuration or the URL-file content makes it a different job. Use a fresh output directory. JSONL values remain strings after numeric or boolean validation. Checkpointed Parquet output is not part of this API.'] },
      { id: 'typed', title: 'TypeScript contract', code: [{ label: 'Exported JobConfig type', language: 'typescript', code: `import type { JobField } from 'crawlingo';

interface JobConfig {
  urls_file: string;
  output_dir: string;
  fields: JobField[];
  row_selector?: string;
  concurrency?: number;
  checkpoint_pages?: number;
  checkpoint_bytes?: number;
  max_response_bytes?: number;
  max_records_per_page?: number;
  max_record_bytes?: number;
  deduplicate?: boolean;
  dedup_fields?: string[];
  respect_robots?: boolean;
  format?: 'jsonl' | 'csv';
}` }], paragraphs: ['Import JobConfig from crawlingo in your application. This declaration shows the current exported type; the Rust engine still validates constraints at runtime. Python accepts a dictionary, while Rust can deserialize the same JSON into JobConfig.'], links: [{ label: 'DatasetJob constructor and methods', href: '/reference/dataset-job' }] },
    ],
  },
  '/reference/session': {
    title: 'Session', category: 'API reference',
    description: 'Configure request behavior before creating a job. Python uses snake_case methods; Node.js uses camelCase.',
    sections: [
      { id: 'create', title: 'Create and pass a session', code: [
        { label: 'Python', language: 'python', code: 'import json\nfrom crawlingo import DatasetJob, Session\n\nwith open("job.json", encoding="utf-8") as source:\n    config = json.load(source)\n\nsession = Session().rate_limit(2).timeout(30)\nsession.headers({"User-Agent": "MyDatasetBot/1.0"})\nreport = DatasetJob(config, session=session).run()\nprint(report)' },
        { label: 'Node.js', language: 'javascript', code: "import { readFileSync } from 'node:fs';\nimport { DatasetJob, Session } from 'crawlingo';\n\nconst config = JSON.parse(readFileSync('job.json', 'utf8'));\nconst session = new Session().rateLimit(2).timeout(30);\nsession.headers({ 'User-Agent': 'MyDatasetBot/1.0' });\nconst report = await new DatasetJob(config, session).run();\nconsole.log(report);" },
      ], links: [{ label: 'Create job.json', href: '/reference/job-config#minimal' }] },
      { id: 'requests', title: 'Request configuration methods', paragraphs: ['These setters return the session for chaining. Configure them before the first request; per-host rate limiters cache their configuration. timeout uses seconds. Session pacing is per host, while JobConfig.concurrency limits simultaneous page work.'], table: { headings: ['Python', 'Node.js', 'Argument', 'Purpose'], rows: [
        ['headers(headers)', 'headers(headers)', 'dict / Record<string, string>', 'Request headers, including the User-Agent used for robots matching.'],
        ['cookies(cookies)', 'cookies(cookies)', 'dict / Record<string, string>', 'Request cookies.'],
        ['timeout(seconds)', 'timeout(seconds)', 'int / number', 'Request timeout in seconds.'],
        ['rate_limit(requests_per_second)', 'rateLimit(requestsPerSecond)', 'float / number', 'Per-host request pacing.'],
        ['proxy(proxy_url)', 'proxy(proxyUrl)', 'string', 'Configure an outbound proxy URL.'],
        ['proxy_pool(proxies)', 'proxyPool(proxies)', 'list[str] / string[]', 'Configure a set of proxy URLs.'],
        ['proxy_provider(url)', 'proxyProvider(url)', 'URL string; Node also accepts null', 'Configure a proxy-provider URL.'],
      ] } },
      { id: 'transport', title: 'Transport and selector recovery', table: { headings: ['Python', 'Node.js', 'Values / behavior'], rows: [
        ['fetcher_tier(tier)', 'fetcherTier(tier)', 'Node typing supports standard and stealthy. Chromium requires a separate browser-enabled Rust build.'],
        ['browser_profile(profile)', 'browserProfile(profile)', 'Transport profile: chrome, firefox or safari in the Node type.'],
        ['auto_match(enabled)', 'autoMatch(enabled)', 'Enable selector recovery for supported existing extraction APIs. Not used by DatasetJob row extraction.'],
        ['fingerprint_path(path)', 'fingerprintPath(path)', 'Location for stored selector fingerprints.'],
        ['auto_match_weights(weights)', 'autoMatchWeights(weights)', 'Dictionary / record of numeric matching weights.'],
      ] }, paragraphs: ['A transport profile does not guarantee access to a target site. Configure browser rendering only through a build and API that expose it.'], links: [{ label: 'Selector recovery scope', href: '/auto-match' }, { label: 'Authentication examples', href: '/authentication' }] },
      { id: 'ownership', title: 'Ownership and binding differences', paragraphs: ['clone() returns another Session wrapper backed by the native clone operation. destroy() invokes native cleanup and returns None / void; avoid destroying a session while its jobs are running.', 'Python also provides helpers such as basic_auth, bearer_auth, from_config, metrics, page and dataset. The current Node Session class does not expose those helpers. Use headers for Node authentication and Page.create(url, { session }) for page inspection. Consult the source for additional Python helpers instead of translating names by assumption.'], links: [{ label: 'Page methods', href: '/reference/page' }, { label: 'Python SDK guide', href: '/sdk/python' }, { label: 'Node.js SDK guide', href: '/sdk/nodejs' }] },
    ],
  },
  '/reference/page': {
    title: 'Page', category: 'API reference',
    description: 'Fetch and inspect an individual page to develop selectors before creating a bulk dataset job.',
    sections: [
      { id: 'create', title: 'Create a page', paragraphs: ['Python Page(url) loads lazily when content is accessed. Page.create(url) fetches immediately. Node.js uses await Page.create(url, options); its constructor accepts a native page object, not a URL.'], code: [
        { label: 'Python', language: 'python', code: 'from crawlingo import Page\n\npage = Page.create("https://example.com/", timeout=30)\nprint(page.status, page.title())\nprint(page.css("h1").text())' },
        { label: 'Node.js', language: 'javascript', code: "import { Page } from 'crawlingo';\n\nconst page = await Page.create('https://example.com/', { timeout: 30 });\nconsole.log(page.status, page.title());\nconsole.log(page.css('h1').text());" },
      ] },
      { id: 'options', title: 'Fetch options', table: { headings: ['Python argument', 'Node.js options key', 'Type / use'], rows: [
        ['url', 'url (first argument)', 'string: HTTP(S) page address.'],
        ['timeout', 'timeout', 'Seconds: int / number.'],
        ['headers', 'headers', 'Dictionary / record of request headers.'],
        ['cookies', 'cookies', 'Dictionary / record of cookies.'],
        ['proxy', 'proxy', 'Proxy URL string.'],
        ['session', 'session', 'Existing Session instance.'],
        ['auto_match', 'autoMatch', 'boolean: enable supported selector recovery.'],
        ['retries', 'Not exposed', 'Python constructor argument; do not assume a Node option exists.'],
        ['Not exposed', 'browserProfile', 'Node option string for a transport profile.'],
      ] } },
      { id: 'members', title: 'Properties and selector methods', table: { headings: ['Python', 'Node.js', 'Returns'], rows: [
        ['page.url', 'page.url', 'string: page URL.'],
        ['page.status', 'page.status', 'int / number: HTTP status.'],
        ['html()', 'page.html', 'string: retained HTML.'],
        ['title()', 'title()', 'string: document title.'],
        ['css(selector)', 'css(selector)', 'ElementCollection for a CSS selector.'],
        ['xpath(query)', 'xpath(query)', 'ElementCollection for a supported XPath query.'],
        ['find_text(text)', 'findText(text)', 'ElementCollection for matching text.'],
        ['after_text(text)', 'afterText(text)', 'ElementCollection after matching text.'],
        ['before_text(text)', 'beforeText(text)', 'ElementCollection before matching text.'],
        ['regex(pattern)', 'regex(pattern)', 'ElementCollection from a regular-expression query.'],
      ] }, links: [{ label: 'Selector examples and limitations', href: '/selectors' }] },
      { id: 'bulk', title: 'From one page to a dataset', paragraphs: ['Use Page to inspect a representative page and select a record container. Check pages with missing fields too. Page retains HTML and parsed content; do not retain a million Page objects in an application list. Move the extraction rule into DatasetJob fields and feed it a URL file.'], links: [{ label: 'DatasetJob API', href: '/reference/dataset-job' }, { label: 'Complete developer tutorial', href: '/developer-tutorial' }] },
    ],
  },
};

export const API_GROUPS = [
  { title: 'Dataset pipeline', items: [
    { name: 'DatasetJob', kind: 'class', path: '/reference/dataset-job', detail: 'constructor · run · run_async · cancel' },
    { name: 'JobConfig', kind: 'type', path: '/reference/job-config', detail: 'Input, output, concurrency and memory limits' },
    { name: 'JobField', kind: 'type', path: '/schema', detail: 'Selectors, extraction and field validation' },
    { name: 'JobReport', kind: 'type', path: '/report-reference', detail: 'Completion, errors, records and shard counters' },
  ] },
  { title: 'Fetch and extract', items: [
    { name: 'Session', kind: 'class', path: '/reference/session', detail: 'Headers, timeout, pacing and transport' },
    { name: 'Page', kind: 'class', path: '/reference/page', detail: 'Fetch one page and inspect its elements' },
    { name: 'Dataset', kind: 'guide', path: '/dataset', detail: 'Build and export a small in-memory dataset' },
    { name: 'Selectors', kind: 'guide', path: '/selectors', detail: 'CSS, XPath, regex and text selection' },
  ] },
  { title: 'Discovery and monitoring', items: [
    { name: 'Crawl', kind: 'guide', path: '/crawl', detail: 'Link discovery, frontier and crawl limits' },
    { name: 'Watch', kind: 'guide', path: '/watch', detail: 'Monitor selected fields for changes' },
    { name: 'CLI', kind: 'guide', path: '/tools/fetch-page', detail: 'Fetch, crawl and dataset commands' },
    { name: 'Output & recovery', kind: 'guide', path: '/recovery', detail: 'Files, commit boundaries and resume rules' },
  ] },
];
