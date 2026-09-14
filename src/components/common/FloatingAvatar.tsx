import React, { useLayoutEffect, useRef } from 'react';
import { cvData } from '../../data/cvData';

export interface FloatingAvatarProps {
  startRect: DOMRect;
  endRect: DOMRect;
  direction: 'to-cv' | 'to-hero';
  onComplete: () => void;
  avatarUrl?: string;
  name?: string;
}

export const FloatingAvatar: React.FC<FloatingAvatarProps> = ({
  startRect,
  endRect,
  direction,
  onComplete,
  avatarUrl = cvData.header.avatarUrl,
  name = cvData.header.name,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const dX = startRect.left - endRect.left;
  const dY = startRect.top - endRect.top;
  const scale = startRect.width / endRect.width;
  const duration = direction === 'to-cv' ? 480 : 420;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Support reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onCompleteRef.current();
      return;
    }

    // 1. Invert: Set initial translated and scaled position
    el.style.transform = `translate3d(${dX}px, ${dY}px, 0) scale(${scale})`;
    el.style.transition = 'none';

    // Force browser reflow so initial transform is committed synchronously
    void el.offsetHeight;

    // 2. Play: Animate cleanly to final destination (0, 0, 0) scale(1)
    el.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    el.style.transform = 'translate3d(0, 0, 0) scale(1)';

    let completed = false;
    const finish = () => {
      if (!completed) {
        completed = true;
        onCompleteRef.current();
      }
    };

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.target === el && e.propertyName === 'transform') {
        finish();
      }
    };

    el.addEventListener('transitionend', handleTransitionEnd);
    const fallbackTimer = setTimeout(finish, duration + 60);

    return () => {
      el.removeEventListener('transitionend', handleTransitionEnd);
      clearTimeout(fallbackTimer);
    };
  }, [dX, dY, scale, duration]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: `${endRect.top}px`,
        left: `${endRect.left}px`,
        width: `${endRect.width}px`,
        height: `${endRect.height}px`,
        transformOrigin: 'top left',
        zIndex: 100,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
      className="rounded-full"
    >
      <div className="relative w-full h-full rounded-full">
        {/* Subtle cosmic aura during flight */}
        <div
          className="absolute -inset-2.5 rounded-full pointer-events-none opacity-60"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 229, 255, 0.65) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 75%)',
          }}
          aria-hidden="true"
        />
        <img
          src={avatarUrl}
          alt={name}
          className="relative w-full h-full rounded-full object-cover border-4 border-white dark:border-cyan-400/50 shadow-2xl bg-[var(--bg-avatar)]"
        />
      </div>
    </div>
  );
};
