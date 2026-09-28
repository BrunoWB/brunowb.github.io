import React, { useId } from 'react';

export const AnimeSummarySvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  const uniqueId = useId().replace(/:/g, '');
  const curveGradId = `curveGrad_${uniqueId}`;
  const areaGradId = `areaGrad_${uniqueId}`;

  return (
    <svg
      className={`w-[170px] h-[85px] transition-all duration-300 visual-svg-wrapper group-hover:scale-105 ${className}`}
      viewBox="0 0 160 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Anime taste analytics affinity curve and Bayesian steerable model"
    >
      <defs>
        {/* Brand Theme Line Gradient */}
        <linearGradient id={curveGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-secondary)" />
          <stop offset="50%" stopColor="var(--brand-primary)" />
          <stop offset="100%" stopColor="var(--brand-accent)" />
        </linearGradient>

        {/* Area fill gradient fading down */}
        <linearGradient id={areaGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.32" />
          <stop offset="70%" stopColor="var(--brand-secondary)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main Container Card */}
      <rect
        x="14"
        y="6"
        width="132"
        height="68"
        rx="6"
        fill="var(--bg-section)"
        stroke="var(--border-subtle)"
        strokeWidth="1.2"
        className="transition-colors duration-200 group-hover:stroke-[var(--brand-primary)]"
      />

      {/* Outer Corner Crosshairs */}
      <path
        d="M 10 6 L 14 6 M 14 2 L 14 6 M 150 6 L 146 6 M 146 2 L 146 6 M 10 74 L 14 74 M 14 78 L 14 74 M 150 74 L 146 74 M 146 78 L 146 74"
        stroke="var(--border-subtle)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Monospace Metadata Tickers */}
      <text
        x="20"
        y="13"
        fill="var(--text-muted)"
        fontSize="3.6"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        className="select-none tracking-wider"
      >
        TASTE MODEL
      </text>
      <text
        x="140"
        y="13"
        fill="var(--brand-primary)"
        fontSize="3.6"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        textAnchor="end"
        className="select-none tracking-wider"
      >
        BAYESIAN AFFINITY
      </text>

      {/* Subtle Horizontal Grid lines */}
      <line x1="20" y1="23" x2="140" y2="23" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6" />
      <line x1="20" y1="36" x2="140" y2="36" stroke="var(--border-subtle)" strokeWidth="0.5" opacity="0.4" />
      <line x1="20" y1="49" x2="140" y2="49" stroke="var(--border-subtle)" strokeWidth="0.7" opacity="0.8" />

      {/* Affinity Area Fill */}
      <path
        d="M 22 49 C 32 48, 38 21, 54 21 C 70 21, 76 38, 92 38 C 104 38, 110 28, 122 28 C 130 28, 134 45, 138 49 Z"
        fill={`url(#${areaGradId})`}
      />

      {/* Affinity Smooth Distribution Curve */}
      <path
        d="M 22 49 C 32 48, 38 21, 54 21 C 70 21, 76 38, 92 38 C 104 38, 110 28, 122 28 C 130 28, 134 45, 138 49"
        fill="none"
        stroke={`url(#${curveGradId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Peak Keypoint Circle: Favored theme */}
      <circle cx="54" cy="21" r="3.2" fill="var(--brand-primary)" fillOpacity="0.25" />
      <circle cx="54" cy="21" r="1.8" fill="var(--brand-primary)" />

      {/* Secondary Peak Keypoint */}
      <circle cx="122" cy="28" r="2.8" fill="var(--brand-accent)" fillOpacity="0.25" />
      <circle cx="122" cy="28" r="1.5" fill="var(--brand-accent)" />

      {/* Steer Tag / Floating Indicator at peak */}
      <g transform="translate(60, 16.5)">
        <rect x="0" y="0" width="22" height="7.5" rx="2" fill="var(--bg-card)" stroke="var(--brand-primary)" strokeWidth="0.6" />
        <text x="11" y="5.2" fill="var(--brand-primary)" fontSize="3.2" fontFamily="ui-monospace, monospace" fontWeight="700" textAnchor="middle">
          +4.8 STD
        </text>
      </g>

      {/* Recency Bias / Steer Slider Bars at Bottom */}
      {/* Genre 1: Sci-Fi */}
      <text x="20" y="59" fill="var(--text-muted)" fontSize="3.2" fontFamily="ui-monospace, monospace" fontWeight="600">
        SCI-FI
      </text>
      <rect x="42" y="56" width="46" height="3.2" rx="1.6" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.5" />
      <rect x="42" y="56" width="38" height="3.2" rx="1.6" fill="var(--brand-primary)" />
      <text x="94" y="59" fill="var(--brand-primary)" fontSize="3.2" fontFamily="ui-monospace, monospace" fontWeight="700">
        +84%
      </text>

      {/* Steer tag indicator */}
      <g transform="translate(108, 54)">
        <rect x="0" y="0" width="32" height="6.5" rx="1.8" fill="var(--brand-secondary)" fillOpacity="0.15" stroke="var(--brand-secondary)" strokeWidth="0.5" />
        <text x="16" y="4.6" fill="var(--brand-secondary)" fontSize="3.0" fontFamily="ui-monospace, monospace" fontWeight="700" textAnchor="middle">
          STEER ±0.1%
        </text>
      </g>

      {/* Genre 2: Psychological */}
      <text x="20" y="67.5" fill="var(--text-muted)" fontSize="3.2" fontFamily="ui-monospace, monospace" fontWeight="600">
        PSYCHO
      </text>
      <rect x="42" y="64.5" width="46" height="3.2" rx="1.6" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.5" />
      <rect x="42" y="64.5" width="43" height="3.2" rx="1.6" fill="var(--brand-secondary)" />
      <text x="94" y="67.5" fill="var(--brand-secondary)" fontSize="3.2" fontFamily="ui-monospace, monospace" fontWeight="700">
        +92%
      </text>

      {/* Recency status indicator dot */}
      <circle cx="112" cy="66" r="1.5" fill="var(--brand-accent)" />
      <text x="116" y="67.5" fill="var(--text-muted)" fontSize="3.0" fontFamily="ui-monospace, monospace" fontWeight="600">
        RECENCY ON
      </text>
    </svg>
  );
};
