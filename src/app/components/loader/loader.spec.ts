import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PT from '../../i18n/pt.json';
import { Loader } from './loader';
import { LoaderService } from '../../services/loader';
import { GithubService } from '../../services/github';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of(PT as TranslationObject);
  }
}

describe('Loader', () => {
  let component: Loader;
  let fixture: ComponentFixture<Loader>;
  let mockLoaderService: {
    load: (afterEnter: Promise<void>) => void;
    finish: (animationDuration: number) => void;
    progress: ReturnType<typeof signal<number>>;
    done: ReturnType<typeof signal<boolean>>;
  };

  beforeEach(async () => {
    const progress = signal(0);
    const done = signal(false);

    mockLoaderService = {
      progress,
      done,
      load: vi.fn(),
      finish: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Loader],
      providers: [
        { provide: LoaderService, useValue: mockLoaderService },
        {
          provide: GithubService,
          useValue: {
            getRepos: () => of([]),
          },
        },
        provideTranslateService({
          lang: 'pt',
          loader: () => new StaticTranslateLoader(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Loader);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call load() on init', () => {
    expect(mockLoaderService.load).toHaveBeenCalledTimes(1);
    expect(mockLoaderService.load).toHaveBeenCalledWith(expect.any(Promise));
  });

  it('should render loading bar and title when not done', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.container')).toBeTruthy();
    expect(compiled.querySelector('.balls')).toBeTruthy();
    expect(compiled.querySelector('.loader')).toBeTruthy();
    expect(compiled.querySelector('.loading-title')).toBeTruthy();
  });

  it('should render top-bar and home when done', async () => {
    mockLoaderService.done.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-top-bar')).toBeTruthy();
    expect(compiled.querySelector('app-home')).toBeTruthy();
  });
});
