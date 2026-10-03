import { AfterViewInit, Component, ElementRef, inject, OnDestroy, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AboutSlideIndex } from '../../interfaces/about-slider';
import { AboutSliderService } from '../../services/about-slider';
import { Modal } from '../../shared/components/modal/modal';
import { SliderWindow } from './slider-window/slider-window';

@Component({
  imports: [TranslatePipe, Modal, SliderWindow],
  selector: 'app-about-slider',
  styleUrl: './about-slider.scss',
  templateUrl: './about-slider.html',
})
export class AboutSlider implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly sliderService = inject(AboutSliderService);
  protected readonly isModalOpen = signal(false);
  protected readonly osUrl = 'https://portfolio-caios.vercel.app';
  protected readonly roomUrl = 'https://portfolio-room-caiossilva.vercel.app/';
  protected activeTargetUrl = this.osUrl;

  protected get slide() {
    return this.sliderService.slide;
  }

  protected goTo(index: AboutSlideIndex): void {
    this.sliderService.goTo(index);
  }

  protected handleItemClick(event: MouseEvent, targetUrl: string): void {
    if (this.isMobileView()) {
      event.preventDefault();
      this.activeTargetUrl = targetUrl;
      this.isModalOpen.set(true);
    }
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }

  protected confirmOpenTarget(): void {
    this.isModalOpen.set(false);
    window.open(this.activeTargetUrl, '_blank', 'noopener,noreferrer');
  }

  private isMobileView(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  private touchStartX = 0;
  private touchStartY = 0;
  private touchIsHorizontal: boolean | null = null;

  private onTouchStart = (e: TouchEvent) => {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchIsHorizontal = null;
  };

  private onTouchMove = (e: TouchEvent) => {
    const dx = e.touches[0].clientX - this.touchStartX;
    const dy = e.touches[0].clientY - this.touchStartY;
    if (this.touchIsHorizontal === null) {
      if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
      this.touchIsHorizontal = Math.abs(dx) >= Math.abs(dy);
    }
    if (this.touchIsHorizontal) e.preventDefault();
  };

  private onTouchEnd = (e: TouchEvent) => {
    if (!this.touchIsHorizontal) return;
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(dx) < 30) return;
    if (dx < 0 && this.slide() < 2) this.goTo((this.slide() + 1) as AboutSlideIndex);
    else if (dx > 0 && this.slide() > 0) this.goTo((this.slide() - 1) as AboutSlideIndex);
    this.touchIsHorizontal = null;
  };

  private readonly DRAG_THRESHOLD = 5;
  private didDrag = false;
  private mouseStartX = 0;
  private mouseDown = false;

  private onMouseDown = (e: MouseEvent) => {
    this.mouseDown = true;
    this.didDrag = false;
    this.mouseStartX = e.clientX;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.mouseDown) return;
    const dx = Math.abs(e.clientX - this.mouseStartX);
    if (dx > this.DRAG_THRESHOLD) {
      this.didDrag = true;
    }
  };

  private onMouseUp = (e: MouseEvent) => {
    if (!this.mouseDown) return;
    this.mouseDown = false;
    const dx = e.clientX - this.mouseStartX;
    if (Math.abs(dx) < 30) return;
    if (dx < 0 && this.slide() < 2) this.goTo((this.slide() + 1) as AboutSlideIndex);
    else if (dx > 0 && this.slide() > 0) this.goTo((this.slide() - 1) as AboutSlideIndex);
  };

  private onClickCapture = (e: MouseEvent) => {
    if (this.didDrag) {
      e.stopPropagation();
      e.preventDefault();
      this.didDrag = false;
    }
  };

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    el.addEventListener('touchstart', this.onTouchStart, { passive: true });
    el.addEventListener('touchmove', this.onTouchMove, { passive: false });
    el.addEventListener('touchend', this.onTouchEnd, { passive: true });
    el.addEventListener('mousedown', this.onMouseDown);
    el.addEventListener('mousemove', this.onMouseMove);
    el.addEventListener('mouseup', this.onMouseUp);
    el.addEventListener('mouseleave', this.onMouseUp);
    el.addEventListener('click', this.onClickCapture, { capture: true });
  }

  ngOnDestroy(): void {
    const el = this.host.nativeElement;
    el.removeEventListener('touchstart', this.onTouchStart);
    el.removeEventListener('touchmove', this.onTouchMove);
    el.removeEventListener('touchend', this.onTouchEnd);
    el.removeEventListener('mousedown', this.onMouseDown);
    el.removeEventListener('mousemove', this.onMouseMove);
    el.removeEventListener('mouseup', this.onMouseUp);
    el.removeEventListener('mouseleave', this.onMouseUp);
    el.removeEventListener('click', this.onClickCapture, { capture: true } as EventListenerOptions);
  }
}
