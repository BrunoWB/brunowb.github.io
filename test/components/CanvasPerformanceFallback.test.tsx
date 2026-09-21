import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { CanvasBackground } from '../../src/components/background/CanvasBackground';
import { ResolvedCanvasParams } from '../../src/components/background/canvas/types';

// Captured params passed to useCanvasEngine
let capturedParams: ResolvedCanvasParams | null = null;

vi.mock('../../src/components/background/canvas/hooks/useCanvasEngine', () => ({
  useCanvasEngine: (params: ResolvedCanvasParams) => {
    capturedParams = params;
    const canvasRef = React.createRef<HTMLCanvasElement>();
    return {
      canvasRef,
      triggerShootingStar: vi.fn(),
    };
  },
}));

describe('CanvasBackground Automatic Performance Fallback', () => {
  let nowMock: number;

  beforeEach(() => {
    capturedParams = null;
    nowMock = 10000;
    vi.spyOn(performance, 'now').mockImplementation(() => nowMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('triggers fallback when FPS stays below 25 for more than 3.5 seconds', () => {
    const onPerformanceFallback = vi.fn();
    const onFpsUpdate = vi.fn();

    const { container } = render(
      <CanvasBackground
        enablePerformanceFallback={true}
        fallbackFpsThreshold={25}
        fallbackDurationMs={3500}
        onPerformanceFallback={onPerformanceFallback}
        onFpsUpdate={onFpsUpdate}
      />
    );

    expect(capturedParams).not.toBeNull();
    expect(capturedParams!.useCleanComposite).toBe(false);

    // Initial canvas has color grading filter applied
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.style.filter).toContain('contrast');

    // Advance past initial grace period (1.5s)
    nowMock += 2000;

    // Report low FPS (20 FPS)
    act(() => {
      capturedParams!.onFpsUpdate!(20, 50);
    });
    expect(onPerformanceFallback).not.toHaveBeenCalled();

    // Advance 2 seconds (total 2s of low FPS, < 3.5s)
    nowMock += 2000;
    act(() => {
      capturedParams!.onFpsUpdate!(18, 55);
    });
    expect(onPerformanceFallback).not.toHaveBeenCalled();

    // Advance 2 more seconds (total 4s of low FPS, > 3.5s)
    nowMock += 2000;
    act(() => {
      capturedParams!.onFpsUpdate!(19, 52);
    });

    // Fallback should now be triggered
    expect(onPerformanceFallback).toHaveBeenCalledTimes(1);
    expect(capturedParams!.useCleanComposite).toBe(true);

    // CSS filter should be cleared on the canvas in clean composite mode
    expect(canvas.style.filter).toBe('');
  });

  it('resets timer and does not trigger fallback if FPS recovers above threshold before 3.5s', () => {
    const onPerformanceFallback = vi.fn();

    render(
      <CanvasBackground
        enablePerformanceFallback={true}
        fallbackFpsThreshold={25}
        fallbackDurationMs={3500}
        onPerformanceFallback={onPerformanceFallback}
      />
    );

    // Past initial grace period
    nowMock += 2000;

    // Report low FPS
    act(() => {
      capturedParams!.onFpsUpdate!(20, 50);
    });

    // Advance 2.5s (still low)
    nowMock += 2500;
    act(() => {
      capturedParams!.onFpsUpdate!(22, 45);
    });
    expect(onPerformanceFallback).not.toHaveBeenCalled();

    // FPS recovers to 60 FPS
    nowMock += 500;
    act(() => {
      capturedParams!.onFpsUpdate!(60, 16.6);
    });

    // Advance another 2 seconds at low FPS (should not trigger because recovery reset timer)
    nowMock += 2000;
    act(() => {
      capturedParams!.onFpsUpdate!(15, 66);
    });

    expect(onPerformanceFallback).not.toHaveBeenCalled();
    expect(capturedParams!.useCleanComposite).toBe(false);
  });

  it('does not trigger fallback when enablePerformanceFallback is false', () => {
    const onPerformanceFallback = vi.fn();

    render(
      <CanvasBackground
        enablePerformanceFallback={false}
        fallbackFpsThreshold={25}
        fallbackDurationMs={3500}
        onPerformanceFallback={onPerformanceFallback}
      />
    );

    // Past grace period
    nowMock += 2000;

    // Report low FPS for 10 seconds
    act(() => {
      capturedParams!.onFpsUpdate!(15, 66);
    });
    nowMock += 10000;
    act(() => {
      capturedParams!.onFpsUpdate!(12, 83);
    });

    expect(onPerformanceFallback).not.toHaveBeenCalled();
    expect(capturedParams!.useCleanComposite).toBe(false);
  });

  it('does not trigger fallback if document is hidden (backgrounded tab)', () => {
    const onPerformanceFallback = vi.fn();

    render(
      <CanvasBackground
        enablePerformanceFallback={true}
        fallbackFpsThreshold={25}
        fallbackDurationMs={3500}
        onPerformanceFallback={onPerformanceFallback}
      />
    );

    nowMock += 2000;

    // Mock document.hidden = true
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });

    // Report low FPS while hidden
    act(() => {
      capturedParams!.onFpsUpdate!(10, 100);
    });
    nowMock += 5000;
    act(() => {
      capturedParams!.onFpsUpdate!(10, 100);
    });

    expect(onPerformanceFallback).not.toHaveBeenCalled();

    // Restore document.hidden
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
  });
});
