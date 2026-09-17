import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../../src/components/common/ThemeToggle';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { LanguageProvider } from '../../src/context/LanguageContext';

describe('ThemeToggle component', () => {
  it('toggles theme and updates localStorage', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </LanguageProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    const savedTheme = localStorage.getItem('theme');
    expect(['dark', 'light']).toContain(savedTheme);
  });
});

