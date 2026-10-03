import { Component, input, output } from '@angular/core';

export type ShadowButtonVariant = 'primary' | 'dark' | 'secondary';

@Component({
  imports: [],
  selector: 'app-shadow-button',
  styleUrl: './shadow-button.scss',
  templateUrl: './shadow-button.html',
})
export class ShadowButton {
  readonly label = input<string>('');
  readonly href = input<string | null>(null);
  readonly target = input<string>('_self');
  readonly rel = input<string>('noopener noreferrer');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input<boolean>(false);
  readonly variant = input<ShadowButtonVariant>('primary');
  readonly frontColor = input<string | null>(null);
  readonly shadowColor = input<string | null>(null);
  readonly textColor = input<string | null>(null);
  readonly padding = input<string | null>(null);
  readonly fullWidth = input<boolean>(false);

  readonly clicked = output<MouseEvent>();

  protected onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
