import React from 'react';
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onOpenCv();
  };

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      {/* CV Trigger Button */}
      <a
        href="#resume"
        onClick={handleCvClick}
        className={`group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-sm sm:text-base cursor-pointer backdrop-blur-md transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
          isDark
            ? 'bg-gradient-to-r from-cyan-950/80 via-purple-950/70 to-orange-950/60 hover:from-cyan-900/90 hover:to-purple-900/80 border border-cyan-400/50 hover:border-cyan-300 text-white shadow-cyan-950/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.45)]'
            : 'bg-white/95 hover:bg-white border border-slate-300 hover:border-cyan-600 text-slate-900 shadow-slate-200/60 hover:shadow-lg hover:shadow-cyan-500/10'
        }`}
      >
        <svg
          className={`w-5 h-5 group-hover:rotate-12 transition-transform duration-300 ${
            isDark ? 'text-cyan-400' : 'text-cyan-700'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="tracking-wide">{t(uiTranslations.hero.cvButton)}</span>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
            isDark
              ? 'bg-purple-500/25 border-purple-400/40 text-purple-200'
              : 'bg-purple-100 border-purple-200 text-purple-800'
          }`}
        >
          Interactive
        </span>
      </a>

      {/* Scroll for Projects Button */}
      <button
        onClick={handleScrollToProjects}
        className={`group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 cursor-pointer ${
          isDark
            ? 'text-cyan-300/90 hover:text-white hover:bg-cyan-500/10'
            : 'text-slate-800 hover:text-slate-950 bg-white/75 hover:bg-white/95 border border-slate-300/70 backdrop-blur-xs shadow-xs'
        }`}
      >
        <span>{t(uiTranslations.hero.scrollButton)}</span>
        <span
          className={`inline-block animate-bounce-slow ${
            isDark ? 'text-cyan-400' : 'text-slate-600'
          }`}
        >
          ↓
        </span>
      </button>
    </div>
  );
};
