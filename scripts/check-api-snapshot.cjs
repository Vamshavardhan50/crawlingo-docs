// Validate documentation provenance without loading a native SDK or running requests.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const snapshot = require('../src/content/generated/sdk-api.json');
const pkg = require('../package.json');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const fail = message => { throw new Error(message); };
if (snapshot.schemaVersion !== 1) fail('Unsupported API snapshot schema.');
if (snapshot.sourceHashFormat !== 'utf8-lf') fail('Regenerate the snapshot with portable UTF-8/LF source hashes.');
if (pkg.version !== snapshot.version) fail('Website version must match API snapshot version.');
if (!/^[a-f0-9]{40}$/.test(snapshot.sourceCommit)) fail('Invalid engine commit.');
if (typeof snapshot.sourceModified !== 'boolean') fail('Missing sourceModified flag.');
if (!snapshot.sourceFiles.length || snapshot.sourceDigest !== hash(JSON.stringify(snapshot.sourceFiles))) fail('Snapshot source digest is invalid.');
const paths = new Set();
for (const input of snapshot.sourceFiles) {
  if (paths.has(input.file) || !/^(sdk|src)\//.test(input.file) || input.file.split('/').includes('..') || !/^[a-f0-9]{64}$/.test(input.sha256)) fail(`Invalid source entry: ${input.file}`);
  paths.add(input.file);
}
require('./load-content.cjs');
const { SDK_REFERENCE_DOCS, symbolRoute } = require('../src/content/sdk-reference.ts');
let members = 0;
for (const language of ['node', 'python']) {
  const surface = snapshot[language];
  const names = new Set();
  for (const symbol of surface.symbols) {
    if (names.has(symbol.name)) fail(`Duplicate ${language} symbol ${symbol.name}`);
    names.add(symbol.name);
    if (!SDK_REFERENCE_DOCS[symbolRoute(language, symbol.name)]) fail(`Undocumented ${language} symbol ${symbol.name}`);
    for (const item of [symbol, ...symbol.members]) {
      if (!paths.has(item.file) || !Number.isInteger(item.line) || item.line < 1 || !item.signature) fail(`Incomplete declaration: ${language}:${symbol.name}`);
    }
    members += symbol.members.length;
  }
  for (const name of surface.exports) if (!names.has(name)) fail(`Missing package export: ${language}:${name}`);
}
if (process.argv.includes('--release')) {
  if (snapshot.sourceModified) fail('Release blocked: snapshot includes uncommitted engine source. Commit it and regenerate.');
  const tag = process.env.DOCS_RELEASE_TAG;
  if (tag !== `v${pkg.version}`) fail(`Release tag must be v${pkg.version}.`);
  if (process.env.DOCS_RELEASE_PRERELEASE !== String(pkg.version.includes('-'))) fail('Release prerelease flag does not match the version.');
  const engine = path.resolve(process.env.CRAWLINGO_ENGINE_ROOT || path.join(root, '.engine'));
  const git = args => execFileSync('git', args, { cwd: engine, encoding: 'utf8' }).trim();
  if (git(['rev-parse', 'HEAD']) !== snapshot.sourceCommit) fail('Engine checkout does not match the snapshot commit.');
  for (const input of snapshot.sourceFiles) {
    if (hash(fs.readFileSync(path.join(engine, input.file), 'utf8').replace(/\r\n/g, '\n')) !== input.sha256) fail(`Engine source changed: ${input.file}`);
  }
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'crawlingo-api-'));
  const regenerated = path.join(temporary, 'sdk-api.json');
  execFileSync(process.execPath, [path.join(engine, 'scripts/export-sdk-api.cjs'), regenerated], { cwd: engine, stdio: 'inherit' });
  if (JSON.stringify(JSON.parse(fs.readFileSync(regenerated, 'utf8'))) !== JSON.stringify(snapshot)) fail('Regenerated API inventory differs. Refresh the website snapshot.');
  fs.unlinkSync(regenerated);
  fs.rmdirSync(temporary);
}
console.log(`API snapshot: ${snapshot.node.exports.length + snapshot.python.exports.length} package exports, ${members} declared members; source ${snapshot.sourceModified ? 'modified (preview only)' : 'clean'}.`);
