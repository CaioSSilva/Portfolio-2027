import { describe, expect, it } from 'vitest';
import * as loadingTimelines from './index';

describe('loading timelines index', () => {
  it('should export all loading timeline functions', () => {
    expect(loadingTimelines.ballsEnter).toBeDefined();
    expect(loadingTimelines.ballsExit).toBeDefined();
    expect(loadingTimelines.barEnter).toBeDefined();
    expect(loadingTimelines.barExit).toBeDefined();
    expect(loadingTimelines.titleEnter).toBeDefined();
    expect(loadingTimelines.titleExit).toBeDefined();
  });
});
