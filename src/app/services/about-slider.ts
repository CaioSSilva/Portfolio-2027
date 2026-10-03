import { Injectable, signal } from '@angular/core';
import { AboutSlideIndex } from '../interfaces/about-slider';

@Injectable({ providedIn: 'root' })
export class AboutSliderService {
  readonly slide = signal<AboutSlideIndex>(0);

  goTo(index: AboutSlideIndex): void {
    this.slide.set(index);
  }
}
