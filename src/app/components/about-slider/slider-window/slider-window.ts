import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-slider-window',
  styleUrl: './slider-window.scss',
  templateUrl: './slider-window.html',
})
export class SliderWindow {
  readonly imageSrc = input.required<string>();
  readonly imageAlt = input<string>('');
  readonly href = input.required<string>();

  readonly itemClick = output<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    this.itemClick.emit(event);
  }
}
