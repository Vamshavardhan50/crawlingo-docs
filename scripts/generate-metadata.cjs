const fs = require('node:fs');
const path = require('node:path');
const { DOCS } = require('./load-content.cjs');
const site = require('../src/content/site.json');
const directory = path.resolve(__dirname, '../public');
const routes = ['/', '/guides', '/api-reference', ...Object.keys(DOCS)];
fs.writeFileSync(path.join(directory, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + routes.map(route => `  <url><loc>${site.url}${route}</loc></url>`).join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(directory, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
console.log(`Generated metadata for ${routes.length} routes.`);
