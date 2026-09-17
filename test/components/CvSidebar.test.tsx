import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CvSidebar } from '../../src/components/cv/CvSidebar';
import { LanguageProvider } from '../../src/context/LanguageContext';
import { TypewriterProvider } from '../../src/context/TypewriterContext';
import { CvHoverProvider } from '../../src/context/CvHoverContext';
import { cvData } from '../../src/data/cvData';

describe('CvSidebar component', () => {
  it('renders sticky sidebar structure and profile name', () => {
    const { container } = render(
      <LanguageProvider>
        <TypewriterProvider>
          <CvHoverProvider>
            <CvSidebar isScrolled={true} />
          </CvHoverProvider>
        </TypewriterProvider>
      </LanguageProvider>
    );

    const aside = container.querySelector('aside');
    expect(aside).not.toBeNull();
    expect(aside?.className).toContain('lg:sticky');
    expect(aside?.className).toContain('lg:top-4');

    // Asserts that user's name is rendered in the DOM
    expect(screen.getByText(cvData.header.name)).toBeInTheDocument();
  });

  it('renders all skills from cvData', () => {
    render(
      <LanguageProvider>
        <TypewriterProvider>
          <CvHoverProvider>
            <CvSidebar />
          </CvHoverProvider>
        </TypewriterProvider>
      </LanguageProvider>
    );

    // Verify first few skills are present
    expect(screen.getByText(cvData.skills.items[0])).toBeInTheDocument();
    expect(screen.getByText(cvData.skills.items[1])).toBeInTheDocument();
  });
});

