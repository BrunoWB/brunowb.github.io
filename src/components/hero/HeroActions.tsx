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
      {/* Resume Trigger Button with fixed hover hit zone */}
      <a
        href="#resume"
        onClick={handleCvClick}
        className="group relative inline-flex items-center justify-center cursor-pointer select-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:focus-visible:ring-cyan-300"
        aria-label={t(uiTranslations.hero.cvButton)}
      >
        {/* Fixed interactive hit zone buffer preventing subpixel boundary flicker */}
        <span
          className="absolute -inset-1 rounded-full pointer-events-auto"
          aria-hidden="true"
        />

        {/* Animated visual button body */}
        <span
          className={`relative z-10 inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-300 shadow-md group-hover:-translate-y-0.5 group-active:translate-y-0 ${
            isDark
              ? 'border border-cyan-400/50 group-hover:border-cyan-300 text-white shadow-cyan-950/50 group-hover:shadow-[0_0_25px_rgba(0,229,255,0.45)]'
              : 'border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)] text-[var(--text-primary)] shadow-sm group-hover:shadow-lg group-hover:shadow-cyan-500/10'
          }`}
        >
          {/* Base Background Gradient */}
          <span
            className={`absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none ${
              isDark
                ? 'bg-gradient-to-r from-cyan-950/80 via-purple-950/70 to-orange-950/60'
                : 'bg-[var(--bg-card)]/95'
            }`}
            aria-hidden="true"
          />

          {/* Hover Background Gradient (smoothly crossfades in) */}
          <span
            className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
              isDark
                ? 'bg-gradient-to-r from-cyan-900/90 via-purple-900/80 to-purple-900/80'
                : 'bg-[var(--bg-card)]'
            }`}
            aria-hidden="true"
          />

          <svg
            className={`relative z-10 w-5 h-5 group-hover:rotate-12 transition-transform duration-300 ${
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
            className="relative z-10 tracking-wide"
            deleteSpeed={10}
            typeSpeed={14}
            pauseDelay={50}
          />
        </span>
      </a>
    </div>
  );
};
