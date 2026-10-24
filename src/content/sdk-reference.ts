import raw from './generated/sdk-api.json';
import type { Doc, DocSection } from './types';
import { CONTRACTS, KNOWN_ISSUES, PARAMETER_HELP, exampleFor, normalize } from './api-contracts';

type Parameter = { name: string; type: string; optional?: boolean; default?: string | null };
type Member = { name: string; kind: string; signature: string; description: string; parameters: Parameter[]; returns: string; file: string; line: number; static?: boolean; bindingIssues?: string[] };
type Symbol = { name: string; kind: string; exported: boolean; signature: string; description: string; members: Member[]; file: string; line: number };
type Language = 'node' | 'python';
export const API_SNAPSHOT = raw;
export const slug = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
export const symbolRoute = (language: Language, name: string) => `/reference/${language}/${slug(name)}`;
const source = (file: string, line: number) => `https://github.com/Vamshavardhan50/crawlingo/blob/${raw.sourceModified ? 'main' : raw.sourceCommit}/${file}#L${line}`;
const types: Record<string, { description: string; guide: string }> = {
  JobConfig: { description: 'Shared input, output, schema and resource-limit configuration. Unknown keys are rejected.', guide: '/reference/job-config' },
  JobField: { description: 'One extraction rule and its validation requirements. Exported values remain strings.', guide: '/schema' },
  JobReport: { description: 'Job progress and quality counters. Completion is distinct from successful extraction.', guide: '/report-reference' },
  WatchChangeEvent: { description: 'Node callback event with camelCase names and change types such as ContentChange and PriceChange.', guide: '/watch' },
  ChangeEvent: { description: 'Python callback event with snake_case fields. change_type is content, price, stock, added or removed.', guide: '/watch' },
  DownloadResult: { description: 'Response metadata and bytes actually retained/written. Check status and resumed explicitly.', guide: '/reference/node/downloader' },
  SitemapEntry: { description: 'Sitemap URL metadata. lastmod and priority are source strings, not validated dates or numbers.', guide: '/reference/node/sitemap' },
  CrawlingoErrorOptions: { description: 'Optional Node error context, including inherited ErrorOptions.cause. Native context is optional.', guide: '/reference/node/crawlingo-error' },
};
const fieldHelp: Record<string, string> = {
  urlsfile: 'Required path to a UTF-8 URL-per-line input file.', outputdir: 'Required job-owned directory containing state, manifest and shards; only one active writer.',
  fields: 'At least one named field rule. Names must be unique and not use the reserved underscore prefix.', rowselector: 'Optional CSS container for one record. Omit for one row per page.',
  concurrency: 'Maximum in-flight pages; default 16, accepted range 1–1024.', checkpointpages: 'Maximum input lines per commit batch; default 256, accepted range 1–10000.',
  checkpointbytes: 'Pending exact-dedup key/value byte budget; default 33554432.', maxresponsebytes: 'Per-page body limit before parsing; default 2097152.',
  maxrecordsperpage: 'Maximum row containers extracted per page; default 1000.', maxrecordbytes: 'Maximum serialized extracted fields per record; default 262144.',
  deduplicate: 'Exact record deduplication; default true.', dedupfields: 'Declared field names defining identity; an empty list uses all extracted fields.', respectrobots: 'Respect robots rules and crawl delay; default true.', format: 'Bulk export format: jsonl (default) or csv.',
  name: 'Unique field name or context-specific item name.', selector: 'Field selector. With row_selector, matches are assigned to the row container.', selectortype: 'css (default), xpath, regex, text, after_text or before_text.', extracttype: 'text (default), price, datetime, url or attr:name.',
  required: 'Reject empty/whitespace-only required fields; default false for job fields.', default: 'Fallback when extraction is empty.', datatype: 'string (default), integer, float or boolean validation; output remains string-valued.', normalizewhitespace: 'Collapse whitespace runs; default true.', minlength: 'Minimum character count after normalization; default 0.',
  sourcelines: 'Cumulative processed input lines.', pagesfetched: 'Cumulative successfully processed pages.', pagesfailed: 'Cumulative failed pages; inspect error shards.', duplicateurls: 'Input URLs skipped because their identity was already seen.',
  recordswritten: 'Accepted unique records committed to data shards.', recordsrejected: 'Rows rejected by validation/extraction checks.', duplicaterecords: 'Rows suppressed by exact record identity.', shards: 'Committed shard count used to enumerate output files.', complete: 'Input processing completed; failures may still be nonzero.', cancelled: 'This invocation observed cancellation.', elapsedms: 'Elapsed time for this invocation in milliseconds; not a cumulative historical duration.',
  url: 'Source/final URL according to the operation; check redirects and provenance needs.', loc: 'URL supplied by the sitemap.', lastmod: 'Optional last-modified string from the sitemap.', changefreq: 'Optional advisory update frequency.', priority: 'Optional advisory priority string.',
  status: 'HTTP response status code.', byteswritten: 'Bytes actually retained or written.', contenttype: 'Reported or inferred response MIME type.', suggestedfilename: 'Untrusted response-suggested filename; choose your destination explicitly.', resumed: 'Whether a range response was accepted for the download.',
  field: 'Name of the monitored field.', changetype: 'Binding-specific change category.', oldvalue: 'Previously observed string value, when supplied.', newvalue: 'Newly observed string value, when supplied.', diff: 'Serialized change difference.', detectedat: 'Detection timestamp string.', similarityscore: 'Heuristic similarity score, not a probability.',
  code: 'Stable Node error category code.', stage: 'Operation stage supplied by the native bridge.', recoverable: 'Advisory indication, not a successful-retry guarantee.', suggestion: 'Human-readable recovery guidance.', seconds: 'Timeout duration when supplied.', host: 'Host context when supplied.', defaultcode: 'Default code inherited by instances of this error class.',
};

