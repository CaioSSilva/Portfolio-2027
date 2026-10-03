import gsap from 'gsap';

export interface TitleEnterRefs {
  titleLight: HTMLElement;
  letters: HTMLElement[];
}

export function titleEnter(refs: TitleEnterRefs): gsap.core.Timeline {
  return gsap
    .timeline()
    .from(refs.titleLight, {
      opacity: 0,
      x: -8,
      y: 8,
      duration: 0.3,
      ease: 'power2.out',
    })
    .from(
      refs.letters,
      {
        opacity: 0,
        y: 8,
        duration: 0.4,
        stagger: 0.07,
        ease: 'power2.out',
      },
      '-=0.15',
    );
}
