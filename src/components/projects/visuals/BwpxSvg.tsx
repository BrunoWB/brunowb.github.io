import React, { useId } from 'react';

// Exact Scyan Studio 1bpp Wolf Mascot Pixel Paths (31x29 grid)
export const WOLF_BODY_PATH =
  'M6,0h2v1h-2zM25,0h2v1h-2zM5,1h4v1h-4zM24,1h4v1h-4zM4,2h5v1h-5zM24,2h5v1h-5zM4,3h2v1h-2zM7,3h3v1h-3zM12,3h1v1h-1zM17,3h1v1h-1zM23,3h3v1h-3zM27,3h2v1h-2zM3,4h2v1h-2zM8,4h3v1h-3zM13,4h1v1h-1zM17,4h2v1h-2zM22,4h3v1h-3zM28,4h2v1h-2zM3,5h2v1h-2zM8,5h3v1h-3zM12,5h9v1h-9zM22,5h3v1h-3zM28,5h2v1h-2zM3,6h2v1h-2zM9,6h9v1h-9zM20,6h4v1h-4zM28,6h2v1h-2zM3,7h2v1h-2zM10,7h1v1h-1zM12,7h8v1h-8zM21,7h2v1h-2zM28,7h2v1h-2zM3,8h2v1h-2zM10,8h1v1h-1zM13,8h7v1h-7zM21,8h2v1h-2zM28,8h2v1h-2zM4,9h2v1h-2zM7,9h4v1h-4zM12,9h4v1h-4zM17,9h2v1h-2zM21,9h5v1h-5zM27,9h2v1h-2zM5,10h12v1h-12zM19,10h9v1h-9zM2,11h5v1h-5zM8,11h4v1h-4zM13,11h1v1h-1zM15,11h5v1h-5zM21,11h4v1h-4zM26,11h5v1h-5zM3,12h3v1h-3zM7,12h6v1h-6zM15,12h3v1h-3zM20,12h6v1h-6zM27,12h3v1h-3zM5,13h1v1h-1zM7,13h1v1h-1zM13,13h7v1h-7zM25,13h1v1h-1zM27,13h1v1h-1zM3,14h6v1h-6zM12,14h1v1h-1zM14,14h5v1h-5zM20,14h1v1h-1zM24,14h6v1h-6zM2,15h6v1h-6zM9,15h1v1h-1zM12,15h1v1h-1zM14,15h5v1h-5zM20,15h1v1h-1zM23,15h1v1h-1zM25,15h6v1h-6zM1,16h3v1h-3zM5,16h2v1h-2zM9,16h2v1h-2zM14,16h5v1h-5zM22,16h2v1h-2zM26,16h2v1h-2zM29,16h2v1h-2zM3,17h2v1h-2zM6,17h2v1h-2zM10,17h3v1h-3zM14,17h5v1h-5zM20,17h3v1h-3zM25,17h2v1h-2zM28,17h2v1h-2zM2,18h2v1h-2zM6,18h3v1h-3zM12,18h9v1h-9zM24,18h3v1h-3zM29,18h2v1h-2zM2,19h5v1h-5zM8,19h17v1h-17zM26,19h5v1h-5zM1,20h5v1h-5zM7,20h2v1h-2zM10,20h16v1h-16zM27,20h4v1h-4zM3,21h3v1h-3zM7,21h3v1h-3zM11,21h9v1h-9zM21,21h5v1h-5zM27,21h3v1h-3zM5,22h2v1h-2zM8,22h6v1h-6zM19,22h2v1h-2zM22,22h3v1h-3zM26,22h2v1h-2zM5,23h6v1h-6zM12,23h2v1h-2zM19,23h2v1h-2zM22,23h6v1h-6zM5,24h1v1h-1zM9,24h2v1h-2zM12,24h3v1h-3zM18,24h3v1h-3zM22,24h2v1h-2zM27,24h1v1h-1zM10,25h2v1h-2zM13,25h3v1h-3zM17,25h3v1h-3zM21,25h2v1h-2zM12,26h1v1h-1zM20,26h1v1h-1zM13,27h7v1h-7zM13,28h7v1h-7z';

export const WOLF_EYES_PATH =
  'M8,13h5v1h-5zM9,14h3v1h-3zM10,15h2v1h-2zM20,13h5v1h-5zM21,14h3v1h-3zM21,15h2v1h-2z';

export const WOLF_PUPILS_PATH = 'M12,14h1v2h-1zM20,14h1v2h-1z';

