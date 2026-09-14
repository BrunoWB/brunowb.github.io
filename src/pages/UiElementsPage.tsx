import React, { useState } from 'react';
import { Avatar } from '../components/common/Avatar';
import { TypewriterText } from '../components/common/TypewriterText';
import { TypewriterProvider } from '../context/TypewriterContext';
import { CorneSvg } from '../components/projects/visuals/CorneSvg';
import { BwpxSvg } from '../components/projects/visuals/BwpxSvg';
import { ScreenMgrSvg } from '../components/projects/visuals/ScreenMgrSvg';
import { useTheme } from '../context/ThemeContext';

export const UiElementsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Typewriter sandbox state
  const [sandboxText, setSandboxText] = useState('Letter-by-letter synchronized typewriter animation.');
  const [sandboxSpeed, setSandboxSpeed] = useState(25);
  const [sandboxDelay, setSandboxDelay] = useState(100);
  const [sandboxKey, setSandboxKey] = useState(0);

  const colors = [
    {
      name: 'Primary: Cyan',
      desc: 'Tech, Energy, Precision',
      hex: '#00d2eb',
      shades: [
        { label: '50', hex: '#ecfeff', bg: 'bg-[#ecfeff]', text: 'text-slate-900' },
        { label: '100', hex: '#cffafe', bg: 'bg-[#cffafe]', text: 'text-slate-900' },
        { label: '300', hex: '#67e8f9', bg: 'bg-[#67e8f9]', text: 'text-slate-900' },
        { label: '400', hex: '#22d3ee', bg: 'bg-[#22d3ee]', text: 'text-slate-900' },
        { label: '500 (Core)', hex: '#00d2eb', bg: 'bg-[#00d2eb]', text: 'text-slate-900' },
        { label: '600', hex: '#00b4cc', bg: 'bg-[#00b4cc]', text: 'text-white' },
        { label: 'Neon', hex: '#00e5ff', bg: 'bg-[#00e5ff]', text: 'text-slate-900' },
      ],
    },
    {
      name: 'Secondary: Purple',
      desc: 'Cosmic, Depth, Creativity',
      hex: '#a855f7',
      shades: [
        { label: '50', hex: '#faf5ff', bg: 'bg-[#faf5ff]', text: 'text-slate-900' },
        { label: '100', hex: '#f3e8ff', bg: 'bg-[#f3e8ff]', text: 'text-slate-900' },
        { label: '300', hex: '#d8b4fe', bg: 'bg-[#d8b4fe]', text: 'text-slate-900' },
        { label: '400', hex: '#c084fc', bg: 'bg-[#c084fc]', text: 'text-slate-900' },
        { label: '500 (Core)', hex: '#a855f7', bg: 'bg-[#a855f7]', text: 'text-white' },
        { label: '600', hex: '#9333ea', bg: 'bg-[#9333ea]', text: 'text-white' },
        { label: 'Neon', hex: '#d946ef', bg: 'bg-[#d946ef]', text: 'text-white' },
      ],
    },
    {
      name: 'Accent: Orange',
      desc: 'Warmth, Action, Energy',
      hex: '#f97316',
      shades: [
        { label: '50', hex: '#fff7ed', bg: 'bg-[#fff7ed]', text: 'text-slate-900' },
        { label: '100', hex: '#ffedd5', bg: 'bg-[#ffedd5]', text: 'text-slate-900' },
        { label: '300', hex: '#fdba74', bg: 'bg-[#fdba74]', text: 'text-slate-900' },
        { label: '400', hex: '#fb923c', bg: 'bg-[#fb923c]', text: 'text-slate-900' },
        { label: '500 (Core)', hex: '#f97316', bg: 'bg-[#f97316]', text: 'text-white' },
        { label: '600', hex: '#ea580c', bg: 'bg-[#ea580c]', text: 'text-white' },
        { label: 'Neon', hex: '#ff6b00', bg: 'bg-[#ff6b00]', text: 'text-white' },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-12 border-b border-cyan-500/20 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2 border border-cyan-500/20">
            Hidden Sandbox: #/ui-elements
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Design System & UI Elements
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
            Tri-color palette matrix, theme tokens, interactive typewriter sandbox, and components.
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 dark:border-cyan-400/30 text-cyan-700 dark:text-cyan-300 text-sm font-semibold hover:bg-cyan-500/25 transition-all self-start sm:self-center cursor-pointer"
        >
          Toggle Theme ({theme})
        </button>
      </div>

      {/* Section 1: Tri-Color Palette Matrix */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span>1. Tri-Color Palette Matrix</span>
          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-normal">(Cyan / Purple / Orange)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {colors.map((palette) => (
            <div
              key={palette.name}
              className="rounded-2xl p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {palette.name}
                </h3>
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.hex }} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{palette.desc}</p>

              <div className="space-y-2">
                {palette.shades.map((shade) => (
                  <div
                    key={shade.label}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono font-medium ${shade.bg} ${shade.text}`}
                  >
                    <span>{shade.label}</span>
                    <span>{shade.hex}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Typewriter Sandbox */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          2. Typewriter Animation Sandbox
        </h2>

        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900/60 border border-cyan-500/30 shadow-xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Text to write
              </label>
              <input
                type="text"
                value={sandboxText}
                onChange={(e) => setSandboxText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Speed: {sandboxSpeed}ms / char
              </label>
              <input
                type="range"
                min="5"
                max="80"
                value={sandboxSpeed}
                onChange={(e) => setSandboxSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Delay: {sandboxDelay}ms
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={sandboxDelay}
                onChange={(e) => setSandboxDelay(Number(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSandboxKey((prev) => prev + 1)}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs transition-all cursor-pointer shadow"
            >
              Replay Animation
            </button>
          </div>

          {/* Live Preview Screen */}
          <div className="p-6 rounded-xl bg-slate-950 border border-cyan-500/40 min-h-[90px] flex items-center">
            <TypewriterProvider key={sandboxKey} initialStep={0} enabled={true}>
              <TypewriterText
                text={sandboxText}
                speed={sandboxSpeed}
                delay={sandboxDelay}
                step={0}
                className="text-lg sm:text-xl font-mono text-cyan-300 font-semibold"
              />
            </TypewriterProvider>
          </div>
        </div>
      </section>

      {/* Section 3: Component Showcase Gallery */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          3. Component Showcase Gallery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Corne Keyboard */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 shadow-md flex flex-col items-center justify-center gap-4">
            <h4 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Corne Keyboard Visual</h4>
            <div className="group p-4 rounded-xl bg-slate-900 border border-cyan-500/20">
              <CorneSvg />
            </div>
          </div>

          {/* Pixel Editor */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 shadow-md flex flex-col items-center justify-center gap-4">
            <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400">Pixel Editor Visual</h4>
            <div className="group p-4 rounded-xl bg-slate-900 border border-purple-500/20">
              <BwpxSvg />
            </div>
          </div>

          {/* Screen Manager */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 shadow-md flex flex-col items-center justify-center gap-4">
            <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400">Screen Manager Visual</h4>
            <div className="group p-4 rounded-xl bg-slate-900 border border-orange-500/20">
              <ScreenMgrSvg />
            </div>
          </div>
        </div>

        {/* Avatar Showcase */}
        <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 shadow-md flex flex-wrap items-center justify-around gap-6">
          <div className="text-center">
            <Avatar size="sm" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">sm</p>
          </div>
          <div className="text-center">
            <Avatar size="md" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">md</p>
          </div>
          <div className="text-center">
            <Avatar size="lg" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">lg</p>
          </div>
          <div className="text-center">
            <Avatar size="hero" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">hero</p>
          </div>
        </div>
      </section>
    </div>
  );
};
