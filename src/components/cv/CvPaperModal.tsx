import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TypewriterProvider, useTypewriterController } from '../../context/TypewriterContext';
import { CvHoverProvider } from '../../context/CvHoverContext';
import { CvHeader, CvPaperTitleBar, CvSmallHeader } from './CvHeader';
import { CvSidebar } from './CvSidebar';
import { CvTimeline } from './CvTimeline';

interface CvPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAvatarDocked?: boolean;
  cvAvatarRef?: React.Ref<HTMLDivElement>;
  isClosing?: boolean;
}

const CvPaperContent: React.FC<{
  onClose: () => void;
  isAvatarDocked?: boolean;
  cvAvatarRef?: React.Ref<HTMLDivElement>;
  isClosing?: boolean;
  isScrolled?: boolean;
}> = ({ onClose, isAvatarDocked, cvAvatarRef, isClosing, isScrolled = false }) => {
  const { isSkipped, skipAll } = useTypewriterController();
  const mobileHeaderRef = useRef<HTMLDivElement>(null);
  const [mobileHeaderHeight, setMobileHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (!isScrolled) {
      setMobileHeaderHeight(0);
      return;
    }

    const updateHeight = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        setMobileHeaderHeight(0);
        return;
      }
      if (mobileHeaderRef.current) {
        const rect = mobileHeaderRef.current.getBoundingClientRect();
        const h = rect.height > 0 ? rect.height : mobileHeaderRef.current.offsetHeight;
        if (h > 0) {
          // Subtract 1px so the job sticky header overlaps the 1px bottom border, eliminating any subpixel gap
          setMobileHeaderHeight(Math.max(0, Math.floor(h) - 1));
          return;
        }
      }
      setMobileHeaderHeight(window.innerWidth >= 640 ? 80 : 72);
    };

    updateHeight();

    const ro = new ResizeObserver(() => {
      updateHeight();
    });

    if (mobileHeaderRef.current) {
      ro.observe(mobileHeaderRef.current);
    }

    window.addEventListener('resize', updateHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [isScrolled]);

  return (
    <CvHoverProvider>
      <div
        onClick={() => {
          if (!isSkipped) skipAll();
        }}
        className={`relative w-full max-w-5xl animate-paper-fade-in overflow-visible my-6 sm:my-10 cursor-default transition-[opacity,transform] duration-300 ${
          isClosing ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Top Banner Area - Completely transparent, outside the paper area, showing real website background */}
        <CvHeader
          onClose={onClose}
          isAvatarDocked={isAvatarDocked}
          cvAvatarRef={cvAvatarRef}
          isScrolled={isScrolled}
        />

        {/* The Actual Curriculum Paper Sheet */}
        <div
          id="resume"
          style={{
            ['--cv-sticky-top-offset' as any]: `${mobileHeaderHeight}px`,
          }}
          className="relative rounded-2xl shadow-2xl bg-[var(--bg-paper)] text-[var(--text-primary)] border border-[var(--border-subtle)] overflow-visible"
        >
          {/* Mobile Sticky Avatar & Title Header - Always sticky by itself on mobile */}
          <div
            ref={mobileHeaderRef}
            className={`block lg:hidden sticky top-0 z-40 bg-[var(--bg-paper)]/95 backdrop-blur-md rounded-t-2xl transition-all duration-300 ease-out overflow-hidden ${
              isScrolled
                ? 'max-h-28 opacity-100 translate-y-0 px-6 sm:px-10 py-3 border-b border-[var(--border-subtle)] shadow-sm'
                : 'max-h-0 opacity-0 -translate-y-3 p-0 pointer-events-none border-b-0'
            }`}
          >
            <CvSmallHeader />
          </div>

          {/* Paper Title & Contact Row */}
          <CvPaperTitleBar isScrolled={isScrolled} />

          {/* Two-Column Body: Left Sidebar + Right Timeline */}
          <div className="pt-6 pb-6 sm:pb-8 px-6 sm:px-10 flex flex-col lg:flex-row gap-8 lg:gap-10">
            <CvSidebar isScrolled={isScrolled} />
            <CvTimeline />
          </div>
        </div>
      </div>
    </CvHoverProvider>
  );
};

export const CvPaperModal: React.FC<CvPaperModalProps> = ({
  isOpen,
  onClose,
  isAvatarDocked = true,
  cvAvatarRef,
  isClosing = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen || isClosing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClosing, onClose]);

  // Lock body scroll when modal is open and not closing
  useLayoutEffect(() => {
    if (isOpen && !isClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isClosing]);

  // Reset scroll state on open/close
  useEffect(() => {
    if (!isOpen) {
      setIsScrolled(false);
    }
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    // Activate sticky header before avatar & title scroll off-screen
    setIsScrolled(scrollTop > 70);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onScroll={handleScroll}
      className={`fixed inset-0 z-50 [scrollbar-gutter:stable] bg-black/20 dark:bg-black/35 backdrop-blur-[1.5px] flex justify-center items-start px-3 sm:px-6 transition-opacity duration-300 ${
        isClosing
          ? 'opacity-0 pointer-events-none overflow-y-hidden'
          : 'opacity-100 overflow-y-scroll'
      }`}
      onClick={(e) => {
        // If clicking on backdrop, close modal
        if (e.target === e.currentTarget && !isClosing) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Resume Modal"
    >
      <TypewriterProvider initialStep={typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('skip') === 'true' ? 10 : 0} enabled={true}>
        <CvPaperContent
          onClose={onClose}
          isAvatarDocked={isAvatarDocked}
          cvAvatarRef={cvAvatarRef}
          isClosing={isClosing}
          isScrolled={isScrolled}
        />
      </TypewriterProvider>
    </div>
  );
};

