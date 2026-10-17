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
| `src/content/types.ts` | Content schema |
| `src/content/site.json` | Public URL and site name |
| `src/components/` | Shared layout, documentation renderer and theme provider |
| `src/pages/` | Home, Next.js setup and thin guide routes |
| `src/styles/` | Responsive light/dark visual design |
| `public/` | Logo, icons and generated metadata |
| `scripts/` | Content validation, metadata and Markdown export |

Keep examples aligned with SDK source. Distinguish development APIs from published
packages. Benchmarks need workload, method and limitations. Preserve route names
and section IDs. Export the named guides to the sibling Markdown repository with:

```sh
npm run export:guides -- ../docs
```

The exporter updates its named guides and index, leaving other authored files alone.

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
