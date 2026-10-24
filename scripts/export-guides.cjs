const fs = require('node:fs');
const path = require('node:path');
const { DOCS } = require('./load-content.cjs');
const { docToMarkdown } = require('../src/content/markdown.ts');
const site = require('../src/content/site.json');
if (!process.argv[2]) throw new Error('Usage: npm run export:guides -- /path/to/output-directory');
const output = path.resolve(process.argv[2]);
fs.mkdirSync(output, { recursive: true });
const mapping = {
  'research-datasets.md': '/research-datasets', 'dataset-design.md': '/dataset-design',
  'real-world-results.md': '/real-world-results',
  'integrations.md': '/integrations', 'integrations-playwright.md': '/integrations/playwright',
  'integrations-data.md': '/integrations/data', 'integrations-workers.md': '/integrations/workers',
  'api-dataset-job.md': '/reference/dataset-job', 'api-job-config.md': '/reference/job-config',
  'api-session.md': '/reference/session', 'api-page.md': '/reference/page',
  'overview.md': '/overview', 'use-cases.md': '/use-cases', 'concepts.md': '/concepts',
  'first-run.md': '/first-run', 'developer-tutorial.md': '/developer-tutorial',
  'report-reference.md': '/report-reference', 'production-guide.md': '/production-guide',
  'advanced.md': '/advanced', 'authentication.md': '/authentication', 'auto-match.md': '/auto-match',
  'change-detection.md': '/change-detection', 'configuration.md': '/configuration', 'crawl.md': '/crawl',
  'dataset.md': '/dataset', 'faq.md': '/faq', 'getting-started.md': '/quick-start',
  'installation.md': '/installation', 'page.md': '/page', 'sdk-nodejs.md': '/sdk/nodejs',
  'sdk-python.md': '/sdk/python', 'selectors.md': '/selectors', 'session.md': '/session', 'watch.md': '/watch',
  'product-example.md': '/examples', 'deployment.md': '/deployment', 'publishing.md': '/publishing', 'docs-hosting.md': '/docs-hosting',
};
// Preserve existing filenames, and export every new guide/reference route too.
const covered = new Set(Object.values(mapping));
for (const route of Object.keys(DOCS)) if (!covered.has(route)) mapping[`${route.slice(1)}.md`] = route;
const routeFiles = Object.fromEntries(Object.entries(mapping).map(([file, route]) => [route, file]));
routeFiles['/guides'] = 'index.md';
routeFiles['/api-reference'] = 'api-reference.md';
for (const [filename, route] of Object.entries(mapping)) {
  const page = DOCS[route];
  const destination = path.join(output, filename);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const resolveLink = href => {
    if (!href.startsWith('/')) return href;
    const [target, anchor] = href.split('#');
    if (!routeFiles[target]) return site.url + href;
    const relative = path.relative(path.dirname(destination), path.join(output, routeFiles[target])).replaceAll('\\', '/');
    return relative + (anchor ? `#${anchor}` : '');
  };
  fs.writeFileSync(destination, docToMarkdown(page, resolveLink));
}
fs.writeFileSync(path.join(output, 'index.md'), ['# Crawlingo documentation', 'Generate validated datasets with a Rust engine and Python and Node.js bindings.', '[API reference](api-reference.md) · [Implementation status](reference/implementation-status.md)', ...Object.entries(mapping).map(([file, route]) => `- [${DOCS[route].title}](${file})`)].join('\n\n') + '\n');
fs.writeFileSync(path.join(output, 'api-reference.md'), ['# API reference', 'Source inventory, signatures and behavior. Presence in source is not a runtime test result.', ...Object.entries(mapping).filter(([, route]) => route.startsWith('/reference/')).map(([file, route]) => `- [${DOCS[route].title}](${file})`)].join('\n\n') + '\n');
fs.mkdirSync(path.join(output, '_meta'), { recursive: true });
fs.copyFileSync(path.join(__dirname, '../src/content/generated/sdk-api.json'), path.join(output, '_meta/sdk-api.json'));
console.log(`Exported ${Object.keys(mapping).length} guides and index to ${output}.`);
