# 《雨夜回声》剧情设定与 QA

## 世界观

临海的青岚学园旧馆因七年前的火灾封闭。雨夜里，旧馆方向反复传来三声回响；它并非超自然现象，而是通风管与旧广播线路共振的结果。转学生顾舟在父亲留下的录音中听见同样的声音，因而追查火灾当晚被遗漏的录音、检修记录与学生证词。故事以校园恋爱氛围中的信任建立为情感主线，以档案缺失和证词隐瞒构成悬疑主线。

## 角色档案

| 角色 | 身份与性格 | 剧情作用 |
|---|---|---|
| 顾舟 | 转学生；带着父亲留下的旧录音来到青岚学园 | 玩家视角与调查核心，在公开真相、保护证人和冒险之间作出选择 |
| 林激 | 图书委员；内敛寡言，隐瞒姐姐曾在火灾当晚值班并提交证词的秘密 | 通过旧报刊、借阅单与证词推动调查，也呈现信任与坦白的角色线 |
| 夏遥 | 学生会成员；直率坦诚 | 通过学生会通知、疏散图和档案手续调查事故，推动证据保全与公开 |

## 剧情结构与节点

剧情数据位于 `content/story.json`，顶层结构为 `{ version, startNode, characters, nodes }`。入口节点为 `prologue`；每个节点使用 `id`、`background`、`speaker`、`text`，并可包含 `choices` 或 `ending`。选项通过 `next` 指向后续节点，可选 `effects.trust` 记录关系变化。结局节点以 `ending.id` 标记结局类型。

全篇共 **14 个节点**：

- 公共开场与调查入口：`prologue`、`library`、`council`
- 两条角色线：林激线 `lin_line`；夏遥线 `xia_line`
- 汇合调查与抉择：`public_records`、`tape_room`、`broadcast_room`、`evidence_review`、`sealed_hall`
- 四个终局：`truth`、`echo`、`spring`、`nightmare`

公共线从 `prologue` 分流至林激与夏遥的调查，再通过公开档案、录音或广播检修记录汇合。`evidence_review` 提供共同提交证据、校内说明、暂时封存和夜闯旧馆等选择；`sealed_hall` 可返回证据复核或进入 `nightmare`。

## 四结局

1. **truth｜雨停之后的真相**：三人提交录音、证词和检修页，调查重启。
2. **echo｜回声中的约定**：暂不公开录音，备份证据并约定不再抹去任何人的声音。
3. **spring｜不再沉默的春天**：校内复核证词、公开道歉，旧馆重新开放。
4. **nightmare｜雨夜回声**：顾舟独自深入封锁区，留下新的未解磁带。

## 剧情 QA（2026-11-11）

验证 `content/story.json` 可解析，节点 ID 唯一，起始节点存在；所有 `choices[].next` 均指向现存节点；从 `prologue` 遍历所有选择可达全部节点及四个结局。验证脚本：

```bash
node - <<'NODE'
const fs = require('fs');
const story = JSON.parse(fs.readFileSync('content/story.json', 'utf8'));
const ids = story.nodes.map(n => n.id);
const idSet = new Set(ids);
if (idSet.size !== ids.length) throw new Error('duplicate node id');
if (!idSet.has(story.startNode)) throw new Error('startNode missing');
for (const n of story.nodes) {
  for (const c of n.choices || []) if (!idSet.has(c.next)) throw new Error(`${n.id} -> ${c.next} missing`);
}
const byId = new Map(story.nodes.map(n => [n.id, n]));
const seen = new Set([story.startNode]);
const queue = [story.startNode];
while (queue.length) {
  const node = byId.get(queue.shift());
  for (const c of node.choices || []) if (!seen.has(c.next)) { seen.add(c.next); queue.push(c.next); }
}
const endings = story.nodes.filter(n => n.ending).map(n => n.ending.id).sort();
const expected = ['echo', 'nightmare', 'spring', 'truth'];
if (JSON.stringify(endings) !== JSON.stringify(expected)) throw new Error(`unexpected endings: ${endings}`);
if (endings.some(id => !seen.has(id))) throw new Error('ending unreachable');
if (seen.size !== story.nodes.length) throw new Error('unreachable nodes exist');
console.log(JSON.stringify({ json: 'valid', nodes: story.nodes.length, reachable: seen.size, endings }, null, 2));
NODE
```

实际验证输出：

```json
{
  "json": "valid",
  "nodes": 14,
  "reachable": 14,
  "endings": ["echo", "nightmare", "spring", "truth"]
}
```

本次剧情文件范围仅为 `content/story.json` 与 `docs/STORY.md`；没有修改应用实现文件，也没有执行 push。
