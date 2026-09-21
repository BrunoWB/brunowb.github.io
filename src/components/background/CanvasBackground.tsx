import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import {
  bgLayers,
  BG_CANVAS_WIDTH,
  BG_CANVAS_HEIGHT,
} from '../../data/bgLayersData';
import type { ReflectionBlendMode, ScrimMode } from '../../types/background';
import { computeCssColorGradingFilter } from '../../utils/colorGrading';
import { useCanvasEngine } from './canvas/hooks/useCanvasEngine';
import { ResolvedCanvasParams } from './canvas/types';

export interface CanvasBackgroundProps {
  interactive?: boolean;
  parallaxIntensity?: number;
  reverseHorizontalParallax?: boolean;
  // Photoshop Vibrance & Levels Color Grading
  colorGradingEnabled?: boolean;
  vibrance?: number;
  saturation?: number;
  inputBlack?: number;
  gamma?: number;
  inputWhite?: number;
  outputBlack?: number;
  outputWhite?: number;
  reflectionEnabled?: boolean;
  reflectionOpacity?: number;
  reflectionBlendMode?: ReflectionBlendMode;
  waterDistortionEnabled?: boolean;
  waterReactiveMode?: boolean;
  waterRestingScale?: number;
  waterDistortionScale?: number;
  waterDistortionSpeed?: number;
  waterPerspectivePower?: number;
  waterBlur?: number;
  waterBlurTransitionSpeed?: number;
  waterFarBackBlur?: number;
  waterWaveMode?: 'continuous' | 'bands';
  waterBandCount?: number;
  waterBandOffset?: number;
  blurTransitionSpeed?: number;
  farBackBlurPeak?: number;
  galaxyBreathingEnabled?: boolean;
  galaxyBreathingSpeed?: number;
  galaxyBreathingIntensity?: number;
  bigStarShineEnabled?: boolean;
  bigStarShineIntensity?: number;
  bigStarShineSpeed?: number;
  bigStarFlareSize?: number;
  mistDisperseEnabled?: boolean;
  mistDisperseSpeed?: number;
  mistInstances?: number;
  mistDistortionEnabled?: boolean;
  mistDistortionScale?: number;
  cloudDriftEnabled?: boolean;
  cloudDriftSpeed?: number;
  cloudDistortionEnabled?: boolean;
  cloudDistortionScale?: number;
  cloudMorphSpeed?: number;
  turmoilEnabled?: boolean;
  shootingStarEnabled?: boolean;
  cometEnabled?: boolean;
  // Comet Dust Tail Properties
  cometFlameTailEnabled?: boolean;
  cometFlameTailSpeed?: number;
  cometTailTurbulence?: number;
  cometTailWaveAmplitude?: number;
  cometTailFlickerIntensity?: number;
  cometTailFlickerSpeed?: number;
  cometTailSpreadFactor?: number;
  cometTailFadePower?: number;
  cometFlameTailIntensity?: number;

  // Comet Core Streak Properties
  cometCorePulseEnabled?: boolean;
  cometCoreBaseOpacity?: number;
  cometCorePulseSpeed?: number;
  cometCoreStretchScale?: number;
  cometCoreStretchLength?: number;
  cometCorePeakBrightness?: number;
  cometCorePulsePeakBrightness?: number;
  cometCoreBaselineOpacity?: number;
  cometCorePulseScale?: number;

  // Backward compatibility aliases
  cometTailWaveEnabled?: boolean;
  cometTailWaveSpeed?: number;
  cometTailWaveIntensity?: number;
  cometCoreDiffusionEnabled?: boolean;
  cometCoreDiffusionScale?: number;

  useCleanComposite?: boolean;
  enablePerformanceFallback?: boolean;
  fallbackFpsThreshold?: number;
  fallbackDurationMs?: number;
  onPerformanceFallback?: () => void;
  darkScrimEnabled?: boolean;
  scrimMode?: ScrimMode;
  darkScrimOpacity?: number;
  lightScrimOpacity?: number;
  darkCenterGlowOpacity?: number;
  darkMidHazeOpacity?: number;
  darkEdgeVignetteOpacity?: number;
  lightTopSkyOpacity?: number;
  lightMidAtmosphericOpacity?: number;
  lightBottomHorizonOpacity?: number;
  layerOverrides?: Record<string, { visible?: boolean; opacity?: number }>;
  className?: string;
  canvasOffsetY?: number;
  isPaused?: boolean;
  onShootingStarTrigger?: () => void;
  onCometTrigger?: () => void;
  onFpsUpdate?: (fps: number, frameTimeMs: number) => void;
  onWaterTelemetry?: (speed: number, blur: number) => void;
}

