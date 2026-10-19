const fs = require('node:fs');
const path = require('node:path');
const { DOCS } = require('./load-content.cjs');
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
const escape = value => value.replaceAll('|', '\\|');
for (const [filename, route] of Object.entries(mapping)) {
  const page = DOCS[route];
  const blocks = [`# ${page.title}`, page.description, '> Current development source. New dataset APIs require a matching source build; published alpha packages may differ.'];
  for (const section of page.sections) {
    blocks.push(`## ${section.title}`, ...section.paragraphs || []);
    for (const example of section.code || []) blocks.push(`### ${example.label}`, `\`\`\`${example.language}\n${example.code}\n\`\`\``);
    if (section.table) blocks.push([
      `| ${section.table.headings.map(escape).join(' | ')} |`,
      `| ${section.table.headings.map(() => '---').join(' | ')} |`,
      ...section.table.rows.map(row => `| ${row.map(escape).join(' | ')} |`),
    ].join('\n'));
    if (section.bullets) blocks.push(section.bullets.map(item => `- ${item}`).join('\n'));
    if (section.links) blocks.push(section.links.map(link => `- [${link.label}](${link.href.startsWith('/') ? site.url : ''}${link.href})`).join('\n'));
  }
  fs.writeFileSync(path.join(output, filename), blocks.join('\n\n') + '\n');
}
fs.writeFileSync(path.join(output, 'index.md'), ['# Crawlingo documentation', 'Generate validated datasets with a Rust engine and Python and Node.js bindings.', ...Object.entries(mapping).map(([file, route]) => `- [${DOCS[route].title}](${file})`)].join('\n\n') + '\n');
console.log(`Exported ${Object.keys(mapping).length} guides and index to ${output}.`);
