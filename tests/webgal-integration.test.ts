import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const pub = join(root, 'public');

const backgrounds = [
  'rainy_gate.jpg',
  'library_rain.jpg',
  'student_council.jpg',
  'archive_library.jpg',
  'old_hall_exterior.jpg',
  'school_archive.jpg',
  'radio_room.jpg',
  'archive_room.jpg',
  'sealed_corridor.jpg',
  'school_morning.jpg',
  'rainy_window.jpg',
  'school_garden.jpg',
  'title_rain.jpg',
];

const figures = [
  'gu_neutral.png',
  'lin_neutral.png',
  'lin_worried.png',
  'lin_smile.png',
  'xia_neutral.png',
  'xia_determined.png',
  'xia_smile.png',
];

const scenes = [
  'start.txt',
  'tape_room.txt',
  'broadcast_room.txt',
  'records.txt',
  'sealed_hall.txt',
  'evidence_review.txt',
  'lin_route.txt',
  'xia_route.txt',
  'ending_echo.txt',
  'ending_nightmare.txt',
  'ending_spring.txt',
  'ending_truth.txt',
];

describe('WebGAL 4.6.6 integration', () => {
  it('pins official engine version 4.6.6', () => {
    const engine = JSON.parse(readFileSync(join(pub, 'webgal-engine.json'), 'utf8'));
    expect(engine.webgalVersion).toBe('4.6.6');
    expect(engine.version).toBe('4.6.6');
    expect(existsSync(join(pub, 'assets/index-Dcp3ZA1M.js'))).toBe(true);
    expect(existsSync(join(pub, 'WEBGAL_VERSION.txt'))).toBe(true);
  });

  it('configures title page for 雨夜回声', () => {
    const cfg = readFileSync(join(pub, 'game/config.txt'), 'utf8');
    expect(cfg).toContain('Game_name:雨夜回声');
    expect(cfg).toContain('Title_img:title_rain.jpg');
    expect(cfg).toContain('Enable_Continue:true');
    const html = readFileSync(join(pub, 'index.html'), 'utf8');
    expect(html).toContain('<title>雨夜回声</title>');
    expect(html).toContain('<base href="/Toukohub/"');
  });

  it('provides contracted backgrounds and figures', () => {
    for (const name of backgrounds) {
      expect(existsSync(join(pub, 'game/background', name)), name).toBe(true);
    }
    for (const name of figures) {
      expect(existsSync(join(pub, 'game/figure', name)), name).toBe(true);
    }
  });

  it('wires Writer scene entrypoints without missing choose targets', () => {
    for (const name of scenes) {
      expect(existsSync(join(pub, 'game/scene', name)), name).toBe(true);
    }
    const start = readFileSync(join(pub, 'game/scene/start.txt'), 'utf8');
    // Writer official syntax: no space after changeBg:; same-line | choose options
    expect(start).toMatch(/changeBg:\s*rainy_gate\.jpg/);
    expect(start).toContain(
      'choose:去图书馆找林激:lin_route.txt|跟夏遥去学生会查报纸:xia_route.txt;',
    );

    const sceneDir = join(pub, 'game/scene');
    const files = readdirSync(sceneDir).filter((f) => f.endsWith('.txt'));
    for (const file of files) {
      const text = readFileSync(join(sceneDir, file), 'utf8');
      for (const m of text.matchAll(/choose:([^;\n]+);/g)) {
        for (const part of m[1].split('|')) {
          const target = part.split(':').slice(1).join(':').trim();
          if (target) {
            expect(existsSync(join(sceneDir, target)), `${file} -> ${target}`).toBe(true);
          }
        }
      }
    }
  });
});

