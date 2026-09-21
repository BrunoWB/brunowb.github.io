import React, { useState, useRef, useEffect } from 'react';
import { HeroSection } from '../components/hero/HeroSection';
import { ProjectsSection } from '../components/projects/ProjectsSection';
import { CvPaperModal } from '../components/cv/CvPaperModal';
import { CvPrintDocument } from '../components/cv/CvPrintDocument';
import { FloatingAvatar } from '../components/common/FloatingAvatar';
import { CanvasBackground } from '../components/background/CanvasBackground';

interface FloatingState {
  startRect: DOMRect;
  endRect: DOMRect;
  direction: 'to-cv' | 'to-hero';
}

const isResumeHash = (hash: string) => hash === '#resume' || hash === '#cv';

const checkShouldOpenCv = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('cv') === 'open' || isResumeHash(window.location.hash);
};

export const HomePage: React.FC = () => {
  const [isCvOpen, setIsCvOpen] = useState(checkShouldOpenCv);
  const [isCvClosing, setIsCvClosing] = useState(false);
  const [isAvatarHidden, setIsAvatarHidden] = useState(checkShouldOpenCv);
  const [isAvatarDocked, setIsAvatarDocked] = useState(checkShouldOpenCv);
  const [floatingState, setFloatingState] = useState<FloatingState | null>(null);

  const heroAvatarRef = useRef<HTMLDivElement>(null);
  const cvAvatarRef = useRef<HTMLDivElement>(null);

  const isTransitioningRef = useRef(false);
  const cancelScrollRef = useRef<(() => void) | null>(null);
  const openRafRef = useRef<number | null>(null);


  useEffect(() => {
    return () => {
      if (cancelScrollRef.current) {
        cancelScrollRef.current();
      }
      if (openRafRef.current) {
        cancelAnimationFrame(openRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('section') === 'projects' || window.location.hash === '#projects') {
      setTimeout(() => {
        document.getElementById('projects')?.scrollIntoView();
      }, 100);
    }

    const handleHashChange = () => {
      const shouldOpen = isResumeHash(window.location.hash);
      if (shouldOpen) {
        if (!isCvOpen && !isCvClosing && !isTransitioningRef.current) {
          handleOpenCv(false);
        }
      } else if (isCvOpen && !isCvClosing && !isTransitioningRef.current) {
        handleCloseCv(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [isCvOpen, isCvClosing]);

  const triggerOpenCv = (updateHash: boolean) => {
    if (updateHash && typeof window !== 'undefined' && window.location.hash !== '#resume') {
      window.history.pushState(null, '', '#resume');
    }

    if (!heroAvatarRef.current) {
      setIsCvOpen(true);
      setIsAvatarDocked(true);
      isTransitioningRef.current = false;
      return;
    }

    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Keep hero avatar visible until floating avatar mounts to prevent blackout
    setIsAvatarDocked(false);
    setIsCvClosing(false);
    setIsCvOpen(true);

    if (openRafRef.current) {
      cancelAnimationFrame(openRafRef.current);
      openRafRef.current = null;
    }

    // Measure fresh CV and hero destination once modal is rendered in DOM
    let frameCount = 0;
    const maxFrames = 20;

    const measureAndAnimate = () => {
      frameCount++;
      const heroEl = heroAvatarRef.current;
      const cvEl = cvAvatarRef.current;

      if (!heroEl || !cvEl) {
        if (frameCount < maxFrames) {
          openRafRef.current = requestAnimationFrame(measureAndAnimate);
          return;
        }
        setIsAvatarHidden(true);
        setIsAvatarDocked(true);
        isTransitioningRef.current = false;
        return;
      }

      const heroRect = heroEl.getBoundingClientRect();
      const cvRect = cvEl.getBoundingClientRect();
      if (cvRect.width === 0 || cvRect.height === 0 || heroRect.width === 0) {
        if (frameCount < maxFrames) {
          openRafRef.current = requestAnimationFrame(measureAndAnimate);
          return;
        }
        setIsAvatarHidden(true);
        setIsAvatarDocked(true);
        isTransitioningRef.current = false;
        return;
      }

      // Simultaneously hide hero avatar and spawn floating avatar in the exact same render
      setIsAvatarHidden(true);
      setFloatingState({
        startRect: heroRect,
        endRect: cvRect,
        direction: 'to-cv',
      });
      openRafRef.current = null;
    };

    openRafRef.current = requestAnimationFrame(measureAndAnimate);
  };

  const handleOpenCv = (updateHash = true) => {
    if (isTransitioningRef.current || floatingState || isCvOpen || isCvClosing) return;
    isTransitioningRef.current = true;

    if (cancelScrollRef.current) {
      cancelScrollRef.current();
    }

    const currentScrollY =
      typeof window !== 'undefined'
        ? window.scrollY || document.documentElement.scrollTop || 0
        : 0;

    // If already scrolled to top (within 1px margin for subpixel rendering), open immediately
    if (currentScrollY <= 1 || typeof window === 'undefined') {
      triggerOpenCv(updateHash);
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      triggerOpenCv(updateHash);
      return;
    }

    let completed = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('scrollend', onScrollComplete);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      cancelScrollRef.current = null;
    };

    const onScrollComplete = () => {
      if (completed) return;
      completed = true;
      cleanup();
      window.scrollTo({ top: 0, behavior: 'auto' });
      triggerOpenCv(updateHash);
    };

    const checkScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      if (y <= 1) {
        onScrollComplete();
      }
    };

    cancelScrollRef.current = cleanup;
    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('scrollend', onScrollComplete, { once: true });
    const scrollTimeout = Math.max(1200, Math.min(2500, Math.round(currentScrollY * 1.5)));
    timeoutId = setTimeout(onScrollComplete, scrollTimeout);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseCv = (updateHash = true) => {
    if (cancelScrollRef.current) {
      cancelScrollRef.current();
    }
    if (openRafRef.current) {
      cancelAnimationFrame(openRafRef.current);
      openRafRef.current = null;
    }

    if (isTransitioningRef.current || floatingState || isCvClosing || !isCvOpen) return;
    isTransitioningRef.current = true;

    if (updateHash && typeof window !== 'undefined' && isResumeHash(window.location.hash)) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }

    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }

    if (!cvAvatarRef.current || !heroAvatarRef.current) {
      setIsCvOpen(false);
      setIsCvClosing(false);
      setIsAvatarHidden(false);
      setIsAvatarDocked(false);
      setFloatingState(null);
      isTransitioningRef.current = false;
      return;
    }

    const cvRect = cvAvatarRef.current.getBoundingClientRect();
    const heroRect = heroAvatarRef.current.getBoundingClientRect();

    // Verify hero rect and cv rect are valid and in viewport
    if (cvRect.width > 0 && heroRect.width > 0 && cvRect.bottom > 0) {
      setIsAvatarDocked(false);
      setIsCvClosing(true);

      setFloatingState({
        startRect: cvRect,
        endRect: heroRect,
        direction: 'to-hero',
      });
    } else {
      setIsCvOpen(false);
      setIsCvClosing(false);
      setIsAvatarHidden(false);
      setIsAvatarDocked(false);
      setFloatingState(null);
      isTransitioningRef.current = false;
    }
  };

  const handleFloatingComplete = () => {
    isTransitioningRef.current = false;
    if (floatingState?.direction === 'to-cv') {
      // Dock CV avatar and remove floating avatar atomically in the same render
      setIsAvatarDocked(true);
      setFloatingState(null);
    } else if (floatingState?.direction === 'to-hero') {
      // Reveal hero avatar and close modal atomically in the same render
      setIsAvatarHidden(false);
      setIsCvOpen(false);
      setIsCvClosing(false);
      setFloatingState(null);
    }
  };

  return (
    <main className="relative min-h-screen">
      <div className="print:hidden">
        <CanvasBackground />
        <HeroSection
          onOpenCv={handleOpenCv}
          isAvatarHidden={isAvatarHidden}
          avatarRef={heroAvatarRef}
        />
        <ProjectsSection />

        <CvPaperModal
          isOpen={isCvOpen}
          isClosing={isCvClosing}
          onClose={handleCloseCv}
          isAvatarDocked={isAvatarDocked}
          cvAvatarRef={cvAvatarRef}
        />
        {floatingState && (
          <FloatingAvatar
            startRect={floatingState.startRect}
            endRect={floatingState.endRect}
            direction={floatingState.direction}
            onComplete={handleFloatingComplete}
          />
        )}
      </div>
      <CvPrintDocument />
    </main>
  );
};
