import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { SupportedLanguage } from '../../types/cv';

interface LanguageItem {
  code: SupportedLanguage;
  label: string;
  punct?: string;
}

const languages: LanguageItem[] = [
  { code: 'en', label: 'Hello', punct: ',' },
  { code: 'fr', label: 'Bonjour', punct: ',' },
  { code: 'pt', label: 'Olá!' },
];

export const LanguageSelect: React.FC = () => {
  const { selectedLang, setSelectedLang, setPreviewLang } = useLanguage();
  const containerRef = useRef<HTMLHeadingElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const updateIndicator = (targetLang?: SupportedLanguage) => {
    if (!containerRef.current) return;
    const lang = targetLang || selectedLang;
    const trigger = containerRef.current.querySelector<HTMLElement>(`[data-lang="${lang}"]`);
    if (!trigger) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const left = triggerRect.left - parentRect.left;
    const width = triggerRect.width;

    setIndicatorStyle({
      left,
      width,
      opacity: 1,
    });
  };

  useEffect(() => {
    updateIndicator(selectedLang);
    const rafId = requestAnimationFrame(() => {
      updateIndicator(selectedLang);
    });
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => updateIndicator(selectedLang));
    }
    return () => cancelAnimationFrame(rafId);
  }, [selectedLang]);

  useEffect(() => {
    const handleResize = () => {
      updateIndicator(selectedLang);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedLang]);

  const handleMouseEnter = (lang: SupportedLanguage) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setPreviewLang(lang);
  };

  const handleContainerMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handleContainerMouseLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setPreviewLang(null);
    }, 220);
  };

  const handleSelect = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    updateIndicator(lang);
  };

  return (
    <h1
      ref={containerRef}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
      className="hero-greetings relative text-4xl sm:text-5xl md:text-[2.8rem] font-bold tracking-tight mb-4 inline-flex items-center justify-center flex-wrap pb-2 select-none"
      aria-label="Hello, Bonjour, Olá!"
    >
      {languages.map((langItem) => {
        const isSelected = selectedLang === langItem.code;
        return (
          <React.Fragment key={langItem.code}>
            <span
              data-lang={langItem.code}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(langItem.code)}
              onMouseEnter={() => handleMouseEnter(langItem.code)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(langItem.code);
                }
              }}
              className={`lang-trigger ${isSelected ? 'active' : ''}`}
            >
              {langItem.label}
            </span>
            {langItem.punct && (
              <span className="greeting-punct">
                {langItem.punct}
              </span>
            )}
          </React.Fragment>
        );
      })}

      {/* Sliding & stretching underline indicator pinned to bottom of greetings */}
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="lang-indicator absolute bottom-[2px] left-0 h-[3px] bg-[var(--brand-primary)] dark:bg-[#00d2eb] rounded-full pointer-events-none shadow-[0_1px_4px_rgba(0,139,163,0.4)] dark:shadow-[0_0_12px_#00e5ff,0_0_4px_#00d2eb] transition-[transform,width,opacity] duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left"
        style={{
          transform: `translateX(${indicatorStyle.left}px)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
        }}
      />
    </h1>
  );
};
