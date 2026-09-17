import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HomePage } from '../../src/pages/HomePage';
import { LanguageProvider } from '../../src/context/LanguageContext';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { TypewriterProvider } from '../../src/context/TypewriterContext';

describe('HomePage CV trigger scroll behavior', () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    window.scrollTo = vi.fn();
    window.location.hash = '';
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    vi.restoreAllMocks();
  });

  it('triggers CV opening immediately when already at top (scrollY = 0)', () => {
    window.scrollY = 0;
    render(
      <LanguageProvider>
        <ThemeProvider>
          <TypewriterProvider>
            <HomePage />
          </TypewriterProvider>
        </ThemeProvider>
      </LanguageProvider>
    );

    const cvButton = screen.getByRole('link', { name: /resume/i });
    expect(cvButton).toBeInTheDocument();

    fireEvent.click(cvButton);

    // Should not trigger smooth scrolling if already at top
    expect(window.scrollTo).not.toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'smooth' })
    );
  });

  it('scrolls user to top smoothly before opening CV when scrolled down', () => {
    vi.useFakeTimers();
    window.scrollY = 250;

    render(
      <LanguageProvider>
        <ThemeProvider>
          <TypewriterProvider>
            <HomePage />
          </TypewriterProvider>
        </ThemeProvider>
      </LanguageProvider>
    );

    const cvButton = screen.getByRole('link', { name: /resume/i });
    expect(cvButton).toBeInTheDocument();

    fireEvent.click(cvButton);

    // Verify smooth scroll to top was initiated
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    // Simulate arriving at top
    window.scrollY = 0;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // Auto snap to 0
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });

    vi.useRealTimers();
  });

  it('triggers floating avatar flight animation after scroll to top completes', () => {
    vi.useFakeTimers();
    window.scrollY = 300;

    // Mock getBoundingClientRect on elements so measureAndAnimate detects valid dimensions
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 100,
      left: 100,
      width: 144,
      height: 144,
      bottom: 244,
      right: 244,
      x: 100,
      y: 100,
      toJSON: () => {},
    });

    try {
      render(
        <LanguageProvider>
          <ThemeProvider>
            <TypewriterProvider>
              <HomePage />
            </TypewriterProvider>
          </ThemeProvider>
        </LanguageProvider>
      );

      const cvButton = screen.getByRole('link', { name: /resume/i });
      fireEvent.click(cvButton);

      // Simulate arriving at top
      window.scrollY = 0;
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      // Advance animation frames via fake timers to allow measureAndAnimate retry loop to execute
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // The resume modal should now be open
      expect(screen.getByRole('dialog', { name: /resume modal/i })).toBeInTheDocument();
    } finally {
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
      vi.useRealTimers();
    }
  });
});
