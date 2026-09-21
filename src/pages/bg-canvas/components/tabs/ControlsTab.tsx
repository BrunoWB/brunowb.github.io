import React from 'react';
import {
  Compass,
  Waves,
  Sparkles,
  Flame,
  Wind,
  Cloud,
  Contrast,
  Sun,
  Moon,
  EyeOff,
} from 'lucide-react';
import { REFLECTION_BLEND_MODES, type ReflectionBlendMode, type ScrimMode } from '../../../../types/background';
import { useTheme } from '../../../../context/ThemeContext';
import type { PlaygroundPreset } from '../../types';

interface ControlsTabProps {
  // Ambient lighting & scrim
  scrimMode: ScrimMode;
  setScrimMode: (val: ScrimMode) => void;
  darkScrimOpacity: number;
  setDarkScrimOpacity: (val: number) => void;
  lightScrimOpacity: number;
  setLightScrimOpacity: (val: number) => void;
  darkCenterGlowOpacity: number;
  setDarkCenterGlowOpacity: (val: number) => void;
  darkMidHazeOpacity: number;
  setDarkMidHazeOpacity: (val: number) => void;
  darkEdgeVignetteOpacity: number;
  setDarkEdgeVignetteOpacity: (val: number) => void;
  lightTopSkyOpacity: number;
  setLightTopSkyOpacity: (val: number) => void;
  lightMidAtmosphericOpacity: number;
  setLightMidAtmosphericOpacity: (val: number) => void;
  lightBottomHorizonOpacity: number;
  setLightBottomHorizonOpacity: (val: number) => void;

  // Presets & Solo
  applyPreset: (preset: PlaygroundPreset | 'serene' | 'interactive' | 'clean' | 'solo0') => void;
  isSoloLayer0Active: boolean;

  // Color grading
  colorGradingEnabled: boolean;
  setColorGradingEnabled: (val: boolean) => void;
  vibrance: number;
  setVibrance: (val: number) => void;
  saturation: number;
  setSaturation: (val: number) => void;
  inputBlack: number;
  setInputBlack: (val: number) => void;
  gamma: number;
  setGamma: (val: number) => void;
  inputWhite: number;
  setInputWhite: (val: number) => void;
  outputBlack: number;
  setOutputBlack: (val: number) => void;
  outputWhite: number;
  setOutputWhite: (val: number) => void;

  // Parallax
  parallaxEnabled: boolean;
  setParallaxEnabled: (val: boolean) => void;
  parallaxIntensity: number;
  setParallaxIntensity: (val: number) => void;
  reverseHorizontalParallax: boolean;
  setReverseHorizontalParallax: (val: boolean) => void;

  // Water & Reflection
  waterDistortionEnabled: boolean;
  setWaterDistortionEnabled: (val: boolean) => void;
  reflectionEnabled: boolean;
  setReflectionEnabled: (val: boolean) => void;
  waterWaveMode: 'continuous' | 'bands';
  setWaterWaveMode: (val: 'continuous' | 'bands') => void;
  liveWaterSpeed: number;
  liveWaterBlur: number;
  waterDistortionSpeed: number;
  setWaterDistortionSpeed: (val: number) => void;
  waterFarBackBlur: number;
  setWaterFarBackBlur: (val: number) => void;
  waterPerspectivePower: number;
  setWaterPerspectivePower: (val: number) => void;
  waterBandCount: number;
  setWaterBandCount: (val: number) => void;
  waterBandOffset: number;
  setWaterBandOffset: (val: number) => void;
  waterDistortionScale: number;
  setWaterDistortionScale: (val: number) => void;
  waterBlurTransitionSpeed: number;
  setWaterBlurTransitionSpeed: (val: number) => void;
  reflectionOpacity: number;
  setReflectionOpacity: (val: number) => void;
  reflectionBlendMode: ReflectionBlendMode;
  setReflectionBlendMode: (val: ReflectionBlendMode) => void;
  waterBlur: number;
  setWaterBlur: (val: number) => void;

  // Comet
  cometEnabled: boolean;
  cometFlameTailEnabled: boolean;
  setCometFlameTailEnabled: (val: boolean) => void;
  cometFlameTailSpeed: number;
  setCometFlameTailSpeed: (val: number) => void;
  cometTailTurbulence: number;
  setCometTailTurbulence: (val: number) => void;
  cometTailFlickerIntensity: number;
  setCometTailFlickerIntensity: (val: number) => void;
  cometTailFlickerSpeed: number;
  setCometTailFlickerSpeed: (val: number) => void;
  cometTailSpreadFactor: number;
  setCometTailSpreadFactor: (val: number) => void;
  cometTailFadePower: number;
  setCometTailFadePower: (val: number) => void;
  cometCorePulseEnabled: boolean;
  setCometCorePulseEnabled: (val: boolean) => void;
  cometCoreBaseOpacity: number;
  setCometCoreBaseOpacity: (val: number) => void;
  cometCorePulseSpeed: number;
  setCometCorePulseSpeed: (val: number) => void;
  cometCoreStretchScale: number;
  setCometCoreStretchScale: (val: number) => void;
  cometCorePeakBrightness: number;
  setCometCorePeakBrightness: (val: number) => void;
  cometCoreBaselineOpacity: number;
  setCometCoreBaselineOpacity: (val: number) => void;

  // Galaxy
  galaxyBreathingEnabled: boolean;
  setGalaxyBreathingEnabled: (val: boolean) => void;
  galaxyBreathingSpeed: number;
  setGalaxyBreathingSpeed: (val: number) => void;
  galaxyBreathingIntensity: number;
  setGalaxyBreathingIntensity: (val: number) => void;

  // Big Stars
  bigStarShineEnabled: boolean;
  setBigStarShineEnabled: (val: boolean) => void;
  bigStarShineIntensity: number;
  setBigStarShineIntensity: (val: number) => void;
  bigStarFlareSize: number;
  setBigStarFlareSize: (val: number) => void;
  bigStarShineSpeed: number;
  setBigStarShineSpeed: (val: number) => void;

