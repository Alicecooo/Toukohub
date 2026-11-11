import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public/game');
const sceneDir = path.join(root, 'scene');

describe('WebGAL scene wiring', () => {
  it('has start.txt and reachable endings via choose graph', () => {
    const files = fs.readdirSync(sceneDir).filter((f) => f.endsWith('.txt'));
    expect(files).toContain('start.txt');
    const graph = new Map<string, string[]>();
    for (const file of files) {
      const text = fs.readFileSync(path.join(sceneDir, file), 'utf8');
      const targets: string[] = [];
      for (const m of text.matchAll(/choose:([^;\n]+);/g)) {
        for (const part of m[1].split('|')) {
          const target = part.split(':').slice(1).join(':').trim();
          if (target) targets.push(target);
        }
      }
      graph.set(file, targets);
    }
    const seen = new Set<string>();
    const queue = ['start.txt'];
    while (queue.length) {
      const cur = queue.pop()!;
      if (seen.has(cur)) continue;
      seen.add(cur);
      for (const n of graph.get(cur) ?? []) queue.push(n);
    }
    for (const ending of [
      'ending_truth.txt',
      'ending_spring.txt',
      'ending_echo.txt',
      'ending_nightmare.txt',
    ]) {
      expect(seen.has(ending)).toBe(true);
    }
  });

  it('referenced backgrounds and figures exist', () => {
    const bg = new Set(fs.readdirSync(path.join(root, 'background')));
    const fig = new Set(fs.readdirSync(path.join(root, 'figure')));
    for (const file of fs.readdirSync(sceneDir).filter((f) => f.endsWith('.txt'))) {
      const text = fs.readFileSync(path.join(sceneDir, file), 'utf8');
      for (const m of text.matchAll(/changeBg:([^ ;\n]+)/g)) {
        expect(bg.has(m[1])).toBe(true);
      }
      for (const m of text.matchAll(/changeFigure(?:Diff)?:([^ ;\n]+)/g)) {
        if (m[1] && m[1] !== 'none') expect(fig.has(m[1])).toBe(true);
      }
    }
  });
});
