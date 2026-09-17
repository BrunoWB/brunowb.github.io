import React from 'react';

export const CorneSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`w-[170px] h-[85px] transition-all duration-300 visual-svg-wrapper group-hover:scale-105 ${className}`}
      viewBox="0 0 160 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Corne 5x3 split keyboard silhouette"
    >
      <defs>
        <g id="corne-half-comp">
          {/* Case outline */}
          <path
            d="M 10 12 Q 10 6 16 6 L 68 6 Q 74 6 74 12 L 74 66 Q 74 72 68 72 L 44 72 Q 38 72 37 66 L 35 56 Q 33 50 27 50 L 16 50 Q 10 50 10 44 Z"
            fill="var(--bg-section)"
            stroke="var(--border-subtle)"
            strokeWidth="1.5"
            className="transition-colors duration-200 group-hover:stroke-[var(--brand-primary)]"
          />
          {/* 5 columns x 3 rows keycaps */}
          <rect x="14" y="15" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="14" y="26" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="14" y="37" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="24" y="13" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="24" y="24" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="24" y="35" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="34" y="11" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="34" y="22" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="34" y="33" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="44" y="12" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="44" y="23" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="44" y="34" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="54" y="14" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="54" y="25" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="54" y="36" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          {/* 3 Thumb keys */}
          <rect x="42" y="47" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="52" y="53" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          <rect x="62" y="57" width="8" height="8" rx="2" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" className="transition-colors duration-200 group-hover:fill-[var(--bg-card-hover)] group-hover:stroke-[var(--brand-primary)]/50" />
          {/* OLED screen frame & active display */}
          <rect x="64.5" y="13.5" width="6" height="17" rx="1.5" fill="var(--bg-app)" stroke="var(--border-subtle)" strokeWidth="0.6" />
          <rect x="65.5" y="14.5" width="4" height="15" rx="1" fill="var(--brand-primary)" className="opacity-90 group-hover:opacity-100 transition-opacity" />
        </g>
      </defs>
      {/* Left half */}
      <use href="#corne-half-comp" />
      {/* Right half (mirrored) */}
      <use href="#corne-half-comp" transform="translate(160, 0) scale(-1, 1)" />
    </svg>
  );
};
