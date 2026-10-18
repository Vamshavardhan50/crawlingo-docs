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
`lint` checks TypeScript, guide routes, section links and JSON examples.

## Project structure

| Directory | Responsibility |
| --- | --- |
| `src/content/docs.ts` | API guides, examples and navigation |
| `src/content/operations.ts` | Complete example, deployment, publishing and hosting |
| `src/content/getting-started.ts` | Plain-language overview, concepts, use cases and guided first run |
| `src/content/developer-guides.ts` | Integration tutorial, report reference and larger-job operations |
| `src/content/api-reference.ts` | SDK signatures, parameter contracts, examples, errors and reference index |
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

The public landing page is `/`; `/guides` is the developer quickstart and documentation
directory; `/api-reference` indexes classes, configuration types and related guides.
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

## Deploy

- **Vercel:** import this repository, choose Next.js, Node 22, `npm ci` and
  `npm run build`. Use this repository's root and framework output discovery.
- **Netlify:** use `netlify.toml` (`npm run build`, `.next`, Node 22). The Next.js
  adapter handles routes. There is no SPA catch-all redirect.
- **Node server:** build, then run `npm start` under a process supervisor with
  production dependencies, `.next` and `public` available.

Check direct navigation to `/quick-start`, `/examples`, `/publishing`, `/docs`
and a missing URL. `/docs` redirects to `/quick-start`.
Set `src/content/site.json` when changing the public domain.

See `/docs-hosting` in the website, the official
[Next.js deployment guide](https://nextjs.org/docs/pages/getting-started/deploying)
and [Netlify guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).
