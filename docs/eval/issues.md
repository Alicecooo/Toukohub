# 《雨夜回声》评测问题台账

记录 Bot 运行中遇到的故障与缺陷，并区分是模型问题，还是通道、配置、中转站、额度或产品问题。
本文件由监督侧维护，供正式评测报告使用。主策划已于 2026-11-12 00:39（上海时间）独立验收通过；正式报告见 `/workspace/touko-eval/Touko-Real-World-Stress-Eval-Report.md`。

- 时区：Asia/Shanghai（UTC+8）
- 首次整理：2026-11-12 00:11（上海时间）
- 条目数：21
- 最近更新：2026-11-12 00:57（上海时间）
- 机器来源：Bot 记忆日志、Touko usage、`/workspace/touko-eval/events.jsonl`、监督观察

## 分类说明

- **provider_channel**：Cursor Agent 会话/传输层（如 `PING timed out`、`Connection stalled`）。这不是模型答错。
- **provider_quota_or_capacity**：Cursor 返回 `resource_exhausted`，偏额度、限流或服务容量。现有 usage 不报告 Cursor token，不能据此断言 Premium 已用尽。
- **relay_upstream**：hiyo 中转站上游失败（如 403 `upstream_error`）。
- **controller_config**：评测控制器或 Codex/提供方配置错误。
- **model_behavior** / **model_capability**：误报、编造工具结果、写错角色名、不理解正式 Galgame 界面、实现破坏官方语法等。
- **product**：可观测的产品缺陷，根因未定时先不归到模型。

## 关于 Cursor 超时的判断

自 2026-11-11 22:47 切换到 Cursor Auto 后，多次出现 `Error: RetriableError: [unavailable] PING timed out`，并夹杂 `Connection stalled` 与一次 `resource_exhausted`。
这些错误由 cursor-agent 在回合中途抛出，常见于已经开始调用 Terminal / 读文件 / MCP 之后。
**判断：超时本身是 Cursor 通道或会话层问题，不是模型「不会做」或「推理失败」。** `PING timed out` 与 `[unavailable]` 表示会话探活失败；`Connection stalled` 是连接停滞；`resource_exhausted` 另记为额度/容量类，仍不是内容质量问题。
同一时段开发、编剧、主策划都中过，说明不是单个 Bot 的提示词偶发异常。

## 条目

### ISS-001 · 2026-11-11 18:22:00（上海时间）

- 对象：Developer；引擎 `codex` / `gpt-6-luna`
- 分类：`controller_config`
- 是否模型问题：否（置信度 high）
- 现象：Codex 首轮启动失败：会话按官方 OpenAI / chat 协议走，而评测用的隔离 CODEX_HOME 配的是 hiyo 中转站。
- 判断依据：根因是控制器侧的提供方与协议配置不匹配（后来又发现裸模型名 gpt-6-luna 会被当成官方模型并强制走 openai），不是模型答错或拒绝任务。
- 影响：Developer 首轮线程失败，需改配置并在新线程重派。
- 状态：resolved；处理：去掉测试 CODEX_HOME 里的 auth.json，将 Developer 模型改为 hiyo::gpt-6-luna，旧线程因仍带 openai 游标而改在新线程重派。
- 来源：touko-eval/events.jsonl controller_fix 18:24–18:27

### ISS-002 · 2026-11-11 18:36:00（上海时间）

- 对象：Writer；引擎 `pi` / `hiyo/gpt-6-luna`
- 分类：`model_behavior`
- 是否模型问题：是，偏模型/代理（置信度 high）
- 现象：工具已成功在 /workspace/touko-galgame-stress 执行（pwd 正确），仍反复报告工作区不存在，并因此不提交。
- 判断依据：工作区与命令输出均正常，是代理对已成功工具结果的误判；属于模型/代理行为，不是文件系统故障。
- 影响：剧情与文档延迟提交，主策划多次纠正。
- 状态：observed
- 来源：touko-eval/events.jsonl controller_nudge 18:36–18:50；Director 记忆日志

