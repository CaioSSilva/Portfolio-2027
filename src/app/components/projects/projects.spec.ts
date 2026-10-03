import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import PT from '../../i18n/pt.json';
import { GithubService } from '../../services/github';
import { Project } from '../../interfaces/github';
import { Projects } from './projects';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of(PT as TranslationObject);
  }
}

const MOCK_PROJECTS: Project[] = [
  {
    name: 'repo-one',
    description: 'First repo',
    language: 'TypeScript',
    stars: 3,
    url: 'https://github.com/caiossilva/repo-one',
  },
  {
    name: 'repo-two',
    description: 'Second repo',
    language: 'JavaScript',
    stars: 1,
    url: 'https://github.com/caiossilva/repo-two',
  },
];

describe('Projects', () => {
  let component: Projects;
  let fixture: ComponentFixture<Projects>;

  beforeEach(async () => {
    const githubSpy = { getRepos: vi.fn(() => of(MOCK_PROJECTS)) };

    await TestBed.configureTestingModule({
      imports: [Projects],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({
          lang: 'pt',
          loader: () => new StaticTranslateLoader(),
        }),
        { provide: GithubService, useValue: githubSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Projects);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getRepos on init', () => {
    const github = TestBed.inject(GithubService) as unknown as {
      getRepos: ReturnType<typeof vi.fn>;
    };
    expect(github.getRepos).toHaveBeenCalledOnce();
  });

  it('should render a card for each project', () => {
    const cards = fixture.nativeElement.querySelectorAll(
      '.projects__card--front:not(.projects__card--see-all)',
    );
    expect(cards.length).toBe(MOCK_PROJECTS.length);
  });

  it('should render project names', () => {
    const names = Array.from(
      fixture.nativeElement.querySelectorAll('.projects__card-name') as NodeListOf<HTMLElement>,
    ).map((el) => el.textContent?.trim());
    expect(names).toContain('repo-one');
    expect(names).toContain('repo-two');
  });

  it('should render project descriptions', () => {
    const descs = Array.from(
      fixture.nativeElement.querySelectorAll('.projects__card-desc') as NodeListOf<HTMLElement>,
    ).map((el) => el.textContent?.trim());
    expect(descs).toContain('First repo');
  });

  it('should render project languages', () => {
    const langs = Array.from(
      fixture.nativeElement.querySelectorAll('.projects__card-lang') as NodeListOf<HTMLElement>,
    ).map((el) => el.textContent?.trim());
    expect(langs.some((l) => l?.includes('TypeScript'))).toBe(true);
  });

  it('should render the section title', () => {
    const title = fixture.nativeElement.querySelector('.projects__title-text') as HTMLElement;
    expect(title?.textContent?.trim()).toBe('Projetos');
  });

  it('should render the "Ver Tudo" card', () => {
    const seeAll = fixture.nativeElement.querySelector(
      '.projects__card--see-all.projects__card--front',
    ) as HTMLElement;
    expect(seeAll?.textContent?.trim()).toContain('Ver Tudo');
  });

  it('should render the drag hint', () => {
    const hint = fixture.nativeElement.querySelector('.projects__hint span') as HTMLElement;
    expect(hint?.textContent?.trim()).toBe(PT.projects.dragHint);
  });

  it('should render the carousel track', () => {
    expect(fixture.nativeElement.querySelector('.projects__track')).toBeTruthy();
  });

  it('should clean up on destroy without throwing', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});
