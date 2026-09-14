import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTypewriterController } from '../../context/TypewriterContext';
import { cvData } from '../../data/cvData';
import { uiTranslations } from '../../data/uiTranslations';

interface CvHeaderProps {
  onClose: () => void;
}

export const CvHeader: React.FC<CvHeaderProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { currentStep, isSkipped, skipAll, advanceStep } = useTypewriterController();

  // Advance from step 0 (paper slide-down / avatar dock) to step 1 (name typing)
  useEffect(() => {
    if (currentStep === 0 && !isSkipped) {
      const timer = setTimeout(() => {
        advanceStep();
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isSkipped, advanceStep]);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between w-full mb-3 px-1 sm:px-2 pointer-events-none">
      <div className="text-xs px-3 py-1 text-[var(--text-muted)] font-mono bg-black/40 backdrop-blur-md rounded-full border border-[var(--border-subtle)] select-none pointer-events-auto hidden sm:block">
        {cvData.contact.linkedin}
      </div>

      <div className="flex items-center gap-2.5 ml-auto pointer-events-auto">
        {!isSkipped && (
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
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={t(uiTranslations.cvModal.close)}
          title={t(uiTranslations.cvModal.close)}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-slate-300 hover:text-white border border-white/20 backdrop-blur-md cursor-pointer transition-all duration-200 shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
