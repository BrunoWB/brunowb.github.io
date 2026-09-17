import React, { useState } from 'react';
import { Avatar } from '../components/common/Avatar';
import { TypewriterText } from '../components/common/TypewriterText';
import { TypewriterProvider } from '../context/TypewriterContext';
import { CorneSvg } from '../components/projects/visuals/CorneSvg';
import { BwpxSvg } from '../components/projects/visuals/BwpxSvg';
import { ScreenMgrSvg } from '../components/projects/visuals/ScreenMgrSvg';
import { useTheme } from '../context/ThemeContext';

interface SemanticToken {
  name: string;
  varName: string;
  value: string;
  bg: string;
  border?: boolean;
  isTextPreview?: boolean;
}

interface SemanticGroup {
  title: string;
  subtitle: string;
  tokens: SemanticToken[];
}

interface RawShade {
  label: string;
  hex: string;
  bg: string;
  textLight: boolean;
}

interface RawPrimitiveGroup {
  name: string;
  desc: string;
  coreHex: string;
  shades: RawShade[];
}

export const UiElementsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Typewriter sandbox state
  const [sandboxText, setSandboxText] = useState('Letter-by-letter synchronized typewriter animation.');
  const [sandboxSpeed, setSandboxSpeed] = useState(25);
  const [sandboxDelay, setSandboxDelay] = useState(100);
  const [sandboxKey, setSandboxKey] = useState(0);

  // 1. Semantic Palette Tokens (Functional layer that inverts / applies opposite gradients across themes)
  const semanticGroups: SemanticGroup[] = [
    {
      title: 'bd and container',
      subtitle: isDark
        ? 'Dark canvas scaling upward to luminous cards and paper modals'
        : 'Light canvas scaling downward to crisp white cards and paper modals',
      tokens: [
        { name: 'App Canvas', varName: '--bg-app', value: isDark ? '#03141a' : '#eaf4f7', bg: 'bg-[var(--bg-app)]', border: true },
        { name: 'Section Alternate', varName: '--bg-section', value: isDark ? '#021319' : '#e2edf1', bg: 'bg-[var(--bg-section)]', border: true },
        { name: 'Card Surface', varName: '--bg-card', value: isDark ? 'rgba(8, 40, 50, 0.65)' : '#ffffff', bg: 'bg-[var(--bg-card)]', border: true },
        { name: 'Card Hover', varName: '--bg-card-hover', value: isDark ? 'rgba(12, 55, 68, 0.85)' : '#f4f9fb', bg: 'bg-[var(--bg-card-hover)]', border: true },
        { name: 'Paper / Modal', varName: '--bg-paper', value: isDark ? '#08212b' : '#ffffff', bg: 'bg-[var(--bg-paper)]', border: true },
        { name: 'Bubble / Pill', varName: '--bg-bubble', value: isDark ? '#061e26' : '#ffffff', bg: 'bg-[var(--bg-bubble)]', border: true },
        { name: 'Avatar Base', varName: '--bg-avatar', value: isDark ? '#0b323c' : '#e0f2f6', bg: 'bg-[var(--bg-avatar)]', border: true },
      ],
    },
    {
      title: 'Typography & Content',
      subtitle: isDark
        ? 'Radiant light text against dark surfaces'
        : 'Deep spacetime teal against light surfaces',
      tokens: [
        { name: 'Primary Text', varName: '--text-primary', value: isDark ? '#e6f6f8' : '#062630', bg: 'bg-[var(--text-primary)]', isTextPreview: true },
        { name: 'Secondary Text', varName: '--text-secondary', value: isDark ? '#92c5cf' : '#164e5b', bg: 'bg-[var(--text-secondary)]', isTextPreview: true },
        { name: 'Muted Text', varName: '--text-muted', value: isDark ? '#57828c' : '#48737e', bg: 'bg-[var(--text-muted)]', isTextPreview: true },
        { name: 'Accent Text', varName: '--text-accent', value: isDark ? '#00d2eb' : '#008ba3', bg: 'bg-[var(--text-accent)]', isTextPreview: true },
      ],
    },
    {
      title: 'Brand & Accents',
      subtitle: isDark
        ? 'Electric high-luminance tones for deep space'
        : 'Denser, higher-contrast tones for crisp light paper',
      tokens: [
        { name: 'Brand Primary', varName: '--brand-primary', value: isDark ? '#00d2eb' : '#008ba3', bg: 'bg-[var(--brand-primary)]' },
        { name: 'Brand Secondary', varName: '--brand-secondary', value: isDark ? '#a855f7' : '#7e22ce', bg: 'bg-[var(--brand-secondary)]' },
        { name: 'Brand Accent', varName: '--brand-accent', value: isDark ? '#f97316' : '#c2410c', bg: 'bg-[var(--brand-accent)]' },
      ],
    },
    {
      title: 'Borders & Lines',
      subtitle: isDark
        ? 'Subtle cyan luminescence and separators'
        : 'Clean slate-teal containment lines',
      tokens: [
        { name: 'Subtle Border', varName: '--border-subtle', value: isDark ? 'rgba(0, 210, 235, 0.18)' : 'rgba(0, 139, 163, 0.22)', bg: 'bg-[var(--border-subtle)]' },
        { name: 'Focus Halo', varName: '--border-focus', value: isDark ? 'rgba(0, 229, 255, 0.5)' : 'rgba(0, 139, 163, 0.6)', bg: 'bg-[var(--border-focus)]' },
        { name: 'Timeline Line', varName: '--timeline-line', value: isDark ? 'rgba(0, 210, 235, 0.3)' : '#cbd5e1', bg: 'bg-[var(--timeline-line)]' },
        { name: 'Timeline Node', varName: '--timeline-node', value: isDark ? '#00d2eb' : '#008ba3', bg: 'bg-[var(--timeline-node)]' },
      ],
    },
  ];

  // 2. True Raw Palette (Primitive scale: immutable, theme-agnostic 50–900 raw pigment scales at page end)
  const rawPrimitives: RawPrimitiveGroup[] = [
    {
      name: 'Primitive: Cyan',
      desc: 'Raw hue scale (Tech, Energy, Precision)',
      coreHex: '#00d2eb',
      shades: [
        { label: '50', hex: '#ecfeff', bg: 'bg-cyan-50', textLight: false },
        { label: '100', hex: '#cffafe', bg: 'bg-cyan-100', textLight: false },
        { label: '300', hex: '#67e8f9', bg: 'bg-cyan-300', textLight: false },
        { label: '400', hex: '#22d3ee', bg: 'bg-cyan-400', textLight: false },
        { label: '500 (Core)', hex: '#00d2eb', bg: 'bg-cyan-500', textLight: false },
        { label: '600', hex: '#00b4cc', bg: 'bg-cyan-600', textLight: true },
        { label: '700', hex: '#008ba3', bg: 'bg-cyan-700', textLight: true },
        { label: '800', hex: '#007084', bg: 'bg-cyan-800', textLight: true },
        { label: '900', hex: '#005f6e', bg: 'bg-cyan-900', textLight: true },
        { label: 'Neon', hex: '#00e5ff', bg: 'bg-cyan-neon', textLight: false },
      ],
    },
    {
      name: 'Primitive: Purple',
      desc: 'Raw hue scale (Cosmic, Depth, Creativity)',
      coreHex: '#a855f7',
      shades: [
        { label: '50', hex: '#faf5ff', bg: 'bg-purple-50', textLight: false },
        { label: '100', hex: '#f3e8ff', bg: 'bg-purple-100', textLight: false },
        { label: '300', hex: '#d8b4fe', bg: 'bg-purple-300', textLight: false },
        { label: '400', hex: '#c084fc', bg: 'bg-purple-400', textLight: false },
        { label: '500 (Core)', hex: '#a855f7', bg: 'bg-purple-500', textLight: true },
        { label: '600', hex: '#9333ea', bg: 'bg-purple-600', textLight: true },
        { label: '700', hex: '#7e22ce', bg: 'bg-purple-700', textLight: true },
        { label: '800', hex: '#6b21a8', bg: 'bg-purple-800', textLight: true },
        { label: 'Neon', hex: '#d946ef', bg: 'bg-purple-neon', textLight: true },
      ],
    },
    {
      name: 'Primitive: Orange',
      desc: 'Raw hue scale (Warmth, Action, Energy)',
      coreHex: '#f97316',
      shades: [
        { label: '50', hex: '#fff7ed', bg: 'bg-orange-50', textLight: false },
        { label: '100', hex: '#ffedd5', bg: 'bg-orange-100', textLight: false },
        { label: '300', hex: '#fdba74', bg: 'bg-orange-300', textLight: false },
        { label: '400', hex: '#fb923c', bg: 'bg-orange-400', textLight: false },
        { label: '500 (Core)', hex: '#f97316', bg: 'bg-orange-500', textLight: true },
        { label: '600', hex: '#ea580c', bg: 'bg-orange-600', textLight: true },
        { label: '700', hex: '#c2410c', bg: 'bg-orange-700', textLight: true },
        { label: '800', hex: '#9a3412', bg: 'bg-orange-800', textLight: true },
        { label: 'Neon', hex: '#ff6b00', bg: 'bg-orange-neon', textLight: true },
      ],
    },
    {
      name: 'Primitive: Spacetime Teal',
      desc: 'Raw space foundation scale (Lightest to Deepest)',
      coreHex: '#08212b',
      shades: [
        { label: '50', hex: '#eaf4f7', bg: 'bg-[var(--bg-app)]', textLight: false },
        { label: '100', hex: '#e0f2f6', bg: 'bg-[var(--bg-avatar)]', textLight: false },
        { label: '300', hex: '#92c5cf', bg: 'bg-[var(--text-secondary)]', textLight: false },
        { label: '500', hex: '#008ba3', bg: 'bg-cyan-700', textLight: true },
        { label: '700', hex: '#08212b', bg: 'bg-[#08212b]', textLight: true },
        { label: '800', hex: '#061e26', bg: 'bg-[#061e26]', textLight: true },
        { label: '900', hex: '#03141a', bg: 'bg-[#03141a]', textLight: true },
        { label: '950', hex: '#021016', bg: 'bg-[#021016]', textLight: true },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-12 border-b border-[var(--border-subtle)] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-mono mb-2 border border-[var(--brand-primary)]/20">
            Hidden Sandbox: #/ui-elements
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
            Design System & UI Elements
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-1">
            2-Layer Palette System (Semantic Inversion & True Raw Scales), interactive typewriter sandbox, and components.
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)]/30 text-[var(--brand-primary)] text-sm font-semibold hover:bg-[var(--brand-primary)]/25 transition-all self-start sm:self-center cursor-pointer"
        >
          Toggle Theme ({theme})
        </button>
      </div>

      {/* Section 1: Semantic Palette (Layer 1 - Dynamic Functional Inversion) */}
      <section className="mb-16">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span>1. Semantic Palette</span>
              <span className="text-xs font-mono text-[var(--brand-primary)] font-normal">(Dynamic Functional Layer)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Functional tokens mapped by UI role. Notice how the gradient inverts oppositely between themes: light mode darkens brand & text for contrast, while dark mode illuminates them against deep spacetime teal canvas.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 shrink-0">
            Active: {theme} mode
          </span>
        </div>

        {/* Opposite Gradient Banner */}
        <div className="mb-8 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[var(--brand-primary)]" />
            <span className="font-semibold text-[var(--text-primary)]">
              Opposite Gradient Mapping:
            </span>
            <span className="text-[var(--text-muted)]">
              {isDark ? 'Dark Base Canvas → Radiant Elevated Highlights' : 'Light Base Canvas → Dense Elevated Contrast'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-secondary)]">
            <span className="px-2 py-0.5 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)]">--bg-app</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)]">--bg-card</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-[var(--brand-primary)] text-white">--brand-primary</span>
          </div>
        </div>

        {/* Semantic Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {semanticGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl transition-colors duration-300 flex flex-col"
            >
              <div className="mb-2">
                <h3 className="font-bold text-base text-[var(--text-primary)]">
                  {group.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 min-h-[32px]">
                  {group.subtitle}
                </p>
              </div>

              <div className="space-y-2.5 mt-2 flex-1">
                {group.tokens.map((tok) => (
                  <div
                    key={tok.varName}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono font-medium transition-colors duration-200 ${
                      tok.isTextPreview
                        ? 'bg-[var(--bg-section)] border border-[var(--border-subtle)] text-[var(--text-primary)]'
                        : `${tok.bg} ${tok.border ? 'border border-[var(--border-subtle)]' : ''} text-[var(--text-primary)]`
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-[11px]">{tok.name}</span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">{tok.varName}</span>
                    </div>
                    <span className="text-[11px] opacity-90">{tok.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Typewriter Sandbox */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
          2. Typewriter Animation Sandbox
        </h2>

        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl space-y-6 transition-colors duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Text to write
              </label>
              <input
                type="text"
                value={sandboxText}
                onChange={(e) => setSandboxText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--brand-primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Speed: {sandboxSpeed}ms / char
              </label>
              <input
                type="range"
                min="5"
                max="80"
                value={sandboxSpeed}
                onChange={(e) => setSandboxSpeed(Number(e.target.value))}
                className="w-full accent-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Delay: {sandboxDelay}ms
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={sandboxDelay}
                onChange={(e) => setSandboxDelay(Number(e.target.value))}
                className="w-full accent-[var(--brand-secondary)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSandboxKey((prev) => prev + 1)}
              className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold text-xs transition-all cursor-pointer shadow"
            >
              Replay Animation
            </button>
          </div>

          {/* Live Preview Screen */}
          <div className="p-6 rounded-xl bg-[var(--bg-section)] border border-[var(--border-subtle)] min-h-[90px] flex items-center">
            <TypewriterProvider key={sandboxKey} initialStep={0} enabled={true}>
              <TypewriterText
                text={sandboxText}
                speed={sandboxSpeed}
                delay={sandboxDelay}
                step={0}
                className="text-lg sm:text-xl font-mono text-[var(--brand-primary)] font-semibold"
              />
            </TypewriterProvider>
          </div>
        </div>
      </section>

      {/* Section 3: Component Showcase Gallery */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
          3. Component Showcase Gallery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Corne Keyboard */}
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-md flex flex-col items-center justify-center gap-4 transition-colors duration-300">
            <h4 className="text-sm font-bold text-[var(--brand-primary)]">Corne Keyboard Visual</h4>
            <div className="group p-4 rounded-xl bg-[var(--bg-section)] border border-[var(--border-subtle)]">
              <CorneSvg />
            </div>
          </div>

          {/* Pixel Editor */}
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-md flex flex-col items-center justify-center gap-4 transition-colors duration-300">
            <h4 className="text-sm font-bold text-[var(--brand-secondary)]">Pixel Editor Visual</h4>
            <div className="group p-4 rounded-xl bg-[var(--bg-section)] border border-[var(--border-subtle)]">
              <BwpxSvg />
            </div>
          </div>

          {/* Screen Manager */}
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-md flex flex-col items-center justify-center gap-4 transition-colors duration-300">
            <h4 className="text-sm font-bold text-[var(--brand-accent)]">Screen Manager Visual</h4>
            <div className="group p-4 rounded-xl bg-[var(--bg-section)] border border-[var(--border-subtle)]">
              <ScreenMgrSvg />
            </div>
          </div>
        </div>

        {/* Avatar Showcase */}
        <div className="mt-8 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-md flex flex-wrap items-center justify-around gap-6 transition-colors duration-300">
          <div className="text-center">
            <Avatar size="sm" />
            <p className="text-xs text-[var(--text-muted)] mt-2 font-mono">sm</p>
          </div>
          <div className="text-center">
            <Avatar size="md" />
            <p className="text-xs text-[var(--text-muted)] mt-2 font-mono">md</p>
          </div>
          <div className="text-center">
            <Avatar size="lg" />
            <p className="text-xs text-[var(--text-muted)] mt-2 font-mono">lg</p>
          </div>
          <div className="text-center">
            <Avatar size="hero" />
            <p className="text-xs text-[var(--text-muted)] mt-2 font-mono">hero</p>
          </div>
        </div>
      </section>

      {/* Section 4: True Raw Palette (Layer 2 - Theme-Agnostic Primitive Scales at Complete End) */}
      <section className="pt-8 border-t border-[var(--border-subtle)]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span>4. True Raw Palette</span>
            <span className="text-xs font-mono text-[var(--brand-primary)] font-normal">(Primitive Scales)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Immutable, theme-agnostic 50–900 luminance scales representing raw pigments. Unlike semantic tokens, these raw shades do not invert between themes. UI components should consume semantic tokens rather than these raw values directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rawPrimitives.map((primitive) => (
            <div
              key={primitive.name}
              className="rounded-2xl p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base text-[var(--text-primary)]">
                  {primitive.name}
                </h3>
                <span
                  className="w-4 h-4 rounded-full border border-[var(--border-subtle)]"
                  style={{ backgroundColor: primitive.coreHex }}
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-4">{primitive.desc}</p>

              <div className="space-y-2">
                {primitive.shades.map((shade) => (
                  <div
                    key={shade.label}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono font-medium ${shade.bg} ${
                      shade.textLight ? 'text-white' : 'text-[var(--text-primary)]'
                    }`}
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
    </div>
  );
};

export default UiElementsPage;
