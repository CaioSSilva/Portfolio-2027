import gsap from 'gsap';

export interface BallsEnterRefs {
  circleLight: HTMLElement;
  circleDark: HTMLElement;
  otterImg: HTMLElement;
}

export function ballsEnter(refs: BallsEnterRefs): gsap.core.Timeline {
  return gsap
    .timeline()
    .from([refs.circleLight, refs.circleDark], {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    })
    .from(
      refs.otterImg,
      {
        opacity: 0,
        y: -12,
        duration: 0.35,
        ease: 'power2.out',
      },
      '-=0.2',
    );
}
