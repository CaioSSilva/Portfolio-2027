export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
}

export interface Project {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
}