export const BwpxSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  const uniqueId = useId().replace(/:/g, '');
  const wolfGradId = `wolfGrad_${uniqueId}`;
  const gridPatternId = `pixelGrid_${uniqueId}`;

  // Wolf rendered at scale 2: 31*2 = 62 wide, 29*2 = 58 high
  // Centered in 160 x 80 -> startX = 49, startY = 11
  const startX = 49;
  const startY = 11;
  const scale = 2;

  // Active editing pixel positioned right at the right eye pupil (col 20, row 14)
  const activeCol = 20;
  const activeRow = 14;
  const activeX = startX + activeCol * scale;
  const activeY = startY + activeRow * scale;

  return (
    <svg
      className={`w-[170px] h-[85px] transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,210,235,0.15)] group-hover:scale-105 group-hover:drop-shadow-[0_4px_16px_rgba(0,229,255,0.35)] ${className}`}
      viewBox="0 0 160 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Freeform wolf pixel art editor canvas"
    >
      <defs>
        {/* Brand Radial Gradient: Violet to Signature Cyan */}
        <radialGradient
          id={wolfGradId}
          cx="100%"
          cy="100%"
          r="135%"
          gradientUnits="userSpaceOnUse"
          fx="31"
          fy="29"
        >
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="55%" stopColor="#00d2eb" />
          <stop offset="100%" stopColor="#00f0ff" />
        </radialGradient>

        {/* 2x2px Freeform Pixel Editor Grid Mesh Pattern */}
        <pattern
          id={gridPatternId}
          width="2"
          height="2"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 2 0 L 0 0 0 2"
            fill="none"
            stroke="rgba(0, 210, 235, 0.15)"
            strokeWidth="0.25"
          />
        </pattern>
      </defs>

      {/* Freeform Blueprint Canvas Container */}
      <rect
        x="14"
        y="6"
        width="132"
        height="68"
        rx="6"
        fill="rgba(0, 210, 235, 0.02)"
        stroke="rgba(0, 210, 235, 0.25)"
        strokeWidth="1"
        className="transition-all duration-200 group-hover:stroke-[#00d2eb] group-hover:fill-[rgba(0,210,235,0.05)]"
      />

      {/* Subtle Pixel Grid Texture across the canvas */}
      <rect
        x="14"
        y="6"
        width="132"
        height="68"
        rx="6"
        fill={`url(#${gridPatternId})`}
        className="opacity-40 group-hover:opacity-70 transition-opacity"
      />

      {/* Freeform Coordinate Crosshairs at Outer Canvas Corners */}
      <path
        d="M 10 6 L 14 6 M 14 2 L 14 6 M 150 6 L 146 6 M 146 2 L 146 6 M 10 74 L 14 74 M 14 78 L 14 74 M 150 74 L 146 74 M 146 78 L 146 74"
        stroke="rgba(0, 210, 235, 0.45)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Monospace Metadata Tickers */}
      <text
        x="18"
        y="11.5"
        fill="rgba(0, 210, 235, 0.7)"
        fontSize="3.8"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        className="select-none tracking-wider"
      >
        CANVAS: 31×29
      </text>
      <text
        x="142"
        y="11.5"
        fill="#f97316"
        fontSize="3.8"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        textAnchor="end"
        className="select-none tracking-wider"
      >
        SCYAN WOLF
      </text>

      {/* Dynamic Editing Crosshair Guidelines crossing through active pupil pixel */}
      <line
        x1="14"
        y1={activeY + scale / 2}
        x2="146"
        y2={activeY + scale / 2}
        stroke="#f97316"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        opacity="0.45"
      />
      <line
        x1={activeX + scale / 2}
        y1="6"
        x2={activeX + scale / 2}
        y2="74"
        stroke="#f97316"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        opacity="0.45"
      />

      {/* The Scyan Wolf Pixel Art Mascot */}
      <g transform={`translate(${startX}, ${startY}) scale(${scale})`}>
        {/* Wolf Body Path */}
        <path
          d={WOLF_BODY_PATH}
          fill={`url(#${wolfGradId})`}
          className="transition-all duration-300 drop-shadow-[0_0_6px_rgba(0,210,235,0.4)] group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]"
        />

        {/* Wolf Eye Cutouts */}
        <path
          d={WOLF_EYES_PATH}
          className="fill-slate-900/90 dark:fill-[#021016]"
        />

        {/* Glowing Orange Wolf Pupils */}
        <path
          d={WOLF_PUPILS_PATH}
          fill="#f97316"
          className="drop-shadow-[0_0_3px_#f97316] group-hover:drop-shadow-[0_0_5px_#ff8c38] transition-all"
        />
      </g>

      {/* Active Pixel Selection Marquee (Focusing on Right Pupil) */}
      <g>
        <rect
          x={activeX - 1.2}
          y={activeY - 1.2}
          width={scale * 1 + 2.4}
          height={scale * 2 + 2.4}
          rx="1"
          fill="none"
          stroke="#f97316"
          strokeWidth="0.7"
          strokeDasharray="2 1.5"
          className="drop-shadow-[0_0_3px_#f97316]"
        />
      </g>

      {/* Vector Pixel Stylus / Pencil Cursor targeting active pupil */}
      <g transform={`translate(${activeX + scale + 3}, ${activeY + scale + 2})`}>
        {/* Pencil body */}
        <path
          d="M 0 0 L 2.5 -1.2 L 9 5.5 L 6.5 8 Z"
          fill="#cbd5e1"
          stroke="#475569"
          strokeWidth="0.5"
        />
        {/* Pencil tip pointing to pupil */}
        <polygon
          points="0,0 -3,-3 0.5,-3.5"
          fill="#f97316"
          stroke="#ea580c"
          strokeWidth="0.4"
          className="drop-shadow-[0_0_4px_#f97316]"
        />
        {/* Purple eraser accent */}
        <rect
          x="8.5"
          y="4.5"
          width="2.2"
          height="3"
          rx="0.5"
          fill="#a855f7"
          transform="rotate(45 9.5 6)"
        />
      </g>
    </svg>
  );
};
