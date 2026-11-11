# WebGAL engine pin

- Version: **4.6.6**
- Source package: official WebGAL release extracted at `/tmp/webgal-4.6.6` (from `webgal-4.6.6.zip`)
- Embedded in-repo at `public/` (`assets/`, `icons/`, `webgal-engine.json`, runtime `game/` template/animation/bgm)
- Game title config: `public/game/config.txt`
- Pages base: `/Toukohub/`
- Build: `node scripts/build.mjs` copies `public/` → `dist/` (engine is prebuilt; not rebundled)
