import type { Doc } from './types';

const job = `{
  "urls_file": "examples/research_dataset/index-urls.txt",
  "output_dir": "work/research/index",
  "row_selector": ".pep-zero-table tbody tr",
  "fields": [
    { "name": "pep_number", "selector": "td:nth-child(2)", "data_type": "integer", "required": true },
    { "name": "title", "selector": "td:nth-child(3)", "required": true },
    { "name": "relative_url", "selector": "td:nth-child(2) a.pep", "extract_type": "attr:href", "required": true },
    { "name": "classification", "selector": "td:nth-child(1) abbr", "extract_type": "attr:title", "required": true }
  ],
  "concurrency": 2,
  "checkpoint_pages": 4,
  "max_response_bytes": 2097152,
  "max_records_per_page": 2000,
  "dedup_fields": ["relative_url"],
  "respect_robots": true,
  "format": "jsonl"
}`;

export const DEEP_DIVE_DOCS: Record<string, Doc> = {
  '/research-job-walkthrough': {
    title: 'A research job, line by line',
    category: 'Build a dataset',
    audience: 'Researchers and developers',
    description: 'Read a real job configuration, follow it through the Rust engine, and run the same dataset with the CLI, Python or Node.js.',
    sections: [
      { id: 'goal', title: 'What this example produces', paragraphs: [
        'The example reads the Python Enhancement Proposal numerical index and extracts one record for each matching table row. A record contains a proposal number, title, relative link and classification, plus source metadata. The input is a single index URL; one page can yield many records.',
        'The PEP project also provides structured metadata. Use its API or bulk data if it already meets your needs. This example explains the HTML extraction path rather than claiming it is the best way to obtain every research dataset.',
        'The examples describe the 1.0.0-alpha.2 source and package APIs. Page layout can change; check the output and errors before using the data.',
      ], links: [{ label: 'Example source files', href: 'https://github.com/Vamshavardhan50/crawlingo/tree/main/examples/research_dataset' }, { label: 'Full research workflow', href: '/research-datasets' }] },
      { id: 'input', title: '1. Start with the input URL', code: [{ label: 'examples/research_dataset/index-urls.txt', language: 'text', code: 'https://peps.python.org/numerical/' }], paragraphs: [
        'DatasetJob expects a UTF-8 text file with one HTTP or HTTPS URL per line. It reads the file in checkpoint batches. It does not discover all linked documents automatically from this list.',
        'Keep this file unchanged when resuming a job. Job paths are resolved relative to the process working directory, so run the commands below from the repository root.',
      ] },
      { id: 'config', title: '2. Read the complete configuration', code: [{ label: 'index-job.json', language: 'json', code: job }], paragraphs: [
        'JSON does not allow comments, so the tables below explain each line without making the copyable example invalid. These are real field names in JobConfig and JobField; unknown properties are rejected.',
      ], links: [{ label: 'JobConfig reference', href: '/reference/job-config' }, { label: 'JobField API', href: '/reference/node/job-field' }] },
      { id: 'inputs-explained', title: '3. Explain the input and row boundary', table: { headings: ['Property', 'What it does', 'Why it matters'], rows: [
        ['urls_file', 'Reads the list of source pages.', 'The input file identity is checked when resuming.'],
        ['output_dir', 'Stores state, reports and output shards for this job.', 'Use one writer per directory; start a new directory for a new snapshot or changed configuration.'],
        ['row_selector', 'Selects each matching table row as a record container.', 'Each field is evaluated within its row, avoiding alignment by separate lists.'],
        ['fields', 'Defines the ordered list of named values to extract.', 'A missing required value rejects its row and is recorded in an error shard.'],
      ] }, paragraphs: ['If one row lacks a value, other rows do not shift to fill its position. This does not prove that a selector chose the correct value: inspect a sample against the source page.'] },
      { id: 'fields-explained', title: '4. Explain every field', table: { headings: ['Field', 'Selector and extraction', 'Validation and output'], rows: [
        ['pep_number', 'td:nth-child(2): text from the second table cell.', 'Required; integer coercion is checked. Job output values are strings.'],
        ['title', 'td:nth-child(3): text from the third cell.', 'Required; an empty or missing value rejects the row.'],
        ['relative_url', 'td:nth-child(2) a.pep: first matching href attribute.', 'Required; the value is a relative link, not automatically a canonical URL.'],
        ['classification', 'td:nth-child(1) abbr: first matching title attribute.', 'Required; check the source HTML if the layout changes.'],
      ] }, paragraphs: [
        'name becomes the exported column name. selector is relative to the row container. extract_type defaults to text; attr:href and attr:title read attributes. data_type defaults to string. required=true rejects empty values instead of silently accepting them.',
        'The selector engine supports positive integer :nth-child(N), not the full browser selector language. Attribute extraction returns the first match. The preparation script resolves relative_url using the source URL; preserve both when building a derived dataset.',
      ], links: [{ label: 'Selector support and limits', href: '/selectors' }, { label: 'Schema and conversion', href: '/schema' }] },
      { id: 'limits-explained', title: '5. Explain concurrency, limits and identity', table: { headings: ['Property', 'Meaning in this job', 'Boundary'], rows: [
        ['concurrency: 2', 'At most two page-processing futures are in flight.', 'This is not a request-per-second setting or a global rate limit.'],
        ['checkpoint_pages: 4', 'Read up to four URL lines in one batch before a checkpoint.', 'It does not guarantee four records: a page can have many rows.'],
        ['max_response_bytes: 2097152', 'Reject a fetched body larger than 2 MiB.', 'The job checks response length after the fetch; do not treat it as a total process-memory cap.'],
        ['max_records_per_page: 2000', 'Limit records extracted from one page.', 'Review page failures if the source exceeds the configured bound.'],
        ['dedup_fields: [relative_url]', 'Compare exact extracted relative_url values within this job.', 'A duplicate is skipped, not merged or updated; other job directories have separate deduplication state.'],
        ['respect_robots: true', 'Check robots rules for each source.', 'Robots rules do not grant copyright or data reuse permission.'],
        ['format: jsonl', 'Write one JSON object per line in numbered shards.', 'DatasetJob supports JSONL and CSV; Parquet belongs to other export paths.'],
      ] }, paragraphs: ['The example session sets a per-host rate of one request per second. Separate processes do not share that limit; coordinate their combined request budget in your scheduler. Neither concurrency nor this example establishes a universal throughput or memory guarantee.'] },
      { id: 'run-cli', title: '6. Run it with the CLI', code: [{ label: 'Repository root', language: 'shell', code: 'cargo build --locked --release --features cli --bin crawlingo\ncargo run --locked --release --features cli -- --config examples/research_dataset/session.json --rate-limit-rps 1 dataset examples/research_dataset/index-job.json' }], table: { headings: ['Part', 'Meaning'], rows: [
        ['cargo build … --features cli', 'Build the Rust command-line binary with the CLI feature enabled.'],
        ['--config …/session.json', 'Load session headers and request settings. The sample identifies its user agent.'],
        ['--rate-limit-rps 1', 'Set a per-host rate for this session.'],
        ['dataset …/index-job.json', 'Read the configuration and run or resume the dataset job.'],
      ] }, paragraphs: ['A clean CLI run returns exit code 0. Exit code 2 indicates failed pages, rejected records or cancellation; 1 indicates a fatal error. Check the report and error shards even when a job reports complete.'] },
      { id: 'python', title: '7. Run the same configuration in Python', code: [{ label: 'run_job.py', language: 'python', code: `import json
from crawlingo import DatasetJob, Session

with open("examples/research_dataset/index-job.json", encoding="utf-8") as file:
    config = json.load(file)

session = Session.from_config("examples/research_dataset/session.json")
job = DatasetJob(config, session)
report = job.run()
print(report["records_written"], report["pages_failed"], report["records_rejected"])` }], table: { headings: ['Line or expression', 'What happens'], rows: [
        ['import json / from crawlingo …', 'Load the JSON parser and the public Python SDK classes.'],
        ['open / json.load', 'Read the same configuration file into a Python dictionary.'],
        ['Session.from_config(...)', 'Load the example session settings.'],
        ['DatasetJob(config, session)', 'Create a native job with those settings.'],
        ['job.run()', 'Run synchronously and return a report dictionary.'],
        ['print(...)', 'Show accepted records and the page and row error counts.'],
      ] }, paragraphs: ['Install the matching Python SDK before running this file. Run the CLI, Python and Node examples separately with distinct output directories, or deliberately resume the same unchanged job after its previous process has stopped.'] },
      { id: 'node', title: '8. Run it in Node.js', code: [{ label: 'run-job.cjs', language: 'javascript', code: `const { readFileSync } = require('node:fs');
const { DatasetJob, Session } = require('crawlingo');

const config = JSON.parse(readFileSync('examples/research_dataset/index-job.json', 'utf8'));
const session = Session.fromConfig('examples/research_dataset/session.json');

async function main() {
  const report = await new DatasetJob(config, session).run();
  console.log(report.records_written, report.pages_failed, report.records_rejected);
}
main().catch(error => { console.error(error); process.exitCode = 1; });` }], table: { headings: ['Line or expression', 'What happens'], rows: [
        ['require(...)', 'Load Node file reading and the Crawlingo SDK classes.'],
        ['JSON.parse(readFileSync(...))', 'Read the same job configuration.'],
        ['Session.fromConfig(...)', 'Load the session settings.'],
        ['new DatasetJob(config, session)', 'Create a native job; configuration crosses the binding as JSON.'],
        ['await …run()', 'Wait for the job and receive a report object.'],
        ['main().catch(...)', 'Print a fatal error and set a nonzero process exit code.'],
      ] }, paragraphs: ['Install the alpha package with npm install crawlingo. The runtime and platform need a supported native addon; see the Node SDK page for supported builds.'] },
      { id: 'execution', title: '9. Follow the work inside Rust', table: { headings: ['Stage', 'Implementation behavior', 'What to inspect'], rows: [
        ['Validate and open', 'Validate JobConfig, acquire the Sled job directory and compare the input/configuration signature.', 'A changed configuration or input requires a fresh directory.'],
        ['Read and deduplicate URLs', 'Read a bounded batch, validate URLs and check canonical URL keys.', 'source_lines, duplicate_urls and page errors.'],
        ['Fetch and extract', 'Check robots rules, dispatch requests through the session, then parse and extract rows.', 'pages_fetched, pages_failed and row error shards.'],
        ['Validate and deduplicate records', 'Validate field values and compare exact deduplication keys.', 'records_rejected and duplicate_records.'],
        ['Commit and resume', 'Write data and errors, record file hashes and commit checkpoint state.', 'report.json, manifest.jsonl and committed shard counts.'],
      ] }, paragraphs: ['The output is processed in input order. A slow page can delay later completed pages. A crash can cause the uncommitted batch to be replayed. On resume the engine verifies committed shards before continuing.', 'The job-specific response-size check occurs after fetching. The system also holds parser state, network buffers and Sled caches; the sample does not establish a fixed memory ceiling.'], links: [{ label: 'Dataset job implementation', href: 'https://github.com/Vamshavardhan50/crawlingo/blob/main/src/dataset/job.rs' }, { label: 'Checkpoint and recovery', href: '/recovery' }] },
      { id: 'output', title: '10. Inspect the output before using it', table: { headings: ['File or counter', 'Meaning'], rows: [
        ['part-00000000.jsonl', 'Data records from a committed batch. Field values and _row are strings.'],
        ['part-00000000.errors.jsonl', 'Page or row issues for that batch.'],
        ['report.json', 'Counters, completion and cancellation status for the job.'],
        ['manifest.jsonl', 'Dataset metadata and file hashes for committed shards.'],
        ['state/', 'Sled checkpoint and deduplication state; retain this directory to resume.'],
      ] }, paragraphs: ['_source_url identifies the fetched page; _row is an extraction position rather than a stable identifier. Reconcile exported records with the report, inspect error files, and compare sample records to the source. Convert integer strings downstream as needed.', 'A completed resume does not refetch pages or retry previously committed failures. To refresh or revisit failed URLs, prepare a new input file and output directory. Never share one output directory between active workers.'], links: [{ label: 'Report and error reference', href: '/report-reference' }, { label: 'Pandas and DuckDB', href: '/integrations/data' }] },
      { id: 'boundaries', title: '11. Know the boundaries', paragraphs: [
        'DatasetJob uses explicit selectors and does not apply the separate Dataset builder’s auto-match recovery to row extraction. It also does not render JavaScript pages, ingest PDFs, create embeddings or guarantee one million records on every site.',
        'For JavaScript-rendered pages, use the documented Playwright integration to discover URLs or create an explicit rendering pipeline. Review the actual adapter boundary before assuming rendered HTML can be passed to a job.',
      ], links: [{ label: 'Playwright integration', href: '/integrations/playwright' }, { label: 'Measured results and limits', href: '/real-world-results' }, { label: 'DatasetJob API reference', href: '/reference/dataset-job' }] },
    ],
  },
};
