import type { Doc } from './types';

const repository = 'https://github.com/Vamshavardhan50/crawlingo';

export const FIELD_MANUAL: Record<string, Doc> = {
  '/field-manual/research': {
    title: 'Research collection field manual',
    category: 'Field manual',
    audience: 'Researchers and developers',
    description: 'Plan a traceable research collection, inspect a public directory, and check whether its records answer your question.',
    sections: [
      {
        id: 'question', title: '1. Write the question before the selector',
        paragraphs: [
          'A collection is useful only when its unit of observation matches the question. A directory row, a document, and a paragraph are different units, even when they refer to the same subject.',
          'The public example collects proposal directory rows and then a separate sample of proposal documents. Do not add the two counts together as though they described distinct proposals.',
        ],
        table: { headings: ['Decision', 'PEP example', 'Reason'], rows: [
          ['Source', 'Python PEP numerical directory', 'One public index lists proposals in table rows.'],
          ['Directory unit', 'One row in the index', 'A page can contain hundreds of records.'],
          ['Document unit', 'One linked proposal page', 'A later job extracts one document per URL.'],
          ['Identity', 'Relative proposal URL for the directory job', 'The configured fields define exact deduplication.'],
          ['Sample', 'The first 20 linked documents', 'A convenience sample, not a random sample.'],
        ] },
        links: [{ label: 'The measured public run', href: '/real-world-results' }],
      },
      {
        id: 'source', title: '2. Choose and describe a source',
        paragraphs: [
          'Inspect the publisher’s documentation, access rules, reuse terms and update schedule. A public page is not automatically suitable for every downstream use. If a maintained API or downloadable dataset already contains your fields, consider using it instead of parsing HTML.',
          'Record the exact source URL, collection date, collector version and configuration with your dataset. A snapshot is a historical observation: the source may change after the run.',
        ],
        links: [{ label: 'Python PEP directory', href: 'https://peps.python.org/numerical/' }, { label: 'Source and sample files', href: `${repository}/tree/main/examples/research_dataset` }],
      },
      {
        id: 'source-shape', title: '3. Inspect the page structure',
        paragraphs: [
          'For the recorded PEP example, the row selector is .pep-zero-table tbody tr. Each matching table row is a separate extraction scope. The second column contains the number, the third contains the title, and the classification is read from an abbr title attribute.',
          'Check more than one row, including rows with missing values or extra links. The initial exploratory extraction included adjacent version text in many titles; selecting the third column corrected that error. A row count alone did not expose the problem.',
          'The source markup may change. Reinspect the page and test your selectors when a field becomes empty, unexpectedly long or semantically wrong.',
        ],
        code: [{ label: 'Field rules from the example', language: 'json', code: `{
  "row_selector": ".pep-zero-table tbody tr",
  "fields": [
    { "name": "pep_number", "selector": "td:nth-child(2)", "data_type": "integer", "required": true },
    { "name": "title", "selector": "td:nth-child(3)", "required": true },
    { "name": "relative_url", "selector": "td:nth-child(2) a.pep", "extract_type": "attr:href", "required": true },
    { "name": "classification", "selector": "td:nth-child(1) abbr", "extract_type": "attr:title", "required": true }
  ]
}` }],
        links: [{ label: 'Complete executable configuration', href: '/research-job-walkthrough#config' }, { label: 'Selector support', href: '/selectors' }],
      },
      {
        id: 'record', title: '4. Understand one recorded result',
        paragraphs: [
          'The following is the first record from a local PEP directory collection. Its _row is a position within this extraction, not a permanent identifier. The relative URL must be resolved against _source_url before it is used as an absolute link.',
          'The number is a string in DatasetJob output, even though the job validates it as an integer. Convert it explicitly when your analysis requires a numeric type.',
        ],
        code: [{ label: 'Recorded JSONL record', language: 'json', code: `{
  "_row": "0",
  "_source_url": "https://peps.python.org/numerical/",
  "classification": "Process, Active",
  "pep_number": "1",
  "relative_url": "../pep-0001/",
  "title": "PEP Purpose and Guidelines"
}` }],
      },
      {
        id: 'run', title: '5. Run the recorded workflow',
        paragraphs: [
          'Run from the repository root so the relative paths in the example point to the expected files. The supplied session identifies the collector and the command sets a rate of one request per second per host.',
          'Use a fresh output directory for a new snapshot. Running an already completed job resumes its existing state; it does not refresh the public website.',
        ],
        code: [{ label: 'Rust CLI', language: 'shell', code: `cargo build --locked --release --features cli --bin crawlingo
cargo run --locked --release --features cli -- --config examples/research_dataset/session.json --rate-limit-rps 1 dataset examples/research_dataset/index-job.json` }],
        links: [{ label: 'Step-by-step walkthrough', href: '/research-job-walkthrough' }],
      },
      {
        id: 'measure', title: '6. Read the result in context',
        paragraphs: [
          'On 19 October 2026 the recorded directory job fetched one page and wrote 744 records in 4.620 seconds. A separate job fetched 20 linked documents and wrote 20 records in 20.539 seconds.',
          'The run used a release-mode Rust CLI on Windows, a concurrency limit of two and a per-host request rate of one per second. These are observations from one paced run, not current counts, a live dashboard, or a maximum throughput claim.',
          'All directory IDs, titles and classifications were compared with an independently parsed source snapshot. Only the PEP 1 document body received the stated text-order comparison; the other 19 document bodies were not semantically certified.',
        ],
        links: [{ label: 'Method and caveats', href: '/real-world-results#method' }, { label: 'Machine-readable measurements', href: `${repository}/blob/main/measurements/2026-10-19-peps.json` }],
      },
      {
        id: 'sample', title: '7. Freeze and describe your sample',
        paragraphs: [
          'The included preparation script reads the directory output, verifies the report, resolves relative URLs, validates the expected origin and freezes up to 50 document URLs. It makes no network calls and refuses to overwrite an existing prepared file.',
          'Its default first-20 selection preserves source order. Record that choice in your analysis and do not treat it as representative of all proposals. For a random sample, design and record a separate sampling method and seed.',
        ],
        code: [{ label: 'Prepare 20 detail URLs', language: 'shell', code: 'python examples/research_dataset/prepare_details.py --limit 20' }],
        links: [{ label: 'Preparation script', href: `${repository}/blob/main/examples/research_dataset/prepare_details.py` }],
      },
      {
        id: 'provenance', title: '8. Preserve provenance during transformations',
        paragraphs: [
          'Keep the raw shards unchanged. Store normalized or cleaned records in a separate directory and record the transformation version. Preserve the source URL, source identifier, collection date and the raw snapshot associated with each derived record.',
          'If you split one document into chunks, include the parent document identifier and a chunk position. A chunk is a derived record, not a second independently collected document.',
        ],
      },
      {
        id: 'quality', title: '9. Review correctness and coverage',
        bullets: [
          'Inspect complete, cancelled, pages_failed and records_rejected before accepting the output.',
          'Compare a sample of extracted fields with the same source snapshot, including long and unusual rows.',
          'Report how many directory entries were discovered and how many documents were actually collected.',
          'Keep errors and missing sources in the study record; a completed job can still contain failures.',
          'Separate extraction correctness from licensing, statistical representativeness and scientific validity.',
        ],
        links: [{ label: 'Data quality checklist', href: '/field-manual/quality' }, { label: 'Report reference', href: '/report-reference' }],
      },
      {
        id: 'limits', title: '10. Know what this experiment does not show',
        paragraphs: [
          'The public run did not collect a million live pages, test maximum throughput, verify every document body, or exercise process-kill recovery. The million-record test used a separate local HTTP fixture with small generated pages.',
          'DatasetJob does not render JavaScript or automatically ingest PDF and JSON API responses. If destination content exists only after a browser runs, a link-discovery handoff alone does not provide the rendered DOM to the job.',
        ],
        links: [{ label: 'Public-web limitations', href: '/real-world-results#scope' }, { label: 'Browser integration boundary', href: '/integrations/playwright' }, { label: 'Local acceptance workload', href: '/benchmarks' }],
      },
    ],
  },
  '/field-manual/quality': {
    title: 'Dataset quality and validation',
    category: 'Field manual',
    audience: 'Researchers and developers',
    description: 'Turn field rules, reports, source comparisons and failure review into a practical quality process.',
    sections: [
      {
        id: 'definition', title: '1. Define what a good record means',
        paragraphs: [
          'Write down the meaning and expected source of each field. Required fields detect missing values, but a nonempty value can still be the wrong value. A valid-looking title selected from a neighboring column is a quality failure even if the job reports no rejection.',
          'Decide whether your downstream consumer needs every source record or can tolerate partial coverage. Define the review threshold before examining the results.',
        ],
      },
      {
        id: 'validation', title: '2. Use field validation deliberately',
        table: { headings: ['Field rule', 'What it checks', 'What it does not prove'], rows: [
          ['required', 'A usable value is present after extraction and defaults.', 'The selected value belongs to the intended entity.'],
          ['data_type', 'The selected string can be interpreted as the requested type.', 'That a number is within a domain-specific range.'],
          ['min_length', 'The extracted value meets a minimum length.', 'That a long value is complete, accurate or free of boilerplate.'],
          ['normalize_whitespace', 'Whitespace is normalized when enabled.', 'That the result is a lossless copy of source markup.'],
          ['default', 'A fallback can be supplied for absent data.', 'That a missing identifier or source fact has been recovered.'],
        ] },
        links: [{ label: 'JobField reference', href: '/schema' }],
      },
      {
        id: 'scope', title: '3. Keep fields inside one row',
        paragraphs: [
          'Use row_selector for repeated records. Field selectors are evaluated within each selected container so that a missing field in one row cannot pull a value from a neighboring row.',
          'One record per page can omit row_selector. In both cases compare selected values with representative source pages. Scoped extraction prevents one class of misalignment; it does not validate business meaning.',
        ],
        code: [{ label: 'Example job fields', language: 'json', code: `{
  "row_selector": "article.product",
  "fields": [
    { "name": "sku", "selector": "article.product", "extract_type": "attr:data-sku", "required": true },
    { "name": "name", "selector": "h2", "required": true },
    { "name": "price", "selector": ".price", "extract_type": "price", "data_type": "float", "required": true }
  ],
  "dedup_fields": ["sku"]
}` }],
        links: [{ label: 'Runnable catalog example', href: '/developer-tutorial' }],
      },
      {
        id: 'dedup', title: '4. Choose record identity',
        paragraphs: [
          'URL deduplication and record deduplication are different. The first skips repeated source URLs; the second skips valid records whose selected field values have already been observed in the job.',
          'An empty dedup_fields list compares all extracted fields. Specifying a stable identifier compares only those named fields. Exact deduplication does not merge records or find semantically similar entities.',
          'For a price history, a product ID alone would collapse later observations within the same job. Model the identity as the observation you intend to retain, and include any required timestamp or snapshot identity in your downstream design.',
        ],
      },
      {
        id: 'report', title: '5. Interpret completion and errors',
        table: { headings: ['Signal', 'Interpretation', 'Action'], rows: [
          ['complete = true', 'The input reached its end.', 'Still inspect failures and rejected records.'],
          ['cancelled = true', 'Cancellation was requested during this invocation.', 'Wait for the worker to stop, then resume with a new job handle.'],
          ['pages_failed > 0', 'Some sources did not produce a successfully processed page.', 'Inspect the corresponding error shards.'],
          ['records_rejected > 0', 'Some rows failed extraction or validation.', 'Compare those rows with the source.'],
          ['duplicate_urls or duplicate_records > 0', 'Exact duplicate checks skipped inputs or records.', 'Confirm the result matches your intended identity rule.'],
        ] },
        links: [{ label: 'All report fields', href: '/report-reference' }],
      },
      {
        id: 'acceptance', title: '6. Make acceptance a separate decision',
        paragraphs: [
          'The following strict policy is an example. A research project may choose a different documented threshold, but should never treat an exception-free run as proof that all values are correct.',
        ],
        code: [{ label: 'Python acceptance policy', language: 'python', code: `def accept_for_review(report):
    if report["cancelled"] or not report["complete"]:
        return False
    if report["pages_failed"] or report["records_rejected"]:
        return False
    return True

if not accept_for_review(report):
    raise RuntimeError("Inspect the report and error shards")
print("Ready for source comparison")` }],
      },
      {
        id: 'compare', title: '7. Compare output to the source',
        paragraphs: [
          'Choose sample rows before reviewing results. Compare identifiers, titles, classifications and any critical field to the source snapshot. Include edge cases, not only the easiest examples.',
          'Use an independent parser or a manual transcription where possible. Record the number checked, the comparison procedure and mismatches. If the source changes between collection and comparison, preserve the snapshot or explain the timing difference.',
          'The recorded PEP validation compared the full directory’s IDs, titles and classifications. Its document-body comparison covered PEP 1 only. That scope is narrower than a claim that all extracted documents are correct.',
        ],
        links: [{ label: 'Recorded semantic check', href: '/real-world-results#quality' }],
      },
      {
        id: 'coverage', title: '8. Describe missing data',
        paragraphs: [
          'Report the intended source population, pages attempted, successfully processed pages, accepted rows, rejected rows and the sampling method. One successful index page may contain many records; page counts and record counts are not interchangeable.',
          'A finished resume does not revisit committed page failures. Once you have corrected the problem, create a new URL file and job directory for the retry or refresh, and keep its relationship to the earlier snapshot explicit.',
        ],
      },
      {
        id: 'drift', title: '9. Detect and respond to source changes',
        paragraphs: [
          'Track missing-field and rejected-record counts over time, then manually inspect values that remain nonempty. A selector can silently match the wrong element after a redesign.',
          'DatasetJob uses explicit field selectors and does not apply the separate Dataset builder’s heuristic auto-match. Update the rule and start a new job directory when the configuration changes.',
        ],
        links: [{ label: 'Selector recovery scope', href: '/auto-match' }, { label: 'Troubleshooting', href: '/faq' }],
      },
      {
        id: 'review', title: '10. Quality review checklist',
        bullets: [
          'Save the job configuration, source list and collector version.',
          'Inspect report counters and retain the error shards.',
          'Confirm the intended identity and understand duplicate counts.',
          'Compare representative fields against a dated source snapshot.',
          'Document missing sources, sampling choices and transformations.',
          'Review source permissions and the intended use separately from technical validation.',
        ],
      },
    ],
  },
  '/field-manual/consume': {
    title: 'Consume JSONL and CSV safely',
    category: 'Field manual',
    audience: 'Developers and data users',
    description: 'Read committed shards incrementally, preserve provenance, and hand clean records to analysis tools.',
    sections: [
      {
        id: 'outputs', title: '1. Identify the files',
        paragraphs: [
          'DatasetJob writes numbered data shards, corresponding error shards, report.json, manifest.jsonl and a state directory. JSONL contains one JSON object per line. CSV shards each contain a header.',
          'Keep the entire output directory while a job may need to resume. The checkpoint database and committed shards belong together. Use one active writer per output directory.',
        ],
        code: [{ label: 'Typical output', language: 'text', code: `datasets/pages/
  report.json
  manifest.jsonl
  part-00000000.jsonl
  part-00000000.errors.jsonl
  state/` }],
        links: [{ label: 'Output and recovery details', href: '/recovery' }],
      },
      {
        id: 'boundary', title: '2. Respect the committed boundary',
        paragraphs: [
          'After a completed or cancelled invocation has returned, report.shards describes the committed shard count. After a hard crash, resume first: report.json can be stale and files from an unfinished batch can remain.',
          'Do not discover every matching file and assume it is committed. Read the numbered shards up to the report boundary, and treat a missing expected file as an error rather than silently skipping it.',
        ],
      },
      {
        id: 'python-reader', title: '3. Stream records with Python',
        paragraphs: [
          'This example reads a returned, completed report and then streams one committed JSONL shard at a time. Replace the output path with your own. It intentionally stops when the run contains errors; adapt this acceptance policy only after deciding how partial data will be handled.',
        ],
        code: [{ label: 'read_jsonl.py', language: 'python', code: `import json
from pathlib import Path

root = Path("datasets/pages")
with (root / "report.json").open(encoding="utf-8") as file:
    report = json.load(file)

if (not report["complete"] or report["cancelled"]
        or report["pages_failed"] or report["records_rejected"]):
    raise SystemExit("Review the job before consuming its output")

count = 0
for index in range(report["shards"]):
    shard = root / f"part-{index:08d}.jsonl"
    with shard.open(encoding="utf-8") as source:
        for line in source:
            record = json.loads(line)
            # Replace this with a bounded downstream operation.
            print(record["_source_url"], record.get("title", ""))
            count += 1

if count != report["records_written"]:
    raise RuntimeError("Committed row count does not match the report")
print(f"Read {count} committed records")` }],
      },
      {
        id: 'node-reader', title: '4. Stream records with Node.js',
        paragraphs: [
          'The Node example uses readline rather than loading the entire dataset into an array. It reads the same committed shard range and checks the observed record count.',
        ],
        code: [{ label: 'read-jsonl.mjs', language: 'javascript', code: `import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

const root = 'datasets/pages';
const report = JSON.parse(await readFile(join(root, 'report.json'), 'utf8'));
if (!report.complete || report.cancelled || report.pages_failed || report.records_rejected) {
  throw new Error('Review the job before consuming its output');
}

let count = 0;
for (let index = 0; index < report.shards; index++) {
  const name = 'part-' + String(index).padStart(8, '0') + '.jsonl';
  const lines = createInterface({ input: createReadStream(join(root, name)), crlfDelay: Infinity });
  for await (const line of lines) {
    const record = JSON.parse(line);
    console.log(record._source_url, record.title ?? '');
    count++;
  }
}
if (count !== report.records_written) throw new Error('Committed row count mismatch');
console.log('Read', count, 'committed records');` }],
      },
      {
        id: 'csv', title: '5. Read CSV as CSV',
        paragraphs: [
          'Each CSV data shard contains its own header. Parse every shard independently or use a CSV library that understands repeated headers. Concatenating files blindly can insert header rows into your data.',
          'CSV quoting handles commas, quotes and newlines within fields. Do not split rows on commas or lines manually. The same report and shard-boundary checks apply.',
        ],
      },
      {
        id: 'types', title: '6. Convert values deliberately',
        paragraphs: [
          'Job field values are exported as strings, including values checked with integer, float or boolean data types. _source_url and _row are also strings. Convert fields in the downstream step according to your own schema.',
          'An empty value, a default and a failed conversion are distinct cases. Record how you handle each, especially if the derived dataset will be used for analysis.',
        ],
        code: [{ label: 'Explicit numeric conversion', language: 'python', code: `raw_number = record["pep_number"]
number = int(raw_number)
if number < 0:
    raise ValueError("Expected a nonnegative proposal number")` }],
      },
      {
        id: 'pandas', title: '7. Use analysis tools with bounded expectations',
        paragraphs: [
          'pandas and DuckDB can read exported files, but loading all rows into a DataFrame is a separate memory decision. For large data, use chunks or a database query engine and measure memory on your actual workload.',
          'Crawlingo does not automatically create a pandas DataFrame, publish a database table or create embeddings. Those are explicit downstream steps owned by your application.',
        ],
        links: [{ label: 'pandas and DuckDB examples', href: '/integrations/data' }],
      },
      {
        id: 'provenance', title: '8. Keep the source trail',
        paragraphs: [
          '_source_url identifies the page fetched by the job. _row is the extracted row position. Preserve the source URL, source-specific identifier and snapshot date in derived data, and keep a link to the raw output and configuration.',
          'Do not use _row as a durable identifier across repeated snapshots: rows can move when the source changes. Use a stable source identifier when available.',
        ],
      },
      {
        id: 'publish', title: '9. Publish or upload as a separate step',
        paragraphs: [
          'Decide whether to publish only data shards or also reports, errors and metadata. Keep any sensitive source material and credentials out of public artifacts. Make downstream storage and access controls the responsibility of your own application.',
          'If you need to resume later, retain the original state and shards in durable storage together. Uploading a copy of data files alone does not create a resumable remote checkpoint.',
        ],
        links: [{ label: 'Worker and storage integration', href: '/integrations/workers' }],
      },
    ],
  },
  '/field-manual/operations': {
    title: 'Operate and recover dataset jobs',
    category: 'Field manual',
    audience: 'Developers and operators',
    description: 'Plan capacity, assign job ownership, handle shutdown, and respond to incomplete or failed work.',
    sections: [
      {
        id: 'ownership', title: '1. Give every job an owner',
        paragraphs: [
          'Assign a unique output directory to each independent input and configuration. One worker owns that directory at a time. The state database uses an exclusive lock, so starting another writer does not provide parallel processing of the same job.',
          'Persist the URL file, configuration, state, shards and collector version together. Input contents and serialized job configuration are checked on resume; changed inputs require a fresh directory.',
        ],
      },
      {
        id: 'budgets', title: '2. Set separate resource budgets',
        table: { headings: ['Control', 'Bounds', 'Important distinction'], rows: [
          ['concurrency', 'In-flight page processing in one job.', 'It is not requests per second.'],
          ['Session rate limit', 'Per-host request pacing in one session.', 'Separate processes do not share a global limiter.'],
          ['checkpoint_pages', 'Input lines in a checkpoint batch.', 'A page may produce many records.'],
          ['checkpoint_bytes', 'Pending exact-dedup identity payload.', 'It is not a process memory limit.'],
          ['max_response_bytes', 'Fetched response size accepted by the job.', 'The job check is after fetching.'],
          ['max_records_per_page', 'Number of row containers allowed on a page.', 'It does not select the most useful rows for you.'],
          ['max_record_bytes', 'Serialized extracted fields accepted for a record.', 'It does not guarantee complete document text.'],
        ] },
        links: [{ label: 'Defaults and constraints', href: '/reference/job-config#limits' }],
      },
      {
        id: 'capacity', title: '3. Estimate a workload before scaling',
        paragraphs: [
          'Estimate required pages as target accepted records divided by accepted unique records per page. Then account for the permitted request rate, discovery, robots requests, retries and actual source latency.',
          'For example, one million single-record pages at one page per second need at least 11.6 days of request time. At 20 accepted records per page the same target needs 50,000 pages, or at least 13.9 hours at that rate. These are arithmetic examples, not measured live-site performance.',
          'Estimate storage from measured serialized record sizes, plus error shards, deduplication state, temporary files and derived datasets. Profile representative pages rather than applying the local small-page benchmark to every source.',
        ],
        links: [{ label: 'Capacity planning', href: '/dataset-design#capacity' }, { label: 'Benchmark method', href: '/benchmarks' }],
      },
      {
        id: 'pilot', title: '4. Run a small pilot',
        bullets: [
          'Include multiple page shapes, long responses and expected missing values.',
          'Start at a source-appropriate request rate and small concurrency.',
          'Measure source latency, accepted records per page, errors, output bytes and worker memory.',
          'Compare representative extracted fields against the source.',
          'Keep the pilot separate from your production snapshot and record its configuration.',
        ],
      },
      {
        id: 'shutdown', title: '5. Handle shutdown and cancellation',
        paragraphs: [
          'Call cancel on the active DatasetJob handle, then wait for the run to return and release its output directory. Cancellation requests do not synchronously wait for the worker to stop.',
          'A cancelled handle stays cancelled. Construct a new job with the same configuration and input to resume. An unfinished batch can be replayed; keep state and committed shards together.',
        ],
        links: [{ label: 'Cancellation examples', href: '/reference/dataset-job#cancel' }],
      },
      {
        id: 'restart', title: '6. Resume after interruption',
        paragraphs: [
          'Start the same job using the unchanged input and configuration, with no other worker using the directory. The engine checks state and committed shard integrity before continuing.',
          'After a hard crash, resume before consuming a final output boundary. Do not remove checkpoint state to force a changed configuration through; use a new directory for a new job.',
          'The PEP experiment tested restart after a completed job. It did not prove behavior for process kills, disk-full conditions or corrupted storage. Test those failure modes for your own deployment.',
        ],
        links: [{ label: 'Recovery contract', href: '/recovery' }, { label: 'Public experiment limits', href: '/real-world-results#scope' }],
      },
      {
        id: 'partial', title: '7. Distinguish a partial result from a fatal error',
        paragraphs: [
          'A job can reach the end of its input while reporting failed pages or rejected records. A constructor or run error, by contrast, can indicate invalid configuration, storage access problems or an incompatible resume.',
          'Preserve the error details and decide whether partial output is acceptable. To revisit committed failures after fixing a problem, prepare a new job and output directory rather than expecting a completed resume to refetch them.',
        ],
        links: [{ label: 'Failure diagnosis', href: '/faq' }, { label: 'Report and errors', href: '/report-reference' }],
      },
      {
        id: 'workers', title: '8. Integrate with a worker or scheduler',
        paragraphs: [
          'Your service owns job scheduling, admission control, destination policy, storage and observability. Crawlingo runs the collection within that boundary and writes a report and local files.',
          'A Docker worker needs a native package for its own operating system and CPU architecture. Keep the output on a persistent volume if the job must resume after container replacement. Never copy a Windows native addon into a Linux container.',
          'If users can submit URLs, apply a separate destination and network policy in your service. The job URL validator alone is not a complete SSRF defense.',
        ],
        links: [{ label: 'Worker integration', href: '/integrations/workers' }, { label: 'Deployment guide', href: '/deployment' }],
      },
      {
        id: 'release', title: '9. Pin and verify your runtime',
        paragraphs: [
          'The published SDKs are alpha releases. Pin the version you tested, verify the native binary on the target platform and run a small fixture before deploying a worker.',
          'Development-source documentation can describe changes that are not present in the registry package. Review the implementation status and package version before relying on an individual method.',
        ],
        links: [{ label: 'Implementation status', href: '/reference/implementation-status' }, { label: 'Install guide', href: '/installation' }],
      },
      {
        id: 'handoff', title: '10. Operational handoff checklist',
        bullets: [
          'Job owner, source policy and target output directory are documented.',
          'Input, configuration, runtime version and state have a durable location.',
          'Only one writer can operate on each output directory.',
          'Shutdown waits for cancellation to complete before another worker resumes.',
          'Reports, errors, disk usage and source-specific request rates are monitored.',
          'A small fixture and realistic failure cases are exercised on the target platform.',
        ],
      },
    ],
  },
};