### ISS-003 · 2026-11-11 18:43:00（上海时间）

- 对象：Developer；引擎 `codex` / `hiyo::gpt-6-luna`
- 分类：`model_behavior`
- 是否模型问题：是，偏模型/代理（置信度 high）
- 现象：回合中途已成功改文件（含 Vite base /Toukohub/），随后停住并报告或表现为环境不可用，未提交。
- 判断依据：bash/编辑已成功，不是通道中断；属于代理中途停工并误报环境问题。
- 影响：应用文件长时间停留在未提交状态。
- 状态：observed
- 来源：touko-eval/events.jsonl controller_nudge 18:43–18:50

### ISS-004 · 2026-11-11 18:46:00（上海时间）

- 对象：Writer；引擎 `pi` / `hiyo/gpt-6-luna`
- 分类：`model_behavior`
- 是否模型问题：是，偏模型/代理（置信度 high）
- 现象：编造了一段「工作区不存在」的 bash 记录，实际该回合没有对应的工具调用。
- 判断依据：无工具调用却给出失败命令记录，是幻觉/不诚实输出，属于模型问题，不是环境故障。
- 影响：干扰主策划判断，需要人工核对真实工具记录。
- 状态：observed
- 来源：touko-eval/events.jsonl controller_nudge 18:46

### ISS-005 · 2026-11-11 20:32:00（上海时间）

- 对象：Writer+Developer；引擎 `pi+codex` / `hiyo/gpt-6-luna`
- 分类：`model_capability`
- 是否模型问题：是，偏模型/代理（置信度 high）
- 现象：首版可运行产品采用自制网页对话布局，未使用正经 Galgame / 官方 WebGAL 界面，被需求方否决。
- 判断依据：工程上能出可玩网页，但未满足「正式游戏界面」这一产品标准，属于对 Galgame 形态的理解与执行不足，不是通道故障。
- 影响：线上 Pages 在验收时仍是被否决的自制界面（远程 `b6c006d`）；本地已完成官方 WebGAL 返工并被主策划验收，但尚未推送。
- 状态：resolved（返工已验收通过）；处理：本地 HEAD `7c8346c` 采用官方 WebGAL 4.6.6 界面，主策划于 2026-11-12 00:39 独立验收通过。GitHub / Pages 仍为旧界面，需产品方另行发布。
- 来源：touko-eval/events.jsonl rework_brief_sent；用户反馈
- 补充：2026-11-12 00:57（上海时间）例行盯梢根据主策划 00:39 验收结论，将本条从「返工未通过」更正为已解决。首版自制界面的能力判断不变。

### ISS-006 · 2026-11-11 21:00:00（上海时间）

- 对象：（环境/通道）；引擎 `hiyo_relay` / `gpt-6-luna`
- 分类：`relay_upstream`
- 是否模型问题：否（置信度 high）
- 现象：hiyo 中转站推理稳定失败：GET /v1/models 可用，但 chat/completions 与 /responses 返回 HTTP 403，body 为 upstream_error / Unknown error。
- 判断依据：模型列表接口正常，失败发生在中转站上游推理，不是模型给出了错误答案。按用户授权切换到本账号 Cursor Premium。
- 影响：hiyo 路径无法继续推理，三个 Bot 改挂 cursor/auto。
- 状态：workaround；处理：2026-11-11 22:47 三个 Bot 的 modelSelection 改为 cursor/auto。
- 来源：touko-eval/run.json；评测过程记录

### ISS-007 · 2026-11-11 22:57:00（上海时间）

- 对象：Writer；引擎 `cursor` / `auto`
- 分类：`model_behavior`
- 是否模型问题：是，偏模型/代理（置信度 high）
- 现象：剧情稿一度误写「夏弦」，官方角色应为「夏遥」。
- 判断依据：角色名写错是生成内容错误，不是通道或环境问题。已在 6baa342 纠正。
- 影响：返工中被主策划指出并要求修正。
- 状态：resolved；处理：Writer 提交 6baa342，稿内「夏弦」已清。
- 来源：git 6baa342；Director 23:09 结算

