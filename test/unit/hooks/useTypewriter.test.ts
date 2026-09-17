import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypewriter } from '../../../src/hooks/useTypewriter';

describe('useTypewriter hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('immediately displays full text when isSkipped is true', () => {
    const { result } = renderHook(() =>
      useTypewriter('Hello World', { isSkipped: true })
    );

    expect(result.current.displayText).toBe('Hello World');
    expect(result.current.isDone).toBe(true);
    expect(result.current.isTyping).toBe(false);
  });

  it('streams characters over time when active', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useTypewriter('Hello', { speed: 10, delay: 0, active: true, onComplete })
    );

    expect(result.current.displayText).toBe('');

    // Advance past initial timeout
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.isTyping).toBe(true);

    // Advance 30ms -> 3 chars
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(result.current.displayText.length).toBeGreaterThan(0);

    // Advance to completion
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayText).toBe('Hello');
    expect(result.current.isDone).toBe(true);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

