import React from 'react';
import { Avatar } from '../common/Avatar';
import { LanguageSelect } from './LanguageSelect';
import { HeroActions } from './HeroActions';
import { useLanguage } from '../../context/LanguageContext';
import { uiTranslations } from '../../data/uiTranslations';

interface HeroSectionProps {
  onOpenCv: () => void;
  isAvatarHidden?: boolean;
  avatarRef?: React.Ref<HTMLDivElement>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCv,
  isAvatarHidden = false,
  avatarRef,
}) => {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-center text-center px-6 py-12 overflow-hidden">
      {/* Background Radial Aura for central text contrast */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80 dark:opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 680px 420px at center, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 50%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Hero Avatar */}
      <div className="mb-6 z-10">
        <Avatar
          size="hero"
          showGlow={true}
          isHidden={isAvatarHidden}
          ref={avatarRef}
        />
      </div>

      {/* Multilingual Greetings Switcher */}
      <div className="z-10">
        <LanguageSelect />
      </div>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl md:text-2xl text-[var(--text-secondary)] max-w-xl leading-relaxed z-10 min-h-[2em] transition-opacity duration-200 font-medium dark:font-normal drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-none">
        {t(uiTranslations.hero.subtitle)}
      </p>

      {/* Actions */}
      <div className="z-10">
        <HeroActions onOpenCv={onOpenCv} />
      </div>

      {/* Bottom Scroll Hint pinned to the bottom of the 100vh header */}
      <a
        href="#projects"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:text-cyan-400/80 dark:hover:text-cyan-200 transition-all duration-200 group cursor-pointer select-none px-3.5 py-1 rounded-full bg-[var(--bg-card)]/70 dark:bg-transparent backdrop-blur-xs border border-[var(--border-subtle)] dark:border-transparent shadow-xs dark:shadow-none"
        aria-label="Scroll to projects"
      >
        <span className="text-[11px] font-semibold tracking-wider uppercase opacity-85 group-hover:opacity-100 transition-opacity">
          {t(uiTranslations.hero.scrollButton)}
        </span>
        <span className="inline-block animate-bounce-slow text-base leading-none text-[var(--brand-primary)]">↓</span>
      </a>
    </section>
  );
};