const errorNames = new Set(['CrawlingoError', 'FetchError', 'ParseError', 'SelectorError', 'AutoMatchFailed', 'TimeoutError', 'RateLimitError', 'ChangeDetectionError', 'ExportError', 'DnsError', 'FingerprintStoreError']);
function overview(symbol: Symbol, language: Language): string[] {
  if (errorNames.has(symbol.name)) return [
    `${symbol.name} is exported from the ${language === 'node' ? 'Node' : 'Python'} package. Specialized errors inherit CrawlingoError; the base inherits ${language === 'node' ? 'JavaScript Error' : 'Python Exception'}.`,
    language === 'node' ? 'Construct with new ErrorClass(message, options?). Inherited properties include name, message, stack, cause, code and optional diagnostic context. SDK boundaries convert structured native failures to this hierarchy.' : 'Construct with ErrorClass(message). The Python wrapper uses message-based conversion for selected methods; other native failures can remain RuntimeError, ValueError or OSError. An exported class is not proof that every corresponding failure path produces it.',
    'Page returns HTTP statuses, including exhausted 429/500 responses. A missing selector can return an empty collection. DatasetJob records individual failures in reports/error shards. These conditions do not automatically throw every exported error class.',
  ];
  return CONTRACTS[symbol.name]?.behavior ?? [types[symbol.name]?.description ?? symbol.description ?? 'Public SDK declaration recorded from source.'];
}
function methodDescription(symbol: Symbol, member: Member, language: Language): string {
  const key = member.name === '__init__' ? 'constructor' : normalize(member.name);
  if (language === 'node' && ['inner', 'nativePage', 'constructor'].includes(member.name) && ['Page', 'Element', 'ElementCollection', 'DatasetResult'].includes(symbol.name)) return 'Native interop entry point. Applications normally obtain this wrapper from Page.create, a selector or Dataset.build; do not pass a URL or an arbitrary object as a native handle.';
  if (member.name === 'inner') return 'Native interop handle. Prefer the documented wrapper methods; bypassing them can bypass validation and typed error conversion.';
  const notes = CONTRACTS[symbol.name]?.methods;
  if (notes && Object.hasOwn(notes, key)) return notes[key];
  if (key === 'constructor') {
    const constructors: Record<string, string> = {
      CrawlingoError: 'Create an error with a message and optional cause/diagnostic context. Construction does not perform an operation or retry it.',
      Dataset: 'Configure extraction for one URL with the supplied or default session. Add fields, then call build to fetch and produce a result.',
      Crawl: 'Create a bounded link-discovery builder. Configure fields, page/depth limits and pacing before running it. Python can also wrap a supplied native crawl handle.',
      Watch: 'Create a monitor with a URL and optional session. Add fields and callbacks before starting the polling loop with run.',
      Sitemap: 'Create a sitemap discovery builder. Fetching begins with listUrls/list_urls or build; the constructor does not materialize discovered URLs.',
      Downloader: 'Create a downloader using a supplied session or a fresh default session. Configure limits and call download or download_to_memory.',
      DatasetSchema: 'Create an empty field schema, or wrap the optional native schema in Python. Add field constraints before validating records.',
      FieldConstraint: 'Store a field name, FieldType and required flag. Pass those values to DatasetSchema.addField/add_field to apply validation.',
      Page: 'Create a lazy Python Page. Network access starts on create() or the first content/status/selector operation. Register hooks before triggering that load.',
      DatasetResult: 'Wrap a native DatasetResult handle returned by the engine. A plain Python dictionary is not a compatible handle.',
      Element: 'Wrap a native DOM element and optional extraction hooks. Normally obtained through Page selectors and collection access.',
      ElementCollection: 'Wrap a native match collection or materialized Python Element list. See the known iteration limitation for materialized lists.',
      CrawlResults: 'Store an in-memory list of DatasetResult wrappers. No fetching or exporting happens during construction.',
      RequestContext: 'Internal value constructed by Page for before_fetch callbacks. Headers refer to the request map; assigning url does not change the actual fetch URL.',
      ResponseContext: 'Internal value constructed by Page for after_fetch callbacks. The status field reports the fetched HTTP status.',
      PaginationConfig: 'Wrap an existing native pagination configuration. Calling without it raises ValueError; use next_link, page_number or url_pattern.',
      SitemapEntry: 'Store the source URL and optional sitemap metadata. The wrapper does not validate dates, update-frequency strings or priority values.',
    };
    if (Object.hasOwn(constructors, symbol.name)) return constructors[symbol.name];
  }
  if (key === 'symbol.iterator' || key === 'iter') return `Iterate over ${symbol.name === 'CrawlResults' ? 'the stored DatasetResult wrappers' : 'matched Element wrappers in collection order'}. See any known limitation above before using a materialized Python collection.`;
  if (key === 'len') return 'Return the number of stored results or matched elements; no additional pages are fetched.';
  if (key === 'getitem') return symbol.name === 'CrawlResults' ? 'Index the backing Python list of results. List indexing rules apply, including negative indices and IndexError outside the list.' : 'Delegate to nth(index). Use a non-negative index; out-of-range matches return None.';
  if (key === 'repr') return 'Return a short debugging representation of the wrapper. This is not a data export or a stable serialization format.';
  if (symbol.name === 'Page' && key === 'html') return 'Load the page if necessary and return its HTML string. Inspect status separately; an HTTP error response can still have a body.';
  return member.description || (Object.hasOwn(fieldHelp, key) ? fieldHelp[key] : '') || (member.kind === 'property' ? 'Read the declared value. Its exact type is shown in the signature.' : member.kind === 'variant' ? 'Named enum member; use the symbol rather than a numeric literal.' : 'The signature below is extracted from the public wrapper. Follow the operation’s lifecycle and failure contract above.');
}
function apiPage(language: Language, symbol: Symbol): Doc {
  const contract = CONTRACTS[symbol.name];
  const route = symbolRoute(language, symbol.name);
  const issueEntries = symbol.members.filter(m => KNOWN_ISSUES[`${language}:${symbol.name}.${m.name}`] || m.bindingIssues?.length);
  const sections: DocSection[] = [
    { id: 'overview', title: 'Purpose and lifecycle', paragraphs: overview(symbol, language), links: [
      { label: `${language === 'node' ? 'Node.js' : 'Python'} API index`, href: `/reference/${language}` },
      { label: 'Implementation status and known gaps', href: '/reference/implementation-status' },
      ...(types[symbol.name] ? [{ label: 'Full field contract', href: types[symbol.name].guide }] : []),
    ] },
    { id: 'definition', title: 'Definition and availability', paragraphs: [`Source snapshot: ${raw.version}. ${symbol.exported ? 'Package export.' : 'Reachable result/callback type; not a top-level package export.'} ${issueEntries.length ? `${issueEntries.length} member(s) have a known limitation; see the marked entries below.` : 'Declared in source; this is not a runtime test result.'}`, 'Signatures and source locations are generated from the SDK wrappers. Clean snapshots link to the recorded commit. Modified snapshots link to main, which may differ; file hashes identify the local inputs.'],
      code: [{ label: language === 'node' ? 'TypeScript declaration' : 'Python declaration', language: language === 'node' ? 'typescript' : 'python', code: symbol.signature }],
      links: [{ label: `${symbol.file}:${symbol.line}`, href: source(symbol.file, symbol.line) }] },
  ];
  const examples = exampleFor(symbol.name, language);
  if (examples.length) sections.push({ id: 'example', title: 'Usage example', paragraphs: ['Use a matching source build. Where a snippet uses page, obtain it with the Page example first. Example URLs illustrate API shape; they are not promised datasets.'], code: examples });
  if (errorNames.has(symbol.name)) sections.push({ id: 'catch', title: 'Construct and catch', code: [{ label: language === 'node' ? 'TypeScript' : 'Python', language: language === 'node' ? 'typescript' : 'python', code: language === 'node' ? `import { ${symbol.name === 'CrawlingoError' ? symbol.name : `${symbol.name}, CrawlingoError`} } from 'crawlingo';\nconst error = new ${symbol.name}('Operation failed');\nconsole.log(error instanceof CrawlingoError, error.message, error.code);` : `from crawlingo import ${symbol.name}\n\ntry:\n    raise ${symbol.name}("Operation failed")\nexcept ${symbol.name} as error:\n    print(str(error))` }], links: symbol.name !== 'CrawlingoError' ? [{ label: 'Base exception contract', href: symbolRoute(language, 'CrawlingoError') }] : [] });
  if (symbol.members.length) sections.push({ id: 'members', title: 'Members', table: { headings: ['Member', 'Kind', 'Return / value type', 'Source status'], rows: symbol.members.map(m => [m.name, m.static ? `static ${m.kind}` : m.kind, m.returns, KNOWN_ISSUES[`${language}:${symbol.name}.${m.name}`] || m.bindingIssues?.length ? 'Known limitation — read entry' : 'Present in source']) }, links: symbol.members.map(m => ({ label: m.name, href: `${route}#${slug(m.name)}` })) });
  for (const member of symbol.members) {
    const issue = KNOWN_ISSUES[`${language}:${symbol.name}.${member.name}`] || (member.bindingIssues?.length ? `Native binding target is missing: ${member.bindingIssues.join(', ')}.` : undefined);
    sections.push({ id: slug(member.name), title: `${member.name}${member.kind === 'method' ? '()' : ''}`,
      paragraphs: [...(issue ? [`Known limitation: ${issue}`] : []), methodDescription(symbol, member, language), `Returns / value: ${member.returns}.`],
      code: [{ label: 'Signature', language: language === 'node' ? 'typescript' : 'python', code: member.signature }],
      table: member.parameters.length ? { headings: ['Parameter', 'Type', 'Required / default', 'Meaning'], rows: member.parameters.map(p => [p.name, p.type, p.default !== null && p.default !== undefined ? `Default: ${p.default}` : p.optional ? 'Optional' : 'Required', PARAMETER_HELP[normalize(p.name)] || 'See the method behavior and exact type above.']) } : undefined,
      links: [{ label: `Source · ${member.file}:${member.line}`, href: source(member.file, member.line) }],
    });
  }
  sections.push({ id: 'errors', title: 'Errors and operational limits', paragraphs: [contract?.errors || 'See the consuming API for validation and failure behavior. Types and enum declarations do not perform network requests by themselves.', 'Source availability, package publication and runtime validation are separate facts. These pages describe the source snapshot, not a claim that all platforms or every API path have passed production acceptance.'], links: [{ label: 'Build and install the matching SDK', href: '/installation' }, { label: 'DatasetJob workflow', href: '/reference/dataset-job' }] });
  return { title: `${symbol.name} · ${language === 'node' ? 'Node.js' : 'Python'}`, category: 'API reference', description: contract?.purpose || types[symbol.name]?.description || symbol.description.split('\n')[0] || `${symbol.kind} declaration and members.`, sections };
}

