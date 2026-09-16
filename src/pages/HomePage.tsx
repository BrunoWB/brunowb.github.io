import React, { useState, useRef, useEffect } from 'react';
import { HeroSection } from '../components/hero/HeroSection';
import { ProjectsSection } from '../components/projects/ProjectsSection';
import { CvPaperModal } from '../components/cv/CvPaperModal';
import { FloatingAvatar } from '../components/common/FloatingAvatar';

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

  const handleOpenCv = (updateHash = true) => {
    if (isTransitioningRef.current || floatingState || isCvOpen || isCvClosing) return;
    isTransitioningRef.current = true;

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

    // Keep hero avatar visible for the 1 frame until floating avatar mounts to prevent blackout
    setIsAvatarDocked(false);
    setIsCvClosing(false);
    setIsCvOpen(true);

    // Measure fresh CV and hero destination on next animation frame once modal is rendered
    requestAnimationFrame(() => {
      if (!heroAvatarRef.current || !cvAvatarRef.current) {
        setIsAvatarHidden(true);
        setIsAvatarDocked(true);
        isTransitioningRef.current = false;
        return;
      }

      const heroRect = heroAvatarRef.current.getBoundingClientRect();
      const cvRect = cvAvatarRef.current.getBoundingClientRect();
      if (cvRect.width === 0 || cvRect.height === 0) {
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
    });
  };

  const handleCloseCv = (updateHash = true) => {
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
    </main>
  );
};
