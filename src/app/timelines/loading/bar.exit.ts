import gsap from 'gsap';

export interface BarExitRefs {
  barDark: HTMLElement;
  barLight: HTMLElement;
}

export function barExit(refs: BarExitRefs): gsap.core.Timeline {
  return gsap.timeline().to([refs.barDark, refs.barLight], {
    opacity: 0,
    scaleX: 0.4,
    transformOrigin: 'center center',
    duration: 0.3,
    stagger: 0.06,
    ease: 'power2.in',
  });
}
