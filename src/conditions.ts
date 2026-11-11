import type { Choice, Condition, StateEffects } from './types';

function matches(value: number, condition: Condition): boolean {
  if (typeof condition === 'number') return value === condition;
  return (condition.eq === undefined || value === condition.eq)
    && (condition.gt === undefined || value > condition.gt)
    && (condition.gte === undefined || value >= condition.gte)
    && (condition.lt === undefined || value < condition.lt)
    && (condition.lte === undefined || value <= condition.lte);
}

export function isChoiceAvailable(choice: Choice, flags: Record<string, number>): boolean {
  return Object.entries(choice.conditions ?? {}).every(([key, condition]) => {
    if (isCondition(condition)) {
      return matches(flags[key] ?? 0, condition as Condition);
    }
    return Object.entries(condition).every(([nestedKey, nestedCondition]) =>
      isCondition(nestedCondition) && matches(flags[`${key}.${nestedKey}`] ?? 0, nestedCondition));
  });
}

function isCondition(value: unknown): value is Condition {
  if (typeof value === 'number') return true;
  return typeof value === 'object' && value !== null
    && Object.keys(value).every(key => ['eq', 'gt', 'gte', 'lt', 'lte'].includes(key))
    && Object.values(value).every(number => typeof number === 'number' && Number.isFinite(number));
}

export function applyEffects(flags: Record<string, number>, effects: StateEffects = {}): Record<string, number> {
  const updated = { ...flags };
  const visit = (values: StateEffects, prefix = '') => {
    for (const [key, value] of Object.entries(values)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'number') updated[path] = (updated[path] ?? 0) + value;
      else visit(value, path);
    }
  };
  visit(effects);
  return updated;
}
