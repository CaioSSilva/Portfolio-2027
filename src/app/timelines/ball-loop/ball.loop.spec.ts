import { describe, expect, it } from 'vitest';
import { ballLoop } from './ball.loop';

function makeSvgSetup(leftD: string, rightD: string) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const ball = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  const pathLeft = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const pathRight = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  pathLeft.setAttribute('d', leftD);
  pathRight.setAttribute('d', rightD);

  svg.appendChild(ball);
  svg.appendChild(pathLeft);
  svg.appendChild(pathRight);
  document.body.appendChild(svg);

  pathLeft.getTotalLength = () => 141.42;
  pathLeft.getPointAtLength = (s: number) => ({ x: s * 0.707, y: s * 0.707 }) as DOMPoint;

  pathRight.getTotalLength = () => 141.42;
  pathRight.getPointAtLength = (s: number) =>
    ({ x: 100 + s * 0.707, y: 100 + s * 0.707 }) as DOMPoint;

  return { svg, ball, pathLeft, pathRight };
}

describe('ballLoop', () => {
  it('should initialize desktop timeline and provide destroy callback', () => {
    const { svg, ball, pathLeft, pathRight } = makeSvgSetup(
      'M 0 0 L 100 100',
      'M 100 100 L 200 200',
    );

    const handle = ballLoop(ball, pathLeft, pathRight, false);

    expect(handle).toBeDefined();
    expect(handle.timeline).toBeDefined();
    expect(typeof handle.destroy).toBe('function');

    handle.destroy();
    svg.remove();
  });

  it('should initialize mobile timeline and provide destroy callback', () => {
    const { svg, ball, pathLeft, pathRight } = makeSvgSetup('M 0 0 L 100 100', 'M 0 200 L 100 200');

    const handle = ballLoop(ball, pathLeft, pathRight, true);

    expect(handle).toBeDefined();
    expect(handle.timeline).toBeDefined();
    expect(typeof handle.destroy).toBe('function');

    handle.destroy();
    svg.remove();
  });
});
