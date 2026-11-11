import type { Story } from './types';
export const SAVE_KEY = 'touko-galgame-save-v1';
export type Save = { storyVersion: string; nodeId: string; flags: Record<string, number> };
export function loadSave(story: Story): Save | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const save: unknown = JSON.parse(raw);
    if (!save || typeof save !== 'object') return null;
    const candidate = save as Partial<Save>;
    const validNode = story.nodes.some(node => node.id === candidate.nodeId);
    const validFlags = candidate.flags && typeof candidate.flags === 'object'
      && Object.values(candidate.flags).every(value => typeof value === 'number' && Number.isFinite(value));
    if (candidate.storyVersion !== story.version || !validNode || !validFlags) return null;
    return candidate as Save;
  } catch {
    return null;
  }
}
export function saveGame(save: Save): void { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }
export function clearSave(): void { localStorage.removeItem(SAVE_KEY); }
