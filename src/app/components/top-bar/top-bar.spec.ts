import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import PT from '../../i18n/pt.json';
import { TopBar } from './top-bar';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of(PT as TranslationObject);
  }
}

describe('TopBar', () => {
  let component: TopBar;
  let fixture: ComponentFixture<TopBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBar],
      providers: [
        provideTranslateService({
          lang: 'pt',
          loader: () => new StaticTranslateLoader(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
