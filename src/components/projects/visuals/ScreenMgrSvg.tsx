import React from 'react';

export const ScreenMgrSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`w-[170px] h-[85px] transition-all duration-300 visual-svg-wrapper group-hover:scale-105 ${className}`}
      viewBox="0 0 160 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="KDE Plasma multi-monitor manager display layout"
    >
      {/* Left Monitor (Primary DP-1) */}
      <rect
        x="12"
        y="14"
        width="62"
        height="42"
        rx="4"
        fill="var(--bg-section)"
        stroke="var(--border-subtle)"
        strokeWidth="1.5"
        className="transition-colors duration-200 group-hover:stroke-[var(--brand-accent)]"
      />
      <rect x="15" y="17" width="56" height="34" rx="2" fill="var(--bg-app)" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <rect x="40" y="56" width="6" height="8" rx="1" fill="var(--bg-section)" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <rect x="31" y="64" width="24" height="3" rx="1.5" fill="var(--bg-section)" stroke="var(--border-subtle)" strokeWidth="1" />

      {/* Monitor 1 UI */}
      <text x="19" y="24" fill="var(--brand-accent)" fontSize="4.5" fontFamily="ui-monospace, monospace" fontWeight="700">
        DP-1
      </text>
      {/* Primary Display Star Badge */}
      <path
        d="M 62 20.5 L 63 22.8 L 65.5 22.8 L 63.5 24.2 L 64.3 26.5 L 62 25.1 L 59.7 26.5 L 60.5 24.2 L 58.5 22.8 L 61 22.8 Z"
        fill="var(--brand-accent)"
      />
      <rect x="19" y="27" width="23" height="17" rx="1.5" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <rect x="45" y="27" width="22" height="17" rx="1.5" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <line x1="22" y1="31" x2="38" y2="31" stroke="var(--text-muted)" strokeWidth="0.8" opacity="0.6" />
      <line x1="22" y1="34" x2="35" y2="34" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <line x1="22" y1="37" x2="32" y2="37" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <rect x="48" y="30" width="16" height="10" rx="1" fill="var(--bg-section)" stroke="var(--border-subtle)" strokeWidth="0.6" />
      <line x1="15" y1="46.5" x2="71" y2="46.5" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <rect x="18" y="47.5" width="4" height="2" rx="0.5" fill="var(--brand-accent)" />
      <rect x="24" y="48" width="6" height="1.2" rx="0.4" fill="var(--text-muted)" opacity="0.7" />
      <rect x="32" y="48" width="6" height="1.2" rx="0.4" fill="var(--text-muted)" opacity="0.7" />

      {/* Inter-display link / arrangement indicator */}
      <line x1="74" y1="35" x2="86" y2="35" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="2 1.5" />
      <circle cx="80" cy="35" r="2" fill="var(--brand-accent)" />

      {/* Right Monitor (Secondary HDMI-A-1) */}
      <rect
        x="86"
        y="14"
        width="62"
        height="42"
        rx="4"
        fill="var(--bg-section)"
        stroke="var(--border-subtle)"
        strokeWidth="1.5"
        className="transition-colors duration-200 group-hover:stroke-[var(--brand-accent)]"
      />
      <rect x="89" y="17" width="56" height="34" rx="2" fill="var(--bg-app)" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <rect x="114" y="56" width="6" height="8" rx="1" fill="var(--bg-section)" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <rect x="105" y="64" width="24" height="3" rx="1.5" fill="var(--bg-section)" stroke="var(--border-subtle)" strokeWidth="1" />

      {/* Monitor 2 UI */}
      <text x="93" y="24" fill="var(--text-secondary)" fontSize="4.5" fontFamily="ui-monospace, monospace" fontWeight="700">
        HDMI-A-1
      </text>
      <circle cx="138" cy="22.5" r="2" fill="var(--text-muted)" opacity="0.8" />
      <rect x="93" y="27" width="48" height="17" rx="1.5" fill="var(--bg-card)" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <line x1="97" y1="31.5" x2="114" y2="31.5" stroke="var(--text-muted)" strokeWidth="0.8" opacity="0.7" />
      <line x1="97" y1="35" x2="135" y2="35" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <line x1="97" y1="38.5" x2="124" y2="38.5" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <line x1="89" y1="46.5" x2="145" y2="46.5" stroke="var(--border-subtle)" strokeWidth="0.8" />
      <rect x="92" y="47.5" width="4" height="2" rx="0.5" fill="var(--brand-accent)" />
      <rect x="98" y="48" width="8" height="1.2" rx="0.4" fill="var(--text-muted)" opacity="0.7" />
    </svg>
  );
};
