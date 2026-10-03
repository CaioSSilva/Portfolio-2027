import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { GithubRepo, Project } from '../interfaces/github';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly user = 'caiossilva';

  getRepos(): Observable<Project[]> {
    return this.http
      .get<GithubRepo[]>(
        `https://api.github.com/users/${this.user}/repos?sort=updated&per_page=100`,
      )
      .pipe(
        map((repos) =>
          repos
            .filter((r) => !r.fork)
            .map((r) => ({
              name: r.name,
              description: r.description ?? this.translate.instant('projects.noDescription'),
              language: r.language ?? this.translate.instant('projects.noLanguage'),
              stars: r.stargazers_count,
              url: r.html_url,
              hasDescription: r.description !== null && r.description.trim() !== '',
              hasLanguage: r.language !== null,
            }))
            .sort((a, b) => {
              const score = (p: typeof a) =>
                p.stars * 10 + (p.hasDescription ? 2 : 0) + (p.hasLanguage ? 1 : 0);
              return score(b) - score(a);
            })
            .map(({ hasDescription, hasLanguage, ...p }) => p),
        ),
      );
  }
}
