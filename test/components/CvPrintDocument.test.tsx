import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CvPrintDocument } from '../../src/components/cv/CvPrintDocument';
import { CvHeader } from '../../src/components/cv/CvHeader';
import { CvPaperModal } from '../../src/components/cv/CvPaperModal';
import { LanguageProvider } from '../../src/context/LanguageContext';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { TypewriterProvider } from '../../src/context/TypewriterContext';
import { PrintModeProvider } from '../../src/context/PrintModeContext';
import { cvData } from '../../src/data/cvData';
import { uiTranslations } from '../../src/data/uiTranslations';

describe('CvPrintDocument and Print Functionality', () => {
  const originalPrint = window.print;

  beforeEach(() => {
    vi.useFakeTimers();
    window.print = vi.fn();
    document.documentElement.removeAttribute('data-print-mode');
    document.body.removeAttribute('data-print-mode');
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    window.print = originalPrint;
    document.documentElement.removeAttribute('data-print-mode');
    document.body.removeAttribute('data-print-mode');
    vi.restoreAllMocks();
  });

  it('renders all essential CV sections in default paper print mode', () => {
    const { container } = render(
      <LanguageProvider defaultLang="en">
        <CvPrintDocument mode="paper" />
      </LanguageProvider>
    );

    // Header
    expect(screen.getByText(cvData.header.name)).toBeInTheDocument();
    expect(screen.getByText(cvData.header.title.en)).toBeInTheDocument();
    expect(screen.getAllByText(cvData.contact.email).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(cvData.contact.phone).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(cvData.contact.linkedin)).toBeInTheDocument();

    // Avatar Image
    const avatar = screen.getByAltText(cvData.header.name);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src');

    // Profile
    expect(screen.getByText(cvData.profile.title.en)).toBeInTheDocument();
    expect(screen.getByText(cvData.profile.summary.en)).toBeInTheDocument();

    // Skills
    expect(screen.getByText(cvData.skills.title.en)).toBeInTheDocument();
    cvData.skills.items.slice(0, 5).forEach((skill) => {
      const elements = screen.getAllByText(skill);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    // Education
    expect(screen.getByText(cvData.education.title.en)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(cvData.education.entry.degree.en, 'i'))).toBeInTheDocument();

    // Languages
    expect(screen.getByText(cvData.languages.title.en)).toBeInTheDocument();
    cvData.languages.items.forEach((lang) => {
      expect(screen.getByText(lang.name.en)).toBeInTheDocument();
    });

    // Experience: Paper mode shows ALL positions including legacy ones
    expect(screen.getByText(cvData.experience.title.en)).toBeInTheDocument();
    expect(screen.getByText(cvData.experience.positions[0].role.en)).toBeInTheDocument();
    expect(screen.getByText(/Datagrid AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Hexoskin/i)).toBeInTheDocument();
    expect(screen.getByText(/Nurun/i)).toBeInTheDocument();
    expect(screen.getByText(/Freelance Web Services \| 3A Distribuidora/i)).toBeInTheDocument();
    expect(screen.getByText(/Backend Developer Trainee \| Allus/i)).toBeInTheDocument();
    expect(screen.getByText(/Web Designer \| Barcellos Sports/i)).toBeInTheDocument();
    expect(screen.queryByText(/Positions/i)).not.toBeInTheDocument();

    // Class and attribute verification
    const sheet = container.querySelector('.cv-print-sheet');
    expect(sheet).toHaveClass('cv-print-paper');
    expect(sheet).toHaveAttribute('data-print-mode', 'paper');
  });

  it('renders digital PDF version with the last 2 legacy jobs removed and digital styling', () => {
    const { container } = render(
      <LanguageProvider defaultLang="en">
        <CvPrintDocument mode="digital" />
      </LanguageProvider>
    );

    // Modern roles exist
    expect(screen.getByText(cvData.experience.positions[0].role.en)).toBeInTheDocument();
    expect(screen.getByText(/Datagrid AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Hexoskin/i)).toBeInTheDocument();
    expect(screen.getByText(/Nurun/i)).toBeInTheDocument();
    expect(screen.getByText(/Freelance Web Services \| 3A Distribuidora/i)).toBeInTheDocument();

    // The 2 oldest jobs (Backend Developer Trainee and Barcellos Sports) are removed in digital mode
    expect(screen.queryByText(/Backend Developer Trainee \| Allus/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Web Designer \| Barcellos Sports/i)).not.toBeInTheDocument();

    // Positions count badge is removed
    expect(screen.queryByText(/Positions/i)).not.toBeInTheDocument();

    // Transparent header verification
    const transparentBanner = container.querySelector('.bg-transparent');
    expect(transparentBanner).toBeInTheDocument();

    // Class and attribute verification
    const sheet = container.querySelector('.cv-print-sheet');
    expect(sheet).toHaveClass('cv-print-digital');
    expect(sheet).toHaveAttribute('data-print-mode', 'digital');
  });

  it('supports French and Portuguese language translations', () => {
    const { unmount } = render(
      <LanguageProvider initialLang="fr">
        <CvPrintDocument />
      </LanguageProvider>
    );

    expect(screen.getByText(cvData.header.title.fr)).toBeInTheDocument();
    expect(screen.getByText(cvData.profile.title.fr)).toBeInTheDocument();

    unmount();

    render(
      <LanguageProvider initialLang="pt">
        <CvPrintDocument />
      </LanguageProvider>
    );

    expect(screen.getByText(cvData.header.title.pt)).toBeInTheDocument();
    expect(screen.getByText(cvData.profile.title.pt)).toBeInTheDocument();
  });

  it('triggers paper print on left click of the Print button in CvHeader', () => {
    render(
      <LanguageProvider defaultLang="en">
        <PrintModeProvider>
          <TypewriterProvider enabled={false}>
            <CvHeader onClose={vi.fn()} />
          </TypewriterProvider>
        </PrintModeProvider>
      </LanguageProvider>
    );

    const printButton = screen.getByRole('button', {
      name: uiTranslations.cvModal.print.en,
    });
    expect(printButton).toBeInTheDocument();

    fireEvent.click(printButton);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.documentElement.getAttribute('data-print-mode')).toBe('paper');
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it('triggers digital PDF print when clicking the Download PDF button in CvHeader', () => {
    render(
      <LanguageProvider defaultLang="en">
        <PrintModeProvider>
          <TypewriterProvider enabled={false}>
            <CvHeader onClose={vi.fn()} />
          </TypewriterProvider>
        </PrintModeProvider>
      </LanguageProvider>
    );

    const downloadButton = screen.getByRole('button', {
      name: uiTranslations.cvModal.downloadPdf.en,
    });
    expect(downloadButton).toBeInTheDocument();

    fireEvent.click(downloadButton);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.documentElement.getAttribute('data-print-mode')).toBe('digital');
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it('triggers digital PDF print on right-click (contextmenu) of the Print button in CvHeader', () => {
    render(
      <LanguageProvider defaultLang="en">
        <PrintModeProvider>
          <TypewriterProvider enabled={false}>
            <CvHeader onClose={vi.fn()} />
          </TypewriterProvider>
        </PrintModeProvider>
      </LanguageProvider>
    );

    const printButton = screen.getByRole('button', {
      name: uiTranslations.cvModal.print.en,
    });

    fireEvent.contextMenu(printButton);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.documentElement.getAttribute('data-print-mode')).toBe('digital');
    expect(window.print).toHaveBeenCalledTimes(1);

    // After print finishes, afterprint resets mode to paper and removes attribute
    act(() => {
      window.dispatchEvent(new Event('afterprint'));
    });
    expect(document.documentElement.getAttribute('data-print-mode')).toBeNull();
  });

  it('triggers window.print() on Cmd+P and Ctrl+P shortcut when CvPaperModal is open', () => {
    render(
      <LanguageProvider defaultLang="en">
        <ThemeProvider>
          <PrintModeProvider>
            <TypewriterProvider enabled={false}>
              <CvPaperModal isOpen={true} onClose={vi.fn()} />
            </TypewriterProvider>
          </PrintModeProvider>
        </ThemeProvider>
      </LanguageProvider>
    );

    // Cmd+P (Mac)
    fireEvent.keyDown(window, { key: 'p', metaKey: true });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(window.print).toHaveBeenCalledTimes(1);

    // Ctrl+P (Windows/Linux)
    fireEvent.keyDown(window, { key: 'p', ctrlKey: true });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(window.print).toHaveBeenCalledTimes(2);
  });
});
