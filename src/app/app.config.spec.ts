import { describe, expect, it } from 'vitest';
import { appConfig } from './app.config';

describe('appConfig', () => {
  it('should define providers array', () => {
    expect(appConfig).toBeDefined();
    expect(appConfig.providers).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBe(true);
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });
});
