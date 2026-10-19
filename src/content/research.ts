import type { Doc } from './types';

const repo = 'https://github.com/Vamshavardhan50/crawlingo';

export const RESEARCH_DOCS: Record<string, Doc> = {
  '/research-datasets': {
    title: 'Research and directory datasets', category: 'Build a dataset', audience: 'Researchers and developers',
    description: 'Collect a directory, choose a reproducible sample, extract documents, and produce records that can be traced back to their sources.',
    sections: [
      { id: 'purpose', title: 'Start with the dataset you need', paragraphs: [
        'Crawlingo turns known web pages into local records. For research, those records might describe technical proposals, public institutions, publications, projects or reference documents. Define one record before choosing how many pages to fetch.',
        'This walkthrough uses the public Python Enhancement Proposal directory: one index page produces many directory rows, then a small selection of document pages produces one record per document. This is technical-document research data; it is not a representative sample of journals, authenticated databases or JavaScript applications.',
        'The PEP site also publishes a metadata API. Prefer a maintained API or bulk download when it already supplies the data you need. This HTML example evaluates the extraction path; Crawlingo DatasetJob does not currently map arbitrary JSON API responses or PDF files into rows.',
      ], links: [{ label: 'Python PEP directory and metadata API', href: 'https://peps.python.org/' }, { label: 'Complete runnable example', href: `${repo}/tree/main/examples/research_dataset` }] },
      { id: 'model', title: 'Two related datasets', table: { headings: ['Dataset', 'One record means', 'Identity', 'Useful fields'], rows: [
        ['Directory', 'One listed proposal', 'PEP number or canonical URL', 'Title, classification, source URL'],
        ['Documents', 'One sampled proposal page', 'Canonical document URL', 'Title, extracted document text, source URL'],
        ['Derived analysis', 'A cleaned record, section or text chunk', 'Document ID + transformation version + chunk index', 'Normalized text, parent ID, source citation'],
      ] }, paragraphs: ['Keep these datasets separate. A directory may be complete while only 20 of its documents have been collected. Directory coverage and document coverage need different denominators.'] },
      { id: 'prepare', title: '1. Build the CLI and inspect the source', code: [{ label: 'From the Crawlingo repository root', language: 'shell', code: 'cargo build --locked --release --features cli --bin crawlingo\n# Review examples/research_dataset/index-job.json and session.json first.' }], bullets: [
        'Use a matching source build for 1.0.0-alpha.2; older registry packages may not contain DatasetJob.',
        'The example session identifies the collector and uses one request per second per host. Concurrency is two.',
        'Robots checks stay enabled. A missing robots.txt is not a content license; record the source’s applicable reuse terms separately.',
        'Run commands from the repository root: configuration paths are relative to the working directory, not the JSON file.',
      ], links: [{ label: 'Native build prerequisites', href: '/installation' }] },
      { id: 'directory', title: '2. Extract the directory', code: [
        { label: 'Run the supplied directory job', language: 'shell', code: 'cargo run --locked --release --features cli -- --config examples/research_dataset/session.json --rate-limit-rps 1 dataset examples/research_dataset/index-job.json' },
        { label: 'How a row is defined', language: 'json', code: JSON.stringify({ row_selector: '.pep-zero-table tbody tr', fields: [
          { name: 'pep_number', selector: 'td:nth-child(2)', data_type: 'integer', required: true },
          { name: 'title', selector: 'td:nth-child(3)', required: true },
          { name: 'relative_url', selector: 'td:nth-child(2) a.pep', extract_type: 'attr:href', required: true },
          { name: 'classification', selector: 'td:nth-child(1) abbr', extract_type: 'attr:title', required: true },
        ], dedup_fields: ['relative_url'] }, null, 2) },
      ], paragraphs: [
        'The JSON above explains the extraction fields; use the complete index-job.json from the example for execution. A row is scoped to a table row, so fields from neighboring proposals cannot be combined accidentally.',
        'Numbered table columns keep proposal IDs, titles and version links separate. :nth-child(N) accepts positive integer element positions; odd/even and an+b expressions are not supported. Attribute extraction returns the first matching attribute. The preparation script converts the ID to an integer and resolves the relative URL against _source_url.',
        'Inspect work/research/index/report.json. Exit code 0 indicates a clean run; 2 indicates failed pages, rejected rows or cancellation; 1 indicates a fatal error. complete=true alone does not mean the dataset has no errors.',
      ] },
      { id: 'sample', title: '3. Freeze a small document sample', code: [{ label: 'Normalize directory rows and select 20 documents', language: 'shell', code: 'python examples/research_dataset/prepare_details.py --limit 20' }], paragraphs: [
        'The script reads only committed data shards, checks the directory report, converts proposal numbers to integers, resolves links to the expected HTTPS origin, and writes work/research/directory.jsonl and work/research/detail-urls.txt. It makes no network calls.',
        'Selection follows directory order. This is a reproducible convenience sample, not a random or representative research sample. Use your own documented sampling method for statistical research. The script caps its demonstration sample at 50 documents.',
        'The script refuses to replace already prepared files. Keep the URL file unchanged when resuming. A later collection date, different sample or selector change needs a fresh output directory and a separate run identity.',
      ] },
      { id: 'documents', title: '4. Collect the document records', code: [{ label: 'Run the bounded detail job', language: 'shell', code: 'cargo run --locked --release --features cli -- --config examples/research_dataset/session.json --rate-limit-rps 1 dataset examples/research_dataset/detail-job.json' }], paragraphs: [
        'The detail schema extracts .page-title, the canonical link attribute and #pep-content. It requires a title, URL and at least 100 characters of content. Deduplication uses canonical_url. Required values and length checks catch empty shells; they do not establish scientific accuracy or completeness.',
        'The document selector includes headings, navigation within the article, metadata and body content. It is extracted text, not an automatically cleaned abstract. The text-order fix preserves mixed inline content; the custom parser is still not a browser-complete HTML implementation. HTML entities and non-UTF-8 inputs need explicit review.',
        'Use a known article section selector when you need an abstract or main body. The current selector implementation supports a limited subset; do not assume browser pseudo-classes, full XPath, PDF text or structured author arrays work.',
      ], links: [{ label: 'Selectors and supported syntax', href: '/selectors' }, { label: 'Dataset schema', href: '/schema' }] },
      { id: 'quality', title: '5. Check quality before analysis', bullets: [
        'Reconcile exported row counts with records_written. Read part-XXXXXXXX.errors.jsonl separately from data.',
        'Check stable IDs, required values, expected languages and unexpected redirects or login pages.',
        'Review text around links, emphasis, punctuation, lists and tables; a nonempty field can still be wrong.',
        'Measure accepted records divided by attempted candidate records, plus failed-page rate and duplicate rate. Document the denominator.',
        'Record source coverage and sample selection. Twenty correct documents do not prove completeness of the directory or all linked documents.',
        'Keep raw shards unchanged. Decode entities and apply cleaning in a derived dataset with a versioned transformation.',
      ], links: [{ label: 'Design and validate a dataset', href: '/dataset-design' }, { label: 'Measured public-site results', href: '/real-world-results' }] },
      { id: 'provenance', title: '6. Keep an evidence manifest', paragraphs: [
        'DatasetJob writes _source_url and _row. _row is an extraction position, not a permanent document ID. A canonical URL is an explicitly extracted field; it is not automatically supplied by the job.',
        'Your runner should also store collection start/end times, engine revision, URL-file hash, schema hash, session settings without secrets, source/reuse notes, and data-shard hashes. Current checkpoints do not include the engine revision or complete Session settings. Pin both when resuming a partially completed job.',
        'Store the original and derived dataset versions together. For retrieval or AI workflows, cite the source document and keep each chunk connected to its parent record. Embedding, train/test splitting, near-duplicate detection and factual validation belong in downstream processing.',
      ], links: [{ label: 'pandas, DuckDB and derived datasets', href: '/integrations/data' }] },
      { id: 'repeat', title: '7. Resume, then plan the next collection', paragraphs: [
        'Repeat the same command to resume the same job. Completed batches are not refreshed. A finished job is idempotent; running it again does not create a new snapshot of the website.',
        'For a new collection date, keep the old output and create new input/configuration files pointing to a fresh output directory. Compare records using stable IDs. The generic watch API is separate from this snapshot workflow.',
        'For large research runs, discover and freeze URLs first, pilot the schema, then partition approved sources into independent jobs with distinct directories. Per-session rate limits do not coordinate multiple processes. A scheduler must enforce each source’s combined request budget.',
      ], links: [{ label: 'Recovery semantics', href: '/recovery' }, { label: 'Worker orchestration', href: '/integrations/workers' }] },
    ],
  },
  '/dataset-design': {
    title: 'Design and validate a dataset', category: 'Build a dataset',
    description: 'Define records, identities, quality gates and capacity before scaling a collection.',
    sections: [
      { id: 'contract', title: 'Write a record contract first', paragraphs: ['A useful dataset has an explicit unit of observation. “One million data” can mean a million pages, directory rows, documents or text chunks. These require different workloads and cannot share a single requests-per-second claim.'], table: { headings: ['Decision', 'Research example', 'Why it matters'], rows: [
        ['Record unit', 'One proposal or organization', 'Prevents counting both cards and detail pages as new entities'],
        ['Stable identity', 'Canonical URL or source-issued ID', 'Supports deduplication and later comparisons'],
        ['Required fields', 'ID, title, source URL', 'Rejects unusable rows instead of filling them silently'],
        ['Optional fields', 'Published date, category', 'Represents missing data without invented values'],
        ['Coverage', 'All directory rows; first 20 documents', 'Makes the sampling boundary visible'],
        ['Update policy', 'Monthly immutable snapshots', 'Separates resume from refreshing stale records'],
      ] } },
      { id: 'architecture', title: 'Use the right collection path', table: { headings: ['Code path', 'Use it for', 'Current boundary'], rows: [
        ['DatasetJob', 'URL file → validated, deduplicated JSONL/CSV shards', 'Single writer, local state and bounded checkpoint batches'],
        ['Crawler / Dataset builder', 'Small discovery jobs and interactive extraction', 'Returned collections can grow in memory; not the million-record export path'],
        ['DatasetStream (Rust)', 'Your own producer feeding a bounded export queue', 'Advanced streaming API; not DatasetJob checkpoint semantics'],
        ['Playwright / Puppeteer', 'Discover links or inspect JavaScript-rendered content', 'Rendered DOM is not passed automatically into Python/Node DatasetJob'],
        ['Source API or bulk data', 'Already structured research metadata', 'Use its own ingestion client; HTML selectors do not parse API JSON'],
      ] }, links: [{ label: 'Architecture', href: '/architecture' }, { label: 'Browser integration boundaries', href: '/integrations/playwright' }] },
      { id: 'schema', title: 'Choose selectors and quality rules', paragraphs: [
        'Select a repeated container with row_selector for a directory page; omit it for one record per document. Each field is resolved within the record’s container. Make identifiers required before enabling deduplication on them.',
        'data_type validates and normalizes string values; integer, float and boolean values are still exported as strings. Convert types explicitly in pandas, SQL or your application. Defaults should encode an intentional value, not hide a missing required identifier.',
        'Use normalize_whitespace=true for prose metadata. Disable it for content where whitespace matters, but verify extraction: this is not a lossless HTML or source-code archive. Avoid broad body selectors that collect menus and footer text.',
      ], code: [{ label: 'Example identifier and title fields', language: 'json', code: JSON.stringify({ fields: [
        { name: 'source_id', selector: '.record', extract_type: 'attr:data-id', required: true },
        { name: 'title', selector: '.record-title', required: true, min_length: 5 },
      ], dedup_fields: ['source_id'] }, null, 2) }], links: [{ label: 'JobConfig field reference', href: '/reference/job-config' }] },
      { id: 'identity', title: 'Deduplication is an identity decision', paragraphs: [
        'With no dedup_fields, the job compares all extracted field values, excluding _source_url and _row. With dedup_fields, it compares only those fields. This is exact comparison, not fuzzy matching or semantic deduplication.',
        'A title alone is rarely a safe key: unrelated publications can share a title. A URL alone may also represent a document that changes over time. Choose a source ID for a snapshot and add a version or collection identity in your derived datasets when preserving revisions.',
        'Within one job, the first accepted value for an exact key wins. No later row merges or updates it. Across independently partitioned jobs, deduplication is separate; reconcile global identity downstream.',
      ] },
      { id: 'pilot', title: 'Establish a measurable pilot', bullets: [
        'Select a small set of different page templates, long documents and missing-field cases.',
        'Start with concurrency 2 and a source-approved host rate. Increase only after looking at latency, errors and resource use.',
        'Manually label a sample of expected fields and compare actual extraction, not just record counts.',
        'Keep failure records and rate-limit responses visible. A partial dataset can be useful only when its missing coverage is recorded.',
        'Repeat the unchanged job and compare shard hashes to check restart idempotence. Separately test interrupted-job recovery in a controlled environment.',
      ] },
      { id: 'capacity', title: 'Estimate one million records honestly', paragraphs: [
        'Start with pages_needed = target_records / accepted_unique_records_per_page. Then estimate collection time using the slower of the permitted request rate and the measured pipeline rate, with additional time for robots requests, retries, parsing, export and discovery.',
        'At an allowed one page per second, one million single-record pages need at least 11.6 days of request time. At 20 accepted records per page, the same target needs 50,000 pages: at least 13.9 hours. These are arithmetic examples, not measured Crawlingo performance or permission to use those rates.',
        'Output storage is approximately record_count × average serialized record size, plus error shards, exact-dedup state, temporary shards and derived datasets. One million 2 KiB records alone are about 1.91 GiB. Full documents can be far larger.',
        'Measure a representative pilot on the intended source. A local million-record fixture proves a particular workload completes; it does not establish a universal public-web throughput or memory ceiling.',
      ], links: [{ label: 'Measurements and methodology', href: '/real-world-results' }, { label: 'Local scale acceptance', href: '/benchmarks' }] },
      { id: 'bounds', title: 'Understand what the resource limits bound', table: { headings: ['Setting', 'Controls', 'Does not guarantee'], rows: [
        ['concurrency', 'In-flight page processing for one job', 'An allowed website rate or total process memory'],
        ['Session rate_limit_rps', 'Request pacing per host in one session', 'Coordination across workers or machines'],
        ['checkpoint_pages', 'Pages represented in a checkpoint batch', 'A fixed number of records when pages have different row counts'],
        ['checkpoint_bytes', 'Pending exact-dedup key budget', 'A total RSS cap; exceeding it is a fatal job error'],
        ['max_response_bytes', 'Job acceptance of a fetched response body', 'A job-specific streaming download cap; this check is after fetch'],
        ['max_records_per_page / max_record_bytes', 'Extraction and serialization acceptance limits', 'Automatic truncation into a valid smaller document'],
      ] }, paragraphs: ['Keep checkpoint batches smaller for long documents and large keys. The engine preserves input order when processing responses, so one slow page can delay later completed pages. Parser workers, network buffers, Sled, dedup state and output buffering all contribute to memory.'] },
      { id: 'publish', title: 'Define a publication gate', paragraphs: [
        'Your application decides when a dataset is ready to publish. A useful default is: complete=true, cancelled=false, no unreviewed page failures or rejected records, expected coverage, validated identity, a manual quality sample and stable artifact hashes.',
        'Never have two workers write one output directory. Treat local job state as recovery state, and publish immutable data shards with a manifest only after review. If some source failures are acceptable, record an explicit threshold and the missing population instead of silently marking the run successful.',
      ], links: [{ label: 'Reports and error records', href: '/report-reference' }, { label: 'Production operations', href: '/production-guide' }] },
    ],
  },
};
