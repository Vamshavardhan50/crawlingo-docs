# Crawlingo documentation

Developer guides for turning web pages into validated datasets. Built with Next.js,
React and TypeScript. This is a **separate Git repository** from the Rust engine.

## Develop and preview

Use Node 22.14+ (Node 24 is also used for local validation):

```sh
npm ci
npm run dev
```

For a production preview:

```sh
npm run lint
npm run build
npm start -- --port 3020
```

Open `http://localhost:3020`. Build regenerates sitemap and robots metadata.
`lint` checks TypeScript, guide routes, section links, JSON examples and the API
snapshot. It parses the new Node usage examples without executing SDK requests.

## Project structure

| Directory | Responsibility |
| --- | --- |
| `src/content/docs.ts` | API guides, examples and navigation |
| `src/content/operations.ts` | Complete example, deployment, publishing and hosting |
| `src/content/getting-started.ts` | Plain-language overview, concepts, use cases and guided first run |
| `src/content/developer-guides.ts` | Integration tutorial, report reference and larger-job operations |
| `src/content/api-reference.ts` | SDK signatures, parameter contracts, examples, errors and reference index |
| `src/content/generated/sdk-api.json` | Compiler/AST inventory with version, engine commit and source hashes |
| `src/content/sdk-reference.ts` | One reference page per Node/Python symbol and member indexes |
| `src/content/api-contracts.ts` | Reviewed behavior, usage examples and known binding limitations |
| `src/content/reference-operations.ts` | Rust module map, CLI reference and docs release procedure |
| `src/content/integrations.ts` | Playwright/Puppeteer discovery, pandas/DuckDB and worker integration recipes |
| `src/content/markdown.ts` | Page text used by Copy page and Markdown downloads |
| `src/content/types.ts` | Content schema |
| `src/content/site.json` | Public URL and site name |
| `src/components/` | Shared layout, documentation renderer and theme provider |
| `src/pages/` | Home, Next.js setup and thin guide routes |
| `src/styles/` | Responsive light/dark visual design |
| `public/` | Logo, icons and generated metadata |
| `scripts/` | Content validation, metadata and Markdown export |

Keep examples aligned with SDK source. Distinguish development APIs from published
packages. Benchmarks need workload, method and limitations. Preserve route names
and section IDs. Export the named guides to a local Markdown directory with:

```sh
npm run export:guides -- ../docs
```

The exporter updates its named guides and index, leaving other authored files alone.
In the development workspace, `../docs` is an older checkout of this same GitHub
repository. Preserve those exports locally; push website changes from this checkout.

The public landing page is `/`; `/guides` is a concise book-style introduction and
chapter directory; `/api-reference` indexes classes, configuration types and related guides.
`/integrations` connects browser discovery, analysis and backend worker recipes.
The sidebar can be hidden on desktop, and individual chapters can be collapsed.
Preferences are stored locally; search opens the navigation when needed.
`src/styles/book.css` contains the reading layout; `global.css` retains shared and landing styles.
Guide pages provide code tabs, syntax colors, Copy code, line wrapping, Copy page and
Markdown downloads. Search includes method names and prioritizes reference headings.
Documentation, API Reference, SDKs and Examples stay visible on narrow screens.

The UI uses the teal/navy palette from `public/brand-mark.svg`, a compact vector mark
based on the original logo. Color tokens live in `src/styles/global.css`; light and
dark themes share the same navigation hierarchy and focus indicators.

For an isolated preview build while another server uses `.next`, set
`CRAWLINGO_DOCS_BUILD_DIR=.next-preview` for both the build and start commands.
For environments where Turbopack's worker IPC is unavailable, use
`npm run build -- --webpack` or `npx next dev --webpack`.

## Refresh the complete API reference

Source version: **1.0.0-alpha.2** (Python **1.0.0a2**). The initial inventory covers
34 Node exports, 30 Python exports, 73 symbols including reachable types/helpers,
and 391 declared members. These are source counts, not runtime coverage results.

From the engine checkout, with the website at `crawlingo-docs/`:

```sh
cd sdk/nodejs
npm ci --ignore-scripts
cd ../..
node scripts/export-sdk-api.cjs crawlingo-docs/src/content/generated/sdk-api.json
```

The generator needs Python 3 and the Node SDK's TypeScript dev dependency. Set
`PYTHON` for a specific interpreter. It reads declarations without importing a
native SDK. Hashes normalize text to UTF-8/LF for Windows/Linux reproducibility.
Review `api-contracts.ts` whenever an implementation changes; generated signatures
cannot prove runtime behavior. `/reference/implementation-status` records the
Python wrapper gaps and the Node scheduled-crawl lifecycle limit.

The public language indexes are `/reference/node` and `/reference/python`; each
symbol has a page and stable member anchors. `/reference/rust` explains generated
rustdoc, and `/reference/cli` covers commands and flags. Markdown export includes
all content pages, relative links, section anchors and `_meta/sdk-api.json`.

## Documentation release

```sh
npm run lint
npm run build -- --webpack
npm run package:docs
```

`artifacts/` receives versioned standalone-server and Markdown archives,
`docs-release.json` and `SHA256SUMS`. The manifest records website/engine commits,
modified-source flags, source digest, Node version and build platform. Local
modified-source bundles are previews. Staging directories are retained for review;
existing versioned archives are never overwritten automatically.

**Docs CI** builds and packages on PRs, main pushes and manual runs. **Docs release**
reuses that workflow. A manual run prepares artifacts; a published GitHub release
also attaches them after validation. The release gate requires:

- A clean engine snapshot, regenerated after committing the implementation.
- Matching website/snapshot versions, `vVERSION` tag and prerelease flag.
- Source hashes and regenerated inventory matching the recorded engine commit.
- Successful content checks, website build and complete checksummed artifacts.

Create the GitHub `documentation` environment for release uploads. The job uses
the built-in GitHub token with release-job-only `contents: write`; registry and
hosting tokens are not part of this workflow. Uploads do not overwrite existing
assets. Inspect partially uploaded releases before retrying.

SDK publication belongs to the engine repository. Its release requires the
`rust-docs` artifact built by `rustdoc.yml` and includes the rustdoc archive in its
manifest. See `/reference/docs-release` for the full cross-repository sequence.

## Deploy

- **Vercel:** import this repository, choose Next.js, Node 22, `npm ci` and
  `npm run build`. Use this repository's root and framework output discovery.
- **Netlify:** use `netlify.toml` (`npm run build`, `.next`, Node 22). The Next.js
  adapter handles routes. There is no SPA catch-all redirect.
- **Node server:** build, then run `npm start` under a process supervisor with
  the matching build available, or extract the standalone archive and run
  `HOSTNAME=0.0.0.0 PORT=3000 node server.js`. Use a matching OS/architecture and
  Node 22+. Workflow bundles target Linux x64; local bundles match the build host.

Vercel/Netlify Git integration owns hosting deployments. The documentation
release workflow distributes artifacts; it does not deploy the live site.

Check direct navigation to `/quick-start`, `/examples`, `/publishing`, `/docs`
and a missing URL. `/docs` redirects to `/quick-start`.
Set `src/content/site.json` when changing the public domain.

See `/docs-hosting` in the website, the official
[Next.js deployment guide](https://nextjs.org/docs/pages/getting-started/deploying)
and [Netlify guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).
