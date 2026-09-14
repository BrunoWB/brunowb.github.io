import React from 'react';
import { TypewriterText } from '../common/TypewriterText';
import { useLanguage } from '../../context/LanguageContext';
import { useTypewriterController } from '../../context/TypewriterContext';
import { cvData } from '../../data/cvData';

export const CvTimeline: React.FC = () => {
  const { t, effectiveLang } = useLanguage();
  const { currentStep, isSkipped } = useTypewriterController();

  return (
    <section className="w-full lg:w-[68%] pl-0 lg:pl-6 text-[var(--text-secondary)]">
      {/* Section Title */}
      <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--brand-primary)] mb-6 border-b border-[var(--border-subtle)] pb-1 flex items-center justify-between">
        <span>{t(cvData.experience.title)}</span>
        <span className="text-xs font-mono font-normal text-[var(--text-muted)]">
          {cvData.experience.positions.filter((p) => p.company).length} Positions
        </span>
      </h3>

      {/* Continuous Vertical Timeline */}
      <div className="relative pl-7 sm:pl-8 space-y-7">
        {/* Continuous vertical line running straight through the center of all dots (center at x = 8px) */}
        <div
          className="absolute left-[7px] top-2.5 bottom-6 w-[2px] bg-[var(--timeline-line)]"
          aria-hidden="true"
        />

        {/* Subtle dashed line continuation at bottom of timeline */}
        <div
          className="absolute left-[7px] -bottom-2 h-6 w-[2px] border-l-2 border-dashed border-[var(--timeline-line)]"
          aria-hidden="true"
        />

        {cvData.experience.positions.map((pos, idx) => {
          const isItemActive = currentStep >= 1 || isSkipped;
          const bullets = pos.bullets
            ? pos.bullets[effectiveLang] || pos.bullets.en
            : [];
          const hasPeriodOrLoc = Boolean(pos.period || pos.location);

          return (
            <div
              key={pos.id}
              className={`relative transition-opacity duration-300 ${
                isItemActive ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {/* Timeline Dot Node - 16px wide, centered at x = 8px (offset: -28px on pl-7, -32px on sm:pl-8) */}
              <div
                className={`absolute -left-[28px] sm:-left-[32px] top-[3px] w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isItemActive
                    ? pos.id === 'open-for-opportunities'
                      ? 'bg-emerald-500 dark:bg-emerald-400 border-[var(--bg-paper)] shadow-sm dark:shadow-[0_0_10px_#10b981]'
                      : 'bg-[var(--brand-primary)] border-[var(--bg-paper)] shadow-sm dark:shadow-[0_0_10px_#00e5ff]'
                    : 'bg-[var(--border-subtle)] border-[var(--bg-paper)]'
                }`}
                aria-hidden="true"
              />

              {/* Role & Company Header */}
              <div className="leading-snug">
                <TypewriterText
                  text={pos.company ? `${t(pos.role)} | ${pos.company}` : t(pos.role)}
                  step={1}
                  speed={15}
                  delay={40 + idx * 30}
                  cursor={false}
                  className={`text-sm sm:text-base font-bold ${
                    pos.id === 'open-for-opportunities'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-[var(--text-primary)]'
                  }`}
                />
              </div>

              {/* Period & Location stacked beneath title like reference CV */}
              {hasPeriodOrLoc && (
                <div className="text-xs sm:text-sm font-semibold text-[var(--brand-primary)] mt-0.5 mb-2">
                  {[pos.period ? t(pos.period) : '', pos.location ? t(pos.location) : ''].filter(Boolean).join(' | ')}
                </div>
              )}

              {/* Bullets List */}
              {bullets.length > 0 && (
                <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed list-disc list-outside pl-4">
                  {bullets.map((bullet, bIdx) => (
                    <TypewriterText
                      key={bIdx}
                      as="li"
                      text={bullet}
                      step={1}
                      speed={9}
                      delay={80 + idx * 40 + bIdx * 20}
                      cursor={false}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