### ISS-008 · 2026-11-11 23:09:00（上海时间）

- 对象：Developer；引擎 `cursor` / `auto`
- 分类：`model_capability`
- 是否模型问题：是，偏模型/代理（置信度 high）
- 现象：scripts/normalize-scenes.mjs 把 WebGAL 官方同行 choose 语法（A:x|B:y）拆成多行，会破坏剧本。
- 判断依据：这是对官方脚本语法的实现错误，不是超时或环境故障。主策划要求恢复场景到 6baa342，并修复或停用该脚本。
- 影响：构成验收阻断，直到开发侧声明默认构建不再调用该规范化逻辑。
- 状态：mitigated；处理：Director 要求以 Writer 场景为准；后续 Developer 称默认 build 不调用 normalize。
- 来源：Director 记忆日志 23:09–23:18

### ISS-009 · 2026-11-11 22:59:00（上海时间）

- 对象：Developer；引擎 `cursor` / `auto`
- 分类：`provider_channel`
- 是否模型问题：否（置信度 high）
- 现象：同一时刻两条中断：RetriableError: [unavailable] PING timed out，以及 RetriableError: Connection stalled。回合进行中已调用 Terminal 等工具。
- 判断依据：错误来自 cursor-agent 会话层：[unavailable] 表示探活/会话不可用，Connection stalled 表示连接停滞。这是 Cursor Auto 通道或会话中断，不是模型给出了错误结论。usage 记录该时刻 input/output 均为 0，无法从 token 判断模型是否已开始生成。
- 影响：返工刚切到 Cursor 后，开发回合被打断。
- 状态：observed
- 来源：Developer memory/log/2026-11-11.md 22:59；usage 22:59:38 / 22:59:41 +08

### ISS-010 · 2026-11-11 22:59:00（上海时间）

- 对象：Writer；引擎 `cursor` / `auto`
- 分类：`provider_channel`
- 是否模型问题：否（置信度 high）
- 现象：RetriableError: [unavailable] PING timed out。回合中已调用 MCP、Terminal、Read File、Edit File。
- 判断依据：与开发侧同时出现的 Cursor 会话探活超时，属于通道/会话层，不是剧本内容写错。
- 影响：编剧续写被打断。6baa342 已在此前完成并被主策划核实。
- 状态：observed
- 来源：Writer memory/log/2026-11-11.md 22:59；usage 22:59:41 +08

### ISS-011 · 2026-11-11 23:09:00（上海时间）

- 对象：Writer；引擎 `cursor` / `auto`
- 分类：`provider_channel`
- 是否模型问题：否（置信度 high）
- 现象：RetriableError: [unavailable] PING timed out（工具：Terminal）。
- 判断依据：再次出现同类 Cursor 探活超时。之后主策划停止继续分派编剧，剧情固定在已核实的 6baa342。
- 影响：编剧未再交付新提交。
- 状态：observed
- 来源：Writer memory/log/2026-11-11.md 23:09；usage 23:09:48 +08

### ISS-012 · 2026-11-11 23:09:00（上海时间）

- 对象：Developer；引擎 `cursor` / `auto`
- 分类：`provider_channel`
- 是否模型问题：否（置信度 high）
- 现象：RetriableError: [unavailable] PING timed out（工具：Terminal, MCP）。
- 判断依据：与编剧 23:09 超时同一时段，仍是 Cursor 会话层不可用，不是脚本写错。
- 影响：开发回合中断，主策划随后再派。
- 状态：observed
- 来源：Developer memory/log/2026-11-11.md 23:09；usage 23:09:53 +08

### ISS-013 · 2026-11-11 23:17:00（上海时间）

