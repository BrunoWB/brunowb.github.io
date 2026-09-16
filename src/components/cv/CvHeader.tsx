import React, { useEffect } from 'react';
import { TypewriterText } from '../common/TypewriterText';
import { useLanguage } from '../../context/LanguageContext';
import { useTypewriterController } from '../../context/TypewriterContext';
import { cvData } from '../../data/cvData';
import { uiTranslations } from '../../data/uiTranslations';

interface CvHeaderProps {
  onClose: () => void;
  isAvatarDocked?: boolean;
  cvAvatarRef?: React.Ref<HTMLDivElement>;
  isScrolled?: boolean;
}

export const CvHeader: React.FC<CvHeaderProps> = ({
  onClose,
  isAvatarDocked = true,
  cvAvatarRef,
  isScrolled = false,
}) => {
  const { t } = useLanguage();
  const { currentStep, isSkipped, skipAll, advanceStep } = useTypewriterController();

  // Advance from step 0 (paper slide-down / avatar dock) to step 1 (name typing)
  useEffect(() => {
    if (currentStep === 0 && !isSkipped) {
      const timer = setTimeout(() => {
        advanceStep();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isSkipped, advanceStep]);

  return (
    <div className="relative w-full overflow-visible bg-transparent">
      {/* Top Banner Area - Completely Transparent to allow website background to show through */}
      <div className="relative h-24 sm:h-28 md:h-32 w-full overflow-visible bg-transparent">
        {/* Top Control Bar: Skip Animation Badge & Close Button */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-5 z-30 flex items-center gap-2.5">
          {!isSkipped ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                skipAll();
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 backdrop-blur-md cursor-pointer transition-all duration-200 shadow-sm"
              title="Reveal all text"
            >
              {t(uiTranslations.cvModal.skipPrompt)}
            </button>
          ) : (
            <div className="text-xs px-3 py-1 text-cyan-200/70 font-mono bg-black/40 rounded-full border border-cyan-500/20 backdrop-blur-xs">
              {cvData.contact.linkedin}
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label={t(uiTranslations.cvModal.close)}
            title={t(uiTranslations.cvModal.close)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-slate-300 hover:text-white border border-white/20 backdrop-blur-md cursor-pointer transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Name "BRUNO BARCELLOS" - Outside the paper area on the transparent website background */}
        <div
          className={`absolute inset-x-0 bottom-2.5 sm:bottom-3 md:bottom-3.5 pl-34 sm:pl-44 md:pl-48 pr-4 sm:pr-8 flex items-center transition-all duration-300 ${
            isScrolled ? 'opacity-0 -translate-x-8 pointer-events-none' : 'opacity-100 translate-x-0'
          }`}
        >
          <TypewriterText
            text={cvData.header.name}
            step={1}
            speed={18}
            as="h1"
            cursor={true}
            onComplete={() => advanceStep()}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.16em] sm:tracking-[0.2em] text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] select-none"
          />
        </div>

        {/* Avatar Circle - Straddles the banner and paper boundary */}
        <div
          className={`absolute left-6 sm:left-10 -bottom-12 sm:-bottom-14 md:-bottom-16 z-20 transition-[transform,opacity] duration-300 ${
            isScrolled ? 'opacity-0 scale-75 -translate-y-4 pointer-events-none' : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          <div
            ref={cvAvatarRef}
            className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-cyan-400/40 shadow-xl bg-[var(--bg-avatar)] overflow-hidden ${
              isAvatarDocked ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={cvData.header.avatarUrl}
              alt={cvData.header.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface CvPaperTitleBarProps {
  isScrolled?: boolean;
}

export const CvPaperTitleBar: React.FC<CvPaperTitleBarProps> = ({ isScrolled = false }) => {
  const { t } = useLanguage();
  const { advanceStep } = useTypewriterController();

  return (
    <div className="relative pt-3 sm:pt-3.5 pb-3.5 sm:pb-4 pl-34 sm:pl-44 md:pl-48 pr-6 sm:pr-10 border-b border-[var(--border-subtle)] overflow-hidden">
      <div
        className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 transition-all duration-300 ${
          isScrolled ? 'opacity-0 -translate-x-8 pointer-events-none' : 'opacity-100 translate-x-0'
        }`}
      >
        {/* Title on Paper: Software Engineer */}
        <div>
          <TypewriterText
            text={t(cvData.header.title)}
            step={2}
            speed={15}
            as="h2"
            cursor={true}
            onComplete={() => advanceStep()}
            className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-[var(--brand-primary)] select-none"
          />
        </div>

        {/* Location & Contact snippet on desktop header */}
        <div className="text-xs sm:text-right text-[var(--text-muted)] hidden sm:block">
          <p className="font-semibold text-[var(--text-secondary)]">
            {t(cvData.profile.location)}
          </p>
          <p className="font-mono text-[11px]">{cvData.contact.email}</p>
          <p className="font-mono text-[11px]">{cvData.contact.phone}</p>
        </div>
      </div>
    </div>
  );
};
