import React, { useLayoutEffect, useRef, useState } from 'react';
import { TypewriterText } from '../common/TypewriterText';
import { useLanguage } from '../../context/LanguageContext';
import { useTypewriterController } from '../../context/TypewriterContext';
import { useCvHover } from '../../context/CvHoverContext';
import { formatSkillsInText } from './cvSkillHighlighter';
import { cvData } from '../../data/cvData';

const BASE_STICKY_TOP = 0;

// Accurate initial fallback based on whether the position has a period/location line
const getInitialStickyTop = (index: number) => {
  let top = BASE_STICKY_TOP;
  for (let i = 0; i < index; i++) {
    const pos = cvData.experience.positions[i];
    const hasSubtitle = Boolean(pos.period || pos.location);
    top += hasSubtitle ? 58 : 34;
  }
  return top;
};

export const CvTimeline: React.FC = () => {
  const { t, effectiveLang } = useLanguage();
  const { currentStep, isSkipped } = useTypewriterController();
  const { setHoveredJobId, isJobHighlighted, hoveredSkill } = useCvHover();
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stickyTops, setStickyTops] = useState<number[]>(() =>
    cvData.experience.positions.map((_, idx) => getInitialStickyTop(idx))
  );

  // Dynamically measure actual rendered height of each header to ensure exact stacking with zero overlap
  useLayoutEffect(() => {
    const measureTops = () => {
      const newTops: number[] = [];
      let currentTop = BASE_STICKY_TOP;

      for (let i = 0; i < cvData.experience.positions.length; i++) {
        newTops[i] = currentTop;
        const el = headerRefs.current[i];
        if (el) {
          currentTop += el.offsetHeight;
        } else {
          const pos = cvData.experience.positions[i];
          currentTop += (pos.period || pos.location) ? 58 : 34;
        }
      }

      setStickyTops((prev) => {
        if (prev.length === newTops.length && prev.every((v, i) => v === newTops[i])) {
          return prev;
        }
        return newTops;
      });
    };

    measureTops();

    const resizeObserver = new ResizeObserver(() => {
      measureTops();
    });

    headerRefs.current.forEach((el) => {
      if (el) resizeObserver.observe(el);
    });

    window.addEventListener('resize', measureTops);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureTops);
    };
  }, [effectiveLang]);

  return (
    <section className="w-full lg:w-[68%] pl-0 lg:pl-6 text-[var(--text-secondary)]">
      {/* Section Title */}
      <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--brand-primary)] mb-6 border-b border-[var(--border-subtle)] pb-1">
        {t(cvData.experience.title)}
      </h3>

      {/* Continuous Vertical Timeline */}
      <div className="relative pl-7 sm:pl-8">
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
          const isJobActive = isJobHighlighted(pos.id);
          const bullets = pos.bullets
            ? pos.bullets[effectiveLang] || pos.bullets.en
            : [];
          const hasPeriodOrLoc = Boolean(pos.period || pos.location);

          const dotNode = (
            <div
              className={`absolute -left-[28px] sm:-left-[32px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 ${
                isItemActive
                  ? pos.id === 'open-for-opportunities'
                    ? 'bg-emerald-500 dark:bg-emerald-400 border-[var(--bg-paper)] shadow-sm dark:shadow-[0_0_10px_#10b981]'
                    : isJobActive
                    ? 'bg-[var(--brand-primary)] border-[var(--bg-paper)] shadow-md dark:shadow-[0_0_14px_#00e5ff] scale-110'
                    : 'bg-[var(--brand-primary)] border-[var(--bg-paper)] shadow-sm dark:shadow-[0_0_10px_#00e5ff]'
                  : 'bg-[var(--border-subtle)] border-[var(--bg-paper)]'
              }`}
              aria-hidden="true"
            />
          );

          return (
            <React.Fragment key={pos.id}>
              {/* Stacked Sticky Role & Company Header - All stay sticky */}
              <div
                id={`job-header-${pos.id}`}
                ref={(el) => {
                  headerRefs.current[idx] = el;
                }}
                style={{
                  top: `calc(var(--cv-sticky-top-offset, 0px) + ${stickyTops[idx] ?? getInitialStickyTop(idx)}px)`,
                  zIndex: 35 - idx,
                }}
                onMouseEnter={() => {
                  if (pos.company) setHoveredJobId(pos.id);
                }}
                onMouseLeave={() => {
                  if (pos.company) setHoveredJobId(null);
                }}
                className={`sticky bg-[var(--bg-paper)]/95 dark:bg-[var(--bg-paper)]/95 backdrop-blur-md py-1.5 -mx-2 px-2 rounded-lg transition-opacity duration-200 ${
                  isItemActive ? 'opacity-100' : 'opacity-30'
                }`}
              >
                {/* Role & Company Header */}
                <div className="relative leading-snug">
                  {!hasPeriodOrLoc && dotNode}
                  <TypewriterText
                    text={pos.company ? `${t(pos.role)} | ${pos.company}` : t(pos.role)}
                    step={1}
                    speed={10}
                    delay={30 + idx * 25}
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
                  <div className="relative text-xs sm:text-sm font-semibold text-[var(--brand-primary)] mt-0.5 mb-0.5">
                    {dotNode}
                    {[pos.period ? t(pos.period) : '', pos.location ? t(pos.location) : ''].filter(Boolean).join(' | ')}
                  </div>
                )}
              </div>

              {/* Bullets List */}
              {bullets.length > 0 && (
                <div
                  onMouseEnter={() => {
                    if (pos.company) setHoveredJobId(pos.id);
                  }}
                  onMouseLeave={() => {
                    if (pos.company) setHoveredJobId(null);
                  }}
                  className={`relative pt-2 pb-6 pl-2 -ml-2 rounded-lg ${
                    isItemActive ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed list-disc list-outside pl-4">
                    {bullets.map((bullet, bIdx) => (
                      <TypewriterText
                        key={bIdx}
                        as="li"
                        text={bullet}
                        step={1}
                        speed={6}
                        delay={50 + idx * 25 + bIdx * 15}
                        cursor={false}
                        formatter={(chunk) => formatSkillsInText(chunk, isJobActive, hoveredSkill)}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {bullets.length === 0 && <div className="h-5" />}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
