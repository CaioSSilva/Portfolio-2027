import gsap from 'gsap';

export interface TitleExitRefs {
  titleLight: HTMLElement;
  titleDark: HTMLElement;
  letters: HTMLElement[];
}

export function titleExit(refs: TitleExitRefs): gsap.core.Timeline {
  return gsap
    .timeline()
    .to(refs.letters, {
      opacity: 0,
      y: -8,
      duration: 0.3,
      stagger: 0.04,
      ease: 'power2.in',
    })
    .to(
      [refs.titleLight, refs.titleDark],
      {
        opacity: 0,
        y: -6,
        duration: 0.25,
        ease: 'power2.in',
      },
      '-=0.1',
    );
}