export const SDK_REFERENCE_DOCS: Record<string, Doc> = {};
for (const language of ['node', 'python'] as const) {
  const symbols = raw[language].symbols as Symbol[];
  for (const symbol of symbols) SDK_REFERENCE_DOCS[symbolRoute(language, symbol.name)] = apiPage(language, symbol);
  SDK_REFERENCE_DOCS[`/reference/${language}`] = {
    title: `${language === 'node' ? 'Node.js / TypeScript' : 'Python'} API`, category: 'API reference',
    description: 'Browse every package export and its declared methods, fields, parameters, returns, source links and known limitations.',
    sections: [
      { id: 'scope', title: 'What this reference covers', paragraphs: [`${raw[language].exports.length} package exports; ${symbols.length} documented symbols including reachable types and helpers; ${symbols.reduce((sum, symbol) => sum + symbol.members.length, 0)} explicitly declared members. Inherited standard-library members are not included in this count.`, 'These are source inventory counts, not a percentage of working features. Classes with broken or limited wrapper paths are marked in their member entries.'], links: [{ label: 'Implementation audit', href: '/reference/implementation-status' }] },
      ...(['class', 'interface', 'type', 'enum', 'function', 'module'] as const).flatMap(kind => {
        const items = symbols.filter(s => s.kind === kind);
        return items.length ? [{ id: kind, title: kind === 'class' ? 'Classes and result objects' : `${kind[0].toUpperCase()}${kind.slice(1)} declarations`, table: { headings: ['Symbol', 'Members', 'Purpose'], rows: items.map(s => [s.name, String(s.members.length), CONTRACTS[s.name]?.purpose || types[s.name]?.description || s.description.split('\n')[0]]) }, links: items.map(s => ({ label: s.name, href: symbolRoute(language, s.name) })) }] : [];
      }),
    ],
  };
}