export const CanvasBackground: React.FC<CanvasBackgroundProps> = ({
  interactive = true,
  reverseHorizontalParallax = true,
  colorGradingEnabled = true,
  vibrance = 37,
  saturation = -5,
  inputBlack = 19,
  gamma = 0.85,
  inputWhite = 255,
  outputBlack = 0,
  outputWhite = 255,
  reflectionEnabled = true,
  reflectionOpacity = 0.4,
  reflectionBlendMode = 'hard-light',
  waterDistortionEnabled = true,
  waterReactiveMode = false,
  waterRestingScale = 0.0,
  waterDistortionScale = 40,
  waterDistortionSpeed = 0.2,
  waterPerspectivePower = 3.0,
  waterBlur = 0,
  waterBlurTransitionSpeed = 1.8,
  waterFarBackBlur = 0.0,
  waterWaveMode = 'bands',
  waterBandCount = 32,
  waterBandOffset = 0.2,
  blurTransitionSpeed,
  farBackBlurPeak,
  galaxyBreathingEnabled = true,
  galaxyBreathingSpeed = 2.5,
  galaxyBreathingIntensity = 2.0,
  bigStarShineEnabled = true,
  bigStarShineIntensity = 0.12,
  bigStarShineSpeed = 0.4,
  bigStarFlareSize = 20,
  mistDisperseEnabled = true,
  mistDisperseSpeed = 1.0,
  mistInstances = 3,
  mistDistortionEnabled = true,
  mistDistortionScale = 8,
  cloudDriftEnabled = true,
  cloudDriftSpeed = 0.8,
  cloudDistortionEnabled = true,
  cloudDistortionScale = 6,
  cloudMorphSpeed = 0.8,
  turmoilEnabled = false,
  shootingStarEnabled = false,
  cometEnabled = true,
  cometFlameTailEnabled = true,
  cometFlameTailSpeed = 0.2,
  cometFlameTailIntensity,
  cometTailTurbulence = 0.2,
  cometTailWaveAmplitude,
  cometTailFlickerIntensity = 1.1,
  cometTailFlickerSpeed = 0.2,
  cometTailSpreadFactor = 2.2,
  cometTailFadePower = 0.50,
  cometCorePulseEnabled = true,
  cometCoreBaseOpacity = 0.75,
  cometCorePulseSpeed = 0.2,
  cometCoreStretchScale = 1.5,
  cometCoreStretchLength,
  cometCorePeakBrightness = 0.74,
  cometCorePulsePeakBrightness,
  cometCoreBaselineOpacity = 0.04,
  cometCorePulseScale,
  cometTailWaveEnabled,
  cometTailWaveSpeed,
  cometTailWaveIntensity,
  cometCoreDiffusionEnabled,
  cometCoreDiffusionScale,
  useCleanComposite = false,
  enablePerformanceFallback = true,
  fallbackFpsThreshold = 25,
  fallbackDurationMs = 3500,
  onPerformanceFallback,
  darkScrimEnabled = true,
  scrimMode,
  darkScrimOpacity,
  lightScrimOpacity,
  darkCenterGlowOpacity = 0.38,
  darkMidHazeOpacity = 0.49,
  darkEdgeVignetteOpacity = 0.83,
  lightTopSkyOpacity = 0.86,
  lightMidAtmosphericOpacity = 0.44,
  lightBottomHorizonOpacity = 0.19,
  layerOverrides = {},
  className = '',
  canvasOffsetY = 0,
  isPaused = false,
  onShootingStarTrigger,
  onCometTrigger,
  onFpsUpdate,
  onWaterTelemetry,
}) => {
  const [isFallbackActive, setIsFallbackActive] = useState<boolean>(false);
  const lowFpsStartRef = useRef<number | null>(null);
  const mountTimeRef = useRef<number>(0);

  useEffect(() => {
    mountTimeRef.current = performance.now();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lowFpsStartRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleFpsUpdate = useCallback(
    (fps: number, frameTimeMs: number) => {
      onFpsUpdate?.(fps, frameTimeMs);

      if (!enablePerformanceFallback || isFallbackActive || useCleanComposite) {
        return;
      }

      // Ignore when tab is hidden
      if (typeof document !== 'undefined' && document.hidden) {
        lowFpsStartRef.current = null;
        return;
      }

      // Initial grace period (1.5s) to allow mounting and image decodes to settle
      const now = performance.now();
      if (now - mountTimeRef.current < 1500) {
        return;
      }

      if (fps < fallbackFpsThreshold) {
        if (lowFpsStartRef.current === null) {
          lowFpsStartRef.current = now;
        } else if (now - lowFpsStartRef.current >= fallbackDurationMs) {
          console.warn(
            `[CanvasBackground] Low framerate detected (${fps.toFixed(1)} FPS < ${fallbackFpsThreshold} FPS for > ${(fallbackDurationMs / 1000).toFixed(1)}s). Gracefully switching to static master composite.`
          );
          setIsFallbackActive(true);
          onPerformanceFallback?.();
        }
      } else {
        lowFpsStartRef.current = null;
      }
    },
    [
      enablePerformanceFallback,
      isFallbackActive,
      useCleanComposite,
      fallbackFpsThreshold,
      fallbackDurationMs,
      onFpsUpdate,
      onPerformanceFallback,
    ]
  );

  const effectiveUseCleanComposite = useCleanComposite || isFallbackActive;

  const effectiveDarkOpacity =
    scrimMode === 'none'
      ? 0
      : scrimMode === 'light'
      ? 0
      : darkScrimOpacity !== undefined
      ? darkScrimOpacity
      : 'var(--bg-dark-tint-opacity, 0.60)';

  const effectiveLightOpacity =
    scrimMode === 'none'
      ? 0
      : scrimMode === 'dark'
      ? 0
      : lightScrimOpacity !== undefined
      ? lightScrimOpacity
      : 'var(--bg-light-tint-opacity, 0.40)';

  // GPU-Composited Hardware Color Grading Filter
  const colorGradingFilter = useMemo(
    () =>
      computeCssColorGradingFilter({
        colorGradingEnabled,
        useCleanComposite: effectiveUseCleanComposite,
        vibrance,
        saturation,
        inputBlack,
        gamma,
        inputWhite,
        outputBlack,
        outputWhite,
      }),
    [
      colorGradingEnabled,
      effectiveUseCleanComposite,
      vibrance,
      saturation,
      inputBlack,
      gamma,
      inputWhite,
      outputBlack,
      outputWhite,
    ]
  );

  // Resolved comet configuration

  const cometConfig = useMemo(() => {
    const flameTailEnabled = cometFlameTailEnabled ?? cometTailWaveEnabled ?? true;
    const flameTailSpeed = cometFlameTailSpeed ?? cometTailWaveSpeed ?? 0.2;
    const tailTurb =
      cometTailTurbulence ?? cometTailWaveAmplitude ?? cometFlameTailIntensity ?? cometTailWaveIntensity ?? 0.2;
    const tailFlicker = cometTailFlickerIntensity ?? cometFlameTailIntensity ?? cometTailWaveIntensity ?? 1.1;
    const corePulse = cometCorePulseEnabled ?? cometCoreDiffusionEnabled ?? true;
    const coreSpeed = cometCorePulseSpeed ?? cometTailWaveSpeed ?? 0.2;
    const coreStretch =
      cometCoreStretchScale ??
      cometCoreStretchLength ??
      cometCorePulseScale ??
      cometCoreDiffusionScale ??
      1.5;
    const coreBright =
      cometCorePeakBrightness ??
      cometCorePulsePeakBrightness ??
      (cometCorePulseScale != null ? Math.min(1.0, 0.74 * cometCorePulseScale) : 0.74);

    return {
      flameTailEnabled,
      flameTailSpeed,
      tailTurbulence: tailTurb,
      tailFlickerIntensity: tailFlicker,
      tailFlickerSpeed: cometTailFlickerSpeed ?? 0.2,
      tailSpreadFactor: cometTailSpreadFactor ?? 2.2,
      tailFadePower: cometTailFadePower ?? 0.50,
      corePulseEnabled: corePulse,
      coreBaseOpacity: cometCoreBaseOpacity ?? 0.75,
      corePulseSpeed: coreSpeed,
      coreStretchScale: coreStretch,
      corePeakBrightness: coreBright,
      coreBaselineOpacity: cometCoreBaselineOpacity ?? 0.04,
    };
  }, [
    cometFlameTailEnabled,
    cometTailWaveEnabled,
    cometFlameTailSpeed,
    cometTailWaveSpeed,
    cometTailTurbulence,
    cometTailWaveAmplitude,
    cometFlameTailIntensity,
    cometTailWaveIntensity,
    cometTailFlickerIntensity,
    cometTailFlickerSpeed,
    cometTailSpreadFactor,
    cometTailFadePower,
    cometCorePulseEnabled,
    cometCoreDiffusionEnabled,
    cometCorePulseSpeed,
    cometCoreStretchScale,
    cometCoreStretchLength,
    cometCorePulseScale,
    cometCoreDiffusionScale,
    cometCorePeakBrightness,
    cometCorePulsePeakBrightness,
    cometCoreBaseOpacity,
    cometCoreBaselineOpacity,
  ]);

  // Resolved layers configuration
  const resolvedLayers = useMemo(() => {
    return bgLayers.map((layer) => {
      const override = layerOverrides[layer.id];
      let visible: boolean;
      if (override?.visible !== undefined) {
        visible = override.visible;
      } else if (layer.id === 'layer-4.1') {
        visible = turmoilEnabled;
      } else if (layer.category === 'celestial') {
        visible = cometEnabled && layer.defaultVisible;
      } else {
        visible = layer.defaultVisible;
      }
      const opacity = override?.opacity !== undefined ? override.opacity : layer.defaultOpacity;
      return {
        ...layer,
        visible,
        opacity,
      };
    });
  }, [layerOverrides, turmoilEnabled, cometEnabled]);

  const baseLayers = useMemo(
    () => resolvedLayers.filter((l) => l.depth <= 1.0 && l.visible),
    [resolvedLayers]
  );
  const upperLayers = useMemo(
    () => resolvedLayers.filter((l) => l.depth > 1.0 && l.visible),
    [resolvedLayers]
  );
  const reflectedLayers = useMemo(
    () => resolvedLayers.filter((l) => l.hasReflection && l.visible),
    [resolvedLayers]
  );
  const bigStarLayer = useMemo(
    () => resolvedLayers.find((l) => l.id === 'layer-3.0'),
    [resolvedLayers]
  );

  const resolvedParams: ResolvedCanvasParams = useMemo(
    () => ({
      baseLayers,
      upperLayers,
      reflectedLayers,
      bigStarLayer,
      resolvedLayers,
      interactive,
      reverseHorizontalParallax,
      useCleanComposite: effectiveUseCleanComposite,
      comet: cometConfig,
      galaxy: {
        breathingEnabled: galaxyBreathingEnabled,
        breathingSpeed: galaxyBreathingSpeed,
        breathingIntensity: galaxyBreathingIntensity,
      },
      cloud: {
        driftEnabled: cloudDriftEnabled,
        driftSpeed: cloudDriftSpeed,
        distortionEnabled: cloudDistortionEnabled,
        distortionScale: cloudDistortionScale,
        morphSpeed: cloudMorphSpeed,
      },
      mist: {
        disperseEnabled: mistDisperseEnabled,
        disperseSpeed: mistDisperseSpeed,
        instances: mistInstances,
        distortionEnabled: mistDistortionEnabled,
        distortionScale: mistDistortionScale,
      },
      star: {
        bigStarShineEnabled,
        bigStarShineIntensity,
        bigStarShineSpeed,
        bigStarFlareSize,
        shootingStarEnabled,
      },
      water: {
        reflectionEnabled,
        reflectionOpacity,
        reflectionBlendMode,
        distortionEnabled: waterDistortionEnabled,
        reactiveMode: waterReactiveMode,
        restingScale: waterRestingScale,
        distortionScale: waterDistortionScale,
        distortionSpeed: waterDistortionSpeed,
        perspectivePower: waterPerspectivePower,
        blur: waterBlur,
        blurTransitionSpeed: blurTransitionSpeed ?? waterBlurTransitionSpeed ?? 1.8,
        farBackBlur: farBackBlurPeak ?? waterFarBackBlur ?? 0.0,
        waveMode: waterWaveMode,
        bandCount: waterBandCount,
        bandOffset: waterBandOffset,
      },
      colorGrading: {
        colorGradingEnabled,
        vibrance,
        saturation,
        inputBlack,
        gamma,
        inputWhite,
        outputBlack,
        outputWhite,
      },
      isPaused,
      onFpsUpdate: handleFpsUpdate,
      onWaterTelemetry,
    }),
    [
      baseLayers,
      upperLayers,
      reflectedLayers,
      bigStarLayer,
      resolvedLayers,
      interactive,
      reverseHorizontalParallax,
      effectiveUseCleanComposite,
      cometConfig,
      galaxyBreathingEnabled,
      galaxyBreathingSpeed,
      galaxyBreathingIntensity,
      cloudDriftEnabled,
      cloudDriftSpeed,
      cloudDistortionEnabled,
      cloudDistortionScale,
      cloudMorphSpeed,
      mistDisperseEnabled,
      mistDisperseSpeed,
      mistInstances,
      mistDistortionEnabled,
      mistDistortionScale,
      bigStarShineEnabled,
      bigStarShineIntensity,
      bigStarShineSpeed,
      bigStarFlareSize,
      shootingStarEnabled,
      reflectionEnabled,
      reflectionOpacity,
      reflectionBlendMode,
      waterDistortionEnabled,
      waterReactiveMode,
      waterRestingScale,
      waterDistortionScale,
      waterDistortionSpeed,
      waterPerspectivePower,
      waterBlur,
      blurTransitionSpeed,
      waterBlurTransitionSpeed,
      farBackBlurPeak,
      waterFarBackBlur,
      waterWaveMode,
      waterBandCount,
      waterBandOffset,
      colorGradingEnabled,
      vibrance,
      saturation,
      inputBlack,
      gamma,
      inputWhite,
      outputBlack,
      outputWhite,
      isPaused,
      handleFpsUpdate,
      onWaterTelemetry,
    ]
  );



  const { canvasRef } = useCanvasEngine(
    resolvedParams,
    onShootingStarTrigger,
    onCometTrigger
  );

  return (
    <div
      className={`fixed top-0 left-0 w-full pointer-events-none select-none overflow-hidden ${className}`}
      style={{
        height: 'var(--fixed-vh, 100lvh)',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* Aspect-Ratio Locked Master HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        width={BG_CANVAS_WIDTH}
        height={BG_CANVAS_HEIGHT}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
        style={{
          width: 'max(105vw, calc(var(--fixed-105vh, 105lvh) * 1920 / 1187))',
          height: 'max(var(--fixed-105vh, 105lvh), calc(105vw * 1187 / 1920))',
          aspectRatio: '1920 / 1187',
          backgroundColor: '#021319',
          top: canvasOffsetY ? `calc(50% + ${canvasOffsetY}px)` : undefined,
          filter: colorGradingFilter,
        }}
      />


      {/* Dark Theme Ambient Darkening & Center Glow Scrim */}
      {darkScrimEnabled && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, rgba(9, 71, 87, ${darkCenterGlowOpacity}) 0%, rgba(3, 35, 44, ${darkMidHazeOpacity}) 60%, rgba(2, 19, 25, ${darkEdgeVignetteOpacity}) 100%)`,
            opacity: effectiveDarkOpacity,
          }}
        />
      )}

      {/* Light Theme Ambient Lighting Scrim */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, rgba(235, 246, 250, ${lightTopSkyOpacity}) 0%, rgba(218, 238, 246, ${lightMidAtmosphericOpacity}) 55%, rgba(195, 226, 238, ${lightBottomHorizonOpacity}) 100%)`,
          opacity: effectiveLightOpacity,
        }}
      />
    </div>
  );
};

export default CanvasBackground;
