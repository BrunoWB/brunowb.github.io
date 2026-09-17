import React from 'react';
import {
  ArrowLeft,
  Activity,
  Layers2,
  RotateCcw,
  Maximize,
  Minimize,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PlaygroundHeaderProps {
  fps: number;
  frameTimeMs: number;
  isSoloLayer0Active: boolean;
  toggleSoloLayer0: () => void;
  handleReset: () => void;
  useCleanComposite: boolean;
  setUseCleanComposite: (val: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  hudMinimized: boolean;
  setHudMinimized: (val: boolean) => void;
}

export const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  fps,
  frameTimeMs,
  isSoloLayer0Active,
  toggleSoloLayer0,
  handleReset,
  useCleanComposite,
  setUseCleanComposite,
  isFullscreen,
  toggleFullscreen,
  hudMinimized,
  setHudMinimized,
}) => {
  return (
    <header className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
      <div className="flex items-center gap-3">
        <a
          href="./#home"
          onClick={() => {
            if (
              typeof window !== 'undefined' &&
              window.location.pathname.replace(/^\/|\/$/g, '').startsWith('bg-canvas')
            ) {
              const base = window.location.pathname.replace(/\/bg-canvas\/?$/, '') || '/';
              window.history.replaceState(null, '', base + '#home');
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)]/80 hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] backdrop-blur-md transition-all shadow-lg text-sm font-medium hover:scale-105"
          title="Return to Portfolio"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--brand-primary)]" />
          <span>Portfolio</span>
        </a>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card)]/80 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-300 font-semibold">Canvas 2D Engine</span>
          <span className="text-[var(--text-muted)]">|</span>
          <span className="font-mono text-cyan-300">1920×1187</span>
          <span className="text-[var(--text-muted)]">|</span>
          <span>Horizon: 61.08% (y=725)</span>
        </div>

        {/* Real-time FPS Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-emerald-500/30 text-xs backdrop-blur-md">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-400 font-bold">{fps.toFixed(1)} FPS</span>
          <span className="font-mono text-[var(--text-muted)] text-[10px]">
            ({frameTimeMs.toFixed(1)}ms)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Switch to DOM (/bg) Engine Button */}
        <a
          href="./#bg"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border border-[var(--border-subtle)] bg-[var(--bg-card)]/80 text-[var(--text-secondary)] hover:text-cyan-300 hover:border-cyan-500/40 transition-all shadow-lg"
          title="Switch directly to the DOM + SVG version at /bg"
        >
          <Layers2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Switch to DOM (/bg)</span>
        </a>

        {/* Solo Layer 0 Toggle (#off) */}
        <button
          onClick={toggleSoloLayer0}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all shadow-lg ${
            isSoloLayer0Active
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400/50'
              : 'bg-[var(--bg-card)]/80 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-cyan-500/40'
          }`}
          title="Toggle solo Layer 0 (turns off all layers except Layer 0.0, equivalent to #off)"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSoloLayer0Active ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
          <span>{isSoloLayer0Active ? 'Solo Layer 0: ON' : 'Solo Layer 0 (#off)'}</span>
        </button>

        {/* Reset to Default Button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border border-[var(--border-subtle)] bg-[var(--bg-card)]/80 text-[var(--text-secondary)] hover:text-white hover:border-[var(--brand-primary)]/40 transition-all shadow-lg"
          title="Reset to Default"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span>Reset to Default</span>
        </button>

        {/* Compare toggle */}
        <button
          onClick={() => setUseCleanComposite(!useCleanComposite)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all ${
            useCleanComposite
              ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-[var(--bg-card)]/80 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          {useCleanComposite ? 'Viewing: Static Master' : 'Viewing: Canvas Engine'}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-[var(--bg-card)]/80 hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] backdrop-blur-md transition-all shadow-lg"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* HUD Collapse Button */}
        <button
          onClick={() => setHudMinimized(!hudMinimized)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-card)]/80 hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] backdrop-blur-md transition-all shadow-lg text-xs font-medium"
        >
          <Sliders className="w-4 h-4 text-[var(--brand-primary)]" />
          <span>{hudMinimized ? 'Show Parameters' : 'Hide Parameters'}</span>
          {hudMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};

export default PlaygroundHeader;
