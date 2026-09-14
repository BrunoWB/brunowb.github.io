import React, { useEffect, useRef } from 'react';
import { TypewriterProvider, useTypewriterController } from '../../context/TypewriterContext';
import { CvHoverProvider } from '../../context/CvHoverContext';
import { CvHeader } from './CvHeader';
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
}> = ({ onClose, isAvatarDocked, cvAvatarRef, isClosing }) => {
  const { isSkipped, skipAll } = useTypewriterController();

  return (
    <CvHoverProvider>
      <div
        onClick={() => {
          if (!isSkipped) skipAll();
        }}
        className={`relative w-full max-w-5xl animate-paper-fade-in overflow-visible mb-6 cursor-default transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Persistent Sticky Top Control Bar */}
        <CvHeader onClose={onClose} />

        {/* The Actual Curriculum Paper Sheet */}
        <div
          id="resume"
          className="relative rounded-2xl shadow-2xl bg-[var(--bg-paper)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
        >
          {/* Two-Column Body: Left Sticky Sidebar + Right Timeline */}
          <div className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-6 sm:px-10 flex flex-col lg:flex-row gap-8 lg:gap-10">
            <CvSidebar
              isAvatarDocked={isAvatarDocked}
              cvAvatarRef={cvAvatarRef}
            />
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`fixed inset-0 z-50 overflow-y-auto bg-black/20 dark:bg-black/35 backdrop-blur-[1.5px] flex justify-center items-start pt-10 sm:pt-16 pb-6 sm:pb-10 px-3 sm:px-6 transition-opacity duration-300 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
        />
      </TypewriterProvider>
    </div>
  );
};
