import fs from 'node:fs';
import path from 'node:path';

/**
 * Safe no-op / legacy cleanup for Writer WebGAL scenes.
 * Official WebGAL choose keeps multiple options on one line with `|`.
 * Never split choose on `|`, and never rewrite `changeBg:` spacing.
 */
const sceneDir = path.resolve('public/game/scene');

function normalize(text) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const raw = line;
    const s = line.trim();

    // Legacy end forms only
    if (/^-?end:\s*;?\s*$/i.test(s) || ['end;', '-end;', '-end:'].includes(s.toLowerCase())) {
      out.push('end;');
      continue;
    }

    // Strip legacy leading dash on known commands; keep rest of line intact
    // (including choose:...|...; and changeBg:file with no space after colon).
    const dash = s.match(
      /^-((?:changeBg|changeFigureDiff|changeFigure|changeScene|callScene|bgm|intro|miniAvatar|pixiInit|pixiPerform|setVar|setAnimation|unlockCg|unlockBgm|choose|end|wait|jumpLabel|label)\b)(.*)$/i,
    );
    if (dash) {
      out.push(`${dash[1]}${dash[2]}`);
      continue;
    }

    // choose and all other lines: preserve verbatim (trim only trailing blank lines later)
    out.push(raw.replace(/\s+$/, ''));
  }
  return `${out.join('\n').replace(/\n+$/, '')}\n`;
}

let changed = 0;
for (const name of fs.readdirSync(sceneDir).filter((f) => f.endsWith('.txt'))) {
  const file = path.join(sceneDir, name);
  const before = fs.readFileSync(file, 'utf8');
  const after = normalize(before);
  if (before !== after) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}
console.log(JSON.stringify({ ok: true, changed, note: 'choose | preserved; changeBg spacing untouched' }));
