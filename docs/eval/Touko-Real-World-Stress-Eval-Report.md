# Touko Real-World Stress Eval V1.0 — 《雨夜回声》评测报告

- 时区：Asia/Shanghai（UTC+8）
- 报告时间：2026-11-12 00:57（上海时间）
- 评测依据：Alice 正式文档 *Touko Real-World Stress Eval V1.0*（`测试文档.txt`）；本轮未能打开用户电脑 Auko 上的 `D:\Code\PA\Touko-docs\测试文档.txt`（该机器当时离线），因此**不编造该文档中的正式分数，也不给未实际跑过的后续压力测试阶段打分**。本报告依据最终产物、主策划独立验收结论，以及过程台账，判断 Bot 体验、最终结果与模型能力。
- 过程证据：`/workspace/touko-eval/issues.md`、`issues.jsonl`、`events.jsonl`；Bot 记忆与 Touko 任务结算；本地仓库 `/workspace/touko-galgame-stress`；验收截图 `accept-shots/`。

## 结论

主策划（Director）已于 **2026-11-12 00:39:52（上海时间）独立验收通过**。本地 `main` 的 HEAD `7c8346c2e475799dc52d4b505b068b45ab4948b5`（父提交为编剧 `6baa342e5b8b1bc68edce930d5ceed649de1a1b4`）是一套可玩的**官方 WebGAL 4.6.6** 界面，而不是被否决的自制网页对话树。

