import gsap from 'gsap';

export interface BallsExitRefs {
  circleLight: HTMLElement;
  circleDark: HTMLElement;
  otterImg: HTMLElement;
}

export function ballsExit(refs: BallsExitRefs): gsap.core.Timeline {
  return gsap.timeline().to([refs.otterImg, refs.circleLight, refs.circleDark], {
    opacity: 0,
    scale: 0.7,
    duration: 0.35,
    stagger: 0.05,
    ease: 'power2.in',
  });
}
