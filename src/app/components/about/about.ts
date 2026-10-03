import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AboutSliderService } from '../../services/about-slider';

@Component({
  imports: [TranslatePipe],
  selector: 'app-about',
  styleUrl: './about.scss',
  templateUrl: './about.html',
})
export class About {
  protected readonly sliderService = inject(AboutSliderService);
}