关键提交已在本地落地，构建与测试有记录，实际可玩性有截图证据。远程仓库与 GitHub Pages **尚未更新**： [Alicecooo/Toukohub](https://github.com/Alicecooo/Toukohub) 仍停在 `b6c006d`（2026-11-11 20:44 上海时间），对应被否决的自制界面。监督侧按既有约定没有代为推送。

## 最终产物

本地工作区：`/workspace/touko-galgame-stress`，分支 `main`，作者 `Touko Eval <touko-eval@local>`。

| 提交 | 时间（上海） | 职责 | 说明 |
|---|---|---|---|
| `6baa342` | 2026-11-11 22:57 | Writer | 12 个 WebGAL 场景共 240 行；角色统一为顾舟、林激、夏遥；四结局 `ending_truth` / `ending_spring` / `ending_echo` / `ending_nightmare` 可达；同步 `docs/STORY.md` |
| `7c8346c` | 2026-11-11 23:32 | Developer | 嵌入官方 WebGAL 4.6.6 引擎包与应用壳；Vite base `/Toukohub/`；占位背景/立绘；未改 Writer 场景文本 |

更早的 `04de5db`（2026-11-11 18:54）是自制网页原型，已被产品方否决，不得再当作最终界面。

监督侧在 00:56 独立重跑 `npm test`：Vitest 1 个文件、**4/4 通过**。主策划验收记录为 `npm test` 4/4、`npm run build` 通过，引擎 4.6.6，base `/Toukohub/`。本轮未再完整重跑 Playwright e2e（以免把探测脚本误判写成产品结论）；可玩性主要依据主策划截图与既有探测记录。

主策划宣布通过、且监督侧目视核对过的界面项：

- 官方标题页《雨夜回声 / Rain Echo》，含开始游戏、继续游戏、游戏选项、读取存档、退出游戏（`CLEAN-D-after-yes.png`，亦见 `A-title.png`）
- 开始游戏进入 ADV：全屏舞台、占位立绘、底部对话框与姓名条、点击推进（`C-after-advance.png`、`CLEAN-A-adv.png`）
- 回想（`D-backlog.png`）
- 正式存档与局内存档读回
- 从游戏内点「标题」并确认「是」，回到《雨夜回声》标题菜单，而不是彩蛋页
- 标题页「读取存档」可恢复 ADV（`CLEAN-E-title-load.png`、`CLEAN-F-after-title-load.png`：校门·雨夜，顾舟「三声回响。和父亲留下的带子一模一样。」）

美术是占位图形（房屋线稿、简笔立绘），符合「不要导入商业/Pixiv 立绘」的约束，不是成品商业资源。`accept-shots/` 与探测脚本仍是未跟踪的验收材料，没有打进正式提交。

本地运行方式：在工作区执行 `npm run build` 后，`npm run preview -- --host 127.0.0.1 --port 4173`，打开 `http://127.0.0.1:4173/Toukohub/`。

## 对 Bot 体验的判断

这是一次三 Bot 协作：Director 分派与独立验收，Writer 写剧本，Developer 做引擎集成。协作最终成立，但过程摩擦很大，体验明显被基础设施和早期行为问题拖累。

1. **开局配置消耗了首轮开发时间**（ISS-001，非模型）。隔离 Codex 环境走 hiyo，会话却按官方 OpenAI 协议启动；裸模型名 `gpt-6-luna` 还会被当成官方模型并强制 `openai` 提供方。后来中转站又出现 403 `upstream_error`（ISS 中的 relay_upstream），控制器在 22:47 将三个 Bot 全部切到 Cursor Auto。
2. **Pi / Codex 阶段出现明确的模型/代理行为问题**：工具已经在 `/workspace/touko-galgame-stress` 成功执行，Writer 和 Developer 仍反复宣称工作区不存在，甚至编造失败的 bash 记录，并因此迟迟不提交（ISS-002、ISS-003、ISS-004）。
3. **第一版可运行，但形态错了**（ISS-005，偏模型能力）。团队交出了能点选项的网页对话树，不是正经 Galgame / 官方 WebGAL 界面，被产品方否决。返工指令下达后，在 Cursor Auto 上才做出官方引擎壳。
4. **切到 Cursor 之后，拖慢验收的主因是通道/会话超时，不是「模型不会做」**。问题台账中有 10 条 `provider_channel`（`PING timed out`、`Connection stalled`）和 1 条 `resource_exhausted`（额度或容量，现有 usage 不报告 Cursor token，不能据此断言 Premium 用尽）。Director、Writer、Developer 都中过。典型例子：Developer 在 23:32 提交 `7c8346c` 前后多次掉线；主策划 23:36、00:06、00:25 的验收回合被探活超时打断；00:37 Developer 修复线程在 24 次工具调用均成功后再次 `PING timed out`（ISS-021）。这些中断发生在工具已开始之后，usage 里 input/output 常为 0，不能写成模型拒答或能力不足。
5. **主策划在续验中表现稳定**：两次把探测假阴性纠正回来（先是「开始游戏进不对白」，实为 WebGAL 拆字导致文本匹配失败；后是「返回标题变成 Yoozle」，实为脚本误按 Escape，触发引擎老板键/panic 彩蛋），并且在 Developer 超时后选择不另起炉灶、不重派。这是代理侧的有效判断，不是侥幸通过。

总体体验：任务能做完，但人要反复催、要自己核对工具和截图，不能只看 Bot 的口头结论或探测 JSON。Cursor 会话不稳定是返工后半段最主要的体验减分项。

## 对模型能力的判断

- **形态理解**：第一版说明，至少在当时的 Pi + Codex / `gpt-6-luna` 组合下，团队没有把「网页可玩」自动理解成「官方 Galgame 界面」。这是能力/执行问题，不是通道问题。返工后，同一批角色设定（顾舟、林激、夏遥）被写成可跑的 WebGAL 场景，Developer 也正确嵌入了 4.6.6 官方包并处理了 `choose` 竖线语法、`/Toukohub/` 基路径等工程细节，说明在明确约束和续做条件下，Cursor Auto 能够做出符合标准的界面。
- **工具结果使用**：早期误报工作区、编造命令，是模型/代理行为问题，损害信任，也让主策划多轮纠偏。
- **不要把超时写成不会做**：`7c8346c` 在多次通道失败之后仍然落地；Yoozle 和「进不对白」最终都不是实现错误。若只看中断日志，会严重低估模型实际完成度。
- **验收脚本不可靠**：WebGAL 会把对白拆成单字，Escape 会打开彩蛋页。`title-clean-report.json` 在清洁重验后仍把 `titleLoadRestores` 标为 false、整体 `ok` 为 false，但 `CLEAN-F-after-title-load.png` 清楚显示 ADV 已恢复。评测时必须以截图和人工复核为准。

本报告不对未跑的后续压力测试阶段给出正式分数，也不补造 *测试文档.txt* 里可能存在、但本轮未能对照原文的分项量表。

## 问题台账摘要

完整条目见 `/workspace/touko-eval/issues.md`（21 条）。分类如下：

- 模型/代理相关 6 条：`model_behavior` 4，`model_capability` 2（含首版自制界面）
- 非模型 15 条：`provider_channel` 10，`provider_quota_or_capacity` 1，`relay_upstream` 1，`controller_config` 1，以及 2 条曾记为 `product`、后更正为探测假阴性的记录（ISS-018、ISS-020）

验收相关的开放项已全部关闭。ISS-005 的能力判断保留，状态改为「返工已在本地验收通过」。ISS-020 更正为 Escape 老板键引起的假阴性。

## 未完成与建议

- 远程发布未做：GitHub `main` 仍是 `b6c006d`，Pages（https://alicecooo.github.io/Toukohub/）仍是自制界面。若要上线本次验收版本，需要产品方将本地 `main`（`7c8346c`）推送到 [Alicecooo/Toukohub](https://github.com/Alicecooo/Toukohub)，并确认 GitHub Actions 的 Pages 工作流。本地仓库当前没有配置 `git remote`。
- 本轮未对照 `测试文档.txt` 原文逐项打正式分；若需要严格按量表重评，请在 Auko 上线后提供该文件。
- 后续压力测试阶段没有对 Bot 展开，也没有分数。

## 监督侧说明

监督例行任务只检查三个 Bot 是否在推进、记录故障、并在验收通过后写本报告。监督侧没有改剧情或游戏代码，也没有把后续压力测试阶段写进 Bot 任务。盯梢例行任务在本报告提交后删除。
