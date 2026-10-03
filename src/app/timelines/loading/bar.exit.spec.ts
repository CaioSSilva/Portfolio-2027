import { describe, expect, it } from 'vitest';
import { barExit, BarExitRefs } from './bar.exit';

describe('barExit', () => {
  it('should create gsap timeline with bar exit animations', () => {
    const refs: BarExitRefs = {
      barDark: document.createElement('div'),
      barLight: document.createElement('div'),
    };

    const tl = barExit(refs);
    expect(tl).toBeDefined();
    expect(tl.duration()).toBeGreaterThan(0);
  });
});
