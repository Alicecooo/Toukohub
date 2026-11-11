# 《雨夜回声》剧情设定与 QA

## 世界观
青岚学园坐落在临海旧城区，旧校舍因七年前的火灾封锁。雨天会出现无法由校钟解释的三声回响，源自地下通风管与广播线路的共振。故事围绕转学生雨宫晴寻找失踪姐姐留下的录音展开；真相不是超自然诅咒，而是被校方封存的人证、档案和长期沉默。

## 角色档案

| 角色 | 身份 | 核心动机 | 关系路线 |
|---|---|---|---|
| 雨宫晴 | 转学生 / 女主 | 找到姐姐的下落，理解录音中的警告 | 可与所有调查者建立信任 |
| 神谷莲 | 新闻部部长 | 查清旧校舍火灾并公开证据 | 新闻部线，偏向公开真相 |
| 白石澪 | 广播部成员 | 还原母亲留下的声音，结束沉默 | 广播线，偏向和解与修复 |
| 桐生奏太 | 学生会副会长 | 保护妹妹与校内档案，同时面对隐瞒 | 档案线，偏向责任与和解 |

## 剧情结构

入口 `prologue` 提供新闻部、广播室、学生会三条调查入口。中段分别汇入 `clocktower`、`window`、`archive_truth`、`tape_truth`，再汇入 `midnight_door` 或直接进入结局。结局节点均无 `choices`，以 `ending.id` 区分四种结局：`truth`、`echo`、`spring`、`nightmare`。

## 四结局

1. **雨停之后的真相（truth）**：公开证据，事故重启调查。
2. **回声中的约定（echo）**：选择守密，留下未来再开门的约定。
3. **不再沉默的春天（spring）**：以证词和档案修复关系，逐步和解。
4. **雨夜回声（nightmare）**：独自冒险，留下新的未解磁带。

## 剧情 QA（2026-11-11）

验证命令（在仓库根目录执行）：

```bash
node - <<'NODE'
const fs = require('fs');
const story = JSON.parse(fs.readFileSync('content/story.json', 'utf8'));
const ids = new Set(story.nodes.map(n => n.id));
if (!ids.has(story.startNode)) throw new Error('startNode missing');
for (const n of story.nodes) {
  for (const c of n.choices || []) if (!ids.has(c.next)) throw new Error(`${n.id} -> ${c.next} missing`);
}
const seen = new Set([story.startNode]), q = [story.startNode];
while (q.length) for (const c of story.nodes.find(n => n.id === q.shift()).choices || [])
  if (!seen.has(c.next)) seen.add(c.next), q.push(c.next);
const endings = story.nodes.filter(n => n.ending);
if (endings.length !== 4 || endings.some(n => !seen.has(n.id))) throw new Error('four endings not reachable');
console.log({ nodes: story.nodes.length, reachable: seen.size, endings: endings.map(n => n.ending.id) });
NODE
```

结果：JSON 解析成功；`startNode` 存在且可达；所有 `choice.next` 均引用现有节点；四个结局均从 `prologue` 可达（节点 13，全部 13 个节点可达；结局 `truth`、`echo`、`spring`、`nightmare`）。

> 说明：本文件与 `content/story.json` 是本次编剧提交的范围；未修改应用代码或 `docs/PROJECT.md`。条件/效果字段采用对象结构，供应用按需累积 `trust`、`bond`、`risk`、`courage`。
