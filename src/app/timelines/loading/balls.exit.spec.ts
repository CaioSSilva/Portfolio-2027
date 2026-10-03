import { describe, expect, it } from 'vitest';
import { ballsExit, BallsExitRefs } from './balls.exit';

describe('ballsExit', () => {
  it('should create gsap timeline with exit animations', () => {
    const refs: BallsExitRefs = {
      circleLight: document.createElement('div'),
      circleDark: document.createElement('div'),
      otterImg: document.createElement('img'),
    };

    const tl = ballsExit(refs);
    expect(tl).toBeDefined();
    expect(tl.duration()).toBeGreaterThan(0);
  });
});
