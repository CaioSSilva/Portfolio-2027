import gsap from 'gsap';

export interface BarEnterRefs {
  barDark: HTMLElement;
  barLight: HTMLElement;
}

export function barEnter(refs: BarEnterRefs): gsap.core.Timeline {
  return gsap.timeline().from([refs.barDark, refs.barLight], {
    opacity: 0,
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.4,
    stagger: 0.08,
    ease: 'power2.out',
  });
}