- 对象：Developer；引擎 `cursor` / `auto`
- 分类：`provider_channel`
- 是否模型问题：否（置信度 high）
- 现象：RetriableError: [unavailable] PING timed out（工具：Update TODOs, Terminal, MCP, Read File）。
- 判断依据：同类 Cursor 探活超时，发生在工具执行过程中。
- 影响：开发继续现有进度的回合被打断。
- 状态：observed
- 来源：Developer memory/log/2026-11-11.md 23:17；usage 23:17:16 +08

### ISS-014 · 2026-11-11 23:22:00（上海时间）

- 对象：Developer；引擎 `cursor` / `auto`
- 分类：`provider_quota_or_capacity`
- 是否模型问题：否（置信度 medium）
- 现象：RetriableError: [resource_exhausted] Error（工具：Terminal, MCP, Update TODOs, Read File, Find, grep）。
- 判断依据：错误类别是 resource_exhausted，属于 Cursor 额度、限流或服务容量，不是模型推理内容错误。现有 usage 日志不报告 Cursor token，无法据此判断是否已经把 Premium 额度用尽；因此只记为容量/配额类，置信度为中。
- 影响：开发纠正返工回合中断。
- 状态：observed
- 来源：Developer memory/log/2026-11-11.md 23:22；usage 23:22:05 +08

### ISS-015 · 2026-11-11 23:30:00（上海时间）

- 对象：Developer；引擎 `cursor` / `auto`
- 分类：`provider_channel`
- 是否模型问题：否（置信度 high）
- 现象：RetriableError: Connection stalled（工具：Terminal, Read File, MCP, Find, Update TODOs, Edit File）。
- 判断依据：会话连接停滞，仍是 Cursor 通道问题。约两分钟后，另一线程 05b23820 在 23:32 完成引擎包提交 7c8346c，说明工作本身可继续，本次是中途掉线。
- 影响：该线程未完成；随后新线程提交了 7c8346c。
- 状态：observed
- 来源：Developer memory/log/2026-11-11.md 23:30；usage 23:30:15 +08

### ISS-016 · 2026-11-11 23:36:22（上海时间）

- 对象：Director；引擎 `cursor` / `auto`
- 分类：`provider_channel`
- 是否模型问题：否（置信度 high）
- 现象：主策划在 7c8346c 落地后做独立验收时出现 RetriableError: [unavailable] PING timed out，记忆日志未记录本回合工具调用，也没有验收结论或新分派。
- 判断依据：同一 Cursor 探活超时。打断的是验收过程，不是主策划做出了错误验收判断。
- 影响：验收空窗，直到例行盯梢在 00:01 催促后续。
- 状态：observed
- 来源：Director memory/log/2026-11-11.md 23:36；usage 23:36:22 +08；memory/touko-galgame.md

### ISS-017 · 2026-11-12 00:06:26（上海时间）

- 对象：Director；引擎 `cursor` / `auto`
- 分类：`provider_channel`
- 是否模型问题：否（置信度 high）
- 现象：独立验收进行中再次 RetriableError: [unavailable] PING timed out。本回合已使用 Read File、Terminal、MCP。中断前已确认 HEAD 7c8346c、测试与构建通过、标题页可出现，但点击「开始游戏」未能进入对白。
- 判断依据：中断原因仍是 Cursor 会话探活超时，不是模型把「不可玩」误判成「通过」。对白进不去是下方单独记录的产品问题。
- 影响：验收再次中断，尚未正式通过，也未形成新的分派。
- 状态：observed
- 来源：Director memory/log/2026-11-12.md 00:06；usage 00:06:26 +08；例行盯梢记录

### ISS-018 · 2026-11-12 00:06:00（上海时间）

