import { describe, expect, it } from 'vitest';
import { barEnter, BarEnterRefs } from './bar.enter';

describe('barEnter', () => {
  it('should create gsap timeline with bar enter animations', () => {
    const refs: BarEnterRefs = {
      barDark: document.createElement('div'),
      barLight: document.createElement('div'),
    };

    const tl = barEnter(refs);
    expect(tl).toBeDefined();
    expect(tl.duration()).toBeGreaterThan(0);
  });
});
