import React from 'react';

export const ScreenMgrSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`w-[170px] h-[85px] transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,210,235,0.15)] group-hover:scale-105 group-hover:drop-shadow-[0_4px_16px_rgba(0,229,255,0.35)] ${className}`}
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
        fill="rgba(0, 210, 235, 0.04)"
        stroke="#00d2eb"
        strokeWidth="1.6"
        className="transition-all duration-200 group-hover:stroke-[#00e5ff] group-hover:fill-[rgba(0,210,235,0.09)]"
      />
      <rect x="15" y="17" width="56" height="34" rx="2" fill="#011016" stroke="rgba(0, 210, 235, 0.4)" strokeWidth="1" />
      <rect x="40" y="56" width="6" height="8" rx="1" fill="rgba(0, 210, 235, 0.2)" stroke="rgba(0, 210, 235, 0.5)" strokeWidth="0.8" />
      <rect x="31" y="64" width="24" height="3" rx="1.5" fill="rgba(0, 210, 235, 0.04)" stroke="#00d2eb" strokeWidth="1.2" />

      {/* Monitor 1 UI */}
      <text x="19" y="24" fill="#5ce1e6" fontSize="4.5" fontFamily="ui-monospace, monospace" fontWeight="700">
        DP-1
      </text>
      {/* Star icon */}
      <path
        d="M 62 20.5 L 63 22.8 L 65.5 22.8 L 63.5 24.2 L 64.3 26.5 L 62 25.1 L 59.7 26.5 L 60.5 24.2 L 58.5 22.8 L 61 22.8 Z"
        fill="#00e5ff"
        className="drop-shadow-[0_0_2px_#00e5ff]"
      />
      <rect x="19" y="27" width="23" height="17" rx="1.5" fill="rgba(0, 210, 235, 0.15)" stroke="rgba(0, 210, 235, 0.4)" strokeWidth="0.8" />
      <rect x="45" y="27" width="22" height="17" rx="1.5" fill="rgba(0, 210, 235, 0.15)" stroke="rgba(0, 210, 235, 0.4)" strokeWidth="0.8" />
      <line x1="15" y1="46.5" x2="71" y2="46.5" stroke="rgba(0, 210, 235, 0.25)" strokeWidth="0.8" />
      <rect x="18" y="47.5" width="4" height="2" rx="0.5" fill="#00e5ff" />
      <rect x="24" y="48" width="6" height="1.2" rx="0.4" fill="rgba(0, 210, 235, 0.4)" />
      <rect x="32" y="48" width="6" height="1.2" rx="0.4" fill="rgba(0, 210, 235, 0.4)" />

      {/* Inter-display link / arrangement indicator */}
      <line x1="74" y1="35" x2="86" y2="35" stroke="rgba(0, 210, 235, 0.4)" strokeWidth="1" strokeDasharray="2 1.5" />
      <circle cx="80" cy="35" r="2" fill="#00e5ff" className="drop-shadow-[0_0_3px_#00e5ff]" />

      {/* Right Monitor (Secondary HDMI-A-1) */}
      <rect
        x="86"
        y="14"
        width="62"
        height="42"
        rx="4"
        fill="rgba(0, 210, 235, 0.04)"
        stroke="#00d2eb"
        strokeWidth="1.6"
        className="transition-all duration-200 group-hover:stroke-[#00e5ff] group-hover:fill-[rgba(0,210,235,0.09)]"
      />
      <rect x="89" y="17" width="56" height="34" rx="2" fill="#011016" stroke="rgba(0, 210, 235, 0.4)" strokeWidth="1" />
      <rect x="114" y="56" width="6" height="8" rx="1" fill="rgba(0, 210, 235, 0.2)" stroke="rgba(0, 210, 235, 0.5)" strokeWidth="0.8" />
      <rect x="105" y="64" width="24" height="3" rx="1.5" fill="rgba(0, 210, 235, 0.04)" stroke="#00d2eb" strokeWidth="1.2" />

      {/* Monitor 2 UI */}
      <text x="93" y="24" fill="rgba(0, 210, 235, 0.65)" fontSize="4.5" fontFamily="ui-monospace, monospace" fontWeight="700">
        HDMI-A-1
      </text>
      <circle cx="138" cy="22.5" r="2.5" fill="#00e5ff" className="drop-shadow-[0_0_2px_#00e5ff]" />
      <rect x="93" y="27" width="48" height="17" rx="1.5" fill="rgba(0, 210, 235, 0.15)" stroke="rgba(0, 210, 235, 0.4)" strokeWidth="0.8" />
      <line x1="97" y1="31.5" x2="114" y2="31.5" stroke="rgba(0, 210, 235, 0.5)" strokeWidth="0.8" />
      <line x1="97" y1="35" x2="135" y2="35" stroke="rgba(0, 210, 235, 0.3)" strokeWidth="0.8" />
      <line x1="97" y1="38.5" x2="124" y2="38.5" stroke="rgba(0, 210, 235, 0.3)" strokeWidth="0.8" />
      <line x1="89" y1="46.5" x2="145" y2="46.5" stroke="rgba(0, 210, 235, 0.25)" strokeWidth="0.8" />
      <rect x="92" y="47.5" width="4" height="2" rx="0.5" fill="#00e5ff" />
    </svg>
  );
};
