import React from 'react';
import { FloatingBubble } from './FloatingBubble';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { uiTranslations } from '../../data/uiTranslations';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const isDark = theme === 'dark';
  const label = isDark
    ? t(uiTranslations.theme.toggleDark)
    : t(uiTranslations.theme.toggleLight);

  return (
    <FloatingBubble position="bottom-right">
      <button
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className={`group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border backdrop-blur-md cursor-pointer transition-all duration-300 shadow-md ${
          isDark
            ? 'bg-[#061e26]/85 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:text-cyan-200 hover:shadow-cyan-500/30'
            : 'bg-white/95 border-slate-300/80 text-amber-600 hover:border-amber-500 hover:text-amber-700 hover:shadow-lg hover:shadow-amber-500/15'
        }`}
      >
        {/* Glow halo */}
        <div
          className={`absolute inset-0 rounded-full blur-md transition-opacity ${
            isDark ? 'bg-cyan-500 opacity-40 group-hover:opacity-75' : 'bg-amber-400/20 opacity-0 group-hover:opacity-100'
          }`}
          aria-hidden="true"
        />

        {/* Lightbulb SVG with filament animation */}
        <svg
          className={`relative w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110 ${
            isDark ? 'rotate-0' : 'rotate-12'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Bulb bulb outline */}
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          {/* Base screw lines */}
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          {/* Filament or inner glowing detail */}
          {isDark ? (
            <path
              d="M10 10l2 2 2-2"
              className="text-cyan-400"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          ) : (
            <path
              d="M12 4v4m-4-2l2 2m6-2l-2 2"
              className="text-orange-500"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </button>
    </FloatingBubble>
  );
};
