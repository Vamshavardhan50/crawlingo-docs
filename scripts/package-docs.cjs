// Package only traced runtime files, public assets and generated Markdown.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const version = require('../package.json').version;
const snapshot = require('../src/content/generated/sdk-api.json');
if (!/^[0-9]+\.[0-9]+\.[0-9]+(?:-[a-zA-Z0-9.-]+)?$/.test(version)) throw new Error('Invalid package version.');
execFileSync(process.execPath, [path.join(__dirname, 'check-api-snapshot.cjs')], { cwd: root, stdio: 'inherit' });
const dist = process.env.CRAWLINGO_DOCS_BUILD_DIR || '.next';
if (!/^\.next(?:-[a-zA-Z0-9_-]+)?$/.test(dist)) throw new Error('Use .next or .next-NAME for the documentation build directory.');
const standalone = path.join(root, dist, 'standalone');
if (!fs.existsSync(path.join(standalone, 'server.js'))) throw new Error('Build the standalone website first.');
const artifacts = path.join(root, 'artifacts');
fs.mkdirSync(artifacts, { recursive: true });
const stage = fs.mkdtempSync(path.join(artifacts, 'stage-'));
const server = path.join(stage, 'server');
// Next can trace environment files; never distribute them in a public archive.
const safeCopy = (source, destination) => fs.cpSync(source, destination, { recursive: true, filter: file => !/^\.env(?:\.|$)/.test(path.basename(file)) });
safeCopy(standalone, server);
safeCopy(path.join(root, 'public'), path.join(server, 'public'));
safeCopy(path.join(root, dist, 'static'), path.join(server, dist, 'static'));
const markdown = path.join(stage, 'markdown');
execFileSync(process.execPath, [path.join(__dirname, 'export-guides.cjs'), markdown], { cwd: root, stdio: 'inherit' });
const archives = [
  [`crawlingo-docs-${version}-server.tar.gz`, server],
  [`crawlingo-docs-${version}-markdown.tar.gz`, markdown],
];
for (const [name, directory] of archives) {
  const destination = path.join(artifacts, name);
  if (fs.existsSync(destination)) throw new Error(`Refusing to overwrite ${destination}. Move the previous bundle before packaging again.`);
  execFileSync('tar', ['-czf', destination, '-C', directory, '.'], { stdio: 'inherit' });
}
const assets = archives.map(([name]) => {
  const file = path.join(artifacts, name);
  return { name, bytes: fs.statSync(file).size, sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') };
});
const manifest = {
  version,
  websiteCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  websiteModified: !!execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim(),
  engineCommit: snapshot.sourceCommit, engineModified: snapshot.sourceModified,
  sourceDigest: snapshot.sourceDigest, buildDirectory: dist, nodeVersion: process.version,
  platform: process.platform, architecture: process.arch,
  createdAt: new Date().toISOString(), assets,
};
const manifestPath = path.join(artifacts, 'docs-release.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
const checksum = crypto.createHash('sha256').update(fs.readFileSync(manifestPath)).digest('hex');
fs.writeFileSync(path.join(artifacts, 'SHA256SUMS'), [...assets.map(asset => `${asset.sha256}  ${asset.name}`), `${checksum}  docs-release.json`].join('\n') + '\n');
console.log(`Prepared ${assets.length} archives, manifest and SHA256SUMS in ${artifacts}. Staging retained at ${stage}.`);