SDK_REFERENCE_DOCS['/reference/implementation-status'] = {
  title: 'Implementation status', category: 'API reference', description: 'A source audit of available APIs, binding gaps and delivery limits. No fabricated coverage score.', sections: [
    { id: 'snapshot', title: 'Inventory provenance', paragraphs: [`Version ${raw.version}; base engine commit ${raw.sourceCommit}. ${raw.sourceModified ? 'The source snapshot includes unpublished working-tree changes.' : 'The source snapshot is clean.'}`, `Source digest: ${raw.sourceDigest}. The JSON inventory includes individual file SHA-256 hashes. Generate a new snapshot when source changes.`, 'Node: all exports from src/index.ts are enumerated with the TypeScript compiler. Python: __all__, wrapper definitions, reachable return/callback types and hook helpers are read without loading native binaries. Rust: rustdoc is the authority for modules, structs, traits and implementations.'], table: { headings: ['Surface', 'Package exports', 'Documented symbols', 'Declared members'], rows: (['node', 'python'] as const).map(language => [language, String(raw[language].exports.length), String(raw[language].symbols.length), String(raw[language].symbols.reduce((sum, s) => sum + s.members.length, 0))]) }, links: [{ label: 'Node reference', href: '/reference/node' }, { label: 'Python reference', href: '/reference/python' }, { label: 'Rust modules and rustdoc', href: '/reference/rust' }] },
    { id: 'available', title: 'Implemented source paths', bullets: ['DatasetJob URL-file processing, scoped records, validation, exact deduplication, JSONL/CSV shards, checkpoint resume, cancellation and reports.', 'Node custom error classes and native conversion; session retry setters and cookie read/delete/clear; shared Page session manager.', 'Page inspection, supported CSS/basic XPath/text/regex selectors, Dataset extraction and small-result JSON/CSV/Parquet exports.', 'Rust HTTP connection reuse, per-host pacing, retry policy, middleware, metrics, sitemap discovery, crawl frontier and optional browser feature.'], paragraphs: ['These paths exist in source. Consult the recorded workload evidence separately; this inventory did not exercise every runtime path or certify production readiness.'], links: [{ label: 'Measured public-site results', href: '/real-world-results' }, { label: 'Scale methodology', href: '/benchmarks' }] },
    { id: 'issues', title: 'Known issues and restricted behavior', table: { headings: ['API', 'Finding'], rows: Object.entries(KNOWN_ISSUES).map(([key, finding]) => [key, finding]) }, links: Object.keys(KNOWN_ISSUES).map(key => { const [language, item] = key.split(':'); const [name, member] = item.split('.'); return { label: key, href: `${symbolRoute(language as Language, name)}#${slug(member)}` }; }) },
    { id: 'parity', title: 'Not exposed or not implemented', table: { headings: ['Capability', 'Current boundary'], rows: [
      ['Python Session retry/cookie-management setters', 'The native PySession has additional methods, but the public Python Session wrapper does not expose the new Node methods. Do not assume snake_case aliases exist.'],
      ['Node auth/cache/metrics helpers', 'The public Node wrapper does not expose Python’s auth middleware helpers, response-cache setter or metrics snapshot. Set headers explicitly where appropriate.'],
      ['Browser navigation on Page', 'No Node Page.navigate/reload/back/forward/close API. Use Playwright/Puppeteer and pass discovered URLs or rendered snapshots to a defined integration.'],
      ['Universal SDK parity', 'Python traversal and hook APIs differ from Node. Error conversion and crawl return types differ. Read the language-specific contract.'],
      ['Distributed processing', 'No multi-host shared checkpoint writer or bundled durable task queue. Use one process per job directory.'],
      ['Data quality beyond exact checks', 'No semantic deduplication or automatic correctness guarantee for heuristic selector recovery.'],
      ['Performance promises', 'No verified universal req/s, idle-memory or Scrapy/Playwright superiority claim.'],
    ] } },
    { id: 'refresh', title: 'Regenerate this reference', code: [{ label: 'Engine checkout', language: 'shell', code: 'cd sdk/nodejs\nnpm ci\ncd ../..\n# Requires Python 3 and the Node SDK TypeScript dev dependency.\nnode scripts/export-sdk-api.cjs crawlingo-docs/src/content/generated/sdk-api.json\ncd crawlingo-docs\nnpm run lint\nnpm run export:guides -- ../docs\nnpm run build' }], paragraphs: ['Commit the engine change and the corresponding website snapshot in their respective repositories. This generator reads declarations; behavior notes and known issues require review when implementation changes. The docs release gate rejects a dirty or stale snapshot.'], links: [{ label: 'Documentation release procedure', href: '/reference/docs-release' }] },
  ],
};
