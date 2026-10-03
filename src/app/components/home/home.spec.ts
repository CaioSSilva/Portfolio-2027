import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import PT from '../../i18n/pt.json';
import { Home } from './home';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of(PT as TranslationObject);
  }
}

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideTranslateService({
          lang: 'pt',
          loader: () => new StaticTranslateLoader(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render name elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameEl = compiled.querySelector('.home__name');
    expect(nameEl?.textContent).toContain('Caio');
    expect(nameEl?.textContent).toContain('Souza');
    expect(nameEl?.textContent).toContain('Silva');
  });

  it('should render tagline', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const taglineEl = compiled.querySelector('.home__tagline');
    expect(taglineEl?.textContent).toContain('Experiência');
  });

  it('should render desktop svg', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home__svg--desktop')).toBeTruthy();
  });

  it('should render mobile svg', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home__svg--mobile')).toBeTruthy();
  });

  it('should render at least one ball element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.home__ball').length).toBeGreaterThanOrEqual(1);
  });

  it('should clean up on destroy', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});
