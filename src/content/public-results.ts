import type { Doc } from './types';

const repo = 'https://github.com/Vamshavardhan50/crawlingo';

export const PUBLIC_RESULTS: Record<string, Doc> = {
  '/real-world-results': {
    title: 'Public website results', category: 'Learn',
    description: 'A measured research-directory collection, with quality checks, restart evidence and explicit limits.',
    sections: [
      { id: 'results', title: 'Python PEP directory · 19 October 2026', paragraphs: ['This run used the production Rust CLI and real HTTPS requests to one public technical-documentation site. Directory rows and document records are separate datasets; they are not 764 unique research entities.', 'Both jobs completed with zero page failures, rejected records and duplicate records. Repeating each finished job preserved all data and error shard hashes. Restart job times were 40 ms and 51 ms.'], table: { headings: ['Workload', 'Pages', 'Records', 'Job time', 'Peak CLI working set', 'JSONL size'], rows: [
        ['Numerical directory', '1', '744', '4.620 seconds', '42.0 MiB', '151,865 bytes'],
        ['First 20 linked documents', '20', '20', '20.539 seconds', '38.9 MiB', '312,906 bytes'],
      ] }, links: [{ label: 'Source directory', href: 'https://peps.python.org/numerical/' }, { label: 'Full report and method', href: `${repo}/blob/main/PUBLIC_WEB_RESULTS.md` }, { label: 'Machine-readable evidence', href: `${repo}/blob/main/measurements/2026-10-19-peps.json` }] },
      { id: 'method', title: 'How it was measured', bullets: [
        'Windows 11, eight logical CPUs, release-mode native CLI; no browser rendering or mocked transport.',
        'Concurrency two and one request per second per host. Robots checks enabled; robots.txt returned 404 during preflight.',
        'Four pages per checkpoint; 2 MiB response acceptance limit and 256 KiB record limit.',
        'JobReport supplied job duration; the harness also recorded process wall time, binary/input hashes and all output shard hashes.',
        'Memory is Windows peak working set for the Rust CLI child, sampled every 20 ms. It excludes Python, build tools and the remote server.',
        'One final measured run after an exploratory pilot. Network variability and source changes are not controlled.',
      ] },
      { id: 'quality', title: 'Correct records matter more than successful requests', paragraphs: [
        'The exploratory run produced 744 rows, but 522 titles included a neighboring version link. A successful HTTP status and matching row count did not detect it. Numbered table-column selectors fixed the extraction; the final example uses td:nth-child(3) for titles.',
        'An independent HTMLParser comparison found zero ID/title/classification mismatches across the corrected 744-row directory. Every exported record also passed required-value, provenance and uniqueness checks.',
        'The parser now preserves mixed inline text in document order. PEP 1 text matched the independently parsed source character order after entity decoding and ignoring whitespace. Only this document body received that semantic comparison; the other 19 did not.',
      ] },
      { id: 'scope', title: 'What remains unproven', bullets: [
        'Maximum throughput on public websites: the run was deliberately paced, not saturated.',
        'Million-page live-site operation, distributed collection, JavaScript-heavy pages, PDFs and authenticated sources.',
        'Process-kill, disk-full or state-corruption recovery; this experiment checks completed-job restart only.',
        'Full HTML/Markdown fidelity and scientific correctness of all collected documents.',
        'The earlier million-page local fixture has not been rerun after these parser changes.',
      ], links: [{ label: 'Separate local million-page evidence', href: '/benchmarks' }, { label: 'Architecture review', href: `${repo}/blob/main/ARCHITECTURE_AUDIT.md` }] },
      { id: 'reproduce', title: 'Reproduce a small sample', paragraphs: ['Build the current source, then run the commands below from the repository root with fresh configured output directories. The measurement runner refuses to overwrite an existing run. It runs the Rust job, checks local output and repeats the completed job to compare hashes.'], code: [{ label: 'Repository root', language: 'shell', code: 'cargo build --locked --release --features cli --bin crawlingo\npython scripts/measure-public-dataset.py examples/research_dataset/index-job.json target/research-evidence/index.json\npython examples/research_dataset/prepare_details.py --limit 20\npython scripts/measure-public-dataset.py examples/research_dataset/detail-job.json target/research-evidence/details.json' }], links: [{ label: 'Step-by-step research walkthrough', href: '/research-datasets' }, { label: 'Independent source comparison instructions', href: `${repo}/tree/main/examples/research_dataset` }] },
      { id: 'million', title: 'How much can your project collect?', paragraphs: ['There is no single public-web maximum. Estimate pages needed from accepted unique records per page, then use the permitted source rate and representative measured processing time. Include discovery, retries, deduplication state, raw records and derived datasets in the plan.', 'At one allowed page per second, a million single-record pages take at least 11.6 days of request time. Twenty accepted records per page reduces the requirement to 50,000 pages, or at least 13.9 hours at that rate. These are arithmetic examples; this run did not fetch a million public pages.'], links: [{ label: 'Capacity planning and resource bounds', href: '/dataset-design#capacity' }] },
    ],
  },
};
