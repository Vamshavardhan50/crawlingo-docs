import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default {
  output: 'standalone',
  devIndicators: false,
  distDir: process.env.CRAWLINGO_DOCS_BUILD_DIR || '.next',
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
  experimental: { optimizePackageImports: ['lucide-react'] },
};
