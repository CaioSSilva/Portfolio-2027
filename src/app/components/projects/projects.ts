import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faStar, faTableCells, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { GithubService } from '../../services/github';
import { Project } from '../../interfaces/github';

@Component({
  imports: [TranslatePipe, FaIconComponent],
  selector: 'app-projects',
  styleUrl: './projects.scss',
  templateUrl: './projects.html',
})
export class Projects implements AfterViewInit, OnDestroy {
  @ViewChild('track') private track!: ElementRef<HTMLElement>;

  private readonly github = inject(GithubService);

  protected readonly githubUrl = 'https://github.com/caiossilva';
  protected readonly projects = signal<Project[]>([]);

  protected readonly faGithub = faGithub;
  protected readonly faStar = faStar;
  protected readonly faTableCells = faTableCells;
  protected readonly faArrowRight = faArrowRight;

  constructor() {
    this.github.getRepos().subscribe((repos) => this.projects.set(repos));
  }

  private readonly DRAG_THRESHOLD = 5;
  private didDrag = false;

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  private onMouseDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.didDrag = false;
    this.startX = e.pageX - this.track.nativeElement.offsetLeft;
    this.scrollLeft = this.track.nativeElement.scrollLeft;
    this.track.nativeElement.style.cursor = 'grabbing';
  };

  private onMouseLeaveOrUp = () => {
    this.isDragging = false;
    this.track.nativeElement.style.cursor = 'grab';
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    e.preventDefault();
    const x = e.pageX - this.track.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.2;
    if (Math.abs(walk) > this.DRAG_THRESHOLD) this.didDrag = true;
    this.track.nativeElement.scrollLeft = this.scrollLeft - walk;
  };

  private touchStartX = 0;
  private touchStartY = 0;
  private touchScrollLeft = 0;
  private touchIsHorizontal: boolean | null = null;

  private onTouchStart = (e: TouchEvent) => {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchScrollLeft = this.track.nativeElement.scrollLeft;
    this.touchIsHorizontal = null;
    this.didDrag = false;
  };

  private onTouchMove = (e: TouchEvent) => {
    const dx = e.touches[0].clientX - this.touchStartX;
    const dy = e.touches[0].clientY - this.touchStartY;

    if (this.touchIsHorizontal === null) {
      if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
      this.touchIsHorizontal = Math.abs(dx) >= Math.abs(dy);
    }

    if (!this.touchIsHorizontal) return;

    e.preventDefault();
    if (Math.abs(dx) > this.DRAG_THRESHOLD) this.didDrag = true;
    this.track.nativeElement.scrollLeft = this.touchScrollLeft - dx;
  };

  private onTouchEnd = () => {
    this.touchIsHorizontal = null;
  };

  private onClickCapture = (e: MouseEvent) => {
    if (this.didDrag) {
      e.stopPropagation();
      e.preventDefault();
      this.didDrag = false;
    }
  };

  ngAfterViewInit(): void {
    const el = this.track.nativeElement;

    el.addEventListener('mousedown', this.onMouseDown);
    el.addEventListener('mouseleave', this.onMouseLeaveOrUp);
    el.addEventListener('mouseup', this.onMouseLeaveOrUp);
    el.addEventListener('mousemove', this.onMouseMove);
    el.addEventListener('click', this.onClickCapture, { capture: true });

    el.addEventListener('touchstart', this.onTouchStart, { passive: true });
    el.addEventListener('touchmove', this.onTouchMove, { passive: false });
    el.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  ngOnDestroy(): void {
    const el = this.track.nativeElement;

    el.removeEventListener('mousedown', this.onMouseDown);
    el.removeEventListener('mouseleave', this.onMouseLeaveOrUp);
    el.removeEventListener('mouseup', this.onMouseLeaveOrUp);
    el.removeEventListener('mousemove', this.onMouseMove);
    el.removeEventListener('click', this.onClickCapture, { capture: true } as EventListenerOptions);

    el.removeEventListener('touchstart', this.onTouchStart);
    el.removeEventListener('touchmove', this.onTouchMove);
    el.removeEventListener('touchend', this.onTouchEnd);
  }
}
