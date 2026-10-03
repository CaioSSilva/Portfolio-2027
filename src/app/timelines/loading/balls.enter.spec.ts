import { describe, expect, it } from 'vitest';
import { ballsEnter, BallsEnterRefs } from './balls.enter';

describe('ballsEnter', () => {
  it('should create gsap timeline with enter animations', () => {
    const refs: BallsEnterRefs = {
      circleLight: document.createElement('div'),
      circleDark: document.createElement('div'),
      otterImg: document.createElement('img'),
    };

    const tl = ballsEnter(refs);
    expect(tl).toBeDefined();
    expect(tl.duration()).toBeGreaterThan(0);
  });
});
