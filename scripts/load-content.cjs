const ts = require('typescript');
const fs = require('node:fs');
// Local content tooling; production code is compiled by Next.js.
require.extensions['.ts'] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: filename,
  });
  module._compile(result.outputText, filename);
};
module.exports = require('../src/content/docs.ts');
