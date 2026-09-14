import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { SupportedLanguage } from '../../types/cv';

export const LanguageSelect: React.FC = () => {
  const { selectedLang, previewLang, setSelectedLang, setPreviewLang } = useLanguage();
  const containerRef = useRef<HTMLHeadingElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    opacity: number;
  }>({ left: 0, top: 0, width: 0, opacity: 0 });

  const activeLang = previewLang ?? selectedLang;

  const updateIndicatorPosition = (lang: SupportedLanguage) => {
    if (!containerRef.current) return;
    const trigger = containerRef.current.querySelector<HTMLElement>(`[data-lang="${lang}"]`);
    if (!trigger) return;

    const textEl = trigger.querySelector<HTMLElement>('.lang-text') || trigger;
    const parentRect = containerRef.current.getBoundingClientRect();
    const textRect = textEl.getBoundingClientRect();

    setIndicatorStyle({
      left: textRect.left - parentRect.left,
      top: textRect.bottom - parentRect.top + 2,
      width: textRect.width,
      opacity: 1,
    });
  };

  useEffect(() => {
    updateIndicatorPosition(activeLang);
    const rafId = requestAnimationFrame(() => {
      updateIndicatorPosition(activeLang);
    });
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => updateIndicatorPosition(activeLang));
    }
    return () => cancelAnimationFrame(rafId);
  }, [activeLang]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      updateIndicatorPosition(activeLang);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeLang]);

  const handleMouseEnter = (lang: SupportedLanguage) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setPreviewLang(lang);
  };

  const handleContainerMouseLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setPreviewLang(null);
    }, 200);
  };

  const handleClick = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
  };

  const getLanguageClasses = (lang: SupportedLanguage) => {
    const isActive = activeLang === lang;
    if (isActive) {
      return 'text-slate-950 dark:text-white dark:drop-shadow-[0_0_8px_rgba(0,229,255,0.45)] font-bold';
    }
    return 'text-slate-700/80 dark:text-[#e6f6f8]/40 hover:text-slate-950 dark:hover:text-[#e6f6f8]/80 hover:bg-white/40 dark:hover:bg-cyan-500/10 font-semibold dark:font-normal';
  };

  return (
    <h1
      ref={containerRef}
      onMouseLeave={handleContainerMouseLeave}
      className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 inline-flex items-center justify-center flex-wrap pb-3"
      aria-label="Hello, Bonjour, Olá!"
    >
      {/* English */}
      <span
        data-lang="en"
        role="button"
        tabIndex={0}
        onClick={() => handleClick('en')}
        onMouseEnter={() => handleMouseEnter('en')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick('en');
          }
        }}
        className={`cursor-pointer px-2.5 py-1 rounded-lg select-none transition-all duration-200 outline-none ${getLanguageClasses('en')}`}
      >
        <span className="lang-text inline-block">Hello</span>
      </span>
      <span className="text-slate-600 dark:text-cyan-400/50 mr-0.5 select-none font-normal">,</span>

      {/* French */}
      <span
        data-lang="fr"
        role="button"
        tabIndex={0}
        onClick={() => handleClick('fr')}
        onMouseEnter={() => handleMouseEnter('fr')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick('fr');
          }
        }}
        className={`cursor-pointer px-2.5 py-1 rounded-lg select-none transition-all duration-200 outline-none ${getLanguageClasses('fr')}`}
      >
        <span className="lang-text inline-block">Bonjour</span>
      </span>
      <span className="text-slate-600 dark:text-cyan-400/50 mr-0.5 select-none font-normal">,</span>

      {/* Portuguese */}
      <span
        data-lang="pt"
        role="button"
        tabIndex={0}
        onClick={() => handleClick('pt')}
        onMouseEnter={() => handleMouseEnter('pt')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick('pt');
          }
        }}
        className={`cursor-pointer px-2.5 py-1 rounded-lg select-none transition-all duration-200 outline-none ${getLanguageClasses('pt')}`}
      >
        <span className="lang-text inline-block">Olá!</span>
      </span>

      {/* Sliding and stretching underline indicator placed right below the active word */}
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="absolute top-0 left-0 h-[3.5px] bg-cyan-600 dark:bg-[#00d2eb] rounded-full pointer-events-none shadow-sm dark:shadow-[0_0_12px_#00e5ff,0_0_4px_#00d2eb] transition-all duration-300 ease-out"
        style={{
          transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
        }}
      />
    </h1>
  );
};
