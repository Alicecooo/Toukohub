import { describe, expect, it } from 'vitest';
import { applyEffects, isChoiceAvailable } from './conditions';

describe('state effects', () => {
  it('adds nested effects without mutating existing flags', () => {
    const flags = { 'trust.lin': 1, courage: 2 };
    expect(applyEffects(flags, { trust: { lin: 2 }, courage: -1, honesty: 1 })).toEqual({
      'trust.lin': 3,
      courage: 1,
      honesty: 1,
    });
    expect(flags).toEqual({ 'trust.lin': 1, courage: 2 });
  });
});

describe('choice conditions', () => {
  it('uses exact numeric conditions and defaults missing flags to zero', () => {
    expect(isChoiceAvailable({ text: 'x', next: 'y', conditions: { trust: 2 } }, { trust: 2 })).toBe(true);
    expect(isChoiceAvailable({ text: 'x', next: 'y', conditions: { trust: 2 } }, {})).toBe(false);
  });
  it('supports numeric ranges', () => {
    expect(isChoiceAvailable({ text: 'x', next: 'y', conditions: { trust: { gte: 2, lt: 4 } } }, { trust: 3 })).toBe(true);
    expect(isChoiceAvailable({ text: 'x', next: 'y', conditions: { trust: { gte: 2 } } }, { trust: 1 })).toBe(false);
  });
});
