import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { DynamicBackground } from '../components/background/DynamicBackground';
import { bgLayers } from '../data/bgLayersData';
import { ReflectionBlendMode, REFLECTION_BLEND_MODES } from '../types/background';
import {
  Sliders,
  Layers,
  Sparkles,
  Waves,
  Eye,
  EyeOff,
  RotateCcw,
  ArrowLeft,
  Maximize,
  Minimize,
  Compass,
  Info,
  ChevronDown,
  ChevronUp,
  Wind,
  Cloud,
  Layers2,
  Contrast,
} from 'lucide-react';

export const isOffRequested = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  return (
    /(?:^|[#/&?])off(?:[#/&?]|$)/.test(hash) ||
    /(?:^|[?&])off(?:[=&]|$)/.test(search) ||
    path.endsWith('/off') ||
    path.endsWith('/off/')
  );
};

interface LayerState {
  visible: boolean;
  opacity: number;
}

export const BgPlaygroundPage: React.FC = () => {
  const isInitialOff = typeof window !== 'undefined' && isOffRequested();

  // Parallax state
  const [parallaxIntensity, setParallaxIntensity] = useState<number>(0.5);
  const [parallaxEnabled, setParallaxEnabled] = useState<boolean>(true);
  const [reverseHorizontalParallax, setReverseHorizontalParallax] = useState<boolean>(true);

  // Water distortion & reflection state
  const [reflectionEnabled, setReflectionEnabled] = useState<boolean>(true);
  const [reflectionOpacity, setReflectionOpacity] = useState<number>(0.4);
  const [reflectionBlendMode, setReflectionBlendMode] = useState<ReflectionBlendMode>('hard-light');
  const [waterDistortionEnabled, setWaterDistortionEnabled] = useState<boolean>(true);
  const [waterReactiveMode, setWaterReactiveMode] = useState<boolean>(true);
  const [waterRestingScale, setWaterRestingScale] = useState<number>(0.0);
  const [waterDistortionScale, setWaterDistortionScale] = useState<number>(18);
  const [waterDistortionSpeed, setWaterDistortionSpeed] = useState<number>(1.0);
  const [waterBlur, setWaterBlur] = useState<number>(0.0);
  const [waterBlurTransitionSpeed, setWaterBlurTransitionSpeed] = useState<number>(1.8);
  const [waterFarBackBlur, setWaterFarBackBlur] = useState<number>(0.0);

  // Big star natural shine state
  const [bigStarShineEnabled, setBigStarShineEnabled] = useState<boolean>(!isInitialOff);
  const [bigStarShineIntensity, setBigStarShineIntensity] = useState<number>(1.0);
  const [bigStarShineSpeed, setBigStarShineSpeed] = useState<number>(0.4);
  const [bigStarFlareSize, setBigStarFlareSize] = useState<number>(28);

  // Mist calm dispersion state
  const [mistDisperseEnabled, setMistDisperseEnabled] = useState<boolean>(true);
  const [mistDisperseSpeed, setMistDisperseSpeed] = useState<number>(1.0);
  const [mistInstances, setMistInstances] = useState<number>(3);
  const [mistDistortionEnabled, setMistDistortionEnabled] = useState<boolean>(true);
  const [mistDistortionScale, setMistDistortionScale] = useState<number>(8);

  // Cloud slow movement & distortion state
  const [cloudDriftEnabled, setCloudDriftEnabled] = useState<boolean>(true);
  const [cloudDriftSpeed, setCloudDriftSpeed] = useState<number>(0.8);
  const [cloudDistortionEnabled, setCloudDistortionEnabled] = useState<boolean>(true);
  const [cloudDistortionScale, setCloudDistortionScale] = useState<number>(6);
  const [cloudMorphSpeed, setCloudMorphSpeed] = useState<number>(0.8);

  // Dynamic events state
  const [turmoilEnabled, setTurmoilEnabled] = useState<boolean>(false);
  const [shootingStarEnabled, setShootingStarEnabled] = useState<boolean>(false);
  const [useCleanComposite, setUseCleanComposite] = useState<boolean>(false);

  // Photoshop Vibrance & Levels Color Grading state
  const [colorGradingEnabled, setColorGradingEnabled] = useState<boolean>(!isInitialOff);
  const [vibrance, setVibrance] = useState<number>(10);
  const [saturation, setSaturation] = useState<number>(-5);
  const [inputBlack, setInputBlack] = useState<number>(19);
  const [gamma, setGamma] = useState<number>(0.85);
  const [inputWhite, setInputWhite] = useState<number>(255);
  const [outputBlack, setOutputBlack] = useState<number>(0);
  const [outputWhite, setOutputWhite] = useState<number>(255);

  // UI state
  const [hudMinimized, setHudMinimized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'layers' | 'info'>('controls');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Per-layer overrides
  const [layerOverrides, setLayerOverrides] = useState<Record<string, LayerState>>(() => {
    const off = typeof window !== 'undefined' && isOffRequested();
    const initial: Record<string, LayerState> = {};
    bgLayers.forEach((l) => {
      initial[l.id] = {
        visible: off ? l.id === 'layer-0.0' : l.defaultVisible,
        opacity: l.defaultOpacity,
      };
    });
    return initial;
  });

  // Check if Solo Layer 0 mode is active (layer-0.0 is visible, all other layers turned off)
  const isSoloLayer0Active = useMemo(() => {
    const l0 = layerOverrides['layer-0.0'];
    if (!l0 || !l0.visible) return false;
    return bgLayers.every((l) => {
      if (l.id === 'layer-0.0') return true;
      return layerOverrides[l.id]?.visible === false;
    });
  }, [layerOverrides]);

  // Turn off all layers except Layer 0.0
  const applySoloLayer0 = useCallback(() => {
    setUseCleanComposite(false);
    setBigStarShineEnabled(false);
    setTurmoilEnabled(false);
    setShootingStarEnabled(false);
    setColorGradingEnabled(false);
    setVibrance(0);
    setSaturation(0);
    setInputBlack(0);
    setGamma(1.0);
    setInputWhite(255);
    setOutputBlack(0);
    setOutputWhite(255);
    setLayerOverrides(() => {
      const updated: Record<string, LayerState> = {};
      bgLayers.forEach((l) => {
        updated[l.id] = {
          visible: l.id === 'layer-0.0',
          opacity: l.defaultOpacity,
        };
      });
      return updated;
    });
  }, []);

  // Restore all layers to default visibility
  const restoreAllLayers = useCallback(() => {
    setColorGradingEnabled(true);
    setBigStarShineEnabled(true);
    setShootingStarEnabled(false);
    setLayerOverrides(() => {
      const updated: Record<string, LayerState> = {};
      bgLayers.forEach((l) => {
        updated[l.id] = {
          visible: l.defaultVisible,
          opacity: l.defaultOpacity,
        };
      });
      return updated;
    });
  }, []);

  // Helper to remove 'off' parameter from URL without breaking SPA path
  const clearOffFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return;
    const cleanSearch = window.location.search
      .replace(/([?&])off(=[^&]*)?(&|$)/i, '$1')
      .replace(/[?&]$/, '');
    const isPathBg = window.location.pathname.replace(/^\/|\/$/g, '') === 'bg';
    if (isPathBg) {
      const newUrl = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : '');
      window.history.replaceState(null, '', newUrl);
    } else {
      window.location.hash = 'bg';
    }
  }, []);

  // Quick toggle between Solo Layer 0 and all layers
  const toggleSoloLayer0 = useCallback(() => {
    if (isSoloLayer0Active) {
      restoreAllLayers();
      clearOffFromUrl();
    } else {
      applySoloLayer0();
      if (typeof window !== 'undefined' && !isOffRequested()) {
        const isPathBg = window.location.pathname.replace(/^\/|\/$/g, '') === 'bg';
        if (isPathBg) {
          window.location.hash = 'off';
        } else {
          window.location.hash = 'bg#off';
        }
      }
    }
  }, [isSoloLayer0Active, applySoloLayer0, restoreAllLayers, clearOffFromUrl]);

  // Track off state to prevent extraneous layer resets on non-off hash events
  const wasOffRef = useRef(isInitialOff);

  // Listen for URL changes (e.g. user changes hash to #off or back)
  useEffect(() => {
    const handleUrlChange = () => {
      const offNow = isOffRequested();
      if (offNow !== wasOffRef.current) {
        wasOffRef.current = offNow;
        if (offNow) {
          applySoloLayer0();
        } else {
          restoreAllLayers();
        }
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [applySoloLayer0, restoreAllLayers]);

  // Layer toggle handler (required by verification tests)
  const handleToggleLayer = (layerId: string) => {
    setLayerOverrides((prev) => {
      const current = prev[layerId];
      return {
        ...prev,
        [layerId]: {
          ...current,
          visible: !current.visible,
        },
      };
    });
  };

  // Layer opacity handler
  const handleOpacityChange = (layerId: string, opacity: number) => {
    setLayerOverrides((prev) => {
      const current = prev[layerId];
      return {
        ...prev,
        [layerId]: {
          ...current,
          opacity,
        },
      };
    });
  };

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Presets
  const applyPreset = (
    preset: 'serene' | 'interactive' | 'cosmic' | 'storm' | 'minimal' | 'clean' | 'solo0'
  ) => {
    if (preset === 'clean') {
      setUseCleanComposite(true);
      return;
    }

    if (preset === 'solo0') {
      applySoloLayer0();
      if (typeof window !== 'undefined' && !isOffRequested()) {
        const isPathBg = window.location.pathname.replace(/^\/|\/$/g, '') === 'bg';
        if (isPathBg) {
          window.location.hash = 'off';
        } else {
          window.location.hash = 'bg#off';
        }
      }
      return;
    }

    if (typeof window !== 'undefined' && isOffRequested()) {
      clearOffFromUrl();
    }

    setUseCleanComposite(false);

    if (preset === 'serene') {
      setParallaxIntensity(0.5);
      setReverseHorizontalParallax(true);
      setTurmoilEnabled(false);
      setReflectionEnabled(true);
      setReflectionOpacity(0.4);
      setReflectionBlendMode('hard-light');
      setWaterDistortionEnabled(true);
      setWaterReactiveMode(true);
      setWaterRestingScale(0.0);
      setWaterDistortionScale(18);
      setWaterDistortionSpeed(1.0);
      setWaterBlur(0.0);
      setWaterBlurTransitionSpeed(1.8);
      setWaterFarBackBlur(0.0);
      setBigStarShineEnabled(true);
      setBigStarShineIntensity(1.0);
      setBigStarFlareSize(28);
      setMistDisperseEnabled(true);
      setMistDisperseSpeed(1.0);
      setMistInstances(3);
      setCloudDriftEnabled(true);
      setCloudDistortionEnabled(true);
      setCloudDistortionScale(6);
      setColorGradingEnabled(true);
      setVibrance(10);
      setSaturation(-5);
      setInputBlack(19);
      setGamma(0.85);
      setInputWhite(255);
      setOutputBlack(0);
      setOutputWhite(255);

      const updated: Record<string, LayerState> = {};
      bgLayers.forEach((l) => {
        updated[l.id] = { visible: l.defaultVisible, opacity: l.defaultOpacity };
      });
      setLayerOverrides(updated);
    } else if (preset === 'interactive') {
      setParallaxIntensity(1.2);
      setReverseHorizontalParallax(false);
      setTurmoilEnabled(false);
      setReflectionEnabled(true);
      setReflectionOpacity(0.4);
      setReflectionBlendMode('hard-light');
      setWaterReactiveMode(true);
      setWaterRestingScale(0.0); // Completely still like glass until mouse passes
      setWaterDistortionScale(24);
      setWaterDistortionSpeed(1.2);
      setWaterBlur(0.0);
      setWaterBlurTransitionSpeed(2.2);
      setWaterFarBackBlur(0.0);
      setBigStarShineEnabled(true);
      setMistDisperseEnabled(true);
      setCloudDriftEnabled(true);
      setColorGradingEnabled(true);
      setVibrance(10);
      setSaturation(5);
      setInputBlack(5);
      setGamma(1.05);
      setInputWhite(252);
      setOutputBlack(0);
      setOutputWhite(255);
    } else if (preset === 'cosmic') {
      setParallaxIntensity(1.8);
      setReverseHorizontalParallax(false);
      setTurmoilEnabled(false);
      setReflectionEnabled(true);
      setReflectionOpacity(0.4);
      setReflectionBlendMode('hard-light');
      setWaterDistortionEnabled(true);
      setWaterReactiveMode(false);
      setWaterDistortionScale(14);
      setWaterDistortionSpeed(0.8);
      setWaterBlur(0.0);
      setWaterBlurTransitionSpeed(1.5);
      setWaterFarBackBlur(0.0);
      setBigStarShineEnabled(true);
      setBigStarShineIntensity(1.6);
      setBigStarFlareSize(38);
      setShootingStarEnabled(false);
      setColorGradingEnabled(true);
      setVibrance(25);
      setSaturation(15);
      setInputBlack(12);
      setGamma(0.95);
      setInputWhite(248);
      setOutputBlack(0);
      setOutputWhite(255);
      setLayerOverrides((prev) => ({
        ...prev,
        'layer-2.1': { visible: true, opacity: 1.0 },
        'layer-2.2': { visible: true, opacity: 1.0 },
        'layer-3.0': { visible: true, opacity: 1.0 },
        'layer-4.0': { visible: true, opacity: 0.45 },
        'layer-4.2': { visible: true, opacity: 0.45 },
      }));
    } else if (preset === 'storm') {
      setParallaxIntensity(1.5);
      setReverseHorizontalParallax(false);
      setTurmoilEnabled(true);
      setReflectionEnabled(true);
      setReflectionOpacity(0.4);
      setReflectionBlendMode('hard-light');
      setWaterDistortionEnabled(true);
      setWaterReactiveMode(false);
      setWaterDistortionScale(30);
      setWaterDistortionSpeed(1.8);
      setWaterBlur(0.0);
      setWaterBlurTransitionSpeed(2.5);
      setWaterFarBackBlur(0.0);
      setCloudDriftEnabled(true);
      setCloudDistortionScale(14);
      setMistDisperseSpeed(1.6);
      setColorGradingEnabled(true);
      setVibrance(-15);
      setSaturation(-20);
      setInputBlack(15);
      setGamma(0.85);
      setInputWhite(245);
      setOutputBlack(5);
      setOutputWhite(240);
    } else if (preset === 'minimal') {
      setParallaxIntensity(0.7);
      setReverseHorizontalParallax(false);
      setTurmoilEnabled(false);
      setReflectionEnabled(true);
      setReflectionOpacity(0.4);
      setReflectionBlendMode('hard-light');
      setWaterReactiveMode(true);
      setWaterRestingScale(0);
      setWaterDistortionScale(8);
      setWaterBlur(0);
      setWaterBlurTransitionSpeed(1.8);
      setWaterFarBackBlur(0.0);
      setBigStarShineEnabled(false);
      setMistDisperseEnabled(false);
      setCloudDriftEnabled(false);
      setColorGradingEnabled(false);
      setVibrance(0);
      setSaturation(0);
      setInputBlack(0);
      setGamma(1.0);
      setInputWhite(255);
      setOutputBlack(0);
      setOutputWhite(255);
      setLayerOverrides((prev) => {
        const next = { ...prev };
        ['layer-4.0', 'layer-4.1', 'layer-4.2', 'layer-5.1', 'layer-5.2', 'layer-5.3'].forEach((id) => {
          if (next[id]) next[id] = { ...next[id], visible: false };
        });
        return next;
      });
    }
  };

  // Reset to default
  const handleReset = () => {
    setParallaxIntensity(0.5);
    setParallaxEnabled(true);
    setReverseHorizontalParallax(true);
    setReflectionEnabled(true);
    setReflectionOpacity(0.4);
    setReflectionBlendMode('hard-light');
    setWaterDistortionEnabled(true);
    setWaterReactiveMode(true);
    setWaterRestingScale(0.0);
    setWaterDistortionScale(18);
    setWaterDistortionSpeed(1.0);
    setWaterBlur(0.0);
    setWaterBlurTransitionSpeed(1.8);
    setWaterFarBackBlur(0.0);
    setBigStarShineEnabled(true);
    setBigStarShineIntensity(1.0);
    setBigStarShineSpeed(0.4);
    setBigStarFlareSize(28);
    setMistDisperseEnabled(true);
    setMistDisperseSpeed(1.0);
    setMistInstances(3);
    setMistDistortionEnabled(true);
    setMistDistortionScale(8);
    setCloudDriftEnabled(true);
    setCloudDriftSpeed(0.8);
    setCloudDistortionEnabled(true);
    setCloudDistortionScale(6);
    setCloudMorphSpeed(0.8);
    setTurmoilEnabled(false);
    setShootingStarEnabled(false);
    setColorGradingEnabled(true);
    setVibrance(10);
    setSaturation(-5);
    setInputBlack(19);
    setGamma(0.85);
    setInputWhite(255);
    setOutputBlack(0);
    setOutputWhite(255);
    setUseCleanComposite(false);
    const initial: Record<string, LayerState> = {};
    bgLayers.forEach((l) => {
      initial[l.id] = { visible: l.defaultVisible, opacity: l.defaultOpacity };
    });
    setLayerOverrides(initial);

    clearOffFromUrl();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#021319]">
      {/* 1. The Dynamic Background Engine */}
      <DynamicBackground
        interactive={parallaxEnabled}
        parallaxIntensity={parallaxIntensity}
        reverseHorizontalParallax={reverseHorizontalParallax}
        colorGradingEnabled={colorGradingEnabled}
        vibrance={vibrance}
        saturation={saturation}
        inputBlack={inputBlack}
        gamma={gamma}
        inputWhite={inputWhite}
        outputBlack={outputBlack}
        outputWhite={outputWhite}
        reflectionEnabled={reflectionEnabled}
        reflectionOpacity={reflectionOpacity}
        reflectionBlendMode={reflectionBlendMode}
        waterDistortionEnabled={waterDistortionEnabled}
        waterReactiveMode={waterReactiveMode}
        waterRestingScale={waterRestingScale}
        waterDistortionScale={waterDistortionScale}
        waterDistortionSpeed={waterDistortionSpeed}
        waterBlur={waterBlur}
        waterBlurTransitionSpeed={waterBlurTransitionSpeed}
        waterFarBackBlur={waterFarBackBlur}
        bigStarShineEnabled={bigStarShineEnabled}
        bigStarShineIntensity={bigStarShineIntensity}
        bigStarShineSpeed={bigStarShineSpeed}
        bigStarFlareSize={bigStarFlareSize}
        mistDisperseEnabled={mistDisperseEnabled}
        mistDisperseSpeed={mistDisperseSpeed}
        mistInstances={mistInstances}
        mistDistortionEnabled={mistDistortionEnabled}
        mistDistortionScale={mistDistortionScale}
        cloudDriftEnabled={cloudDriftEnabled}
        cloudDriftSpeed={cloudDriftSpeed}
        cloudDistortionEnabled={cloudDistortionEnabled}
        cloudDistortionScale={cloudDistortionScale}
        cloudMorphSpeed={cloudMorphSpeed}
        turmoilEnabled={turmoilEnabled}
        shootingStarEnabled={shootingStarEnabled}
        useCleanComposite={useCleanComposite}
        layerOverrides={layerOverrides}
      />

      {/* 2. Top Navigation Bar */}
      <header className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-3">
          <a
            href="./#home"
            onClick={() => {
              if (typeof window !== 'undefined' && window.location.pathname.replace(/^\/|\/$/g, '') === 'bg') {
                const base = window.location.pathname.replace(/\/bg\/?$/, '') || '/';
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
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-cyan-300">1920×1187 Canvas</span>
            <span className="text-[var(--text-muted)]">|</span>
            <span>Horizon: 61.08% (y=725)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch to Canvas (/bg-canvas) Engine Button */}
          <a
            href="./#bg-canvas"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border border-[var(--border-subtle)] bg-[var(--bg-card)]/80 text-[var(--text-secondary)] hover:text-emerald-300 hover:border-emerald-500/40 transition-all shadow-lg"
            title="Switch directly to the HTML5 Canvas version at /bg-canvas"
          >
            <Layers2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Switch to Canvas (/bg-canvas)</span>
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
            {useCleanComposite ? 'Viewing: Static Master' : 'Viewing: Dynamic Engine'}
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

      {/* 3. Floating Interactive HUD Deck */}
      {!hudMinimized && (
        <aside className="absolute bottom-4 right-4 w-[94vw] sm:w-[460px] max-h-[84vh] flex flex-col rounded-2xl bg-[var(--bg-paper)]/90 backdrop-blur-xl border border-[var(--border-subtle)] shadow-2xl z-30 pointer-events-auto overflow-hidden animate-fadeIn">
          {/* HUD Header & Tabs */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)]/70 px-4 py-3 bg-[var(--bg-card)]/50">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('controls')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'controls'
                    ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Controls</span>
              </button>

              <button
                onClick={() => setActiveTab('layers')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'layers'
                    ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layers ({bgLayers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'info'
                    ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Specs & Benchmark</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 transition-all"
              title="Reset all settings to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(84vh-60px)] space-y-4 text-xs">
            {/* TAB 1: CONTROLS */}
            {activeTab === 'controls' && (
              <div className="space-y-4">
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

                  {/* GPU SVG Filter info badge */}
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/40 text-[10px] text-[var(--text-muted)] space-y-1">
                    <div className="flex items-center justify-between text-cyan-300 font-mono text-[9px] uppercase">
                      <span>GPU SVG &lt;feColorMatrix&gt; + &lt;feComponentTransfer&gt;</span>
                      <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-1 rounded">60 FPS Locked</span>
                    </div>
                    <p className="leading-tight text-[10px]">
                      Zero CPU pixel iteration. 1D LUT tableValues calculated via Photoshop Levels formula: clamp((x - inB)/(inW - inB))^{`1/γ`} mapped to [outB, outW].
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

                {/* 2. Water Stillness & Reactive Wave Disturbance */}
                <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-cyan-400" />
                      Water Reflections & Wave Motion
                    </span>
                    <button
                      onClick={() => setReflectionEnabled(!reflectionEnabled)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        reflectionEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
                      }`}
                    >
                      {reflectionEnabled ? 'REFLECT ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Reactive vs Continuous mode toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="font-medium text-[var(--text-secondary)]">Stillness / Mouse Reactivity</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {waterReactiveMode ? 'Water is still, ripples when mouse passes' : 'Continuous animated wave loop'}
                      </div>
                    </div>
                    <button
                      onClick={() => setWaterReactiveMode(!waterReactiveMode)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        waterReactiveMode
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {waterReactiveMode ? 'Still (Reactive)' : 'Continuous'}
                    </button>
                  </div>

                  {waterReactiveMode ? (
                    <div>
                      <div className="flex justify-between text-[var(--text-muted)] mb-1">
                        <span>Resting Wave Scale (Still State)</span>
                        <span className="font-mono text-cyan-300">{waterRestingScale.toFixed(1)}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="6"
                        step="0.2"
                        value={waterRestingScale}
                        onChange={(e) => setWaterRestingScale(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                      />
                    </div>
                  ) : null}

                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-1">
                      <span>{waterReactiveMode ? 'Mouse Excitation Peak Scale' : 'Wave Ripple Scale'}</span>
                      <span className="font-mono text-cyan-300">{waterDistortionScale}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="36"
                      step="1"
                      value={waterDistortionScale}
                      onChange={(e) => setWaterDistortionScale(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-1">
                      <span>Water Ripple Frequency Speed</span>
                      <span className="font-mono text-cyan-300">{waterDistortionSpeed.toFixed(1)}×</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="2.5"
                      step="0.1"
                      value={waterDistortionSpeed}
                      onChange={(e) => setWaterDistortionSpeed(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-1">
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
                      className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-1">
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
                      className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-1">
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

                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-1">
                      <span>Water Surface Backdrop Blur</span>
                      <span className="font-mono text-cyan-300">{waterBlur.toFixed(1)}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4.0"
                      step="0.2"
                      value={waterBlur}
                      onChange={(e) => setWaterBlur(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. Big Star Natural Luminous Shine */}
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
                      <span className="font-mono text-cyan-300">{Math.round(bigStarShineIntensity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2.0"
                      step="0.05"
                      value={bigStarShineIntensity}
                      onChange={(e) => setBigStarShineIntensity(parseFloat(e.target.value))}
                      disabled={!bigStarShineEnabled}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-30"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-1">
                      <span>Diffraction Ray & Flare Size</span>
                      <span className="font-mono text-cyan-300">{bigStarFlareSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="48"
                      step="2"
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

                {/* 4. Calm Mist Dispersion & Destruction Loop */}
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

                {/* 5. Cloud Super-Slow Movement & Organic Morphing */}
                <div className="p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                      <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                      Cloud Slow Drift & Distortion
                    </span>
                    <button
                      onClick={() => setCloudDriftEnabled(!cloudDriftEnabled)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        cloudDriftEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
                      }`}
                    >
                      {cloudDriftEnabled ? 'DRIFT ON' : 'STATIC'}
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-1">
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

                  <div>
                    <div className="flex justify-between text-[var(--text-muted)] mb-1">
                      <span>Organic Morphing Distortion (SVG Turbulence)</span>
                      <span className="font-mono text-cyan-300">{cloudDistortionScale}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="16"
                      step="1"
                      value={cloudDistortionScale}
                      onChange={(e) => setCloudDistortionScale(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LAYER INSPECTOR */}
            {activeTab === 'layers' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50">
                  <div className="text-[11px] text-[var(--text-muted)] font-medium">
                    Quick Isolation:
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={applySoloLayer0}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                        isSoloLayer0Active
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border-[var(--border-subtle)]'
                      }`}
                      title="Turns off all layers except Layer 0.0"
                    >
                      Solo Layer 0 (#off)
                    </button>
                    <button
                      onClick={restoreAllLayers}
                      className="px-2 py-1 rounded-lg text-[10px] font-medium bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)] transition-all"
                      title="Restore all layers to default visibility"
                    >
                      Show All
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-[var(--text-muted)] flex justify-between px-1">
                  <span>Layer Depth & Mode</span>
                  <span>Visibility & Opacity</span>
                </div>

                {bgLayers.map((layer) => {
                  const state = layerOverrides[layer.id] || {
                    visible: layer.defaultVisible,
                    opacity: layer.defaultOpacity,
                  };

                  return (
                    <div
                      key={layer.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        state.visible
                          ? 'bg-[var(--bg-card)]/70 border-[var(--border-subtle)]'
                          : 'bg-black/20 border-slate-800/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleLayer(layer.id)}
                            className="text-[var(--text-muted)] hover:text-white transition-colors"
                          >
                            {state.visible ? (
                              <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                            )}
                          </button>
                          <div>
                            <div className="font-semibold text-[var(--text-primary)] leading-tight">
                              {layer.name}
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)]">
                              Depth {layer.depth.toFixed(1)} • {layer.category} • Parallax ({layer.parallaxFactor.x}, {layer.parallaxFactor.y})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                              layer.blendMode === 'normal'
                                ? 'bg-slate-700/40 text-slate-300'
                                : layer.blendMode === 'screen'
                                ? 'bg-blue-500/20 text-blue-300'
                                : layer.blendMode === 'color-dodge'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            {layer.blendMode}
                          </span>
                          {layer.hasReflection && (
                            <span className="px-1 py-0.5 rounded text-[8px] bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono">
                              REFL
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Opacity slider */}
                      <div className="flex items-center gap-2 mt-1 pt-1 border-t border-slate-800/40">
                        <span className="text-[10px] text-[var(--text-muted)] w-12">Opacity:</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={state.opacity}
                          onChange={(e) => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                          disabled={!state.visible}
                          className="flex-1 accent-cyan-400 h-1 bg-slate-700 rounded cursor-pointer disabled:opacity-30"
                        />
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] w-8 text-right">
                          {Math.round(state.opacity * 100)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: SPECS, ARCHITECTURE & TRIMMING BENCHMARK */}
            {activeTab === 'info' && (
              <div className="space-y-3.5 text-[var(--text-secondary)] leading-relaxed">
                {/* 1. Trimming Analysis */}
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-700/50 text-cyan-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-cyan-300">Empirical Trimming Benchmark</h4>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-900/60 text-cyan-300">
                      SAVINGS: 0.5% (20 KB)
                    </span>
                  </div>
                  <p className="text-[11px] leading-normal">
                    We tested cropping empty transparent pixels from all 19 Photoshop layer breakdown files versus retaining full-canvas registration:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-black/40 p-2 rounded-lg border border-cyan-900/40">
                    <div>Full Canvas WebP: <strong>3.76 MB</strong></div>
                    <div>Trimmed WebP: <strong>3.74 MB</strong></div>
                    <div>Byte Difference: <strong>0.02 MB</strong></div>
                    <div>Bandwidth Savings: <strong>0.5%</strong></div>
                  </div>
                  <p className="text-[11px] leading-normal text-cyan-300">
                    <strong>Recommendation: Keep full-canvas registration (1920×1187).</strong>
                  </p>
                  <p className="text-[11px] text-cyan-100/80">
                    WebP run-length and entropy coding compresses transparent alpha pixels to near zero bytes. Cropping provides negligible bandwidth savings while introducing severe layout penalties: custom bounding box offsets for every layer, fractional subpixel tearing during browser scaling, and completely breaking horizon-mirrored reflection geometry across dynamic viewport ratios.
                  </p>
                </div>

                {/* 2. Parallax Depth Rationale */}
                <div className="space-y-1">
                  <h5 className="font-semibold text-[var(--text-primary)]">
                    Depth Hierarchy & Physical Distance Rationale
                  </h5>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    The Photoshop layer index <code>X</code> reflects drawing stack order rather than distance. True parallax displacement is calibrated by cosmic distance:
                  </p>
                  <ul className="text-[10px] text-[var(--text-muted)] list-disc pl-4 space-y-0.5">
                    <li><strong>Space & Milky Way (0.0-2.3):</strong> 25,000 light-years → minimal displacement (0.006 - 0.016)</li>
                    <li><strong>Stars (3.0) & Meteors (7.x):</strong> Upper atmosphere & cosmos → anchored (0.022 - 0.025)</li>
                    <li><strong>Clouds (4.0-4.2):</strong> 10-15 km high → subtle depth drift (0.065 - 0.075)</li>
                    <li><strong>Horizon Mist (5.1-5.2):</strong> 1-3 km distance → moderate displacement (0.11 - 0.14)</li>
                    <li><strong>Disperse Mist (5.3):</strong> Foreground camera plane → dynamic 3D immersion (0.32)</li>
                  </ul>
                </div>

                {/* 3. Water Reflection Geometry */}
                <div className="space-y-1">
                  <h5 className="font-semibold text-[var(--text-primary)]">
                    Water Reflection Mirroring (Zero Duplicated Assets)
                  </h5>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    The sea horizon is bit-aligned at <strong>y = 725 px</strong> (61.08% from top). Reflected sky layers are mirrored via <code>scaleY(-1)</code> with <code>transformOrigin: 50% 61.08%</code> and clipped to the ocean plane via <code>clipPath: inset(61.08% 0 0 0)</code>. Parallax movement and animations in the sky naturally reflect in real-time.
                  </p>
                </div>

                {/* 4. Water Stillness & Disturbance */}
                <div className="space-y-1">
                  <h5 className="font-semibold text-[var(--text-primary)]">
                    Still Water & Mouse Wave Excitation
                  </h5>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Water remains still at rest. When the cursor passes over the ocean plane, cursor velocity excites wave displacement on the SVG <code>&lt;feDisplacementMap&gt;</code>, which then decays exponentially back to glassy stillness.
                  </p>
                </div>

                {/* 5. Gaseous Mist & Cloud Distortion */}
                <div className="space-y-1">
                  <h5 className="font-semibold text-[var(--text-primary)]">
                    Organic Dissipation & Cloud Morphing
                  </h5>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Foreground mist is generated through a 3-instance lifecycle loop with staggered phase delays, smoothly emerging, drifting, expanding, and dissolving. Clouds morph subtly via an ultra-low frequency SVG turbulence filter.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};

export default BgPlaygroundPage;
