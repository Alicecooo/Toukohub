import type { Story } from './types';

export function validateStory(value: unknown): Story {
  if (!value || typeof value !== 'object') throw new Error('剧情数据格式无效');
  const story = value as Partial<Story>;
  if (typeof story.version !== 'string' || !story.version || typeof story.startNode !== 'string'
    || !story.characters || typeof story.characters !== 'object' || !Array.isArray(story.nodes)) {
    throw new Error('剧情数据缺少必要字段');
  }

  const ids = new Set<string>();
  for (const node of story.nodes) {
    if (!node || typeof node.id !== 'string' || !node.id || ids.has(node.id) || typeof node.text !== 'string') {
      throw new Error('剧情节点无效或 ID 重复');
    }
    ids.add(node.id);
  }
  if (!ids.has(story.startNode)) throw new Error('剧情起始节点不存在');

  for (const node of story.nodes) {
    for (const choice of node.choices ?? []) {
      if (typeof choice.text !== 'string' || typeof choice.next !== 'string' || !ids.has(choice.next)) {
        throw new Error(`剧情选项引用了不存在的节点：${node.id}`);
      }
    }
    if (node.ending && typeof node.ending.title !== 'string') throw new Error(`结局节点无效：${node.id}`);
  }
  return story as Story;
}

export async function loadStory(): Promise<Story> {
  const response = await fetch(`${import.meta.env.BASE_URL}story.json`);
  if (!response.ok) throw new Error(`剧情加载失败 (${response.status})`);
  return validateStory(await response.json());
}
