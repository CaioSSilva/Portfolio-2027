import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Modal } from './modal';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal],
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test Modal');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and description', () => {
    fixture.componentRef.setInput('description', 'Modal description text');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal-card__title')?.textContent).toContain('Test Modal');
    expect(compiled.querySelector('.modal-card__description')?.textContent).toContain(
      'Modal description text',
    );
  });

  it('should emit confirmed when confirm button clicked', () => {
    let emitted = false;
    component.confirmed.subscribe(() => {
      emitted = true;
    });

    const confirmBtn = fixture.nativeElement.querySelector(
      '.modal-card__btn--confirm',
    ) as HTMLButtonElement;
    confirmBtn.click();

    expect(emitted).toBe(true);
  });

  it('should emit cancelled when cancel button or backdrop clicked', () => {
    let cancelCount = 0;
    component.cancelled.subscribe(() => {
      cancelCount++;
    });

    const cancelBtn = fixture.nativeElement.querySelector(
      '.modal-card__btn--cancel',
    ) as HTMLButtonElement;
    cancelBtn.click();

    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop') as HTMLElement;
    backdrop.click();

    expect(cancelCount).toBe(2);
  });

  it('should disable body scroll on init and restore on destroy', () => {
    expect(document.body.style.overflow).toBe('hidden');

    fixture.destroy();

    expect(document.body.style.overflow).toBe('');
  });
});
