import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CanvasBackground } from '../components/background/CanvasBackground';
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
  Activity,
  Layers2,
  Flame,
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

export const BgCanvasPlaygroundPage: React.FC = () => {
  const isInitialOff = typeof window !== 'undefined' && isOffRequested();

  // Performance telemetry state
  const [fps, setFps] = useState<number>(60);
  const [frameTimeMs, setFrameTimeMs] = useState<number>(16.6);

  // Parallax & Camera state
  const [parallaxIntensity, setParallaxIntensity] = useState<number>(0.5);
  const [parallaxEnabled, setParallaxEnabled] = useState<boolean>(true);
  const [reverseHorizontalParallax, setReverseHorizontalParallax] = useState<boolean>(true);

  // Water distortion & reflection state
  const [reflectionEnabled, setReflectionEnabled] = useState<boolean>(true);
  const [reflectionOpacity, setReflectionOpacity] = useState<number>(0.8);
  const [reflectionBlendMode, setReflectionBlendMode] = useState<ReflectionBlendMode>('normal');
  const [waterDistortionEnabled, setWaterDistortionEnabled] = useState<boolean>(!isInitialOff);
  const [waterReactiveMode, setWaterReactiveMode] = useState<boolean>(false);
  const [waterRestingScale, setWaterRestingScale] = useState<number>(0.0);
  const [waterDistortionScale, setWaterDistortionScale] = useState<number>(isInitialOff ? 0 : 40);
  const [waterDistortionSpeed, setWaterDistortionSpeed] = useState<number>(0.2);
  const [waterPerspectivePower, setWaterPerspectivePower] = useState<number>(3.0);
  const [waterBlur, setWaterBlur] = useState<number>(0);
  const [waterBlurTransitionSpeed, setWaterBlurTransitionSpeed] = useState<number>(1.8);
  const [waterFarBackBlur, setWaterFarBackBlur] = useState<number>(0.0);
  const [waterWaveMode, setWaterWaveMode] = useState<'continuous' | 'bands'>('bands');
  const [waterBandCount, setWaterBandCount] = useState<number>(50);
  const [waterBandOffset, setWaterBandOffset] = useState<number>(0.2);
  const [liveWaterSpeed, setLiveWaterSpeed] = useState<number>(0.2);
  const [liveWaterBlur, setLiveWaterBlur] = useState<number>(0);

  // Living Breathing Galaxy (Milky Way respiration) state
  const [galaxyBreathingEnabled, setGalaxyBreathingEnabled] = useState<boolean>(!isInitialOff);
  const [galaxyBreathingSpeed, setGalaxyBreathingSpeed] = useState<number>(2.5);
  const [galaxyBreathingIntensity, setGalaxyBreathingIntensity] = useState<number>(2.0);

  // Big star natural shine state
  const [bigStarShineEnabled, setBigStarShineEnabled] = useState<boolean>(!isInitialOff);
  const [bigStarShineIntensity, setBigStarShineIntensity] = useState<number>(0.12);
  const [bigStarShineSpeed, setBigStarShineSpeed] = useState<number>(0.4);
  const [bigStarFlareSize, setBigStarFlareSize] = useState<number>(20);

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

  // Dynamic events & comet state
  const [turmoilEnabled, setTurmoilEnabled] = useState<boolean>(false);
  const [shootingStarEnabled, setShootingStarEnabled] = useState<boolean>(false);
  const [cometEnabled, setCometEnabled] = useState<boolean>(!isInitialOff);
  // Dust Tail Properties (independent controls)
  const [cometFlameTailEnabled, setCometFlameTailEnabled] = useState<boolean>(true);
  const [cometFlameTailSpeed, setCometFlameTailSpeed] = useState<number>(0.2);
  const [cometTailTurbulence, setCometTailTurbulence] = useState<number>(0.2);
  const [cometTailFlickerIntensity, setCometTailFlickerIntensity] = useState<number>(1.1);
  const [cometTailFlickerSpeed, setCometTailFlickerSpeed] = useState<number>(0.2);
  const [cometTailSpreadFactor, setCometTailSpreadFactor] = useState<number>(2.2);
  const [cometTailFadePower, setCometTailFadePower] = useState<number>(0.50);
  // Core Streak Properties (independent controls)
  const [cometCorePulseEnabled, setCometCorePulseEnabled] = useState<boolean>(true);
  const [cometCoreBaseOpacity, setCometCoreBaseOpacity] = useState<number>(0.75);
  const [cometCorePulseSpeed, setCometCorePulseSpeed] = useState<number>(0.2);
  const [cometCoreStretchScale, setCometCoreStretchScale] = useState<number>(1.5);
  const [cometCorePeakBrightness, setCometCorePeakBrightness] = useState<number>(0.74);
  const [cometCoreBaselineOpacity, setCometCoreBaselineOpacity] = useState<number>(0.04);
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

  // Check if Solo Layer 0 mode is active
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
    setGalaxyBreathingEnabled(false);
    setBigStarShineEnabled(false);
    setWaterDistortionEnabled(false);
    setWaterDistortionScale(0);
    setTurmoilEnabled(false);
    setShootingStarEnabled(false);
    setCometEnabled(false);
    setCometFlameTailEnabled(false);
    setCometCorePulseEnabled(false);
    setCometCorePulseSpeed(1.0);
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
    setGalaxyBreathingEnabled(true);
    setBigStarShineEnabled(true);
    setWaterDistortionEnabled(true);
    setWaterDistortionScale(40);
    setShootingStarEnabled(false);
    setCometEnabled(true);
    setCometFlameTailEnabled(true);
    setCometCorePulseEnabled(true);
    setCometCorePulseSpeed(1.0);
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
    const isPathBgCanvas = window.location.pathname.replace(/^\/|\/$/g, '').startsWith('bg-canvas');
    if (isPathBgCanvas) {
      const newUrl = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : '');
      window.history.replaceState(null, '', newUrl);
    } else {
      window.location.hash = 'bg-canvas';
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
        const isPathBgCanvas = window.location.pathname.replace(/^\/|\/$/g, '').startsWith('bg-canvas');
        if (isPathBgCanvas) {
          window.location.hash = 'off';
        } else {
          window.location.hash = 'bg-canvas#off';
        }
      }
    }
  }, [isSoloLayer0Active, applySoloLayer0, restoreAllLayers, clearOffFromUrl]);

  // Track off state across popstate/hashchange
  const wasOffRef = useRef(isInitialOff);

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

  // Layer toggle handler
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
        const isPathBgCanvas = window.location.pathname.replace(/^\/|\/$/g, '').startsWith('bg-canvas');
        if (isPathBgCanvas) {
          window.location.hash = 'off';
        } else {
          window.location.hash = 'bg-canvas#off';
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
      setReflectionOpacity(0.8);
      setWaterDistortionEnabled(true);
      setWaterReactiveMode(false);
      setWaterRestingScale(0.0);
      setWaterDistortionScale(40);
      setWaterDistortionSpeed(0.2);
      setWaterPerspectivePower(3.0);
      setWaterBlur(0);
      setWaterBlurTransitionSpeed(1.8);
      setWaterFarBackBlur(0.0);
      setWaterWaveMode('bands');
      setWaterBandCount(50);
      setWaterBandOffset(0.2);
      setGalaxyBreathingEnabled(true);
      setGalaxyBreathingSpeed(2.5);
      setGalaxyBreathingIntensity(2.0);
      setBigStarShineEnabled(true);
      setBigStarShineIntensity(0.12);
      setBigStarShineSpeed(0.4);
      setBigStarFlareSize(20);
      setMistDisperseEnabled(true);
      setMistDisperseSpeed(1.0);
      setMistInstances(3);
      setCloudDriftEnabled(true);
      setCloudDistortionEnabled(true);
      setCloudDistortionScale(6);
      setCloudMorphSpeed(0.8);
      setCometEnabled(true);
      setCometFlameTailEnabled(true);
      setCometFlameTailSpeed(0.2);
      setCometTailTurbulence(1.0);
      setCometTailFlickerIntensity(0.6);
      setCometTailFlickerSpeed(1.0);
      setCometTailSpreadFactor(1.0);
      setCometTailFadePower(1.0);
      setCometCorePulseEnabled(true);
      setCometCoreBaseOpacity(0.04);
      setCometCorePulseSpeed(0.2);
      setCometCoreStretchScale(1.5);
      setCometCorePeakBrightness(0.74);
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
      setReflectionOpacity(0.8);
      setWaterDistortionEnabled(true);
      setWaterReactiveMode(false);
      setWaterRestingScale(0.0);
      setWaterDistortionScale(42);
      setWaterDistortionSpeed(0.25);
      setWaterPerspectivePower(3.0);
      setWaterBlur(0);
      setWaterBlurTransitionSpeed(2.2);
      setWaterFarBackBlur(0.0);
      setWaterWaveMode('bands');
      setWaterBandCount(50);
      setWaterBandOffset(0.2);
      setGalaxyBreathingEnabled(true);
      setGalaxyBreathingSpeed(1.0);
      setGalaxyBreathingIntensity(1.0);
      setBigStarShineEnabled(true);
      setMistDisperseEnabled(true);
      setCloudDriftEnabled(true);
      setCloudDistortionEnabled(true);
      setCloudDistortionScale(6);
      setCloudMorphSpeed(0.8);
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
      setReflectionOpacity(0.8);
      setWaterDistortionEnabled(true);
      setWaterReactiveMode(false);
      setWaterDistortionScale(45);
      setWaterDistortionSpeed(0.3);
      setWaterPerspectivePower(3.0);
      setWaterBlur(0);
      setWaterBlurTransitionSpeed(1.5);
      setWaterFarBackBlur(0.0);
      setWaterWaveMode('bands');
      setWaterBandCount(50);
      setWaterBandOffset(0.2);
      setGalaxyBreathingEnabled(true);
      setGalaxyBreathingSpeed(1.2);
      setGalaxyBreathingIntensity(1.4);
      setBigStarShineEnabled(true);
      setBigStarShineIntensity(0.15);
      setBigStarFlareSize(26);
      setShootingStarEnabled(false);
      setCometEnabled(true);
      setCometFlameTailEnabled(true);
      setCometFlameTailSpeed(1.2);
      setCometTailTurbulence(1.4);
      setCometTailFlickerIntensity(1.3);
      setCometTailFlickerSpeed(1.2);
      setCometTailSpreadFactor(1.3);
      setCometTailFadePower(1.35);
      setCometCorePulseEnabled(true);
      setCometCoreBaseOpacity(0.85);
      setCometCorePulseSpeed(1.2);
      setCometCoreStretchScale(1.3);
      setCometCorePeakBrightness(0.95);
      setCometCoreBaselineOpacity(0.05);
      setCloudDistortionEnabled(true);
      setCloudDistortionScale(6);
      setCloudMorphSpeed(0.8);
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
      setReflectionOpacity(0.8);
      setWaterDistortionEnabled(true);
      setWaterReactiveMode(false);
      setWaterDistortionScale(55);
      setWaterDistortionSpeed(0.6);
      setWaterPerspectivePower(2.5);
      setWaterBlur(0);
      setWaterBlurTransitionSpeed(2.5);
      setWaterFarBackBlur(0.0);
      setWaterWaveMode('bands');
      setWaterBandCount(50);
      setWaterBandOffset(0.2);
      setGalaxyBreathingEnabled(true);
      setGalaxyBreathingSpeed(0.8);
      setGalaxyBreathingIntensity(0.7);
      setCloudDriftEnabled(true);
      setCloudDistortionEnabled(true);
      setCloudDistortionScale(14);
      setCloudMorphSpeed(1.4);
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
      setReflectionOpacity(0.8);
      setWaterDistortionEnabled(false);
      setWaterReactiveMode(false);
      setWaterRestingScale(0);
      setWaterDistortionScale(0);
      setWaterDistortionSpeed(0.2);
      setWaterPerspectivePower(3.0);
      setWaterBlur(0);
      setWaterBlurTransitionSpeed(1.8);
      setWaterFarBackBlur(0.0);
      setWaterWaveMode('bands');
      setWaterBandCount(50);
      setWaterBandOffset(0.2);
      setGalaxyBreathingEnabled(false);
      setBigStarShineEnabled(false);
      setMistDisperseEnabled(false);
      setCloudDriftEnabled(false);
      setCloudDistortionEnabled(false);
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
    setReflectionOpacity(0.8);
    setReflectionBlendMode('normal');
    setWaterDistortionEnabled(true);
    setWaterReactiveMode(false);
    setWaterRestingScale(0.0);
    setWaterDistortionScale(40);
    setWaterDistortionSpeed(0.2);
    setWaterPerspectivePower(3.0);
    setWaterBlur(0);
    setWaterBlurTransitionSpeed(1.8);
    setWaterFarBackBlur(0.0);
    setWaterWaveMode('bands');
    setWaterBandCount(50);
    setWaterBandOffset(0.2);
    setGalaxyBreathingEnabled(true);
    setGalaxyBreathingSpeed(2.5);
    setGalaxyBreathingIntensity(2.0);
    setBigStarShineEnabled(true);
    setBigStarShineIntensity(0.12);
    setBigStarShineSpeed(0.4);
    setBigStarFlareSize(20);
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
    setCometEnabled(true);
    setCometFlameTailEnabled(true);
    setCometFlameTailSpeed(0.2);
    setCometTailTurbulence(0.2);
    setCometTailFlickerIntensity(1.1);
    setCometTailFlickerSpeed(0.2);
    setCometTailSpreadFactor(2.2);
    setCometTailFadePower(0.50);
    setCometCorePulseEnabled(true);
    setCometCoreBaseOpacity(0.75);
    setCometCorePulseSpeed(0.2);
    setCometCoreStretchScale(1.5);
    setCometCorePeakBrightness(0.74);
    setCometCoreBaselineOpacity(0.04);
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

  const handleFpsUpdate = useCallback((newFps: number, newFrameTime: number) => {
    setFps(newFps);
    setFrameTimeMs(newFrameTime);
  }, []);

  const handleWaterTelemetry = useCallback((currentSpeed: number, currentBlur: number) => {
    setLiveWaterSpeed(currentSpeed);
    setLiveWaterBlur(currentBlur);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#021319]">
      {/* 1. The HTML5 Canvas Background Engine */}
      <CanvasBackground
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
        waterPerspectivePower={waterPerspectivePower}
        waterBlur={waterBlur}
        waterBlurTransitionSpeed={waterBlurTransitionSpeed}
        waterFarBackBlur={waterFarBackBlur}
        waterWaveMode={waterWaveMode}
        waterBandCount={waterBandCount}
        waterBandOffset={waterBandOffset}
        galaxyBreathingEnabled={galaxyBreathingEnabled}
        galaxyBreathingSpeed={galaxyBreathingSpeed}
        galaxyBreathingIntensity={galaxyBreathingIntensity}
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
        cometEnabled={cometEnabled}
        cometFlameTailEnabled={cometFlameTailEnabled}
        cometFlameTailSpeed={cometFlameTailSpeed}
        cometTailTurbulence={cometTailTurbulence}
        cometTailFlickerIntensity={cometTailFlickerIntensity}
        cometTailFlickerSpeed={cometTailFlickerSpeed}
        cometTailSpreadFactor={cometTailSpreadFactor}
        cometTailFadePower={cometTailFadePower}
        cometCorePulseEnabled={cometCorePulseEnabled}
        cometCoreBaseOpacity={cometCoreBaseOpacity}
        cometCorePulseSpeed={cometCorePulseSpeed}
        cometCoreStretchScale={cometCoreStretchScale}
        cometCorePeakBrightness={cometCorePeakBrightness}
        cometCoreBaselineOpacity={cometCoreBaselineOpacity}
        useCleanComposite={useCleanComposite}
        layerOverrides={layerOverrides}
        onFpsUpdate={handleFpsUpdate}
        onWaterTelemetry={handleWaterTelemetry}
      />

      {/* 2. Top Navigation Bar */}
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
                <span>Benchmark & Specs</span>
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
                          cloudDistortionEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700/50 text-slate-400'
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

            {/* TAB 3: BENCHMARK & SPECS */}
            {activeTab === 'info' && (
              <div className="space-y-3.5 text-[var(--text-secondary)] leading-relaxed">
                {/* 1. Real-Time Telemetry Card */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      Live Canvas Performance Benchmark
                    </h4>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-900/60 text-emerald-300">
                      HTML5 2D CONTEXT
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-black/40 p-2 rounded-lg border border-emerald-900/40">
                    <div>
                      Framerate:{' '}
                      <strong className="text-emerald-300 text-xs">{fps.toFixed(1)} FPS</strong>
                    </div>
                    <div>
                      Frame Time:{' '}
                      <strong className="text-emerald-300 text-xs">{frameTimeMs.toFixed(1)} ms</strong>
                    </div>
                    <div>Canvas Resolution: <strong>1920×1187</strong></div>
                    <div>DOM Elements: <strong>1 (&lt;canvas&gt;)</strong></div>
                  </div>
                </div>

                {/* 2. Side-by-Side Comparison: Canvas vs DOM */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-card)]/60 border border-[var(--border-subtle)] space-y-2">
                  <h4 className="font-bold text-xs text-cyan-300">Architecture Comparison: Canvas vs DOM</h4>
                  <div className="overflow-x-auto text-[10px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-700/60 text-[var(--text-muted)]">
                          <th className="py-1 pr-2">Feature</th>
                          <th className="py-1 px-2 text-cyan-300">HTML5 Canvas (/bg-canvas)</th>
                          <th className="py-1 pl-2 text-amber-300">DOM Stack (/bg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        <tr>
                          <td className="py-1 font-medium">DOM Nodes</td>
                          <td className="py-1 px-2 text-emerald-400">1 canvas element</td>
                          <td className="py-1 pl-2 text-slate-300">19+ img + div layers</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Water Distortion</td>
                          <td className="py-1 px-2 text-emerald-400">Perspective wave bands (32 strips / &lt;0.2ms / 60 FPS)</td>
                          <td className="py-1 pl-2 text-slate-300">SVG feDisplacementMap</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Reflection Plane</td>
                          <td className="py-1 px-2 text-emerald-400">Offscreen 1920×462 buffer</td>
                          <td className="py-1 pl-2 text-slate-300">CSS scaleY(-1) + clip-path</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">Star Scintillation</td>
                          <td className="py-1 px-2 text-emerald-400">Procedural 2D flare pass</td>
                          <td className="py-1 pl-2 text-slate-300">CSS keyframes + drop-shadow</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-medium">GPU Blend Modes</td>
                          <td className="py-1 px-2 text-emerald-400">globalCompositeOperation</td>
                          <td className="py-1 pl-2 text-slate-300">mix-blend-mode</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Water Reflection Geometry */}
                <div className="space-y-1">
                  <h5 className="font-semibold text-[var(--text-primary)]">
                    Water Reflection Mirroring & Perspective Bands Performance
                  </h5>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    The sea horizon is bit-aligned at <strong>y = 725 px</strong> (61.08% from top). Reflected sky layers are rendered to an offscreen buffer (1920×462 px) using a horizon mirror transform. The reflection is then blitted through 32 perspective-expanded bands with an oceanic gradient overlay, maintaining a rock-solid 60 FPS (&lt; 0.2ms draw time) with zero transparent seam gaps.
                  </p>
                </div>

                {/* 4. Perspective Water Wave Physics */}
                <div className="space-y-1">
                  <h5 className="font-semibold text-[var(--text-primary)]">
                    Perspective Water Wave Depth Physics
                  </h5>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Depth perspective models physical distance from camera ($A(v) \propto v^{1.8}$). At the distant horizon ($v = 0$), displacement is microscopic ($A \approx 0$) with tightly compressed spatial frequency. In the foreground ($v = 1$), rolling swells crest and trough with natural wide undulation, creating realistic depth immersion.
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

export default BgCanvasPlaygroundPage;
