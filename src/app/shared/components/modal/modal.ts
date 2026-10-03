import { Component, input, OnDestroy, OnInit, output, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  imports: [FaIconComponent],
  selector: 'app-modal',
  styleUrl: './modal.scss',
  templateUrl: './modal.html',
})
export class Modal implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);

  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly confirmText = input<string>('Confirm');
  readonly cancelText = input<string>('Cancel');
  readonly showCancel = input<boolean>(true);
  readonly closeOnly = input<boolean>(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly faXmark = faXmark;

  private originalOverflow = '';

  ngOnInit(): void {
    this.originalOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = this.originalOverflow;
  }

  protected onConfirm(): void {
    this.confirmed.emit();
  }

  protected onCancel(): void {
    this.cancelled.emit();
  }
}
