import { describe, expect, it } from 'vitest';
import { titleExit, TitleExitRefs } from './title.exit';

describe('titleExit', () => {
  it('should create gsap timeline with title exit animations', () => {
    const refs: TitleExitRefs = {
      titleLight: document.createElement('div'),
      titleDark: document.createElement('div'),
      letters: [document.createElement('span'), document.createElement('span')],
    };

    const tl = titleExit(refs);
    expect(tl).toBeDefined();
    expect(tl.duration()).toBeGreaterThan(0);
  });
});
