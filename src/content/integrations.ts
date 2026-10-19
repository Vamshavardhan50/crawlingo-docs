import type { Doc } from './types';

export const INTEGRATION_DOCS: Record<string, Doc> = {
  '/integrations': {
    title: 'Integrations', category: 'Integrations',
    description: 'Use Crawlingo as the collection step in your existing data pipeline.',
    sections: [
      { id: 'contract', title: 'The integration contract', paragraphs: ['Crawlingo takes a UTF-8 URL file and a field schema. It writes validated records, rejection details and a completion report to a local directory. Your application owns discovery, scheduling and the destination for the finished dataset.'], code: [{ label: 'Pipeline', language: 'text', code: 'Discover URLs → urls.txt + job.json → Crawlingo worker\n             → JSONL / CSV + report → analysis, database or search' }] },
      { id: 'choose', title: 'Choose a handoff', table: { headings: ['Your tool', 'Connect through', 'Who does what'], rows: [
        ['Playwright / Puppeteer', 'A saved URL file', 'The browser discovers links; Crawlingo fetches and extracts destination pages.'],
        ['pandas / DuckDB', 'Completed JSONL or CSV shards', 'Crawlingo validates strings; the analysis tool casts types and queries records.'],
        ['FastAPI / Express', 'A queued SDK or CLI worker', 'Your service controls access and job status; Crawlingo produces files.'],
        ['Airflow / cron / CI', 'The CLI and its exit status', 'The scheduler owns retries and storage; Crawlingo resumes an unchanged job.'],
        ['Object storage / databases', 'A separate export stage', 'Upload committed output after completion; retain state locally for resume.'],
        ['Search / RAG tools', 'JSONL records with source metadata', 'Your downstream code cleans text, chunks, embeds and indexes it.'],
      ] }, links: [{ label: 'Playwright and Puppeteer', href: '/integrations/playwright' }, { label: 'pandas, DuckDB and Parquet', href: '/integrations/data' }, { label: 'Services and scheduled workers', href: '/integrations/workers' }] },
      { id: 'ownership', title: 'Keep the boundaries explicit', bullets: [
        'Build the current SDK from source for DatasetJob. Older registry packages do not include the new job API.',
        'Give each job a stable input, configuration and output directory. Only one process may own that directory.',
        'Publish a dataset only after reviewing complete, cancelled, pages_failed and records_rejected.',
        'Use JSONL for incremental processing. Do not collect a million records into an application response.',
      ], links: [{ label: 'Job configuration', href: '/reference/job-config' }, { label: 'Report fields', href: '/report-reference' }] },
      { id: 'support', title: 'Adapters and support', paragraphs: ['The recipes here compose existing APIs and file formats. They are not maintained Playwright, Airflow, pandas or database plugins. Crawlingo has no hosted REST API, built-in queue, embedding service or direct object-storage checkpoint backend. Choose the recipe whose boundary matches your application.'] },
    ],
  },
  '/integrations/playwright': {
    title: 'Playwright & Puppeteer', category: 'Integrations',
    description: 'Discover links with a browser, then hand a stable URL file to a dataset job.',
    sections: [
      { id: 'fit', title: '1. Choose the right browser boundary', paragraphs: [
        'Use this pattern when a listing needs JavaScript or interaction, but each destination page contains the fields you need in its HTTP response. The browser runs only for discovery. The dataset job owns fetching, field validation, deduplication and checkpoints.',
        'If the data exists only after JavaScript runs on each destination, this URL handoff is insufficient. Crawlingo will fetch the destination again without the Playwright page state. See the rendered-content section before choosing this design.',
      ] },
      { id: 'install', title: '2. Prepare the tools', paragraphs: ['Build the matching Crawlingo SDK first. Install Playwright in the same Python environment or Node application. Browser installation is a separate step. The examples accept a listing URL and link selector so you can use a site you control.'], code: [
        { label: 'Python', language: 'shell', code: 'python -m pip install playwright\npython -m playwright install chromium' },
        { label: 'Node.js', language: 'shell', code: 'npm install playwright\nnpx playwright install chromium' },
      ], links: [{ label: 'Crawlingo source installation', href: '/installation' }] },
      { id: 'discover', title: '3. Save the discovered URLs', paragraphs: ['Save one of these examples and pass a listing URL plus the CSS selector for destination links. It waits for a link and keeps HTTP(S) URLs on the same origin. A real listing may require an explicit “all results loaded” signal, pagination or button clicks before collecting links. The link list is in memory for this discovery step; split very large listings into bounded batches.'], code: [
        { label: 'Python · discover.py', language: 'python', code: `import sys
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

listing, selector = sys.argv[1:3]
with sync_playwright() as p:
    browser = p.chromium.launch()
    try:
        page = browser.new_page()
        page.goto(listing, wait_until="domcontentloaded")
        links = page.locator(selector)
        links.first.wait_for(state="attached")
        origin = urlsplit(page.url)
        urls = links.evaluate_all("(nodes) => nodes.map(a => a.href)")
        accepted = set()
        for value in urls:
            if not value:
                continue
            url = urlsplit(value)
            if url.scheme in ("http", "https") and (url.scheme, url.netloc) == (origin.scheme, origin.netloc):
                accepted.add(url._replace(fragment="").geturl())
        if not accepted:
            raise RuntimeError("No destination URLs matched")
        Path("urls.txt").write_text("\\n".join(sorted(accepted)) + "\\n", encoding="utf-8")
    finally:
        browser.close()` },
        { label: 'Node.js · discover.mjs', language: 'javascript', code: `import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const [listing, selector] = process.argv.slice(2);
if (!listing || !selector) throw new Error('Pass a URL and link selector');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(listing, { waitUntil: 'domcontentloaded' });
  const links = page.locator(selector);
  await links.first().waitFor({ state: 'attached' });
  const origin = new URL(page.url()).origin;
  const hrefs = await links.evaluateAll(nodes => nodes.map(a => a.href));
  const urls = new Set();
  for (const href of hrefs) {
    if (!href) continue;
    const url = new URL(href);
    if (['http:', 'https:'].includes(url.protocol) && url.origin === origin) {
      url.hash = '';
      urls.add(url.href);
    }
  }
  if (!urls.size) throw new Error('No destination URLs matched');
  await writeFile('urls.txt', [...urls].sort().join('\\n') + '\\n');
} finally {
  await browser.close();
}` },
      ] },
      { id: 'run', title: '4. Run a dataset job', paragraphs: ['Inspect urls.txt, then keep it unchanged for the lifetime of the job. Save job.json below in the same directory. Replace h1 with the field selector in the destination response. This example produces one title record per page.'], code: [{ label: 'job.json', language: 'json', code: JSON.stringify({ urls_file: 'urls.txt', output_dir: 'datasets/discovered', fields: [{ name: 'title', selector: 'h1', required: true }], concurrency: 8, format: 'jsonl' }, null, 2) }, { label: 'Python · run_job.py', language: 'python', code: 'import json\nfrom crawlingo import DatasetJob\n\nwith open("job.json", encoding="utf-8") as source:\n    report = DatasetJob(json.load(source)).run()\nprint(report)\nif not report["complete"] or report["cancelled"] or report["pages_failed"] or report["records_rejected"]:\n    raise SystemExit("Review the report before publishing this dataset")' }, { label: 'Node.js · run-job.mjs', language: 'javascript', code: "import { readFile } from 'node:fs/promises';\nimport { DatasetJob } from 'crawlingo';\n\nconst config = JSON.parse(await readFile('job.json', 'utf8'));\nconst report = await new DatasetJob(config).run();\nconsole.log(report);\nif (!report.complete || report.cancelled || report.pages_failed || report.records_rejected) {\n  throw new Error('Review the report before publishing this dataset');\n}" }], links: [{ label: 'Output and recovery contract', href: '/reference/dataset-job' }] },
      { id: 'puppeteer', title: 'Using Puppeteer instead', paragraphs: ['In a Node project with Puppeteer installed, use its browser for the discovery stage. The output is the same urls.txt, so the job configuration and execution above are unchanged. Adjust the selector to the page and wait for the complete listing before taking a snapshot.'], code: [{ label: 'Node.js · discover-puppeteer.mjs', language: 'javascript', code: `import puppeteer from 'puppeteer';
import { writeFile } from 'node:fs/promises';

const [listing, selector] = process.argv.slice(2);
if (!listing || !selector) throw new Error('Pass a URL and link selector');
const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.goto(listing, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(selector);
  const origin = new URL(page.url()).origin;
  const hrefs = await page.$$eval(selector, nodes => nodes.map(a => a.href));
  const urls = new Set();
  for (const href of hrefs) {
    if (!href) continue;
    const url = new URL(href);
    if (['http:', 'https:'].includes(url.protocol) && url.origin === origin) {
      url.hash = '';
      urls.add(url.href);
    }
  }
  if (!urls.size) throw new Error('No destination URLs matched');
  await writeFile('urls.txt', [...urls].sort().join('\\n') + '\\n');
} finally {
  await browser.close();
}` }] },
      { id: 'rendered-content', title: 'When the destination also needs JavaScript', paragraphs: [
        'page.content() returns the rendered document HTML. The current Python and Node Page wrappers have no public from_html / fromHtml constructor, and DatasetJob accepts a URL file rather than HTML records. Do not pass HTML to Page.create: it expects a URL.',
        'For a browser-owned extraction workflow, keep extraction in Playwright or Puppeteer and write its records using your own pipeline. Alternatively, a custom Rust application can use Crawlingo’s optional browser feature and a browser-tier Session. That path launches its own Chromium process; it does not attach to the Playwright context.',
        'Playwright cookies, local storage, authentication and proxy configuration are not shared automatically. Session HTTP settings must be configured separately. A copied cookie may still be insufficient for a site whose state lives in the browser. Start with public destinations and inspect the actual response before scaling.',
      ], links: [{ label: 'Session reference', href: '/reference/session' }, { label: 'Rust browser tier', href: '/advanced' }] },
      { id: 'sources', title: 'API sources', links: [
        { label: 'Playwright Python: locator.evaluate_all', href: 'https://playwright.dev/python/docs/api/class-locator#locator-evaluate-all' },
        { label: 'Playwright: page.content', href: 'https://playwright.dev/docs/api/class-page#page-content' },
        { label: 'Puppeteer: page.$$eval', href: 'https://pptr.dev/api/puppeteer.page.__eval' },
      ] },
    ],
  },
  '/integrations/data': {
    title: 'pandas, DuckDB & Parquet', category: 'Integrations',
    description: 'Read completed output incrementally, convert field types, and produce an analytical dataset.',
    sections: [
      { id: 'input', title: 'Start with committed output', paragraphs: ['Run the product example first. The snippets below read its output directory from examples/product_dataset. Review report.json before importing records. Use only part-XXXXXXXX.jsonl files: a broad *.jsonl glob also matches error shards. Crawlingo stores validated field values as strings, so define downstream types deliberately.'], links: [{ label: 'Run the product example', href: '/examples' }] },
      { id: 'pandas', title: 'Read JSONL in pandas batches', paragraphs: ['Install pandas in a separate analysis environment if needed. Process each chunk before reading the next. Concatenating every chunk recreates an in-memory dataset and loses the benefit of chunked reading. Keep identifiers as strings so leading zeros survive.'], code: [{ label: 'Terminal', language: 'shell', code: 'python -m pip install pandas' }, { label: 'Python · summarize.py', language: 'python', code: `import json
from pathlib import Path
import pandas as pd

root = Path("examples/product_dataset/output")
report = json.loads((root / "report.json").read_text(encoding="utf-8"))
if not report["complete"] or report["cancelled"]:
    raise RuntimeError("Wait for a completed job")
# The sample intentionally has one rejected row. Review its error shard first.
total = 0
for shard in sorted(root.glob("part-" + "[0-9]" * 8 + ".jsonl")):
    for chunk in pd.read_json(shard, lines=True, chunksize=10_000, dtype=False, convert_dates=False):
        chunk["sku"] = chunk["sku"].astype("string")
        chunk["price"] = pd.to_numeric(chunk["price"], errors="raise")
        total += len(chunk)
        print(chunk[["sku", "price"]].head())
print({"rows_processed": total, "rejected_rows": report["records_rejected"]})` }] },
      { id: 'duckdb', title: 'Query and convert with DuckDB', paragraphs: ['Install DuckDB and run this script from the repository root after the product job completes. The explicit columns preserve field types at import. Casting price creates a typed numeric column. This Parquet file is a downstream artifact; the dataset job itself still checkpoints JSONL or CSV.'], code: [{ label: 'Terminal', language: 'shell', code: 'python -m pip install duckdb' }, { label: 'Python · to_parquet.py', language: 'python', code: `from pathlib import Path
import duckdb

destination = Path("products.parquet")
if destination.exists():
    raise RuntimeError("Choose a new destination for this export")
with duckdb.connect() as con:
    con.execute("""
        CREATE TEMP VIEW products AS
        SELECT sku, name, CAST(price AS DOUBLE) AS price, _source_url
        FROM read_json(
          'examples/product_dataset/output/part-[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9].jsonl',
          format = 'newline_delimited',
          columns = {sku: 'VARCHAR', name: 'VARCHAR', price: 'VARCHAR',
                     _source_url: 'VARCHAR', _row: 'VARCHAR'}
        )
    """)
    print(con.execute("SELECT COUNT(*), AVG(price) FROM products").fetchone())
    con.execute("COPY products TO 'products.parquet' (FORMAT PARQUET)")
` }] },
      { id: 'destinations', title: 'Databases, object storage and search', table: { headings: ['Destination', 'Application responsibility'], rows: [
        ['SQL database', 'Batch records into transactions; define an identity key and use an intentional insert/upsert policy.'],
        ['Object storage', 'Upload completed data and error shards with the report and a file manifest; publish a completion marker last.'],
        ['Search or RAG index', 'Review extracted text, remove boilerplate, chunk it, create embeddings, and keep _source_url for attribution.'],
        ['CSV / spreadsheets', 'Read each shard with its own header; preserve identifiers as text and convert numbers explicitly.'],
      ] }, paragraphs: ['Do not upload a live state database as a consistent recovery snapshot. A remote bucket is not the local state backend. Snapshot a stopped job as a whole when you need a recoverable backup.'] },
      { id: 'sources', title: 'API sources', links: [{ label: 'pandas.read_json: lines, chunksize and dtype', href: 'https://pandas.pydata.org/docs/reference/api/pandas.read_json.html' }, { label: 'DuckDB JSON reader', href: 'https://duckdb.org/docs/stable/data/json/overview' }, { label: 'Crawlingo recovery', href: '/recovery' }] },
    ],
  },
  '/integrations/workers': {
    title: 'Services & scheduled workers', category: 'Integrations',
    description: 'Run Crawlingo behind an API or scheduler with explicit ownership, retries and output publication.',
    sections: [
      { id: 'architecture', title: 'Keep long jobs in a worker', paragraphs: ['For FastAPI, Express or another web framework, accept a request, enqueue an application job ID, and return that ID. A separate worker loads a trusted configuration and runs Crawlingo. The web handler returns progress metadata or file links rather than holding an HTTP connection open for a million records.'], code: [{ label: 'Application architecture', language: 'text', code: 'API request → your job store / queue → one worker per output_dir\nGET status  ← application job status ← report + error summary\nDownload    ← completed dataset     ← publication step' }], bullets: ['Persist your own queued/running/failed/published states. report.json is an engine report, not a queue or a live status service.', 'Validate submitted destinations and file paths in the application. Do not accept arbitrary output directories from an API caller.', 'Use durable storage for both shards and state. An ephemeral container filesystem cannot provide restart recovery.'] },
      { id: 'python', title: 'A Python worker entry point', paragraphs: ['Install the source SDK, save a trusted job.json, and run this script in the worker’s assigned directory. It returns a non-zero status when the result needs review. Configure your queue to retry only one worker for this output directory at a time.'], code: [{ label: 'worker.py', language: 'python', code: `import json
from pathlib import Path
from crawlingo import DatasetJob

config = json.loads(Path("job.json").read_text(encoding="utf-8"))
report = DatasetJob(config).run()
print(json.dumps(report))
if report["cancelled"] or not report["complete"]:
    raise SystemExit(1)
if report["pages_failed"] or report["records_rejected"]:
    raise SystemExit(2)
# Your publication step runs only after this point.
` }], bullets: ['The same synchronous entry point can run inside a queue task. In an async worker, await DatasetJob(config).run_async(). Cancellation requests a cooperative stop; wait for the worker to exit before starting a replacement on the same directory.'] },
      { id: 'node', title: 'A Node.js worker entry point', code: [{ label: 'worker.mjs', language: 'javascript', code: `import { readFile } from 'node:fs/promises';
import { DatasetJob } from 'crawlingo';

const config = JSON.parse(await readFile('job.json', 'utf8'));
const job = new DatasetJob(config);
const stop = () => job.cancel();
process.once('SIGTERM', stop);
process.once('SIGINT', stop);
try {
  const report = await job.run();
  console.log(JSON.stringify(report));
  process.exitCode = report.cancelled || !report.complete ? 1
    : report.pages_failed || report.records_rejected ? 2 : 0;
} finally {
  process.removeListener('SIGTERM', stop);
  process.removeListener('SIGINT', stop);
}` }], paragraphs: ['Use the native SDK in a Node server or worker process. It cannot run in a browser bundle or an edge runtime without native-addon support. Await completion after cancel() so the next owner does not race the current writer.'] },
      { id: 'scheduler', title: 'cron, Airflow and CI jobs', paragraphs: ['Build the CLI once in your worker image. Configure the scheduler to run the command below with a fixed working directory and a persistent mounted job directory. In Airflow, the task or container operator runs the same command; this guide does not require a custom Crawlingo operator.'], code: [{ label: 'Worker command', language: 'shell', code: 'crawlingo dataset /work/job.json' }], table: { headings: ['CLI status', 'Meaning', 'Scheduler action'], rows: [['0', 'Complete with no page failures or rejected rows', 'Proceed to the publication task.'], ['2', 'Page failures, rejected rows, or cooperative cancellation', 'Inspect the report; resume cancellation after the old worker exits.'], ['1', 'Fatal startup, configuration or storage error', 'Resolve the error before retrying.']] }, bullets: ['A retry uses the same immutable inputs and directory. A scheduled refresh uses a new directory for that collection date. A finished job resumes without refetching completed URLs; it does not refresh pages or retry previously committed failures automatically. A process killed by the OS may return a different exit status.'], links: [{ label: 'Container and storage setup', href: '/deployment' }, { label: 'Recovery and retry semantics', href: '/recovery' }] },
      { id: 'publish', title: 'Publish a finished dataset', bullets: ['Check report counters against your quality threshold.', 'Keep data shards, error shards, report, input and configuration traceable to one run.', 'Write a destination manifest or completion marker only after all transfers succeed.', 'Use stable record keys to make downstream retries idempotent. Dataset deduplication is scoped to a job, not your entire database.'], links: [{ label: 'FastAPI: background work considerations', href: 'https://fastapi.tiangolo.com/tutorial/background-tasks/' }, { label: 'Processing the output', href: '/integrations/data' }] },
    ],
  },
};
