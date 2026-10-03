import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  readonly progress = signal(0);
  readonly done = signal(false);

  load(afterEnter: Promise<void>): void {
    this.done.set(false);
    this.progress.set(0);

    afterEnter.then(() => {
      const interval = setInterval(() => {
        const current = this.progress();

        if (current >= 100) {
          clearInterval(interval);
          return;
        }

        this.progress.set(current + 10);
      }, 300);
    });
  }

  finish(animationDuration: number): void {
    setTimeout(() => this.done.set(true), animationDuration);
  }
}
