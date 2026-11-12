# 评测与排查材料

这些文件是《雨夜回声》这次 Touko 三 Bot 评测的过程材料和正式报告，方便从本仓库拉到本地排查。

## 文件

- `Touko-Real-World-Stress-Eval-Report.md`：正式评测报告（主策划于 2026-11-12 00:39 上海时间独立验收通过后撰写）。当时验收的是官方 WebGAL 4.6.6 界面，立绘和背景仍是占位图形。报告没有编造未跑阶段的正式分数。
- `issues.md` / `issues.jsonl`：问题台账，区分模型/代理问题与 Cursor 通道、中转站、配置等问题。
- `events.jsonl`、`run.json`：监督侧过程事件与本次运行配置（不含密钥）。
- `screenshots/`：2026-11-12 上午更换网上素材后的界面截图。
- 素材授权见仓库 `docs/ASSET_CREDITS.md` 和 `docs/licenses/`。发布时需署名 **onboroo**（CC BY 4.0）和 **Uncle Mugen (mugenjohncel)**。

## 关于验收之后的素材更换

2026-11-12 上午，按需求把自制 SVG 占位图换成了可再分发的网上立绘和背景（提交 `a7ea5b5`）。这不影响此前「官方 WebGAL 界面可玩」的验收结论，但成品观感已与报告截图中的占位图不同。请以本目录 `screenshots/` 和当前仓库资源为准。

## Touko 本地存储

`touko-runtime-core-2026-11-12.tar.gz` 是这次评测的 Touko 本地存储精简快照，含对话数据库、任务和记忆，不含 `checkpoints/` 和 `native/` 缓存。克隆仓库后解压，按包内 README 把 `openmausbot/` 复制到目标机器的 Touko 数据目录（评测环境是 `OMB_DATA_DIR`，即 `/workspace/dev-env/.runtime/openmausbot`）即可恢复排查。

注意：这个压缩包里有完整 Bot 对话记录，仓库是公开的。
