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
        if (!isCvOpen && !isCvClosing) {
          handleOpenCv(false);
        }
      } else if (isCvOpen && !isCvClosing) {
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
    if (floatingState || isCvClosing) return;

    if (updateHash && typeof window !== 'undefined' && window.location.hash !== '#resume') {
      window.history.pushState(null, '', '#resume');
    }

    if (!heroAvatarRef.current) {
      setIsCvOpen(true);
      setIsAvatarDocked(true);
      return;
    }

    const heroRect = heroAvatarRef.current.getBoundingClientRect();
    // Immediately hide hero avatar so it never lingers/fades on the back
    setIsAvatarHidden(true);
    setIsAvatarDocked(false);
    setIsCvClosing(false);
    setIsCvOpen(true);

    // Measure CV avatar destination on next animation frame once modal mounts
    requestAnimationFrame(() => {
      if (!cvAvatarRef.current) {
        setIsAvatarDocked(true);
        return;
      }

      const cvRect = cvAvatarRef.current.getBoundingClientRect();
      setFloatingState({
        startRect: heroRect,
        endRect: cvRect,
        direction: 'to-cv',
      });
    });
  };

  const handleCloseCv = (updateHash = true) => {
    if (floatingState || isCvClosing) return;

    if (updateHash && typeof window !== 'undefined' && isResumeHash(window.location.hash)) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }

    if (!cvAvatarRef.current || !heroAvatarRef.current) {
      setIsCvOpen(false);
      setIsCvClosing(false);
      setIsAvatarHidden(false);
      setIsAvatarDocked(false);
      setFloatingState(null);
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
    }
  };

  const handleFloatingComplete = () => {
    if (floatingState?.direction === 'to-cv') {
      setIsAvatarDocked(true);
      setFloatingState(null);
    } else if (floatingState?.direction === 'to-hero') {
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
