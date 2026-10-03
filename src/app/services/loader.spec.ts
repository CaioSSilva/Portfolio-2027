import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoaderService } from './loader';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start progress at 0', () => {
    expect(service.progress()).toBe(0);
  });

  it('should increment progress by 10 every 300ms until 100', async () => {
    service.load(Promise.resolve());
    await Promise.resolve();

    expect(service.progress()).toBe(0);

    vi.advanceTimersByTime(300);
    expect(service.progress()).toBe(10);

    vi.advanceTimersByTime(300);
    expect(service.progress()).toBe(20);

    vi.advanceTimersByTime(2400);
    expect(service.progress()).toBe(100);

    vi.advanceTimersByTime(600);
    expect(service.progress()).toBe(100);
  });

  it('should reset progress to 0 when load() is called again', async () => {
    service.load(Promise.resolve());
    await Promise.resolve();

    vi.advanceTimersByTime(900);
    expect(service.progress()).toBe(30);

    service.load(Promise.resolve());
    await Promise.resolve();

    expect(service.progress()).toBe(0);
  });

  it('should set done to true after animationDuration in finish()', () => {
    expect(service.done()).toBe(false);

    service.finish(500);
    expect(service.done()).toBe(false);

    vi.advanceTimersByTime(500);
    expect(service.done()).toBe(true);
  });
});
