import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { bgLayers } from '../../../data/bgLayersData';
import type { ReflectionBlendMode } from '../../../types/background';
import type { LayerState, PlaygroundPreset } from '../types';

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

export const useCanvasPlaygroundState = () => {
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
  const [reflectionOpacity, setReflectionOpacity] = useState<number>(0.4);
  const [reflectionBlendMode, setReflectionBlendMode] = useState<ReflectionBlendMode>('hard-light');
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
  // Dust Tail Properties
  const [cometFlameTailEnabled, setCometFlameTailEnabled] = useState<boolean>(true);
  const [cometFlameTailSpeed, setCometFlameTailSpeed] = useState<number>(0.2);
  const [cometTailTurbulence, setCometTailTurbulence] = useState<number>(0.2);
  const [cometTailFlickerIntensity, setCometTailFlickerIntensity] = useState<number>(1.1);
  const [cometTailFlickerSpeed, setCometTailFlickerSpeed] = useState<number>(0.2);
  const [cometTailSpreadFactor, setCometTailSpreadFactor] = useState<number>(2.2);
  const [cometTailFadePower, setCometTailFadePower] = useState<number>(0.50);
  // Core Streak Properties
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

  // Presets
  const applyPreset = (preset: PlaygroundPreset | 'serene' | 'interactive' | 'clean' | 'solo0') => {
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
      setReflectionOpacity(0.4);
      setReflectionBlendMode('hard-light');
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
      setReflectionOpacity(0.4);
      setReflectionBlendMode('hard-light');
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
      setReflectionOpacity(0.4);
      setReflectionBlendMode('hard-light');
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
      setReflectionOpacity(0.4);
      setReflectionBlendMode('hard-light');
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
      setReflectionOpacity(0.4);
      setReflectionBlendMode('hard-light');
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
    setReflectionOpacity(0.4);
    setReflectionBlendMode('hard-light');
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

  return {
    fps,
    frameTimeMs,
    parallaxIntensity,
    setParallaxIntensity,
    parallaxEnabled,
    setParallaxEnabled,
    reverseHorizontalParallax,
    setReverseHorizontalParallax,
    reflectionEnabled,
    setReflectionEnabled,
    reflectionOpacity,
    setReflectionOpacity,
    reflectionBlendMode,
    setReflectionBlendMode,
    waterDistortionEnabled,
    setWaterDistortionEnabled,
    waterReactiveMode,
    setWaterReactiveMode,
    waterRestingScale,
    setWaterRestingScale,
    waterDistortionScale,
    setWaterDistortionScale,
    waterDistortionSpeed,
    setWaterDistortionSpeed,
    waterPerspectivePower,
    setWaterPerspectivePower,
    waterBlur,
    setWaterBlur,
    waterBlurTransitionSpeed,
    setWaterBlurTransitionSpeed,
    waterFarBackBlur,
    setWaterFarBackBlur,
    waterWaveMode,
    setWaterWaveMode,
    waterBandCount,
    setWaterBandCount,
    waterBandOffset,
    setWaterBandOffset,
    liveWaterSpeed,
    liveWaterBlur,
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
    bigStarShineSpeed,
    setBigStarShineSpeed,
    bigStarFlareSize,
    setBigStarFlareSize,
    mistDisperseEnabled,
    setMistDisperseEnabled,
    mistDisperseSpeed,
    setMistDisperseSpeed,
    mistInstances,
    setMistInstances,
    mistDistortionEnabled,
    setMistDistortionEnabled,
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
    turmoilEnabled,
    setTurmoilEnabled,
    shootingStarEnabled,
    setShootingStarEnabled,
    cometEnabled,
    setCometEnabled,
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
    useCleanComposite,
    setUseCleanComposite,
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
    layerOverrides,
    setLayerOverrides,
    isSoloLayer0Active,
    applySoloLayer0,
    restoreAllLayers,
    toggleSoloLayer0,
    handleToggleLayer,
    handleOpacityChange,
    applyPreset,
    handleReset,
    handleFpsUpdate,
    handleWaterTelemetry,
  };
};

export default useCanvasPlaygroundState;
