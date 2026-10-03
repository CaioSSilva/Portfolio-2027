import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TranslatePipe } from '@ngx-translate/core';
import { BallLoopHandle } from '../../interfaces/ball-loop';
import { ballLoop } from '../../timelines/ball-loop/ball.loop';
import { ShadowButton } from '../../shared/components/shadow-button/shadow-button';
import { Modal } from '../../shared/components/modal/modal';

gsap.registerPlugin(MotionPathPlugin);

@Component({
  imports: [TranslatePipe, ShadowButton, Modal],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements AfterViewInit, OnDestroy {
  @ViewChild('ball') private ball!: ElementRef<SVGEllipseElement>;
  @ViewChild('pathLeft') private pathLeft!: ElementRef<SVGPathElement>;
  @ViewChild('pathRight') private pathRight!: ElementRef<SVGPathElement>;

  @ViewChild('ballMobile') private ballMobile!: ElementRef<SVGEllipseElement>;
  @ViewChild('pathLeftMobile') private pathLeftMobile!: ElementRef<SVGPathElement>;
  @ViewChild('pathRightMobile') private pathRightMobile!: ElementRef<SVGPathElement>;

  protected cvModalOpen = false;

  protected openCvModal(): void {
    this.cvModalOpen = true;
  }

  protected closeCvModal(): void {
    this.cvModalOpen = false;
  }

  private handle?: BallLoopHandle;
  private mobileQuery =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(max-width: 768px)')
      : null;
  private boundOnResize = () => this.initBall();

  ngAfterViewInit(): void {
    this.initBall();
    this.mobileQuery?.addEventListener('change', this.boundOnResize);
  }

  private initBall(): void {
    this.handle?.destroy();
    if (this.mobileQuery?.matches) {
      this.handle = ballLoop(
        this.ballMobile.nativeElement,
        this.pathLeftMobile.nativeElement,
        this.pathRightMobile.nativeElement,
        true,
      );
    } else {
      this.handle = ballLoop(
        this.ball.nativeElement,
        this.pathLeft.nativeElement,
        this.pathRight.nativeElement,
        false,
      );
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery?.removeEventListener('change', this.boundOnResize);
    this.handle?.destroy();
  }
}
