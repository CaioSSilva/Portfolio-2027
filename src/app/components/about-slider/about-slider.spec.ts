import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import PT from '../../i18n/pt.json';
import { AboutSlider } from './about-slider';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of(PT as TranslationObject);
  }
}

describe('AboutSlider', () => {
  let component: AboutSlider;
  let fixture: ComponentFixture<AboutSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSlider],
      providers: [
        provideTranslateService({
          lang: 'pt',
          loader: () => new StaticTranslateLoader(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal when clicking OS link on mobile', () => {
    window.innerWidth = 500;
    const event = new MouseEvent('click', { cancelable: true });
    const link = fixture.nativeElement.querySelector('.slider-window') as HTMLAnchorElement;

    link.dispatchEvent(event);
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('app-modal');
    expect(modal).toBeTruthy();
  });

  it('should open modal when clicking Room link on mobile', () => {
    window.innerWidth = 500;
    const event = new MouseEvent('click', { cancelable: true });
    const links = fixture.nativeElement.querySelectorAll('.slider-window');
    const roomLink = links[1] as HTMLAnchorElement;

    roomLink.dispatchEvent(event);
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('app-modal');
    expect(modal).toBeTruthy();
  });

  it('should prevent click when dragging with mouse', () => {
    const el = fixture.nativeElement as HTMLElement;
    const link = el.querySelector('.slider-window') as HTMLAnchorElement;

    // Simulate drag start and move beyond threshold
    el.dispatchEvent(new MouseEvent('mousedown', { clientX: 100 }));
    el.dispatchEvent(new MouseEvent('mousemove', { clientX: 150 }));
    el.dispatchEvent(new MouseEvent('mouseup', { clientX: 150 }));

    const clickEvent = new MouseEvent('click', { cancelable: true, bubbles: true });
    link.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
  });
});
