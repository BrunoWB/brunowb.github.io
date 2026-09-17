import React, { useMemo } from 'react';
import {
  bgLayers,
  BG_CANVAS_WIDTH,
  BG_CANVAS_HEIGHT,
} from '../../data/bgLayersData';
import { ReflectionBlendMode } from '../../types/background';
import {
  computeLevelsTableValues,
  computeVibranceSaturationMatrix,
} from '../../utils/colorGrading';
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
  darkScrimEnabled?: boolean;
  layerOverrides?: Record<string, { visible?: boolean; opacity?: number }>;
  className?: string;
  canvasOffsetY?: number;
  onShootingStarTrigger?: () => void;
  onCometTrigger?: () => void;
  onFpsUpdate?: (fps: number, frameTimeMs: number) => void;
  onWaterTelemetry?: (speed: number, blur: number) => void;
}

export const CanvasBackground: React.FC<CanvasBackgroundProps> = ({
  interactive = true,
  reverseHorizontalParallax = true,
  colorGradingEnabled = true,
  vibrance = 10,
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
  waterBandCount = 50,
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
  darkScrimEnabled = true,
  layerOverrides = {},
  className = '',
  canvasOffsetY = 0,
  onShootingStarTrigger,
  onCometTrigger,
  onFpsUpdate,
  onWaterTelemetry,
}) => {
  // Photoshop Vibrance & Saturation Color Matrix
  const colorMatrixValues = useMemo(
    () => computeVibranceSaturationMatrix(vibrance, saturation),
    [vibrance, saturation]
  );

  // Photoshop Levels 1D LUT tableValues
  const levelsTableValues = useMemo(
    () => computeLevelsTableValues(inputBlack, gamma, inputWhite, outputBlack, outputWhite),
    [inputBlack, gamma, inputWhite, outputBlack, outputWhite]
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
      useCleanComposite,
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
      onFpsUpdate,
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
      useCleanComposite,
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
      onFpsUpdate,
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
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* SVG Filter Definitions for GPU Post-Processing Color Grading */}
      <svg className="sr-only" aria-hidden="true" width="0" height="0">
        <defs>
          <filter
            id="canvas-color-grading"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix type="matrix" values={colorMatrixValues} result="vibrance_sat" />
            <feComponentTransfer in="vibrance_sat">
              <feFuncR type="table" tableValues={levelsTableValues} />
              <feFuncG type="table" tableValues={levelsTableValues} />
              <feFuncB type="table" tableValues={levelsTableValues} />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Aspect-Ratio Locked Master HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        width={BG_CANVAS_WIDTH}
        height={BG_CANVAS_HEIGHT}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
        style={{
          width: 'max(105vw, calc(105vh * 1920 / 1187))',
          height: 'max(105vh, calc(105vw * 1187 / 1920))',
          aspectRatio: '1920 / 1187',
          backgroundColor: '#021319',
          top: canvasOffsetY ? `calc(50% + ${canvasOffsetY}px)` : undefined,
          filter: colorGradingEnabled && !useCleanComposite ? 'url(#canvas-color-grading)' : undefined,
        }}
      />

      {/* Dark Theme Ambient Darkening & Center Glow Scrim */}
      {darkScrimEnabled && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle at center, rgba(9, 71, 87, 0.45) 0%, rgba(3, 35, 44, 0.72) 60%, rgba(2, 19, 25, 0.88) 100%)',
            opacity: 'var(--bg-dark-tint-opacity, 1)',
          }}
        />
      )}

      {/* Light Theme Ambient Lighting Scrim */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background:
            'linear-gradient(180deg, rgba(240, 248, 255, 0.55) 0%, rgba(228, 244, 250, 0.72) 65%, rgba(215, 238, 246, 0.88) 100%)',
          opacity: 'var(--bg-light-tint-opacity, 0)',
        }}
      />
    </div>
  );
};

export default CanvasBackground;
