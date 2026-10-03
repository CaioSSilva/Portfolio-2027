import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ShadowButton } from './shadow-button';

describe('ShadowButton', () => {
  let component: ShadowButton;
  let fixture: ComponentFixture<ShadowButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShadowButton],
    }).compileComponents();

    fixture = TestBed.createComponent(ShadowButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button by default', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
  });

  it('should render an anchor when href is provided', () => {
    fixture.componentRef.setInput('href', 'https://example.com');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('https://example.com');
  });

  it('should emit clicked output when clicked', () => {
    let clicked = false;
    component.clicked.subscribe(() => {
      clicked = true;
    });

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();

    expect(clicked).toBe(true);
  });
});
