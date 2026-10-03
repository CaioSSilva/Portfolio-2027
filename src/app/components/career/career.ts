import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faBriefcase,
  faGraduationCap,
  faCalendar,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  imports: [TranslatePipe, FaIconComponent],
  selector: 'app-career',
  styleUrl: './career.scss',
  templateUrl: './career.html',
})
export class Career {
  protected readonly faBriefcase = faBriefcase;
  protected readonly faGraduationCap = faGraduationCap;
  protected readonly faCalendar = faCalendar;
  protected readonly faLocationDot = faLocationDot;

  protected readonly jobs = [0, 1] as const;
  protected readonly jobBullets: readonly number[] = [5, 5];

  protected readonly education = [0, 1] as const;
  protected readonly educationBullets: readonly number[] = [3, 1];

  protected toBullets(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }
}
