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
  const auraRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const animationRef = useRef<Animation | null>(null);
  const isFinishedRef = useRef(false);

  const targetDx = endRect.left - startRect.left;
  const targetDy = endRect.top - startRect.top;
  const targetScale = endRect.width / startRect.width;
  const duration = direction === 'to-cv' ? 460 : 400;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Support reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (!isFinishedRef.current) {
        isFinishedRef.current = true;
        onCompleteRef.current();
      }
      return;
    }

    const finalTransform = `translate3d(${targetDx}px, ${targetDy}px, 0) scale(${targetScale})`;

    const finish = () => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;

      // Lock element directly to final transform so it never reverts or snaps back
      el.style.transform = finalTransform;
      if (auraRef.current) {
        auraRef.current.style.opacity = direction === 'to-cv' ? '0' : '0.7';
      }

      onCompleteRef.current();
    };

    // If an animation is already running (e.g. across StrictMode unmount/remount), preserve it!
    if (animationRef.current && animationRef.current.playState === 'running') {
      animationRef.current.onfinish = finish;
      return;
    }

    // Web Animations API for 60/120fps hardware-accelerated flight
    const animation = el.animate(
      [
        { transform: 'translate3d(0, 0, 0) scale(1)' },
        { transform: finalTransform },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      }
    );
    animationRef.current = animation;
    animation.onfinish = finish;

    if (auraRef.current) {
      auraRef.current.animate(
        [
          { opacity: direction === 'to-cv' ? 0.7 : 0 },
          { opacity: direction === 'to-cv' ? 0 : 0.7 },
        ],
        {
          duration,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards',
        }
      );
    }

    const fallbackTimer = setTimeout(finish, duration + 40);

    return () => {
      clearTimeout(fallbackTimer);
      // NOTE: Do NOT call animation.cancel() here!
      // In StrictMode or on unmount, cancelling removes forwards transform and causes visual snap-back.
    };
  }, [targetDx, targetDy, targetScale, duration, direction]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: `${startRect.top}px`,
        left: `${startRect.left}px`,
        width: `${startRect.width}px`,
        height: `${startRect.height}px`,
        transformOrigin: 'top left',
        zIndex: 100,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
      className="rounded-full"
    >
      <div className="relative w-full h-full rounded-full">
        {/* Subtle cosmic aura during flight - dissolves smoothly on arrival */}
        <div
          ref={auraRef}
          className="absolute -inset-2.5 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 229, 255, 0.65) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 75%)',
            opacity: direction === 'to-cv' ? 0.7 : 0,
          }}
          aria-hidden="true"
        />
        <div className="relative w-full h-full rounded-full border-4 border-white dark:border-cyan-400/40 shadow-xl bg-[var(--bg-avatar)] overflow-hidden">
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
