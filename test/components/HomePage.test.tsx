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
});
