import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '../../data/projectsData';
import type { ProjectItem } from '../../types/projects';

interface ActivePanelItem {
  key: string;
  project: ProjectItem;
  slidingIn: boolean;
  zIndex: number;
}

interface ProjectPreviewOverlayProps {
  activeProjectId: string | null;
}

export const ProjectPreviewOverlay: React.FC<ProjectPreviewOverlayProps> = ({ activeProjectId }) => {
  const [panels, setPanels] = useState<ActivePanelItem[]>([]);
  const zIndexCounter = useRef(10);
  const prevActiveIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!activeProjectId || activeProjectId === prevActiveIdRef.current) return;
    prevActiveIdRef.current = activeProjectId;

    const project = projectsData.find((p) => p.id === activeProjectId);
    if (!project || !project.preview) return;

    const nextZ = zIndexCounter.current + 1;
    zIndexCounter.current = nextZ;

    const newPanel: ActivePanelItem = {
      key: `${project.id}-${Date.now()}`,
      project,
      slidingIn: true, // starts at translateX(100%)
      zIndex: nextZ,
    };

    setPanels((prev) => [...prev, newPanel]);

    // Trigger sliding animation on next animation frame
    const rafId = requestAnimationFrame(() => {
      setPanels((prev) =>
        prev.map((p) => (p.key === newPanel.key ? { ...p, slidingIn: false } : p))
      );
    });

    return () => cancelAnimationFrame(rafId);
  }, [activeProjectId]);

  // Preload all project media in background once mounted during browser idle
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preloadMedia = () => {
      projectsData.forEach((project) => {
        if (!project.preview) return;
        if (project.preview.type === 'video') {
          const v = document.createElement('video');
          v.preload = 'auto';
          v.src = project.preview.src;
          if (project.preview.poster) {
            const img = new Image();
            img.src = project.preview.poster;
          }
        } else if (project.preview.type === 'image') {
          const img = new Image();
          img.src = project.preview.src;
        }
      });
    };

    if ('requestIdleCallback' in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(preloadMedia);
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as unknown as { cancelIdleCallback: (h: number) => void }).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(preloadMedia, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTransitionEnd = (panelKey: string) => {
    // Once the latest panel has fully finished its pan in to translateX(0%),
    // it completely covers everything underneath. Dispose of older panels.
    setPanels((prev) => {
      const targetIndex = prev.findIndex((p) => p.key === panelKey);
      if (targetIndex === -1) return prev;
      // If this panel is the latest or has covered others, prune all panels before it
      return prev.filter((_, index) => index >= targetIndex);
    });
  };

  if (panels.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden pointer-events-none select-none">
      {panels.map((panel) => {
        const { project, slidingIn, zIndex, key } = panel;
        const preview = project.preview!;

        return (
          <div
            key={key}
            onTransitionEnd={() => handleTransitionEnd(key)}
            style={{
              zIndex,
              clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
              transform: slidingIn ? 'translateX(100%)' : 'translateX(0%)',
              transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute inset-0 w-full h-full bg-[#03131a] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] will-change-transform"
          >
            {/* Media Content */}
            <div className="relative w-full h-full">
              {preview.type === 'video' ? (
                <video
                  key={preview.src}
                  src={preview.src}
                  poster={preview.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover object-left"
                />
              ) : (
                <img
                  key={preview.src}
                  src={preview.src}
                  alt={project.title}
                  className="w-full h-full object-cover object-left"
                />
              )}

              {/* Gradient Scrims for Atmosphere & Dark Integration */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-section)]/80 via-transparent to-[var(--bg-section)]/40 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-section)]/60 via-transparent to-transparent pointer-events-none" />

              {/* Glowing Diagonal Leading Edge Line */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={`edge-grad-${key}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--brand-primary, #00d2eb)" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="var(--brand-primary, #00d2eb)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="var(--brand-primary, #00d2eb)" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id={`edge-glow-${key}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <line
                  x1="25"
                  y1="0"
                  x2="0"
                  y2="100"
                  stroke={`url(#edge-grad-${key})`}
                  strokeWidth="0.8"
                  filter={`url(#edge-glow-${key})`}
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
