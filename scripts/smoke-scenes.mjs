import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public/game');
const sceneDir = path.join(root, 'scene');
const files = fs.readdirSync(sceneDir).filter((f) => f.endsWith('.txt'));
if (!files.includes('start.txt')) {
  console.error('missing start.txt');
  process.exit(1);
}

const bg = new Set(fs.readdirSync(path.join(root, 'background')));
const fig = new Set(fs.readdirSync(path.join(root, 'figure')));
const sceneNames = new Set(files);
const missing = [];
const chooseTargets = new Set();

for (const file of files) {
  const text = fs.readFileSync(path.join(sceneDir, file), 'utf8');
  for (const m of text.matchAll(/changeBg:([^ ;\n]+)/g)) {
    if (!bg.has(m[1])) missing.push(`${file}: bg ${m[1]}`);
  }
  for (const m of text.matchAll(/changeFigure(?:Diff)?:([^ ;\n]+)/g)) {
    const name = m[1];
    if (name && name !== 'none' && !fig.has(name)) missing.push(`${file}: figure ${name}`);
  }
  for (const m of text.matchAll(/choose:([^;\n]+);/g)) {
    for (const part of m[1].split('|')) {
      const target = part.split(':').slice(1).join(':').trim();
      if (target) {
        chooseTargets.add(target);
        if (!sceneNames.has(target)) missing.push(`${file}: choose -> ${target}`);
      }
    }
  }
  if (/^-changeBg:|^-changeFigure:|^-end:/m.test(text)) {
    missing.push(`${file}: legacy leading-dash command remains`);
  }
}

if (missing.length) {
  console.error('smoke failed:\n' + missing.join('\n'));
  process.exit(1);
}
console.log(JSON.stringify({ scenes: files.length, chooseTargets: [...chooseTargets].sort() }, null, 2));
