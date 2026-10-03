import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import PT from '../../i18n/pt.json';
import { About } from './about';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of(PT as TranslationObject);
  }
}

describe('About', () => {
  let component: About;
  let fixture: ComponentFixture<About>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [
        provideTranslateService({
          lang: 'pt',
          loader: () => new StaticTranslateLoader(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(About);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the section title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.about__title')?.textContent?.trim()).toBe('Sobre');
  });

  it('should render all four paragraphs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.about__text').length).toBe(4);
  });

  it('should render the signature', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.about__signature-label')?.textContent?.trim()).toBe(
      'Esse sou eu',
    );
  });
});
