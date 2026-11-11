import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve('.');
const src = path.join(root, 'public');
const dist = path.join(root, 'dist');

// Do not rewrite Writer scenes during build. normalize-scenes.mjs is opt-in
// legacy cleanup only; smoke validates choose targets / assets without mutating.
const smoke = spawnSync(process.execPath, [path.join(root, 'scripts/smoke-scenes.mjs')], {
  stdio: 'inherit',
});
if (smoke.status) process.exit(smoke.status);

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(src, dist, { recursive: true });
if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/index.html missing');
  process.exit(1);
}
console.log('WebGAL static build ->', dist);
