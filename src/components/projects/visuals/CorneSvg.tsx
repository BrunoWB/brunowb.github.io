import React from 'react';

export const CorneSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`w-[170px] h-[85px] transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,210,235,0.15)] group-hover:scale-105 group-hover:drop-shadow-[0_4px_16px_rgba(0,229,255,0.35)] ${className}`}
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
            fill="rgba(0, 210, 235, 0.04)"
            stroke="#00d2eb"
            strokeWidth="1.6"
            className="transition-all duration-200 group-hover:stroke-[#00e5ff] group-hover:fill-[rgba(0,210,235,0.09)]"
          />
          {/* 5 columns x 3 rows keycaps */}
          <rect x="14" y="15" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="14" y="26" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="14" y="37" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="24" y="13" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="24" y="24" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="24" y="35" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="34" y="11" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="34" y="22" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="34" y="33" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="44" y="12" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="44" y="23" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="44" y="34" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="54" y="14" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="54" y="25" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="54" y="36" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          {/* 3 Thumb keys */}
          <rect x="42" y="47" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="52" y="53" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          <rect x="62" y="57" width="8" height="8" rx="2" fill="rgba(0, 210, 235, 0.18)" stroke="rgba(0, 210, 235, 0.45)" strokeWidth="0.8" className="transition-all duration-200 group-hover:fill-[rgba(0,229,255,0.3)] group-hover:stroke-[rgba(0,229,255,0.7)]" />
          {/* OLED screen */}
          <rect x="65" y="14" width="5" height="16" rx="1.5" fill="#00e5ff" className="opacity-85 drop-shadow-[0_0_3px_#00e5ff] group-hover:opacity-100 group-hover:drop-shadow-[0_0_7px_#00e5ff] transition-all duration-200" />
        </g>
      </defs>
      {/* Left half */}
      <use href="#corne-half-comp" />
      {/* Right half (mirrored) */}
      <use href="#corne-half-comp" transform="translate(160, 0) scale(-1, 1)" />
    </svg>
  );
};
