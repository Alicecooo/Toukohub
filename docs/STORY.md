# 《雨夜回声》WebGAL 剧情结构与 QA

## 世界与主题

临海的青岚学园旧馆因七年前的火灾封闭。雨夜里旧馆方向反复传来三声回响；它来自通风管与旧广播线路共振。转学生顾舟在父亲留下的录音中听到同样声音，追查事故当晚未进入结案报告的录音、检修页与学生证词。情感主线是顾舟与林激、夏遥逐步建立信任；悬疑主线是查明安全门故障被忽略及证词、档案为何缺失。

## 角色

| 角色 | 身份与性格 | 剧情作用 |
|---|---|---|
| 顾舟 | 转学生，带着父亲留下的旧录音来到青岚学园 | 玩家视角；在真相、证人保护与冒险之间选择 |
| 林激 | 内敛寡言的图书委员；姐姐曾在火灾当晚值班并提交证词 | 旧报刊、借阅单、证词线；信任与坦白主题 |
| 夏遥 | 直率坦诚的学生会成员 | 疏散图、档案手续、线路检修调查 |

## WebGAL 脚本路线

入口为 `public/game/scene/start.txt`（WebGAL 默认入口）。场景以官方脚本逐句对白演出，背景引用 `background/*.svg`，立绘引用 `figure/*.svg`；对话结束后才出现 `choose`（多选项用 `|` 写在同一行）。脚本用 `changeFigure` 完成左/中/右站位与表情切换（`changeFigureDiff`），命令不加前导 `-`。人物关系不是数值变量门槛，而是对白与信任感的叙事后果；分支选择改变调查顺序、是否先听录音、是否保全证据及结局。

```text
start.txt
├─ 去图书馆找林激 → lin_route.txt
│  ├─ 一起听录音 → tape_room.txt ─┬→ evidence_review.txt
│  │                              └→ ending_echo.txt
│  └─ 先查公开档案 → records.txt
│                                 ├→ tape_room.txt
│                                 └→ evidence_review.txt
└─ 去学生会找夏遥 → xia_route.txt
   ├─ 按流程申请附件 → records.txt
   └─ 查广播线路 → broadcast_room.txt ─┬→ evidence_review.txt
                                        └→ sealed_hall.txt

 evidence_review.txt
 ├→ ending_truth.txt（共同提交证据、重启调查）
 ├→ ending_spring.txt（校内说明、复核证词、公开道歉）
 ├→ ending_echo.txt（封存录音、尊重当事人意愿）
 └→ sealed_hall.txt → evidence_review.txt（呼叫伙伴）
                       └→ ending_nightmare.txt（独自深入）
```

四个结局均由入口选择流程可达：**truth** 雨停之后的真相、**spring** 不再沉默的春天、**echo** 回声中的约定、**nightmare** 雨夜回声。夜闯路径允许返回证据复核，也可继续深入进入 nightmare。

## 资源契约

背景文件使用开发者固定名称：`rainy_gate.svg`、`library_rain.svg`、`student_council.svg`、`archive_library.svg`、`old_hall_exterior.svg`、`school_archive.svg`、`radio_room.svg`、`archive_room.svg`、`sealed_corridor.svg`、`school_morning.svg`、`rainy_window.svg`、`school_garden.svg`。立绘使用 `gu_neutral.svg`、`lin_neutral.svg`、`lin_worried.svg`、`lin_smile.svg`、`xia_neutral.svg`、`xia_determined.svg`、`xia_smile.svg`。标题图 `title_rain.svg`。未在脚本中另造资源名。

## QA

- `start.txt` 默认入口，所有分支目标均存在。
- 全部背景和立绘引用均含扩展名，并对应固定资源契约。
- 对白逐句出现，分支 `choose` 放在该段对白之后。
- 四个结局从 `start.txt` 经可追踪路径可达。
- 角色正式名为顾舟、林激、夏遥（脚本与本文档全文统一）。
- 本次仅维护 `public/game/scene/**/*.txt` 与 `docs/STORY.md`；不修改应用代码、运行配置、资源、`content/story.json`、`docs/PROJECT.md`。

待在集成 WebGAL 4.6.6 的工程中做实际引擎运行验证；若引擎解析器对语法给出不同结果，按运行日志修正。
