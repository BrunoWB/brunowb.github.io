import React from 'react';
import { FloatingBubble } from './FloatingBubble';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { uiTranslations } from '../../data/uiTranslations';

export const KofiButton: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <FloatingBubble position="bottom-left">
      <a
        href="https://ko-fi.com/brunowb"
        target="_blank"
        rel="noopener noreferrer"
        title={t(uiTranslations.coffee.button)}
        aria-label={t(uiTranslations.coffee.button)}
        className={`group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full border backdrop-blur-md text-sm font-medium transition-all duration-300 shadow-md ${
          isDark
            ? 'bg-[#061e26]/85 border-cyan-500/35 text-slate-100 hover:text-white hover:border-orange-400 hover:shadow-orange-500/20'
            : 'bg-white/95 border-slate-300/80 text-slate-800 hover:text-orange-600 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/15'
        }`}
      >
        <svg
          className="w-5 h-5 fill-current text-cyan-600 dark:text-cyan-400 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:rotate-[-10deg] group-hover:scale-110 transition-all duration-300 flex-shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.238-.209-.344-.319-1.206-1.261-2.91-3.69-2.91-3.69s-.733-1.09-.272-2.146c.465-1.055 1.579-1.328 2.378-1.024.798.304 1.344 1.092 1.344 1.092s.546-.788 1.344-1.092c.799-.304 1.913-.031 2.378 1.024.461 1.056-.272 2.146-.272 2.146l.405.01zm5.286-.967c-.206 1.37-1.144 1.705-1.993 1.745V7.472c.849.04 1.787.375 1.993 1.745z" />
        </svg>
        <span className="font-semibold tracking-wide">
          {t(uiTranslations.coffee.button)}
        </span>
      </a>
    </FloatingBubble>
  );
};
