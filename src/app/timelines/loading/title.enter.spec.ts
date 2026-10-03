import { describe, expect, it } from 'vitest';
import { titleEnter, TitleEnterRefs } from './title.enter';

describe('titleEnter', () => {
  it('should create gsap timeline with title enter animations', () => {
    const refs: TitleEnterRefs = {
      titleLight: document.createElement('div'),
      letters: [document.createElement('span'), document.createElement('span')],
    };

    const tl = titleEnter(refs);
    expect(tl).toBeDefined();
    expect(tl.duration()).toBeGreaterThan(0);
  });
});
