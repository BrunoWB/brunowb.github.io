import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TypewriterProvider, useTypewriterController } from '../../context/TypewriterContext';
import { CvHoverProvider } from '../../context/CvHoverContext';
import { CvHeader, CvPaperTitleBar } from './CvHeader';
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
          className="relative rounded-2xl shadow-2xl bg-[var(--bg-paper)] text-[var(--text-primary)] border border-[var(--border-subtle)] overflow-visible"
        >
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