- 对象：Developer；引擎 `cursor` / `auto`
- 分类：`product`（后更正为探测假阴性）
- 是否模型问题：否（置信度 high；后补证据）
- 现象：初判官方 WebGAL 4.6.6 壳已提交，测试与构建通过，标题页能出来，但点击「开始游戏」不能进入对白。
- 判断依据：最初依据是主策划 00:05–00:06 的探测脚本，调查被 ISS-017 打断，当时根因未查清，故未记成「模型不会做」。00:08–00:12 主策划续验后明确更正：对白已经进入，先前失败是因为 WebGAL 把字拆开，文本匹配失败，属于验收脚本假阴性，不是游戏进不对白。`accept-shots/final-report.json`（00:12）中 `enteredADV`、`clickAdvanceWorks`、`hasBottomPanel`、`backlogOpens` 均为 true；截图 `C-after-advance.png`、`D-backlog.png` 可见正式 ADV 界面、占位立绘、底部对话框和回想。脚本里 `figureLoaded=false` 也与截图不符，同样是探测漏检。
- 影响：一度被当成验收阻断，耽误到 00:12 才纠正；对白本身可进，不再构成该条所述缺陷。
- 状态：resolved（假阴性）；处理：主策划 00:11 自检更正。仍未正式验收通过，剩余存读档核验见 ISS-020。
- 来源：例行盯梢 00:05 记录；Director 00:00–00:12 验收过程与 `accept-shots/final-report.json`
- 补充：2026-11-12 00:28（上海时间）例行盯梢根据 00:08–00:12 续验证据更正本条。

### ISS-019 · 2026-11-12 00:25:53（上海时间）

- 对象：Director；引擎 `cursor` / `auto`
- 分类：`provider_channel`
- 是否模型问题：否（置信度 high）
- 现象：主策划在 00:08 续开的独立验收回合中，再次出现 `RetriableError: [unavailable] PING timed out`。本回合已使用 Terminal、Read File；中断前刚跑完存读档探测脚本。
- 判断依据：与 ISS-017 同类的 Cursor 会话探活超时。发生在工具执行之后、验收结论写出之前，不是模型给出了错误的通过/不通过判断。usage 该时刻 input/output 仍为 0，不能据此判断模型是否已开始生成。
- 影响：存读档核验未完成，没有验收结论，也没有向 Developer 分派。例行盯梢随后催其从已有进度继续。
- 状态：observed
- 来源：Director memory/log/2026-11-12.md 00:25；usage 00:25:53 +08；线程事件 turn d9712cf1；`accept-shots/saveload-report.json`

### ISS-020 · 2026-11-12 00:25:00（上海时间）

- 对象：Developer；引擎 `cursor` / `auto`
- 分类：`product`
- 是否模型问题：尚不能判断（置信度 medium）
- 现象：从 ADV 或存档菜单点「标题」并确认「是」后，没有回到《雨夜回声》官方标题菜单（开始游戏 / 读取存档等），而是进入 WebGAL 彩蛋页 **Yoozle / Webgal Search / Feeling Lucky**，`document.title` 变为 `Yoozle Search`。更早的 00:25 探测里，`J-back-title.png`、`K-load-panel.png`、`L-after-load.png` 已是同一类搜索页；当时 `saveload-report.json` 的 `ok` 为 false，但又与 `loadRestoredADV` 等字段矛盾，尚不能确定是脚本点错还是产品缺口。
- 判断依据：主策划在 00:29 催促后续验，于 00:31–00:32 独立复核并给出结论：这是真实缺口，不是探测假阴性。`accept-shots/title-yes-report.json`（00:31）中点击「是」后 `title` 为 `Yoozle Search`，`hasStart`/`hasLoad` 为 false，`ok` 为 false；`title-load-report.json` 中局内读档可通过，但 `returnedToGameTitle`、`controlBarTitleOk` 为 false。已通过项为官方标题页进 ADV、底部对话框、点击推进、占位立绘/舞台、回想、正式存档、局内读档。根因仍可能是引擎彩蛋被误触发或集成配置问题，Developer 的修复回合随即被 ISS-021 打断，因此仍不把它记成「模型不会做」。
- 影响：一度阻断验收并触发对 Developer 的修复分派；该分派被 ISS-021 超时打断，但重验后认定不必再修。独立验收随后通过。
- 状态：resolved（假阴性）；处理：主策划 00:38–00:39 用禁止 Escape 的清洁脚本重验，确认返回的是《雨夜回声》标题菜单，标题页读档可恢复 ADV。
- 来源：Director 00:32 验收结论与 MEMORY.md；`accept-shots/title-yes-report.json`、`title-load-report.json`、`S-after-yes-title.png`；先前 saveload 报告与 J/K/L 截图；例行盯梢 00:38 记录
- 补充：2026-11-12 00:38（上海时间）例行盯梢根据主策划 00:32 独立验收结论，将本条从「证据矛盾、尚未核清」更正为已确认的返回标题缺口。
- 补充：2026-11-12 00:57（上海时间）例行盯梢根据主策划 00:39 结论与清洁截图，将本条更正为验收脚本假阴性。依据：`CLEAN-D-after-yes.png` 为官方标题菜单（开始游戏 / 继续游戏 / 游戏选项 / 读取存档 / 退出游戏）；`CLEAN-E-title-load.png` 为正式读档面板（存档位 2，顾舟对白，00:38:40）；`CLEAN-F-after-title-load.png` 已回到 ADV（校门·雨夜、姓名条「顾舟」、底部对话框、控制栏）。根因是探测脚本误按 `Escape`，触发 WebGAL 老板键 / panic 彩蛋「Yoozle / Webgal Search」，不是产品缺口，也不是模型不会做。需注意 `title-clean-report.json` 仍把 `titleLoadRestores` 记为 false、整体 `ok` 为 false，但与 `CLEAN-F` 目视结果不符，属于脚本文本匹配再一次假阴性（WebGAL 拆字导致 `hasADV` 漏检），不能压过截图。

