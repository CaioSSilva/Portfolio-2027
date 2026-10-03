import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  TranslateLoader,
  TranslateService,
  TranslationObject,
  provideTranslateService,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import PT from '../i18n/pt.json';
import { GithubService } from './github';
import { GithubRepo } from '../interfaces/github';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of(PT as TranslationObject);
  }
}

const makeRepo = (overrides: Partial<GithubRepo> = {}): GithubRepo => ({
  name: 'my-repo',
  description: 'A description',
  language: 'TypeScript',
  stargazers_count: 0,
  html_url: 'https://github.com/caiossilva/my-repo',
  fork: false,
  ...overrides,
});

describe('GithubService', () => {
  let service: GithubService;
  let http: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({
          lang: 'pt',
          loader: () => new StaticTranslateLoader(),
        }),
      ],
    });

    service = TestBed.inject(GithubService);
    http = TestBed.inject(HttpTestingController);

    await TestBed.inject(TranslateService).use('pt').toPromise();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    http.verify();
  });

  it('should call the correct GitHub API URL', () => {
    service.getRepos().subscribe();
    const req = http.expectOne(
      'https://api.github.com/users/caiossilva/repos?sort=updated&per_page=100',
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should filter out forks', () => {
    let result: { name: string }[] = [];
    service.getRepos().subscribe((r) => (result = r));

    http
      .expectOne((r) => r.url.includes('repos'))
      .flush([
        makeRepo({ name: 'original', fork: false }),
        makeRepo({ name: 'forked', fork: true }),
      ]);

    expect(result.map((r) => r.name)).toEqual(['original']);
  });

  it('should map repo fields to Project shape', () => {
    let result: { name: string; stars: number; url: string }[] = [];
    service.getRepos().subscribe((r) => (result = r));

    http
      .expectOne((r) => r.url.includes('repos'))
      .flush([
        makeRepo({
          name: 'repo-a',
          stargazers_count: 5,
          html_url: 'https://github.com/caiossilva/repo-a',
        }),
      ]);

    expect(result[0]).toMatchObject({
      name: 'repo-a',
      stars: 5,
      url: 'https://github.com/caiossilva/repo-a',
    });
  });

  it('should use translated fallback when description is null', () => {
    let result: { description: string }[] = [];
    service.getRepos().subscribe((r) => (result = r));

    http.expectOne((r) => r.url.includes('repos')).flush([makeRepo({ description: null })]);

    expect(result[0].description).toBe(PT.projects.noDescription);
  });

  it('should use translated fallback when language is null', () => {
    let result: { language: string }[] = [];
    service.getRepos().subscribe((r) => (result = r));

    http.expectOne((r) => r.url.includes('repos')).flush([makeRepo({ language: null })]);

    expect(result[0].language).toBe(PT.projects.noLanguage);
  });

  it('should sort by stars descending', () => {
    let result: { name: string }[] = [];
    service.getRepos().subscribe((r) => (result = r));

    http
      .expectOne((r) => r.url.includes('repos'))
      .flush([
        makeRepo({ name: 'low', stargazers_count: 1 }),
        makeRepo({ name: 'high', stargazers_count: 10 }),
        makeRepo({ name: 'mid', stargazers_count: 5 }),
      ]);

    expect(result.map((r) => r.name)).toEqual(['high', 'mid', 'low']);
  });

  it('should rank repos with description and language higher when stars are equal', () => {
    let result: { name: string }[] = [];
    service.getRepos().subscribe((r) => (result = r));

    http
      .expectOne((r) => r.url.includes('repos'))
      .flush([
        makeRepo({ name: 'no-meta', description: null, language: null, stargazers_count: 0 }),
        makeRepo({
          name: 'full-meta',
          description: 'desc',
          language: 'TypeScript',
          stargazers_count: 0,
        }),
        makeRepo({ name: 'desc-only', description: 'desc', language: null, stargazers_count: 0 }),
      ]);

    expect(result.map((r) => r.name)).toEqual(['full-meta', 'desc-only', 'no-meta']);
  });

  it('should not expose hasDescription or hasLanguage in the output', () => {
    let result: Record<string, unknown>[] = [];
    service.getRepos().subscribe((r) => (result = r as unknown as Record<string, unknown>[]));

    http.expectOne((r) => r.url.includes('repos')).flush([makeRepo()]);

    expect(result[0]).not.toHaveProperty('hasDescription');
    expect(result[0]).not.toHaveProperty('hasLanguage');
  });
});
