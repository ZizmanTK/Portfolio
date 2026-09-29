/**
 * Copies the static build into docs/, which GitHub Pages serves from the master branch
 * at https://zizmantk.github.io/Portfolio/. Run after `ng build` (or just `npm run deploy`).
 */
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const build = join(root, 'dist/portfolio/browser');
const docs = join(root, 'docs');

if (!existsSync(join(build, 'index.html')) || !existsSync(join(build, 'fr/index.html'))) {
  console.error('No prerendered build found in dist/portfolio/browser — run `ng build` first.');
  process.exit(1);
}

rmSync(docs, { recursive: true, force: true });
cpSync(build, docs, { recursive: true });
rmSync(join(docs, 'index.csr.html'), { force: true }); // client-only fallback, unused on a static host
writeFileSync(join(docs, '.nojekyll'), ''); // serve files as-is, no Jekyll processing

console.log('✔ docs/ updated — commit and push to publish.');