### ISS-021 · 2026-11-12 00:37:05（上海时间）

- 对象：Developer；引擎 `cursor` / `auto`
- 分类：`provider_channel`
- 是否模型问题：否（置信度 high）
- 现象：主策划分派「只修返回标题 / 标题读档」后，Developer 新工作线程 `da52bd61` 在修复过程中出现 `RetriableError: [unavailable] PING timed out`。本回合已使用 Terminal、MCP、Read File、grep、Find；工具调用 24 次均成功。中断前运行时提示 “Cursor has sent nothing for 3 min”，随后超时。没有新的游戏代码改动或提交，HEAD 仍为 `7c8346c`。
- 判断依据：与 ISS-019 同类的 Cursor 会话探活超时。打断的是修复工作，不是 Developer 给出了错误实现结论。usage 该时刻 input/output 为 0，不能据此判断模型是否已开始生成。任务在系统里被记成 completed/done，但结果文本就是这条超时错误。
- 影响：返回标题缺口尚未修复。主策划根任务在 00:37:06 自动续开第 2 回合，正在处理这次结算，监督侧未再催促，以免打断进行中的回合。
- 状态：observed
- 来源：Developer memory/log/2026-11-12.md 00:37；usage 00:37:05 +08；线程事件 turn d7bde714；assignment 020d6955

## 汇总

- 合计 21 条：判定为模型/代理相关 6 条，非模型 15 条，根因未定 0 条（ISS-018、ISS-020 均已更正为验收脚本假阴性，非模型；ISS-005 能力判断仍成立，但返工已验收通过）。
- 分类计数：controller_config 1，model_behavior 4，model_capability 2，relay_upstream 1，provider_channel 10，provider_quota_or_capacity 1，product 2（其中 ISS-018、ISS-020 后更正为探测假阴性）
- 当前仍开放：无。验收相关产品项均已关闭。GitHub / Pages 仍为旧自制界面，这是发布动作未做，不是未关闭的缺陷条目。
- Cursor 通道类超时（ISS-009 至 ISS-013、ISS-015 至 ISS-017、ISS-019、ISS-021）在切到 Cursor 后密集出现，是拖慢验收的主要非模型因素。
- 主策划于 2026-11-12 00:39（上海时间）对本地 HEAD `7c8346c` 独立验收通过。正式报告：`/workspace/touko-eval/Touko-Real-World-Stress-Eval-Report.md`。
