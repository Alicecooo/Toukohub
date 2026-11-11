import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public');
const dist = join(root, 'dist');
const BASE = '/Toukohub/';

function mustExist(rel) {
  const p = join(src, rel);
  if (!existsSync(p)) throw new Error(`missing required file: public/${rel}`);
  return p;
}

mustExist('index.html');
mustExist('assets/index-Dcp3ZA1M.js');
mustExist('webgal-engine.json');
mustExist('game/config.txt');
mustExist('game/scene/start.txt');
mustExist('game/background/title_rain.svg');
mustExist('game/figure/gu_neutral.svg');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(src, dist, { recursive: true });

const indexPath = join(dist, 'index.html');
let html = readFileSync(indexPath, 'utf8');
if (!html.includes(`<base href="${BASE}"`)) {
  html = html.replace('<head>', `<head>\n    <base href="${BASE}" />`);
}
html = html.replace(/<title>.*?<\/title>/, '<title>雨夜回声</title>');
writeFileSync(indexPath, html);

const engine = JSON.parse(readFileSync(join(dist, 'webgal-engine.json'), 'utf8'));
if (engine.webgalVersion !== '4.6.6') {
  throw new Error(`unexpected WebGAL version: ${engine.webgalVersion}`);
}

const cfg = readFileSync(join(dist, 'game/config.txt'), 'utf8');
if (!cfg.includes('Game_name:雨夜回声')) {
  throw new Error('game config title mismatch');
}

console.log(
  JSON.stringify(
    {
      ok: true,
      engine: engine.webgalVersion,
      base: BASE,
      distBytes: statSync(join(dist, 'assets/index-Dcp3ZA1M.js')).size,
    },
    null,
    2,
  ),
);
