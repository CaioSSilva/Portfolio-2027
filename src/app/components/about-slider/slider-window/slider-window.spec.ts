import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SliderWindow } from './slider-window';

describe('SliderWindow', () => {
  let component: SliderWindow;
  let fixture: ComponentFixture<SliderWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderWindow],
    }).compileComponents();

    fixture = TestBed.createComponent(SliderWindow);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('imageSrc', 'images/cai-os.png');
    fixture.componentRef.setInput('imageAlt', 'cai-os');
    fixture.componentRef.setInput('href', 'https://example.com');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render image and controls', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('images/cai-os.png');
    expect(img.getAttribute('alt')).toBe('cai-os');
    expect(compiled.querySelectorAll('.slider-window__dot').length).toBe(3);
  });

  it('should emit itemClick on link click', () => {
    let clicked = false;
    component.itemClick.subscribe(() => {
      clicked = true;
    });

    const link = fixture.nativeElement.querySelector('.slider-window') as HTMLAnchorElement;
    link.click();

    expect(clicked).toBe(true);
  });
});