  // Mist
  mistDisperseEnabled: boolean;
  setMistDisperseEnabled: (val: boolean) => void;
  mistInstances: number;
  setMistInstances: (val: number) => void;
  mistDisperseSpeed: number;
  setMistDisperseSpeed: (val: number) => void;
  mistDistortionScale: number;
  setMistDistortionScale: (val: number) => void;

  // Clouds
  cloudDriftEnabled: boolean;
  setCloudDriftEnabled: (val: boolean) => void;
  cloudDriftSpeed: number;
  setCloudDriftSpeed: (val: number) => void;
  cloudDistortionEnabled: boolean;
  setCloudDistortionEnabled: (val: boolean) => void;
  cloudDistortionScale: number;
  setCloudDistortionScale: (val: number) => void;
  cloudMorphSpeed: number;
  setCloudMorphSpeed: (val: number) => void;
}

export const ControlsTab: React.FC<ControlsTabProps> = ({
  scrimMode,
  setScrimMode,
  darkScrimOpacity,
  setDarkScrimOpacity,
  lightScrimOpacity,
  setLightScrimOpacity,
  darkCenterGlowOpacity,
  setDarkCenterGlowOpacity,
  darkMidHazeOpacity,
  setDarkMidHazeOpacity,
  darkEdgeVignetteOpacity,
  setDarkEdgeVignetteOpacity,
  lightTopSkyOpacity,
  setLightTopSkyOpacity,
  lightMidAtmosphericOpacity,
  setLightMidAtmosphericOpacity,
  lightBottomHorizonOpacity,
  setLightBottomHorizonOpacity,
  applyPreset,
  isSoloLayer0Active,
  colorGradingEnabled,
  setColorGradingEnabled,
  vibrance,
  setVibrance,
  saturation,
  setSaturation,
  inputBlack,
  setInputBlack,
  gamma,
  setGamma,
  inputWhite,
  setInputWhite,
  outputBlack,
  setOutputBlack,
  outputWhite,
  setOutputWhite,
  parallaxEnabled,
  setParallaxEnabled,
  parallaxIntensity,
  setParallaxIntensity,
  reverseHorizontalParallax,
  setReverseHorizontalParallax,
  waterDistortionEnabled,
  setWaterDistortionEnabled,
  reflectionEnabled,
  setReflectionEnabled,
  waterWaveMode,
  setWaterWaveMode,
  liveWaterSpeed,
  liveWaterBlur,
  waterDistortionSpeed,
  setWaterDistortionSpeed,
  waterFarBackBlur,
  setWaterFarBackBlur,
  waterPerspectivePower,
  setWaterPerspectivePower,
  waterBandCount,
  setWaterBandCount,
  waterBandOffset,
  setWaterBandOffset,
  waterDistortionScale,
  setWaterDistortionScale,
  waterBlurTransitionSpeed,
  setWaterBlurTransitionSpeed,
  reflectionOpacity,
  setReflectionOpacity,
  reflectionBlendMode,
  setReflectionBlendMode,
  waterBlur,
  setWaterBlur,
  cometEnabled,
  cometFlameTailEnabled,
  setCometFlameTailEnabled,
  cometFlameTailSpeed,
  setCometFlameTailSpeed,
  cometTailTurbulence,
  setCometTailTurbulence,
  cometTailFlickerIntensity,
  setCometTailFlickerIntensity,
  cometTailFlickerSpeed,
  setCometTailFlickerSpeed,
  cometTailSpreadFactor,
  setCometTailSpreadFactor,
  cometTailFadePower,
  setCometTailFadePower,
  cometCorePulseEnabled,
  setCometCorePulseEnabled,
  cometCoreBaseOpacity,
  setCometCoreBaseOpacity,
  cometCorePulseSpeed,
  setCometCorePulseSpeed,
  cometCoreStretchScale,
  setCometCoreStretchScale,
  cometCorePeakBrightness,
  setCometCorePeakBrightness,
  cometCoreBaselineOpacity,
  setCometCoreBaselineOpacity,
  galaxyBreathingEnabled,
  setGalaxyBreathingEnabled,
  galaxyBreathingSpeed,
  setGalaxyBreathingSpeed,
  galaxyBreathingIntensity,
  setGalaxyBreathingIntensity,
  bigStarShineEnabled,
  setBigStarShineEnabled,
  bigStarShineIntensity,
  setBigStarShineIntensity,
  bigStarFlareSize,
  setBigStarFlareSize,
  bigStarShineSpeed,
  setBigStarShineSpeed,
  mistDisperseEnabled,
  setMistDisperseEnabled,
  mistInstances,
  setMistInstances,
  mistDisperseSpeed,
  setMistDisperseSpeed,
  mistDistortionScale,
  setMistDistortionScale,
  cloudDriftEnabled,
  setCloudDriftEnabled,
  cloudDriftSpeed,
  setCloudDriftSpeed,
  cloudDistortionEnabled,
  setCloudDistortionEnabled,
  cloudDistortionScale,
  setCloudDistortionScale,
  cloudMorphSpeed,
  setCloudMorphSpeed,
}) => {
  const { setTheme } = useTheme();

  const handleScrimModeChange = (mode: ScrimMode) => {
    setScrimMode(mode);
    if (mode === 'light') {
      setTheme('light');
    } else if (mode === 'dark') {
      setTheme('dark');
    }
  };

  return (
    <div className="space-y-4">
      {/* Ambient Lighting & Scrim Mode: None / Dark / Light */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Ambient Lighting & Scrim
          </label>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${
              scrimMode === 'dark'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : scrimMode === 'light'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
            }`}
          >
            {scrimMode === 'none'
              ? 'None (Raw)'
              : scrimMode === 'dark'
              ? `Dark (${Math.round(darkScrimOpacity * 100)}%)`
              : `Light (${Math.round(lightScrimOpacity * 100)}%)`}
          </span>
        </div>

        {/* None / Dark / Light Radio Toggle */}
        <div
          className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-slate-800"
          role="radiogroup"
          aria-label="Ambient lighting and scrim mode"
        >
          {(
            [
              { id: 'none', label: 'None', icon: EyeOff },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'light', label: 'Light', icon: Sun },
            ] as const
          ).map((item) => {
            const isSelected = scrimMode === item.id;
            const Icon = item.icon;
            return (
              <label
                key={item.id}
                className={`flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all text-xs font-semibold select-none border ${
                  isSelected
                    ? item.id === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : item.id === 'light'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'bg-slate-700/60 border-slate-500 text-slate-200 shadow-sm'
                    : 'border-transparent text-[var(--text-muted)] hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <input
                  type="radio"
                  name="ambient-scrim-mode"
                  value={item.id}
                  checked={isSelected}
                  onChange={() => handleScrimModeChange(item.id)}
                  className="sr-only"
                />
                <span
                  className={`w-2 h-2 rounded-full border transition-all ${
                    isSelected
                      ? item.id === 'dark'
                        ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_6px_#22d3ee]'
                        : item.id === 'light'
                        ? 'bg-amber-400 border-amber-300 shadow-[0_0_6px_#fbbf24]'
                        : 'bg-slate-300 border-white'
                      : 'border-slate-500 bg-transparent'
                  }`}
                />
                <Icon className="w-3.5 h-3.5 opacity-90" />
                <span>{item.label}</span>
              </label>
            );
          })}
        </div>

        {/* When in Dark: Show values of Darkening */}
        {scrimMode === 'dark' && (
          <div className="space-y-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                Darkening Scrim (Ambient Center Glow)
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 uppercase">
                Radial Gradient
              </span>
            </div>

            {/* Darkening Opacity Slider */}
            <div>
              <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
                <span>Darkening Opacity</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-cyan-300 font-semibold">
                    {Math.round(darkScrimOpacity * 100)}% ({darkScrimOpacity.toFixed(2)})
                  </span>
                  {darkScrimOpacity !== 0.60 && (
                    <button
                      onClick={() => setDarkScrimOpacity(0.60)}
                      className="text-[10px] text-[var(--text-muted)] hover:text-cyan-300 underline"
                      title="Reset darkening opacity to default 0.60"
                    >
                      Reset (0.60)
                    </button>
                  )}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={darkScrimOpacity}
                onChange={(e) => setDarkScrimOpacity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Color Stops & Values breakdown */}
            <div className="space-y-1 pt-1.5 border-t border-slate-800 text-[10px] font-mono">
              <div className="text-[10px] text-[var(--text-muted)] font-sans font-medium mb-1">
                Darkening Formula & Calibration Stops:
              </div>
              {/* Stop 1: Center Glow (0%) */}
              <div className="space-y-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm transition-colors"
                      style={{ backgroundColor: `rgba(9, 71, 87, ${darkCenterGlowOpacity})` }}
                    />
                    <span className="text-slate-300 font-sans text-xs">Center Glow (0%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-cyan-300">
                      rgba(9, 71, 87, {darkCenterGlowOpacity.toFixed(2)})
                    </span>
                    {darkCenterGlowOpacity !== 0.38 && (
                      <button
                        onClick={() => setDarkCenterGlowOpacity(0.38)}
                        className="text-[9px] text-[var(--text-muted)] hover:text-cyan-300 underline font-sans"
                        title="Reset Center Glow opacity to 0.38"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={darkCenterGlowOpacity}
                  onChange={(e) => setDarkCenterGlowOpacity(parseFloat(e.target.value))}
                  aria-label="Center Glow (0%) opacity"
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              {/* Stop 2: Mid Haze (60%) */}
              <div className="space-y-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm transition-colors"
                      style={{ backgroundColor: `rgba(3, 35, 44, ${darkMidHazeOpacity})` }}
                    />
                    <span className="text-slate-300 font-sans text-xs">Mid Haze (60%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-cyan-300">
                      rgba(3, 35, 44, {darkMidHazeOpacity.toFixed(2)})
                    </span>
                    {darkMidHazeOpacity !== 0.49 && (
                      <button
                        onClick={() => setDarkMidHazeOpacity(0.49)}
                        className="text-[9px] text-[var(--text-muted)] hover:text-cyan-300 underline font-sans"
                        title="Reset Mid Haze opacity to 0.49"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={darkMidHazeOpacity}
                  onChange={(e) => setDarkMidHazeOpacity(parseFloat(e.target.value))}
                  aria-label="Mid Haze (60%) opacity"
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              {/* Stop 3: Edge Vignette (100%) */}
              <div className="space-y-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm transition-colors"
                      style={{ backgroundColor: `rgba(2, 19, 25, ${darkEdgeVignetteOpacity})` }}
                    />
                    <span className="text-slate-300 font-sans text-xs">Edge Vignette (100%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-cyan-300">
                      rgba(2, 19, 25, {darkEdgeVignetteOpacity.toFixed(2)})
                    </span>
                    {darkEdgeVignetteOpacity !== 0.83 && (
                      <button
                        onClick={() => setDarkEdgeVignetteOpacity(0.83)}
                        className="text-[9px] text-[var(--text-muted)] hover:text-cyan-300 underline font-sans"
                        title="Reset Edge Vignette opacity to 0.83"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={darkEdgeVignetteOpacity}
                  onChange={(e) => setDarkEdgeVignetteOpacity(parseFloat(e.target.value))}
                  aria-label="Edge Vignette (100%) opacity"
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] px-1 pt-0.5">
                <span>CSS Token: --bg-dark-tint-opacity</span>
                <span>Target: #021319 Deep Space</span>
              </div>
            </div>
          </div>
        )}

        {/* When in Light: Show values of Lightening */}
        {scrimMode === 'light' && (
          <div className="space-y-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Lightening Scrim (Ambient Center Glow)
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/30 uppercase">
                Radial Gradient
              </span>
            </div>

            {/* Lightening Opacity Slider */}
            <div>
              <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
                <span>Lightening Opacity</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-amber-300 font-semibold">
                    {Math.round(lightScrimOpacity * 100)}% ({lightScrimOpacity.toFixed(2)})
                  </span>
                  {lightScrimOpacity !== 0.40 && (
                    <button
                      onClick={() => setLightScrimOpacity(0.40)}
                      className="text-[10px] text-[var(--text-muted)] hover:text-amber-300 underline"
                      title="Reset lightening opacity to default 0.40"
                    >
                      Reset (0.40)
                    </button>
                  )}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={lightScrimOpacity}
                onChange={(e) => setLightScrimOpacity(parseFloat(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Color Stops & Values breakdown */}
            <div className="space-y-1 pt-1.5 border-t border-slate-800 text-[10px] font-mono">
              <div className="text-[10px] text-[var(--text-muted)] font-sans font-medium mb-1">
                Lightening Formula & Calibration Stops:
              </div>
              {/* Stop 1: Center Sky (0%) */}
              <div className="space-y-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm transition-colors"
                      style={{ backgroundColor: `rgba(235, 246, 250, ${lightTopSkyOpacity})` }}
                    />
                    <span className="text-slate-300 font-sans text-xs">Center Sky (0%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-amber-200">
                      rgba(235, 246, 250, {lightTopSkyOpacity.toFixed(2)})
                    </span>
                    {lightTopSkyOpacity !== 0.86 && (
                      <button
                        onClick={() => setLightTopSkyOpacity(0.86)}
                        className="text-[9px] text-[var(--text-muted)] hover:text-amber-300 underline font-sans"
                        title="Reset Center Sky opacity to 0.86"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={lightTopSkyOpacity}
                  onChange={(e) => setLightTopSkyOpacity(parseFloat(e.target.value))}
                  aria-label="Center Sky (0%) opacity"
                  className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              {/* Stop 2: Mid Atmospheric (55%) */}
              <div className="space-y-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm transition-colors"
                      style={{ backgroundColor: `rgba(218, 238, 246, ${lightMidAtmosphericOpacity})` }}
                    />
                    <span className="text-slate-300 font-sans text-xs">Mid Atmospheric (55%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-amber-200">
                      rgba(218, 238, 246, {lightMidAtmosphericOpacity.toFixed(2)})
                    </span>
                    {lightMidAtmosphericOpacity !== 0.44 && (
                      <button
                        onClick={() => setLightMidAtmosphericOpacity(0.44)}
                        className="text-[9px] text-[var(--text-muted)] hover:text-amber-300 underline font-sans"
                        title="Reset Mid Atmospheric opacity to 0.44"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={lightMidAtmosphericOpacity}
                  onChange={(e) => setLightMidAtmosphericOpacity(parseFloat(e.target.value))}
                  aria-label="Mid Atmospheric (55%) opacity"
                  className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              {/* Stop 3: Edge Horizon (100%) */}
              <div className="space-y-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm transition-colors"
                      style={{ backgroundColor: `rgba(195, 226, 238, ${lightBottomHorizonOpacity})` }}
                    />
                    <span className="text-slate-300 font-sans text-xs">Edge Horizon (100%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-amber-200">
                      rgba(195, 226, 238, {lightBottomHorizonOpacity.toFixed(2)})
                    </span>
                    {lightBottomHorizonOpacity !== 0.19 && (
                      <button
                        onClick={() => setLightBottomHorizonOpacity(0.19)}
                        className="text-[9px] text-[var(--text-muted)] hover:text-amber-300 underline font-sans"
                        title="Reset Edge Horizon opacity to 0.19"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={lightBottomHorizonOpacity}
                  onChange={(e) => setLightBottomHorizonOpacity(parseFloat(e.target.value))}
                  aria-label="Edge Horizon (100%) opacity"
                  className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] px-1 pt-0.5">
                <span>CSS Token: --bg-light-tint-opacity</span>
                <span>Target: Clean Paper Wash</span>
              </div>
            </div>
          </div>
        )}

        {/* When in None: Clean Stack notice */}
        {scrimMode === 'none' && (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-[11px] text-[var(--text-muted)] flex items-center justify-between animate-fadeIn">
            <span>Raw Canvas: Ambient darkening & lightening overlays disabled</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              Clean Stack
            </span>
          </div>
        )}
      </div>

      {/* Presets */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 block">
          Presets
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {[
            { id: 'serene', label: 'Serene' },
            { id: 'interactive', label: 'Living' },
            { id: 'cosmic', label: 'Cosmic' },
            { id: 'storm', label: 'Tempest' },
            { id: 'minimal', label: 'Minimal' },
            { id: 'solo0', label: 'Solo L0' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id as any)}
              className={`px-2 py-1.5 rounded-lg border transition-all text-center font-medium ${
                p.id === 'solo0' && isSoloLayer0Active
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Master Post-Processing: Photoshop Vibrance & Levels */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <Contrast className="w-3.5 h-3.5 text-cyan-400" />
            Photoshop Vibrance & Levels
          </span>
          <button
            onClick={() => setColorGradingEnabled(!colorGradingEnabled)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
              colorGradingEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {colorGradingEnabled ? 'ACTIVE' : 'OFF'}
          </button>
        </div>

        {/* Hardware GPU Compositor Post-Processing info badge */}
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/40 text-[10px] text-[var(--text-muted)] space-y-1">
          <div className="flex items-center justify-between text-cyan-300 font-mono text-[9px] uppercase">
            <span>Hardware GPU Compositor Post-Processing</span>
            <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-1 rounded">60 FPS Locked</span>
          </div>
          <p className="leading-tight text-[10px]">
            Zero CPU pixel iteration. Hardware compositor applies tone mapping, contrast, and vibrance scaling directly via GPU compositor shaders.
          </p>
        </div>


        {/* 1. Photoshop Vibrance & Saturation */}
        <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]/30">
          <span className="text-[11px] font-semibold text-cyan-200 uppercase tracking-wider block">
            Vibrance & Saturation
          </span>

          {/* Vibrance Slider */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Vibrance</span>
              <span className="font-mono text-cyan-300">{vibrance > 0 ? `+${vibrance}` : vibrance}</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={vibrance}
              onChange={(e) => setVibrance(parseInt(e.target.value))}
              disabled={!colorGradingEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* Saturation Slider */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Saturation</span>
              <span className="font-mono text-cyan-300">{saturation > 0 ? `+${saturation}` : saturation}</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
              disabled={!colorGradingEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>

        {/* 2. Photoshop Levels Adjustment */}
        <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]/30">
          <span className="text-[11px] font-semibold text-cyan-200 uppercase tracking-wider block">
            Photoshop Levels
          </span>

          {/* Input Black / Shadows */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Input Black / Shadows</span>
              <span className="font-mono text-cyan-300">{inputBlack}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              step="1"
              value={inputBlack}
              onChange={(e) => setInputBlack(parseInt(e.target.value))}
              disabled={!colorGradingEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* Gamma / Midtones */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Gamma / Midtones</span>
              <span className="font-mono text-cyan-300">{gamma.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.05"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              disabled={!colorGradingEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* Input White / Highlights */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Input White / Highlights</span>
              <span className="font-mono text-cyan-300">{inputWhite}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              step="1"
              value={inputWhite}
              onChange={(e) => setInputWhite(parseInt(e.target.value))}
              disabled={!colorGradingEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* Output Black */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Output Black</span>
              <span className="font-mono text-cyan-300">{outputBlack}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              step="1"
              value={outputBlack}
              onChange={(e) => setOutputBlack(parseInt(e.target.value))}
              disabled={!colorGradingEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* Output White */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Output White</span>
              <span className="font-mono text-cyan-300">{outputWhite}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              step="1"
              value={outputWhite}
              onChange={(e) => setOutputWhite(parseInt(e.target.value))}
              disabled={!colorGradingEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>
      </div>

      {/* 1. Parallax Physics & Depth Ordering */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Physical Parallax Depth
          </span>
          <button
            onClick={() => setParallaxEnabled(!parallaxEnabled)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              parallaxEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {parallaxEnabled ? 'ACTIVE' : 'OFF'}
          </button>
        </div>

        <div>
          <div className="flex justify-between text-[var(--text-muted)] mb-1">
            <span>Global Parallax Intensity</span>
            <span className="font-mono text-cyan-300">{parallaxIntensity.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            min="0"
            max="3.0"
            step="0.1"
            value={parallaxIntensity}
            onChange={(e) => setParallaxIntensity(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            Physical calibration: Space/stars = 0.006-0.02, Clouds = 0.065, Foreground mist = 0.32
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border-subtle)]/30 flex items-center justify-between">
          <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={reverseHorizontalParallax}
              onChange={(e) => setReverseHorizontalParallax(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 accent-cyan-400 focus:ring-cyan-400/30 focus:ring-offset-0 cursor-pointer"
            />
            <span>Reverse Horizontal Motion</span>
          </label>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {reverseHorizontalParallax ? 'INVERTED' : 'NORMAL'}
          </span>
        </div>
      </div>

      {/* 2. Water Reflection & Perspective Wave Distortion */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            Water Reflection & Perspective Waves
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setWaterDistortionEnabled(!waterDistortionEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                waterDistortionEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {waterDistortionEnabled ? 'WAVES ON' : 'STATIC'}
            </button>
            <button
              onClick={() => setReflectionEnabled(!reflectionEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                reflectionEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {reflectionEnabled ? 'REFLECT ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Performance & Dynamic Telemetry status badge */}
        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {waterWaveMode === 'continuous'
                ? 'Continuous Whole-Raster Wave Dynamics (Seamless)'
                : 'Perspective Wave Mesh (32 Bands • 4 Blur Tiers)'}
            </span>
            <span className="text-[9px] font-mono uppercase bg-emerald-900/50 text-emerald-300 px-1.5 py-0.5 rounded">
              &lt; 0.2ms / 60 FPS
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono pt-0.5">
            <div className="bg-slate-900/60 px-2 py-1 rounded text-cyan-300">
              Wave Speed: <span className="text-white font-bold">{liveWaterSpeed.toFixed(2)}×</span>
              <span className="text-[9px] text-[var(--text-muted)] ml-1">(base {waterDistortionSpeed.toFixed(1)}×)</span>
            </div>
            <div className="bg-slate-900/60 px-2 py-1 rounded text-cyan-300">
              Horizon Blur: <span className="text-white font-bold">{liveWaterBlur.toFixed(1)}px</span>
              <span className="text-[9px] text-[var(--text-muted)] ml-1">(base {waterFarBackBlur.toFixed(1)}px)</span>
            </div>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] leading-normal">
            {waterWaveMode === 'continuous'
              ? 'Continuous whole-raster wave dynamics with horizon-anchored organic swell and harmonic drift. Zero slicing seams or Venetian blind artifacts across cloud reflections.'
              : `Perspective-accurate depth physics (A(v) ∝ v^${waterPerspectivePower.toFixed(1)}). Distant horizon features non-linear depth blur (${waterFarBackBlur.toFixed(1)}px baseline, surging dynamically) with smooth continuous temporal easing.`}
          </p>
        </div>

        {/* Wave Dynamic Mode Toggle */}
        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1.5">
            <span>Wave Dynamic Mode</span>
            <span className="font-mono text-cyan-300 capitalize">{waterWaveMode}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWaterWaveMode('continuous')}
              className={`px-2.5 py-1.5 rounded text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                waterWaveMode === 'continuous'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Continuous (Seamless)
            </button>
            <button
              type="button"
              onClick={() => setWaterWaveMode('bands')}
              className={`px-2.5 py-1.5 rounded text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                waterWaveMode === 'bands'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              Bands ({waterBandCount} Strips)
            </button>
          </div>
        </div>

        {/* Bands Mode Parameters: Band Count & Band Offset */}
        {waterWaveMode === 'bands' && (
          <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 space-y-3">
            <div>
              <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
                <span>Band Count (Slices)</span>
                <span className="font-mono text-cyan-300">{waterBandCount} bands</span>
              </div>
              <input
                type="range"
                min="8"
                max="96"
                step="1"
                value={waterBandCount}
                onChange={(e) => setWaterBandCount(parseInt(e.target.value, 10))}
                disabled={!reflectionEnabled || !waterDistortionEnabled}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
              />
              <div className="flex justify-between text-[9px] text-[var(--text-muted)] mt-0.5 font-mono">
                <span>8 (chunky)</span>
                <span>50 (default)</span>
                <span>96 (micro)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
                <span>Band Offset (Distance / Overlap)</span>
                <span className="font-mono text-cyan-300">
                  {waterBandOffset > 0 ? `+${waterBandOffset.toFixed(1)}` : waterBandOffset.toFixed(1)}px
                </span>
              </div>
              <input
                type="range"
                min="-4.0"
                max="4.0"
                step="0.1"
                value={waterBandOffset}
                onChange={(e) => setWaterBandOffset(parseFloat(e.target.value))}
                disabled={!reflectionEnabled || !waterDistortionEnabled}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
              />
              <p className="text-[9px] text-[var(--text-muted)] mt-0.5 leading-tight">
                Distance between 2 bands: &lt; 0px gap spacing, 0px exact touch, &gt; 0px overlap padding.
              </p>
            </div>
          </div>
        )}

        {/* Perspective Wave Scale */}
        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Perspective Wave Scale</span>
            <span className="font-mono text-cyan-300">{waterDistortionScale}px</span>
          </div>
          <input
            type="range"
            min="25"
            max="55"
            step="1"
            value={waterDistortionScale}
            onChange={(e) => setWaterDistortionScale(parseInt(e.target.value))}
            disabled={!reflectionEnabled || !waterDistortionEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
        </div>

        {/* Wave Speed */}
        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Wave Speed (Baseline)</span>
            <span className="font-mono text-cyan-300">{waterDistortionSpeed.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={waterDistortionSpeed}
            onChange={(e) => setWaterDistortionSpeed(parseFloat(e.target.value))}
            disabled={!reflectionEnabled || !waterDistortionEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
        </div>

        {/* Perspective Power */}
        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Perspective Power</span>
            <span className="font-mono text-cyan-300">{waterPerspectivePower.toFixed(1)}p</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="4.0"
            step="0.1"
            value={waterPerspectivePower}
            onChange={(e) => setWaterPerspectivePower(parseFloat(e.target.value))}
            disabled={!reflectionEnabled || !waterDistortionEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
        </div>

        {/* Blur Transition Speed / Easing Rate */}
        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Blur Transition Speed / Easing Rate</span>
            <span className="font-mono text-cyan-300">{waterBlurTransitionSpeed.toFixed(1)}/s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.0"
            step="0.1"
            value={waterBlurTransitionSpeed}
            onChange={(e) => setWaterBlurTransitionSpeed(parseFloat(e.target.value))}
            disabled={!reflectionEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
        </div>

        {/* Far-Back Horizon Blur Peak */}
        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Far-Back Horizon Blur Peak</span>
            <span className="font-mono text-cyan-300">{waterFarBackBlur.toFixed(1)}px</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="5.0"
            step="0.1"
            value={waterFarBackBlur}
            onChange={(e) => setWaterFarBackBlur(parseFloat(e.target.value))}
            disabled={!reflectionEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
        </div>

        {/* Reflection Opacity */}
        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Reflection Opacity</span>
            <span className="font-mono text-cyan-300">{Math.round(reflectionOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={reflectionOpacity}
            onChange={(e) => setReflectionOpacity(parseFloat(e.target.value))}
            disabled={!reflectionEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
        </div>

        {/* Reflection Blend Mode Picker */}
        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1.5">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Reflection Blend Mode
            </span>
            <span className="font-mono text-cyan-300 uppercase text-[11px] font-bold">
              {reflectionBlendMode}
            </span>
          </div>
          <select
            value={reflectionBlendMode}
            onChange={(e) => setReflectionBlendMode(e.target.value as ReflectionBlendMode)}
            disabled={!reflectionEnabled}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-cyan-200 font-mono focus:outline-none focus:border-cyan-400 cursor-pointer disabled:opacity-30"
          >
            {REFLECTION_BLEND_MODES.map((mode) => (
              <option key={mode.value} value={mode.value} className="bg-slate-900 text-slate-200 font-sans">
                {mode.label} — {mode.description}
              </option>
            ))}
          </select>

          {/* Quick-select pills */}
          <div className="flex flex-wrap gap-1 mt-2">
            {REFLECTION_BLEND_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => setReflectionBlendMode(mode.value)}
                disabled={!reflectionEnabled}
                title={mode.description}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  reflectionBlendMode === mode.value
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 font-bold'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                } disabled:opacity-30`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-[var(--text-muted)] mt-1.5 italic">
            {REFLECTION_BLEND_MODES.find((m) => m.value === reflectionBlendMode)?.description}
          </p>
        </div>

        {/* Water Surface Backdrop Blur */}
        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Water Surface Backdrop Blur</span>
            <span className="font-mono text-cyan-300">{waterBlur.toFixed(1)}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="3.0"
            step="0.5"
            value={waterBlur}
            onChange={(e) => setWaterBlur(parseFloat(e.target.value))}
            disabled={!reflectionEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
        </div>
      </div>

      {/* 3. Deep Space Comet Dynamics (Comet Flame Tail & Core Pulse) */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            Comet Flame Tail & Core Pulse
          </span>
          <button
            onClick={() => {
              const next = !cometFlameTailEnabled;
              setCometFlameTailEnabled(next);
              setCometCorePulseEnabled(next);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              cometFlameTailEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {cometFlameTailEnabled ? 'FLAME & PULSE' : 'STATIC'}
          </button>
        </div>

        {/* Dust Tail Properties */}
        <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[var(--text-secondary)] font-medium">Dust Tail Properties</div>
            <button
              onClick={() => setCometFlameTailEnabled(!cometFlameTailEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                cometFlameTailEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {cometFlameTailEnabled ? 'Active' : 'Off'}
            </button>
          </div>

          {/* Tail Flame Wave Turbulence Speed */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Wave Turbulence Speed</span>
              <span className="font-mono text-cyan-300">{cometFlameTailSpeed.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={cometFlameTailSpeed}
              onChange={(e) => setCometFlameTailSpeed(parseFloat(e.target.value))}
              disabled={!cometFlameTailEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* 1. Tail Flame Turbulence / Wave Amplitude (orthogonal displacement) */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Tail Flame Turbulence / Wave Amplitude</span>
              <span className="font-mono text-cyan-300">{cometTailTurbulence.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.1"
              value={cometTailTurbulence}
              onChange={(e) => setCometTailTurbulence(parseFloat(e.target.value))}
              disabled={!cometFlameTailEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* 2. Tail Flame Flicker Intensity */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Tail Flame Flicker Intensity</span>
              <span className="font-mono text-cyan-300">{cometTailFlickerIntensity.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.5"
              step="0.1"
              value={cometTailFlickerIntensity}
              onChange={(e) => setCometTailFlickerIntensity(parseFloat(e.target.value))}
              disabled={!cometFlameTailEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* 3. Tail Flame Flicker Speed / Frequency */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Tail Flame Flicker Speed / Frequency</span>
              <span className="font-mono text-cyan-300">{cometTailFlickerSpeed.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={cometTailFlickerSpeed}
              onChange={(e) => setCometTailFlickerSpeed(parseFloat(e.target.value))}
              disabled={!cometFlameTailEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* 4. Tail Lateral Spread Factor */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Tail Lateral Spread Factor</span>
              <span className="font-mono text-cyan-300">{cometTailSpreadFactor.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.5"
              step="0.1"
              value={cometTailSpreadFactor}
              onChange={(e) => setCometTailSpreadFactor(parseFloat(e.target.value))}
              disabled={!cometFlameTailEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* 5. Tail Terminal Fade Power */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Tail Terminal Fade Power</span>
              <span className="font-mono text-cyan-300">{cometTailFadePower.toFixed(2)}p</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.05"
              value={cometTailFadePower}
              onChange={(e) => setCometTailFadePower(parseFloat(e.target.value))}
              disabled={!cometFlameTailEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>

        {/* Core Streak Properties */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[var(--text-secondary)] font-medium">Core Streak Properties</div>
            <button
              onClick={() => setCometCorePulseEnabled(!cometCorePulseEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                cometCorePulseEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {cometCorePulseEnabled ? 'Pulse ON' : 'Pulse OFF'}
            </button>
          </div>

          {/* 1. Core Streak Base Opacity */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Core Streak Base Opacity</span>
              <span className="font-mono text-cyan-300">{Math.round(cometCoreBaseOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={cometCoreBaseOpacity}
              onChange={(e) => setCometCoreBaseOpacity(parseFloat(e.target.value))}
              disabled={!cometEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* 2. Core Traveling Pulse Speed */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Core Traveling Pulse Speed</span>
              <span className="font-mono text-cyan-300">{cometCorePulseSpeed.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={cometCorePulseSpeed}
              onChange={(e) => setCometCorePulseSpeed(parseFloat(e.target.value))}
              disabled={!cometCorePulseEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* 3. Core Stretch Length / Amplitude along angle */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Core Stretch Length / Amplitude along angle</span>
              <span className="font-mono text-cyan-300">{cometCoreStretchScale.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.5"
              step="0.1"
              value={cometCoreStretchScale}
              onChange={(e) => setCometCoreStretchScale(parseFloat(e.target.value))}
              disabled={!cometCorePulseEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* 4. Core Pulse Peak Brightness / Surge Opacity */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Core Pulse Peak Brightness / Surge Opacity</span>
              <span className="font-mono text-cyan-300">{Math.round(cometCorePeakBrightness * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.02"
              value={cometCorePeakBrightness}
              onChange={(e) => setCometCorePeakBrightness(parseFloat(e.target.value))}
              disabled={!cometCorePulseEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* 5. Core Baseline Hidden Opacity */}
          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Core Baseline Hidden Opacity</span>
              <span className="font-mono text-cyan-300">{Math.round(cometCoreBaselineOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.25"
              step="0.01"
              value={cometCoreBaselineOpacity}
              onChange={(e) => setCometCoreBaselineOpacity(parseFloat(e.target.value))}
              disabled={!cometCorePulseEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>
      </div>

      {/* 4. Living Breathing Galaxy (Milky Way Celestial Respiration) */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Living Breathing Galaxy (Milky Way)
          </span>
          <button
            onClick={() => setGalaxyBreathingEnabled(!galaxyBreathingEnabled)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              galaxyBreathingEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {galaxyBreathingEnabled ? 'BREATHING' : 'STATIC'}
          </button>
        </div>

        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Respiration Cycle Speed</span>
            <span className="font-mono text-cyan-300">{galaxyBreathingSpeed.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={galaxyBreathingSpeed}
            onChange={(e) => setGalaxyBreathingSpeed(parseFloat(e.target.value))}
            disabled={!galaxyBreathingEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            Ultra-slow 18–28s harmonic oscillation without size deformation.
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Luminosity & Opacity Depth</span>
            <span className="font-mono text-cyan-300">{galaxyBreathingIntensity.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="2.0"
            step="0.1"
            value={galaxyBreathingIntensity}
            onChange={(e) => setGalaxyBreathingIntensity(parseFloat(e.target.value))}
            disabled={!galaxyBreathingEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            Subtle phase offsets across base dust, core gas, and bright highlights.
          </div>
        </div>
      </div>

      {/* 4. Big Star Natural Luminous Shine */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Big Star Natural Shine & Scintillation
          </span>
          <button
            onClick={() => setBigStarShineEnabled(!bigStarShineEnabled)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              bigStarShineEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {bigStarShineEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div>
          <div className="flex justify-between text-[var(--text-muted)] mb-1">
            <span>Shine Intensity (Scintillation Core)</span>
            <span className="font-mono text-cyan-300">
              {Number((bigStarShineIntensity * 100).toFixed(1))}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.15"
            step="0.005"
            value={bigStarShineIntensity}
            onChange={(e) => setBigStarShineIntensity(parseFloat(e.target.value))}
            disabled={!bigStarShineEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            Calibrated max 15%. Scales flare smoothly from 50% at 0% to 100% at 15%.
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[var(--text-muted)] mb-1">
            <span>Diffraction Ray & Flare Size</span>
            <span className="font-mono text-cyan-300">{bigStarFlareSize}px</span>
          </div>
          <input
            type="range"
            min="6"
            max="26"
            step="1"
            value={bigStarFlareSize}
            onChange={(e) => setBigStarFlareSize(parseInt(e.target.value))}
            disabled={!bigStarShineEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
        </div>

        <div>
          <div className="flex justify-between text-[var(--text-muted)] mb-1">
            <span>Twinkle Respiration Speed</span>
            <span className="font-mono text-cyan-300">{bigStarShineSpeed.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="2.5"
            step="0.1"
            value={bigStarShineSpeed}
            onChange={(e) => setBigStarShineSpeed(parseFloat(e.target.value))}
            disabled={!bigStarShineEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
        </div>
      </div>

      {/* 4. Calm Mist Dispersion */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            Mist Calm Dispersion & Gaseous Loop
          </span>
          <button
            onClick={() => setMistDisperseEnabled(!mistDisperseEnabled)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              mistDisperseEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {mistDisperseEnabled ? 'DISPERSING' : 'STATIC'}
          </button>
        </div>

        <div>
          <div className="flex justify-between text-[var(--text-muted)] mb-1">
            <span>Overlapping Phased Instances (Lifecycle Recycle)</span>
            <span className="font-mono text-cyan-300">{mistInstances} instances</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setMistInstances(num)}
                disabled={!mistDisperseEnabled}
                className={`py-1 rounded text-center text-xs font-mono font-bold border transition-all ${
                  mistInstances === num
                    ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {num} Phase{num > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[var(--text-muted)] mb-1">
            <span>Dispersion & Dissipation Speed</span>
            <span className="font-mono text-cyan-300">{mistDisperseSpeed.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="2.5"
            step="0.1"
            value={mistDisperseSpeed}
            onChange={(e) => setMistDisperseSpeed(parseFloat(e.target.value))}
            disabled={!mistDisperseEnabled}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
          />
        </div>

        <div>
          <div className="flex justify-between text-[var(--text-muted)] mb-1">
            <span>Mist Gaseous Curl Distortion</span>
            <span className="font-mono text-cyan-300">{mistDistortionScale}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="24"
            step="1"
            value={mistDistortionScale}
            onChange={(e) => setMistDistortionScale(parseInt(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* 5. Cloud Slow Drift & Multi-Zone Billow Distortion */}
      <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            Cloud Slow Drift & Billow Distortion
          </span>
          <button
            onClick={() => {
              const next = !cloudDistortionEnabled;
              setCloudDistortionEnabled(next);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              cloudDistortionEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {cloudDistortionEnabled ? 'BILLOWING' : 'STATIC'}
          </button>
        </div>

        {/* Drift Controls */}
        <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[var(--text-secondary)] font-medium">Horizontal Wind Drift</div>
            <button
              onClick={() => setCloudDriftEnabled(!cloudDriftEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                cloudDriftEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {cloudDriftEnabled ? 'Active' : 'Off'}
            </button>
          </div>

          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>High-Altitude Drift Speed</span>
              <span className="font-mono text-cyan-300">{cloudDriftSpeed.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={cloudDriftSpeed}
              onChange={(e) => setCloudDriftSpeed(parseFloat(e.target.value))}
              disabled={!cloudDriftEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>

        {/* Multi-Zone Billow Distortion Controls */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[var(--text-secondary)] font-medium">Multi-Zone Vapor Pocket Billowing</div>
            <button
              onClick={() => setCloudDistortionEnabled(!cloudDistortionEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                cloudDistortionEnabled ? 'distorting' : 'Off'
              }`}
            >
              {cloudDistortionEnabled ? 'Distorting' : 'Off'}
            </button>
          </div>

          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Organic Billow Distortion Scale</span>
              <span className="font-mono text-cyan-300">{cloudDistortionScale}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              step="1"
              value={cloudDistortionScale}
              onChange={(e) => setCloudDistortionScale(parseInt(e.target.value))}
              disabled={!cloudDistortionEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
            <div className="text-[10px] text-[var(--text-muted)] mt-1">
              Seamless whole-raster anisotropic aspect breathing and vapor pocket respiration (zero grid lines, zero seams).
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[var(--text-muted)] text-xs mb-1">
              <span>Billow Morphing & Respiration Speed</span>
              <span className="font-mono text-cyan-300">{cloudMorphSpeed.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={cloudMorphSpeed}
              onChange={(e) => setCloudMorphSpeed(parseFloat(e.target.value))}
              disabled={!cloudDistortionEnabled}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsTab;
