import React from 'react';
import { TypewriterRewriter } from '../common/TypewriterRewriter';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { uiTranslations } from '../../data/uiTranslations';

interface HeroActionsProps {
  onOpenCv: () => void;
}

export const HeroActions: React.FC<HeroActionsProps> = ({ onOpenCv }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleCvClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenCv();
  };

  return (
    <div className="flex items-center justify-center mt-8">
      {/* Resume Trigger Button */}
      <a
        href="#resume"
        onClick={handleCvClick}
        className={`group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-sm sm:text-base cursor-pointer backdrop-blur-md transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
          isDark
            ? 'bg-gradient-to-r from-cyan-950/80 via-purple-950/70 to-orange-950/60 hover:from-cyan-900/90 hover:to-purple-900/80 border border-cyan-400/50 hover:border-cyan-300 text-white shadow-cyan-950/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.45)]'
            : 'bg-[var(--bg-card)]/95 hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-[var(--text-primary)] shadow-sm hover:shadow-lg hover:shadow-cyan-500/10'
        }`}
      >
        <svg
          className={`w-5 h-5 group-hover:rotate-12 transition-transform duration-300 ${
            isDark ? 'text-cyan-400' : 'text-[var(--brand-primary)]'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <TypewriterRewriter
          text={t(uiTranslations.hero.cvButton)}
          as="span"
          className="tracking-wide"
          deleteSpeed={10}
          typeSpeed={14}
          pauseDelay={50}
        />
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
            isDark
              ? 'bg-purple-500/25 border-purple-400/40 text-purple-200'
              : 'bg-[var(--brand-secondary)]/15 border-[var(--brand-secondary)]/30 text-[var(--brand-secondary)]'
          }`}
        >
          Interactive
        </span>
      </a>
    </div>
  );
};
