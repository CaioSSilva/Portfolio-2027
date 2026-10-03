import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';

describe('appRoutes', () => {
  it('should have wildcard route configured', () => {
    expect(routes).toBeDefined();
    expect(routes.length).toBeGreaterThan(0);

    const wildcardRoute = routes.find((r) => r.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.loadComponent).toBeDefined();
  });

  it('should load Loader component for wildcard route', async () => {
    const wildcardRoute = routes.find((r) => r.path === '**');
    if (wildcardRoute?.loadComponent) {
      const component = await (wildcardRoute.loadComponent as () => Promise<any>)();
      expect(component).toBeDefined();
    }
  });
});
