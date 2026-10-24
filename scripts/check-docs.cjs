const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const { DOCS, NAV_GROUPS } = require('./load-content.cjs');
const { SDK_REFERENCE_DOCS } = require('../src/content/sdk-reference.ts');
const { REFERENCE_OPERATIONS } = require('../src/content/reference-operations.ts');
const dynamicRoutes = new Set([...Object.keys(SDK_REFERENCE_DOCS), ...Object.keys(REFERENCE_OPERATIONS)]);
const failures = [];
if (!fs.existsSync(path.join(root, 'src/pages/reference/[...slug].tsx'))) failures.push('Missing generated API route handler.');
let codeCount = 0;
for (const group of NAV_GROUPS) {
  for (const route of group.paths) if (!DOCS[route]) failures.push(`Missing navigation page: ${route}`);
}
for (const [route, page] of Object.entries(DOCS)) {
  if (!fs.existsSync(path.join(root, 'src/pages', `${route.slice(1)}.tsx`)) && !dynamicRoutes.has(route)) failures.push(`Missing route file: ${route}`);
  const ids = page.sections.map(section => section.id);
  if (ids.length !== new Set(ids).size) failures.push(`Duplicate section ID: ${route}`);
  for (const section of page.sections) {
    for (const paragraph of section.paragraphs || []) if (typeof paragraph !== 'string') failures.push(`Non-text paragraph: ${route}#${section.id}`);
    for (const link of section.links || []) {
      if (!link.href.startsWith('/')) continue;
      const [destination, hash] = link.href.split('#');
      if (!DOCS[destination]) failures.push(`Broken link: ${route} → ${link.href}`);
      else if (hash && !DOCS[destination].sections.some(item => item.id === hash)) failures.push(`Broken anchor: ${route} → ${link.href}`);
    }
    for (const example of section.code || []) {
      codeCount++;
      if (example.language === 'json') {
        try { JSON.parse(example.code); } catch (error) { failures.push(`Invalid JSON at ${route}#${section.id}: ${error.message}`); }
      }
      if (['example', 'catch'].includes(section.id) && route.startsWith('/reference/node/') && ['typescript', 'javascript'].includes(example.language)) {
        const source = ts.createSourceFile('example.ts', example.code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        for (const error of source.parseDiagnostics) failures.push(`Invalid example syntax at ${route}#${section.id}: ${ts.flattenDiagnosticMessageText(error.messageText, ' ')}`);
      }
    }
  }
}
function checkPageLinks(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { checkPageLinks(file); continue; }
    if (!file.endsWith('.tsx')) continue;
    const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isJsxAttribute(node) && node.name.getText(source) === 'href' && node.initializer && ts.isStringLiteral(node.initializer)) {
        const href = node.initializer.text;
        if (href.startsWith('/') && !href.startsWith('//')) {
          const [route, anchor] = href.split('#');
          const pageFile = path.join(root, 'src/pages', route === '/' ? 'index.tsx' : `${route.slice(1)}.tsx`);
          const assetFile = path.join(root, 'public', route.slice(1));
          if (!fs.existsSync(pageFile) && !fs.existsSync(assetFile) && !dynamicRoutes.has(route)) failures.push(`Broken JSX link: ${path.relative(root, file)} → ${href}`);
          if (anchor && DOCS[route] && !DOCS[route].sections.some(section => section.id === anchor)) failures.push(`Broken JSX anchor: ${href}`);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
checkPageLinks(path.join(root, 'src/pages'));
checkPageLinks(path.join(root, 'src/components'));
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Checked ${Object.keys(DOCS).length} guides, ${codeCount} code examples, navigation and internal section links.`);
