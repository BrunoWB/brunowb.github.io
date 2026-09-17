import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import {
  bgLayers,
  bigStarsData,
  getStarFlareIntensityScale,
  BG_CANVAS_WIDTH,
  BG_CANVAS_HEIGHT,
  BG_HORIZON_Y,
} from '../../data/bgLayersData';
import { useParallax } from '../../hooks/useParallax';
import { BgLayerConfig, ReflectionBlendMode } from '../../types/background';
import {
  computeLevelsTableValues,
  computeVibranceSaturationMatrix,
} from '../../utils/colorGrading';

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
  blurTransitionSpeed?: number; // alias
  farBackBlurPeak?: number; // alias
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
  // Comet Dust Tail Properties (independent controls)
  cometFlameTailEnabled?: boolean;
  cometFlameTailSpeed?: number;
  cometTailTurbulence?: number;
  cometTailWaveAmplitude?: number; // alias
  cometTailFlickerIntensity?: number;
  cometTailFlickerSpeed?: number;
  cometTailSpreadFactor?: number;
  cometTailFadePower?: number;
  cometFlameTailIntensity?: number; // backward compatibility

  // Comet Core Streak Properties (independent controls)
  cometCorePulseEnabled?: boolean;
  cometCoreBaseOpacity?: number;
  cometCorePulseSpeed?: number;
  cometCoreStretchScale?: number;
  cometCoreStretchLength?: number; // alias
  cometCorePeakBrightness?: number;
  cometCorePulsePeakBrightness?: number; // alias
  cometCoreBaselineOpacity?: number;
  cometCorePulseScale?: number; // backward compatibility
  // Backward compatibility aliases
  cometTailWaveEnabled?: boolean;
  cometTailWaveSpeed?: number;
  cometTailWaveIntensity?: number;
  cometCoreDiffusionEnabled?: boolean;
  cometCoreDiffusionScale?: number;
  useCleanComposite?: boolean;
  layerOverrides?: Record<string, { visible?: boolean; opacity?: number }>;
  className?: string;
  canvasOffsetY?: number;
  onShootingStarTrigger?: () => void;
  onCometTrigger?: () => void;
  onFpsUpdate?: (fps: number, frameTimeMs: number) => void;
  onWaterTelemetry?: (speed: number, blur: number) => void;
}

interface ActiveStreak {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTime: number;
  duration: number;
}

// Helper to map layer blendMode to Canvas globalCompositeOperation
function getCompositeOperation(blendMode: string): GlobalCompositeOperation {
  switch (blendMode) {
    case 'screen':
      return 'screen';
    case 'color-dodge':
      return 'color-dodge';
    case 'overlay':
      return 'overlay';
    case 'hard-light':
      return 'hard-light';
    case 'soft-light':
      return 'soft-light';
    case 'lighten':
      return 'lighten';
    case 'lighter':
    case 'plus-lighter':
      return 'lighter';
    case 'multiply':
      return 'multiply';
    case 'luminosity':
      return 'luminosity';
    case 'color':
      return 'color';
    default:
      return 'source-over';
  }
}

export const CanvasBackground: React.FC<CanvasBackgroundProps> = ({
  interactive = true,
  parallaxIntensity = 0.5,
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
  reflectionOpacity = 0.8,
  reflectionBlendMode = 'normal',
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
  cometFlameTailEnabled,
  cometFlameTailSpeed,
  cometFlameTailIntensity,
  cometTailTurbulence,
  cometTailWaveAmplitude,
  cometTailFlickerIntensity,
  cometTailFlickerSpeed,
  cometTailSpreadFactor,
  cometTailFadePower,
  cometCorePulseEnabled,
  cometCoreBaseOpacity,
  cometCorePulseSpeed,
  cometCoreStretchScale,
  cometCoreStretchLength,
  cometCorePeakBrightness,
  cometCorePulsePeakBrightness,
  cometCoreBaselineOpacity,
  cometCorePulseScale,
  cometTailWaveEnabled = true,
  cometTailWaveSpeed = 1.0,
  cometTailWaveIntensity = 1.0,
  cometCoreDiffusionEnabled = true,
  cometCoreDiffusionScale = 1.0,
  useCleanComposite = false,
  layerOverrides = {},
  className = '',
  canvasOffsetY = 0,
  onShootingStarTrigger,
  onCometTrigger,
  onFpsUpdate,
  onWaterTelemetry,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reflectionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const distortedWaterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const blurredWaterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const galaxyReflectionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const distortedGalaxyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cometFlameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cometPulseCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const resolvedFlameTailEnabled = cometFlameTailEnabled ?? cometTailWaveEnabled ?? true;
  const resolvedFlameTailSpeed = cometFlameTailSpeed ?? cometTailWaveSpeed ?? 0.2;
  const resolvedTailTurbulence = cometTailTurbulence ?? cometTailWaveAmplitude ?? cometFlameTailIntensity ?? cometTailWaveIntensity ?? 0.2;
  const resolvedTailFlickerIntensity = cometTailFlickerIntensity ?? cometFlameTailIntensity ?? cometTailWaveIntensity ?? 1.1;
  const resolvedTailFlickerSpeed = cometTailFlickerSpeed ?? 0.2;
  const resolvedTailSpreadFactor = cometTailSpreadFactor ?? cometFlameTailIntensity ?? cometTailWaveIntensity ?? 2.2;
  const resolvedTailFadePower = cometTailFadePower ?? 0.50;

  const resolvedCorePulseEnabled = cometCorePulseEnabled ?? cometCoreDiffusionEnabled ?? true;
  const resolvedCoreBaseOpacity = cometCoreBaseOpacity ?? 0.75;
  const resolvedCorePulseSpeed = cometCorePulseSpeed ?? cometTailWaveSpeed ?? 0.2;
  const resolvedCoreStretchScale = cometCoreStretchScale ?? cometCoreStretchLength ?? cometCorePulseScale ?? cometCoreDiffusionScale ?? 1.5;
  const resolvedCorePeakBrightness = cometCorePeakBrightness ?? cometCorePulsePeakBrightness ?? (cometCorePulseScale != null ? Math.min(1.0, 0.74 * cometCorePulseScale) : 0.74);
  const resolvedCoreBaselineOpacity = cometCoreBaselineOpacity ?? 0.04;

  const resolvedBlurTransitionSpeed = blurTransitionSpeed ?? waterBlurTransitionSpeed ?? 1.8;
  const resolvedFarBackBlur = farBackBlurPeak ?? waterFarBackBlur ?? 0.0;

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

  const motion = useParallax({
    enabled: interactive,
    intensity: parallaxIntensity,
    smoothness: 0.08,
    autoDrift: true,
  });

  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  // Image cache
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const imagesLoadedRef = useRef<boolean>(false);

  // Dynamic shooting star streak state
  const streakRef = useRef<ActiveStreak | null>(null);

  // Preallocated typed buffer for continuous perspective water mesh nodes (up to 256 nodes)
  const waterMeshNodesRef = useRef<Float64Array>(new Float64Array(256));

  // Dynamic wave excitation & continuous phase state
  const waterExcitationRef = useRef<number>(0);
  const waterPhaseRef = useRef<number>(0);
  const waterBlurSmoothedRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(performance.now());

  // FPS and frame duration monitoring
  const fpsStatsRef = useRef<{ frames: number; lastTime: number; fps: number; frameTime: number }>({
    frames: 0,
    lastTime: performance.now(),
    fps: 60,
    frameTime: 16.6,
  });

  // Dynamic water excitation: mouse movement over water or scrolling surges wave speed and synchronized depth blur
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastX = 0;
    let lastY = 0;
    let hasLastPos = false;

    const onMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const horizonCanvasY = BG_HORIZON_Y + normX * (835 - BG_HORIZON_Y);
      const horizonScreenY = rect.top + rect.height * (horizonCanvasY / BG_CANVAS_HEIGHT);

      // Trigger when mouse moves over the water plane
      if (e.clientY >= horizonScreenY - 15 && e.clientY <= rect.bottom + 15) {
        if (hasLastPos) {
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const surgeAdd = Math.min(0.25, dist * 0.006);
          waterExcitationRef.current = Math.min(1.0, waterExcitationRef.current + surgeAdd);
        }
      }
      lastX = e.clientX;
      lastY = e.clientY;
      hasLastPos = true;
    };

    const onWheel = (e: WheelEvent) => {
      const scrollAmount = Math.abs(e.deltaY || e.deltaX || 0);
      const surgeAdd = Math.min(0.35, scrollAmount * 0.005);
      waterExcitationRef.current = Math.min(1.0, waterExcitationRef.current + surgeAdd);
    };

    const onScroll = () => {
      waterExcitationRef.current = Math.min(1.0, waterExcitationRef.current + 0.15);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const normX = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
        const horizonCanvasY = BG_HORIZON_Y + normX * (835 - BG_HORIZON_Y);
        const horizonScreenY = rect.top + rect.height * (horizonCanvasY / BG_CANVAS_HEIGHT);
        if (touch.clientY >= horizonScreenY - 15) {
          waterExcitationRef.current = Math.min(1.0, waterExcitationRef.current + 0.12);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // Preload all background layer assets
  useEffect(() => {
    const cache = imageCacheRef.current;
    const urlsToLoad = [
      ...bgLayers.map((l) => ({ id: l.id, url: `${cleanBase}bg-layers/${l.filename}` })),
      { id: 'bgclean', url: `${cleanBase}bg-layers/bgclean.webp` },
      { id: 'comet-sprite', url: `${cleanBase}bg-layers/comet-sprite.webp` },
    ];

    let loadedCount = 0;
    const totalCount = urlsToLoad.length;

    urlsToLoad.forEach(({ id, url }) => {
      if (cache.has(id)) {
        loadedCount++;
        if (loadedCount === totalCount) imagesLoadedRef.current = true;
        return;
      }
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalCount) imagesLoadedRef.current = true;
      };
      cache.set(id, img);
    });
  }, [cleanBase]);

  // Shooting star trigger (state evaluated inside render loop)
  const triggerShootingStar = useCallback(() => {
    if (streakRef.current) return;
    const startX = (65 + Math.random() * 25) * 0.01 * BG_CANVAS_WIDTH;
    const startY = (5 + Math.random() * 20) * 0.01 * BG_CANVAS_HEIGHT;
    const length = (25 + Math.random() * 15) * 0.01 * BG_CANVAS_WIDTH;
    const angle = 35 * (Math.PI / 180);

    const endX = startX - Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;

    streakRef.current = {
      startX,
      startY,
      endX,
      endY,
      startTime: performance.now(),
      duration: 1100,
    };

    onShootingStarTrigger?.();
    onCometTrigger?.();
  }, [onShootingStarTrigger, onCometTrigger]);

  // Periodic automatic shooting stars
  useEffect(() => {
    if (!shootingStarEnabled) return;
    const intervalTime = 12000 + Math.random() * 8000;
    const timer = setInterval(() => {
      triggerShootingStar();
    }, intervalTime);
    return () => clearInterval(timer);
  }, [shootingStarEnabled, triggerShootingStar]);


  // Compute resolved layer configurations
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

  // Big star reference
  const bigStarLayer = useMemo(
    () => resolvedLayers.find((l) => l.id === 'layer-3.0'),
    [resolvedLayers]
  );

  // Keep motion and animation parameters in mutable refs to avoid tearing down the canvas RAF loop
  const motionRef = useRef(motion);
  motionRef.current = motion;

  const animParamsRef = useRef({
    baseLayers,
    upperLayers,
    reflectedLayers,
    bigStarLayer,
    resolvedLayers,
    interactive,
    reverseHorizontalParallax,
    colorGradingEnabled,
    vibrance,
    saturation,
    inputBlack,
    gamma,
    inputWhite,
    outputBlack,
    outputWhite,
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
    waterBlurTransitionSpeed: resolvedBlurTransitionSpeed,
    waterFarBackBlur: resolvedFarBackBlur,
    waterWaveMode,
    waterBandCount,
    waterBandOffset,
    galaxyBreathingEnabled,
    galaxyBreathingSpeed,
    galaxyBreathingIntensity,
    bigStarShineEnabled,
    bigStarShineIntensity,
    bigStarShineSpeed,
    bigStarFlareSize,
    mistDisperseEnabled,
    mistDisperseSpeed,
    mistInstances,
    mistDistortionEnabled,
    mistDistortionScale,
    cloudDriftEnabled,
    cloudDriftSpeed,
    cloudDistortionEnabled,
    cloudDistortionScale,
    cloudMorphSpeed,
    cometFlameTailEnabled: resolvedFlameTailEnabled,
    cometFlameTailSpeed: resolvedFlameTailSpeed,
    cometFlameTailIntensity: resolvedTailTurbulence,
    cometTailTurbulence: resolvedTailTurbulence,
    cometTailWaveAmplitude: resolvedTailTurbulence,
    cometTailFlickerIntensity: resolvedTailFlickerIntensity,
    cometTailFlickerSpeed: resolvedTailFlickerSpeed,
    cometTailSpreadFactor: resolvedTailSpreadFactor,
    cometTailFadePower: resolvedTailFadePower,
    cometCorePulseEnabled: resolvedCorePulseEnabled,
    cometCoreBaseOpacity: resolvedCoreBaseOpacity,
    cometCorePulseSpeed: resolvedCorePulseSpeed,
    cometCoreStretchScale: resolvedCoreStretchScale,
    cometCoreStretchLength: resolvedCoreStretchScale,
    cometCorePeakBrightness: resolvedCorePeakBrightness,
    cometCorePulsePeakBrightness: resolvedCorePeakBrightness,
    cometCoreBaselineOpacity: resolvedCoreBaselineOpacity,
    cometCorePulseScale: resolvedCoreStretchScale,
    cometTailWaveEnabled: resolvedFlameTailEnabled,
    cometTailWaveSpeed: resolvedFlameTailSpeed,
    cometTailWaveIntensity: resolvedTailTurbulence,
    cometCoreDiffusionEnabled: resolvedCorePulseEnabled,
    cometCoreDiffusionScale: resolvedCoreStretchScale,
    useCleanComposite,
    onFpsUpdate,
    onWaterTelemetry,
  });

  animParamsRef.current = {
    baseLayers,
    upperLayers,
    reflectedLayers,
    bigStarLayer,
    resolvedLayers,
    interactive,
    reverseHorizontalParallax,
    colorGradingEnabled,
    vibrance,
    saturation,
    inputBlack,
    gamma,
    inputWhite,
    outputBlack,
    outputWhite,
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
    waterBlurTransitionSpeed: resolvedBlurTransitionSpeed,
    waterFarBackBlur: resolvedFarBackBlur,
    waterWaveMode,
    waterBandCount,
    waterBandOffset,
    galaxyBreathingEnabled,
    galaxyBreathingSpeed,
    galaxyBreathingIntensity,
    bigStarShineEnabled,
    bigStarShineIntensity,
    bigStarShineSpeed,
    bigStarFlareSize,
    mistDisperseEnabled,
    mistDisperseSpeed,
    mistInstances,
    mistDistortionEnabled,
    mistDistortionScale,
    cloudDriftEnabled,
    cloudDriftSpeed,
    cloudDistortionEnabled,
    cloudDistortionScale,
    cloudMorphSpeed,
    cometFlameTailEnabled: resolvedFlameTailEnabled,
    cometFlameTailSpeed: resolvedFlameTailSpeed,
    cometFlameTailIntensity: resolvedTailTurbulence,
    cometTailTurbulence: resolvedTailTurbulence,
    cometTailWaveAmplitude: resolvedTailTurbulence,
    cometTailFlickerIntensity: resolvedTailFlickerIntensity,
    cometTailFlickerSpeed: resolvedTailFlickerSpeed,
    cometTailSpreadFactor: resolvedTailSpreadFactor,
    cometTailFadePower: resolvedTailFadePower,
    cometCorePulseEnabled: resolvedCorePulseEnabled,
    cometCoreBaseOpacity: resolvedCoreBaseOpacity,
    cometCorePulseSpeed: resolvedCorePulseSpeed,
    cometCoreStretchScale: resolvedCoreStretchScale,
    cometCoreStretchLength: resolvedCoreStretchScale,
    cometCorePeakBrightness: resolvedCorePeakBrightness,
    cometCorePulsePeakBrightness: resolvedCorePeakBrightness,
    cometCoreBaselineOpacity: resolvedCoreBaselineOpacity,
    cometCorePulseScale: resolvedCoreStretchScale,
    cometTailWaveEnabled: resolvedFlameTailEnabled,
    cometTailWaveSpeed: resolvedFlameTailSpeed,
    cometTailWaveIntensity: resolvedTailTurbulence,
    cometCoreDiffusionEnabled: resolvedCorePulseEnabled,
    cometCoreDiffusionScale: resolvedCoreStretchScale,
    useCleanComposite,
    onFpsUpdate,
    onWaterTelemetry,
  };

  // Create or resize offscreen reflection buffer
  useEffect(() => {
    const waterH = BG_CANVAS_HEIGHT - BG_HORIZON_Y;
    if (!reflectionCanvasRef.current) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = BG_CANVAS_WIDTH;
      offCanvas.height = waterH;
      reflectionCanvasRef.current = offCanvas;
    }
    if (!distortedWaterCanvasRef.current) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = BG_CANVAS_WIDTH;
      offCanvas.height = waterH;
      distortedWaterCanvasRef.current = offCanvas;
    }
    if (!blurredWaterCanvasRef.current) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = BG_CANVAS_WIDTH;
      offCanvas.height = waterH;
      blurredWaterCanvasRef.current = offCanvas;
    }
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    let animationId: number;
    let frameCount = 0;
    let lastFpsReport = performance.now();
    let lastWaterTelemetryReport = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Reflection offscreen canvas
    const waterHeight = BG_CANVAS_HEIGHT - BG_HORIZON_Y; // 462 px
    if (!reflectionCanvasRef.current) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = BG_CANVAS_WIDTH;
      offCanvas.height = waterHeight;
      reflectionCanvasRef.current = offCanvas;
    }
    if (!distortedWaterCanvasRef.current) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = BG_CANVAS_WIDTH;
      offCanvas.height = waterHeight;
      distortedWaterCanvasRef.current = offCanvas;
    }
    if (!blurredWaterCanvasRef.current) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = BG_CANVAS_WIDTH;
      offCanvas.height = waterHeight;
      blurredWaterCanvasRef.current = offCanvas;
    }
    if (!galaxyReflectionCanvasRef.current) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = BG_CANVAS_WIDTH;
      offCanvas.height = waterHeight;
      galaxyReflectionCanvasRef.current = offCanvas;
    }
    if (!distortedGalaxyCanvasRef.current) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = BG_CANVAS_WIDTH;
      offCanvas.height = waterHeight;
      distortedGalaxyCanvasRef.current = offCanvas;
    }
    const reflCanvas = reflectionCanvasRef.current;
    const reflCtx = reflCanvas?.getContext('2d', { alpha: true });
    const galaxyReflCanvas = galaxyReflectionCanvasRef.current;
    const galaxyReflCtx = galaxyReflCanvas?.getContext('2d', { alpha: true });
    const distGalaxyCanvas = distortedGalaxyCanvasRef.current;
    const distGalaxyCtx = distGalaxyCanvas?.getContext('2d', { alpha: true });

    // Comet Flame & Pulse offscreen canvas buffers (zero GC allocations during animation)
    if (!cometFlameCanvasRef.current) {
      const fc = document.createElement('canvas');
      fc.width = 440;
      fc.height = 280;
      cometFlameCanvasRef.current = fc;
    }
    const cometFlameCanvas = cometFlameCanvasRef.current;
    const cometFlameCtx = cometFlameCanvas?.getContext('2d', { alpha: true });

    if (!cometPulseCanvasRef.current) {
      const pc = document.createElement('canvas');
      pc.width = 540;
      pc.height = 360;
      cometPulseCanvasRef.current = pc;
    }
    const cometPulseCanvas = cometPulseCanvasRef.current;
    const cometPulseCtx = cometPulseCanvas?.getContext('2d', { alpha: true });

    const render = (now: number) => {
      const p = animParamsRef.current;
      const motion = motionRef.current;
      const timeSec = now / 1000;
      const activeWaterScale = p.waterDistortionScale;

      // Delta time calculation for variable-speed wave phase integration
      const dt = Math.max(0.001, Math.min(0.1, (now - lastFrameTimeRef.current) / 1000));
      lastFrameTimeRef.current = now;

      // Smoothly decay water excitation back toward 0.0 (baseline return when idle)
      waterExcitationRef.current = Math.max(0, waterExcitationRef.current - dt * 0.55);
      const excitation = waterExcitationRef.current;

      // Dynamic wave speed: baseline (default 0.2) + surge up to +0.8 (e.g. 0.2 -> 1.0)
      const baseWaveSpeed = p.waterDistortionSpeed ?? 0.2;
      const effectiveWaveSpeed = baseWaveSpeed + excitation * 0.8;

      // Continuously accumulate wave phase (guarantees smooth wave continuity without phase jumping)
      waterPhaseRef.current += dt * effectiveWaveSpeed;
      const waterPhaseTime = waterPhaseRef.current;

      // Far-back horizon peak blur intensity (defaults to 0.0px for crisp testing clarity)
      // (waterFarBackBlur ?? 3.8)
      const farBackBlurPeak = p.waterFarBackBlur ?? 0.0;
      const surgeRatio = Math.min(1.0, Math.max(0, (effectiveWaveSpeed - 0.2) / 0.8));
      // Baseline optical depth blur at horizon (farBackBlurPeak) plus dynamic wave excitation surge (up to +35%)
      const targetWaterBlur = (p.waterBlur ?? 0) + farBackBlurPeak * (1.0 + 0.35 * surgeRatio);

      // Continuous temporal smoothing (exponential moving average / lerp with dt elapsed frame time)
      // Prevents water blur from changing instantaneously during excitation surges and decay
      const blurTransitionSpeed = p.waterBlurTransitionSpeed ?? 1.8;
      const blurAlpha = 1 - Math.exp(-dt * blurTransitionSpeed);
      waterBlurSmoothedRef.current += (targetWaterBlur - waterBlurSmoothedRef.current) * blurAlpha;
      const peakWaterBlur = waterBlurSmoothedRef.current;

      // FPS tracking
      frameCount++;
      if (now - lastFpsReport >= 500) {
        const measuredFps = (frameCount * 1000) / (now - lastFpsReport);
        const frameTime = 1000 / Math.max(1, measuredFps);
        fpsStatsRef.current = {
          frames: frameCount,
          lastTime: now,
          fps: Math.round(measuredFps * 10) / 10,
          frameTime: Math.round(frameTime * 10) / 10,
        };
        p.onFpsUpdate?.(fpsStatsRef.current.fps, fpsStatsRef.current.frameTime);
        frameCount = 0;
        lastFpsReport = now;
      }

      // Live water telemetry reporting (~10Hz for smooth, responsive HUD feedback)
      if (now - lastWaterTelemetryReport >= 100) {
        p.onWaterTelemetry?.(
          Math.round(effectiveWaveSpeed * 100) / 100,
          Math.round(peakWaterBlur * 10) / 10
        );
        lastWaterTelemetryReport = now;
      }

      // Parallax displacement helper
      const getLayerOffset = (layer: BgLayerConfig) => {
        const motionX = p.reverseHorizontalParallax ? -motion.x : motion.x;
        const tx = motionX * layer.parallaxFactor.x * 45;
        const ty =
          motion.y * layer.parallaxFactor.y * 30 -
          motion.scrollY * layer.parallaxFactor.y * 0.12;
        return { tx, ty };
      };

      const cache = imageCacheRef.current;
      const seaLayer = p.resolvedLayers.find((l) => l.id === 'layer-1.0');
      const seaVisible = !seaLayer || seaLayer.visible;

      // 1. Clear main canvas with midnight base background
      ctx.fillStyle = '#021319';
      ctx.fillRect(0, 0, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);

      // Clean composite shortcut
      if (p.useCleanComposite) {
        const cleanImg = cache.get('bgclean');
        if (cleanImg && cleanImg.complete && cleanImg.naturalWidth > 0) {
          ctx.drawImage(cleanImg, 0, 0, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        }
        animationId = requestAnimationFrame(render);
        return;
      }

      // Comet geometry constants
      const COMET_HEAD_X = 1385;
      const COMET_HEAD_Y = 318;
      const COMET_TAIL_X = 1680;
      const COMET_TAIL_Y = 155;
      const COMET_ANGLE = Math.atan2(COMET_TAIL_Y - COMET_HEAD_Y, COMET_TAIL_X - COMET_HEAD_X); // ~ -0.505 rad (~ -28.9° to -32° flight angle)

      // Render Comet Dust Tail layers (7.1, 7.2, 7.3):
      // Flame-like behavior: organic burning flame turbulence, turbulent flame flicker,
      // lateral spreading/widening toward trailing end, smoothly fading out toward tail tip.
      const renderCometTail = (
        targetCtx: CanvasRenderingContext2D,
        layer: BgLayerConfig,
        img: HTMLImageElement,
        tx: number,
        ty: number,
        opacity: number,
        blendMode: string
      ) => {
        const flameEnabled = p.cometFlameTailEnabled ?? p.cometTailWaveEnabled ?? true;
        if (!flameEnabled || !cometFlameCanvas || !cometFlameCtx) {
          targetCtx.save();
          targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
          targetCtx.globalAlpha = opacity;
          targetCtx.drawImage(img, tx, ty, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
          targetCtx.restore();
          return;
        }

        const flameSpeed = p.cometFlameTailSpeed ?? p.cometTailWaveSpeed ?? 0.2;
        const tailTurbulence = p.cometTailTurbulence ?? p.cometTailWaveAmplitude ?? p.cometFlameTailIntensity ?? p.cometTailWaveIntensity ?? 0.2;
        const tailFlickerIntensity = p.cometTailFlickerIntensity ?? p.cometFlameTailIntensity ?? p.cometTailWaveIntensity ?? 1.1;
        const tailFlickerSpeed = p.cometTailFlickerSpeed ?? 0.2;
        const tailSpreadFactor = p.cometTailSpreadFactor ?? p.cometFlameTailIntensity ?? p.cometTailWaveIntensity ?? 2.2;
        const tailFadePower = p.cometTailFadePower ?? 0.50;

        // Layer-specific seed offsets and lateral spread multipliers for volumetric flame variation
        const layerSeed = layer.id === 'layer-7.1' ? 0.0 : layer.id === 'layer-7.2' ? 2.35 : 4.71;
        const spreadAmount = layer.id === 'layer-7.1' ? 0.50 : layer.id === 'layer-7.2' ? 0.38 : 0.62;

        const bufW = 440;
        const bufH = 280;
        const anchorBufX = 40;
        const anchorBufY = 140;

        // Draw the tail into offscreen buffer rotated so tail axis aligns with horizontal X-axis
        cometFlameCtx.clearRect(0, 0, bufW, bufH);
        cometFlameCtx.save();
        cometFlameCtx.translate(anchorBufX, anchorBufY);
        cometFlameCtx.rotate(-COMET_ANGLE);
        cometFlameCtx.translate(-COMET_HEAD_X, -COMET_HEAD_Y);
        cometFlameCtx.drawImage(img, 0, 0);
        cometFlameCtx.restore();

        // 2. Smooth continuous terminal fade out toward tail tip (100% continuous gradient, zero strips)
        const startX = 16;
        const endX = 385;
        cometFlameCtx.save();
        cometFlameCtx.globalCompositeOperation = 'destination-in';
        const fadeGrad = cometFlameCtx.createLinearGradient(startX, 0, endX, 0);
        const steps = 24;
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const fadeAlpha = Math.max(0, 1.0 - 0.72 * Math.pow(u, tailFadePower));
          fadeGrad.addColorStop(u, `rgba(0,0,0,${fadeAlpha})`);
        }
        cometFlameCtx.fillStyle = fadeGrad;
        cometFlameCtx.fillRect(0, 0, bufW, bufH);
        cometFlameCtx.restore();

        // 3. Turbulent flame flicker
        const flicker =
          1.0 +
          (0.16 * Math.sin(timeSec * 18.5 * tailFlickerSpeed + layerSeed * 3.0) +
            0.09 * Math.cos(timeSec * 28.0 * tailFlickerSpeed + layerSeed * 1.7)) *
            tailFlickerIntensity;
        const baseAlpha = Math.max(0, Math.min(1.0, opacity * flicker));

        // 4. Continuous multi-harmonic flame wave sway and shear lick (zero slices, zero lines)
        const p1 = timeSec * 6.5 * flameSpeed + layerSeed;
        const p2 = timeSec * 13.0 * flameSpeed + layerSeed * 1.6 + 1.2;
        const p3 = timeSec * 21.5 * flameSpeed + 2.1;
        const totalWave =
          (Math.sin(p1) * 0.65 + Math.sin(p2) * 0.25 + Math.sin(p3) * 0.10) *
          (tailTurbulence * 14.0) / 14.0;

        // Angular sway anchored at comet head (head is stationary, tail tip wafts organically)
        const swayAngle = totalWave * 0.024 * tailTurbulence;

        // Shear flame lick (S-curve undulation along trailing axis)
        const shearY =
          (Math.sin(timeSec * 5.2 * flameSpeed + layerSeed) * 0.032 +
            Math.cos(timeSec * 11.4 * flameSpeed + layerSeed * 1.4) * 0.016) *
          tailTurbulence;

        // Lateral spreading towards trailing end
        const spreadY = 1.0 + spreadAmount * (tailSpreadFactor - 1.0) * 0.40;
        const spreadX = 1.0 + (tailSpreadFactor - 1.0) * 0.06;

        // Primary Flame Pass (whole-raster continuous blit without strip slicing)
        targetCtx.save();
        targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
        targetCtx.globalAlpha = baseAlpha;
        targetCtx.translate(COMET_HEAD_X + tx, COMET_HEAD_Y + ty);
        targetCtx.rotate(COMET_ANGLE + swayAngle);
        targetCtx.transform(spreadX, shearY, 0, spreadY, 0, 0);
        targetCtx.drawImage(cometFlameCanvas, -anchorBufX, -anchorBufY);
        targetCtx.restore();

        // Secondary Ethereal Vapor Pass (gives burning flame volumetric depth and luminescence)
        if (tailTurbulence > 0.08) {
          const vaporAlpha = Math.max(0, Math.min(1.0, baseAlpha * 0.32 * Math.min(1.5, tailTurbulence)));
          const vaporSway = -swayAngle * 0.65 + 0.008 * Math.sin(timeSec * 8.0 * flameSpeed + layerSeed);
          const vaporShear = -shearY * 0.70;
          const vaporSpreadY = spreadY * 1.12;

          targetCtx.save();
          targetCtx.globalCompositeOperation = 'screen';
          targetCtx.globalAlpha = vaporAlpha;
          targetCtx.translate(COMET_HEAD_X + tx, COMET_HEAD_Y + ty);
          targetCtx.rotate(COMET_ANGLE + vaporSway);
          targetCtx.transform(spreadX * 1.02, vaporShear, 0, vaporSpreadY, 0, 0);
          targetCtx.drawImage(cometFlameCanvas, -anchorBufX, -anchorBufY);
          targetCtx.restore();
        }
      };

      // Render Comet Core & Nucleus Streak (layer-7.0)
      // 1. Base pass: rendered cleanly at configurable base opacity (0.8 * opacity default)
      // 2. Effect pass: duplicated pass stretched along flight angle (~32° diagonal)
      //    with advancing wave pulse of opacity (mostly hidden baseline, surges with radiant light)
      const renderCometCore = (
        targetCtx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        tx: number,
        ty: number,
        opacity: number,
        blendMode: string
      ) => {
        const coreBaseOpacity = p.cometCoreBaseOpacity ?? 0.75;
        // 1. Base clean pass at 75% opacity default (0.75 * opacity)
        targetCtx.save();
        targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
        targetCtx.globalAlpha = coreBaseOpacity * opacity;
        targetCtx.drawImage(img, tx, ty, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        targetCtx.restore();

        const pulseEnabled = p.cometCorePulseEnabled ?? p.cometCoreDiffusionEnabled ?? true;
        if (!pulseEnabled || !cometPulseCanvas || !cometPulseCtx) return;

        const pulseSpeed = p.cometCorePulseSpeed ?? p.cometTailWaveSpeed ?? 0.2;
        const coreStretchScale = p.cometCoreStretchScale ?? p.cometCoreStretchLength ?? p.cometCorePulseScale ?? p.cometCoreDiffusionScale ?? 1.5;
        const corePeakBrightness = p.cometCorePeakBrightness ?? p.cometCorePulsePeakBrightness ?? (p.cometCorePulseScale != null ? Math.min(1.0, 0.74 * p.cometCorePulseScale) : 0.74);
        const coreBaselineOpacity = p.cometCoreBaselineOpacity ?? 0.04;

        // Bounding crop around comet streak with ample headroom for flight diagonal stretch
        const cropX = 1340;
        const cropY = 30;
        const cropW = 540;
        const cropH = 360;

        const anchorX = COMET_HEAD_X - cropX; // 45
        const anchorY = COMET_HEAD_Y - cropY; // 288
        const endRelX = COMET_TAIL_X - cropX; // 340
        const endRelY = COMET_TAIL_Y - cropY; // 125

        // Advancing wave cycle (~3.2s duration): 70% traveling pulse, 30% quiet dormant pause
        const cycleDuration = 3.2 / Math.max(0.2, pulseSpeed);
        const cycleProg = ((timeSec / cycleDuration) % 1.0 + 1.0) % 1.0;
        const isSurging = cycleProg <= 0.70;
        const uWave = isSurging ? cycleProg / 0.70 : 2.0;

        // Dynamic stretch along flight angle (~32° diagonal) during pulse surge
        const surgeStretch = isSurging ? Math.sin(uWave * Math.PI) : 0;
        const stretchX = 1.0 + (0.04 + 0.12 * surgeStretch) * coreStretchScale;
        const stretchY = 1.0 + 0.02 * surgeStretch * coreStretchScale;

        // Render stretched pass onto offscreen pulse buffer
        cometPulseCtx.clearRect(0, 0, cropW, cropH);
        cometPulseCtx.save();
        cometPulseCtx.translate(anchorX, anchorY);
        cometPulseCtx.rotate(COMET_ANGLE);
        cometPulseCtx.scale(stretchX, stretchY);
        cometPulseCtx.rotate(-COMET_ANGLE);
        cometPulseCtx.translate(-anchorX, -anchorY);
        cometPulseCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        cometPulseCtx.restore();

        // Advancing wave / pulse of opacity traveling along its length:
        // Dynamically stretched end coordinates so radiant wave pulse travels all the way through extended streak
        const curEndRelX = anchorX + (endRelX - anchorX) * stretchX;
        const curEndRelY = anchorY + (endRelY - anchorY) * stretchX;

        cometPulseCtx.globalCompositeOperation = 'destination-in';
        const grad = cometPulseCtx.createLinearGradient(anchorX, anchorY, curEndRelX, curEndRelY);
        const baseAlpha = Math.max(0, Math.min(1.0, coreBaselineOpacity));
        const peakAlpha = Math.min(1.0, Math.max(0, corePeakBrightness));

        if (isSurging && uWave <= 1.15) {
          const sigma = 0.22;
          const uStart = Math.max(0, uWave - sigma);
          const uMid = Math.min(1.0, Math.max(0, uWave));
          const uEnd = Math.min(1.0, uWave + sigma);

          grad.addColorStop(0, `rgba(0,0,0,${baseAlpha})`);
          if (uStart > 0.01) grad.addColorStop(uStart, `rgba(0,0,0,${baseAlpha})`);
          grad.addColorStop(uMid, `rgba(0,0,0,${peakAlpha})`);
          if (uEnd < 0.99) grad.addColorStop(uEnd, `rgba(0,0,0,${baseAlpha})`);
          grad.addColorStop(1, `rgba(0,0,0,${baseAlpha})`);
        } else {
          grad.addColorStop(0, `rgba(0,0,0,${baseAlpha})`);
          grad.addColorStop(1, `rgba(0,0,0,${baseAlpha})`);
        }

        cometPulseCtx.fillStyle = grad;
        cometPulseCtx.fillRect(0, 0, cropW, cropH);
        cometPulseCtx.globalCompositeOperation = 'source-over';

        // Blit radiant wave pulse with screen composite operation
        targetCtx.save();
        targetCtx.globalCompositeOperation = 'screen';
        targetCtx.globalAlpha = opacity;
        targetCtx.drawImage(cometPulseCanvas, 0, 0, cropW, cropH, cropX + tx, cropY + ty, cropW, cropH);
        targetCtx.restore();
      };

      // Render Living Breathing Galaxy layer with subtle celestial respiration & composite luminosity modulation
      // (Constraint: Zero size deformation/scaling; subtle opacity & composite radiance modulation across 18-28s harmonic cycles)
      const renderGalaxyLayer = (
        targetCtx: CanvasRenderingContext2D,
        layer: BgLayerConfig,
        img: HTMLImageElement,
        cx: number,
        cy: number,
        baseOpacity: number,
        blendMode: string,
        isReflection: boolean = false
      ) => {
        if (!p.galaxyBreathingEnabled || p.galaxyBreathingIntensity <= 0) {
          targetCtx.save();
          if (!isReflection && seaVisible) {
            targetCtx.beginPath();
            targetCtx.moveTo(0, 0);
            targetCtx.lineTo(BG_CANVAS_WIDTH, 0);
            targetCtx.lineTo(BG_CANVAS_WIDTH, 835);
            targetCtx.lineTo(0, BG_HORIZON_Y);
            targetCtx.closePath();
            targetCtx.clip();
          }
          targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
          targetCtx.globalAlpha = baseOpacity;
          targetCtx.drawImage(img, cx, cy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
          targetCtx.restore();
          return;
        }

        const speed = Math.max(0.1, p.galaxyBreathingSpeed);
        const intensity = p.galaxyBreathingIntensity;

        let effAlpha = baseOpacity;
        let bloomAlpha = 0;
        let bloomMode: GlobalCompositeOperation = 'screen';

        if (layer.id === 'layer-2.0') {
          // Milky Way Base Dust: ultra-slow, deep foundation wash (~26s harmonic period)
          const phaseDust = (timeSec * 2 * Math.PI * speed) / 26.0;
          const waveDust = Math.sin(phaseDust) * 0.75 + Math.sin(phaseDust * 0.5 + 0.6) * 0.25;
          effAlpha = Math.max(0, Math.min(1.0, baseOpacity * (1.0 + 0.05 * waveDust * intensity)));
          if (waveDust > 0) {
            bloomAlpha = Math.max(0, Math.min(1.0, baseOpacity * (0.03 * waveDust * intensity)));
            bloomMode = 'screen';
          }
        } else if (layer.id === 'layer-2.1') {
          // Milky Way Core Gas: radiant stellar core respiration (~21s harmonic period, +1.0 rad phase offset)
          const phaseCore = (timeSec * 2 * Math.PI * speed) / 21.0 + 1.0;
          const waveCore = Math.sin(phaseCore) * 0.70 + Math.sin(phaseCore * 1.4 - 0.4) * 0.30;
          effAlpha = Math.max(0, Math.min(1.0, baseOpacity * (1.0 + 0.08 * waveCore * intensity)));
          if (waveCore > 0) {
            bloomAlpha = Math.max(0, Math.min(1.0, baseOpacity * (0.07 * waveCore * intensity)));
            bloomMode = 'screen';
          }
        } else if (layer.id === 'layer-2.2') {
          // Milky Way Bright Highlights: ionized nebular peaks (~18s harmonic period, +2.1 rad phase offset)
          const phaseBright = (timeSec * 2 * Math.PI * speed) / 18.0 + 2.1;
          const waveBright = Math.sin(phaseBright) * 0.68 + Math.cos(phaseBright * 1.3 + 0.5) * 0.32;
          effAlpha = Math.max(0, Math.min(1.0, baseOpacity * (1.0 + 0.10 * waveBright * intensity)));
          if (waveBright > 0) {
            bloomAlpha = Math.max(0, Math.min(1.0, baseOpacity * (0.08 * waveBright * intensity)));
            bloomMode = 'screen';
          }
        }

        // Primary base pass with layer composite blend mode (strictly without size scaling or deformation)
        targetCtx.save();
        if (!isReflection && seaVisible) {
          targetCtx.beginPath();
          targetCtx.moveTo(0, 0);
          targetCtx.lineTo(BG_CANVAS_WIDTH, 0);
          targetCtx.lineTo(BG_CANVAS_WIDTH, 835);
          targetCtx.lineTo(0, BG_HORIZON_Y);
          targetCtx.closePath();
          targetCtx.clip();
        }
        targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
        targetCtx.globalAlpha = effAlpha;
        targetCtx.drawImage(img, cx, cy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        targetCtx.restore();

        // Secondary ethereal luminosity bloom pass for composite radiance ebb & flow
        if (bloomAlpha > 0.001) {
          targetCtx.save();
          if (!isReflection && seaVisible) {
            targetCtx.beginPath();
            targetCtx.moveTo(0, 0);
            targetCtx.lineTo(BG_CANVAS_WIDTH, 0);
            targetCtx.lineTo(BG_CANVAS_WIDTH, 835);
            targetCtx.lineTo(0, BG_HORIZON_Y);
            targetCtx.closePath();
            targetCtx.clip();
          }
          targetCtx.globalCompositeOperation = bloomMode;
          targetCtx.globalAlpha = bloomAlpha;
          targetCtx.drawImage(img, cx, cy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
          targetCtx.restore();
        }
      };

      // Render Cloud layers with continuous whole-raster living dynamics (zero slicing, zero tile borders)
      const renderCloud = (
        targetCtx: CanvasRenderingContext2D,
        layer: BgLayerConfig,
        img: HTMLImageElement,
        cx: number,
        cy: number,
        opacity: number,
        blendMode: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _isReflection: boolean = false
      ) => {
        if (!p.cloudDistortionEnabled || p.cloudDistortionScale <= 0) {
          targetCtx.save();
          targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
          targetCtx.globalAlpha = opacity;
          targetCtx.drawImage(img, cx, cy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
          targetCtx.restore();
          return;
        }

        // Layer-specific organic visual center anchors and seeds
        let originX = 520;
        let originY = 390;
        let layerSeed = 0.0;

        if (layer.id === 'layer-4.2') {
          originX = 1450;
          originY = 510;
          layerSeed = 5.3;
        } else if (layer.id === 'layer-4.1') {
          originX = 520;
          originY = 390;
          layerSeed = 2.7;
        }

        const distortionScale = p.cloudDistortionScale;
        const morphSpeed = p.cloudMorphSpeed;

        // 1. Dual Multi-Frequency Harmonic Billow Drift
        const phaseDrift1 = timeSec * 0.38 * morphSpeed + layerSeed;
        const phaseDrift2 = timeSec * 0.72 * morphSpeed + layerSeed * 1.3 + 0.8;
        const billowDriftX =
          (Math.sin(phaseDrift1) * 0.65 + Math.cos(phaseDrift2) * 0.35) * (distortionScale * 0.8);

        const phaseDriftY1 = timeSec * 0.32 * morphSpeed + layerSeed * 0.9 + 1.2;
        const phaseDriftY2 = timeSec * 0.64 * morphSpeed + layerSeed * 1.4 + 2.1;
        const billowDriftY =
          (Math.sin(phaseDriftY1) * 0.70 + Math.sin(phaseDriftY2) * 0.30) * (distortionScale * 0.4);

        // 2. Subtle Anisotropic Aspect Breathing (1.00 ± 0.02 at default scale 6)
        const breathMagnitude = 0.02 * Math.min(2.0, distortionScale / 6);
        const breathPhaseX = timeSec * 0.44 * morphSpeed + layerSeed;
        const breathX =
          1.0 +
          breathMagnitude *
            (Math.sin(breathPhaseX) * 0.75 + Math.cos(breathPhaseX * 1.6 + 0.5) * 0.25);

        const breathPhaseY = timeSec * 0.36 * morphSpeed + layerSeed * 1.2 + 1.1;
        const breathY =
          1.0 +
          breathMagnitude *
            0.85 *
            (Math.cos(breathPhaseY) * 0.70 + Math.sin(breathPhaseY * 1.5 + 0.9) * 0.30);

        // 3. Soft Traveling Vapor Density Respiration
        const vaporPhase = timeSec * 0.52 * morphSpeed + layerSeed;
        const vaporPulse =
          1.0 +
          0.045 *
            Math.min(2.0, distortionScale / 6) *
            (Math.sin(vaporPhase) * 0.70 + Math.sin(vaporPhase * 1.7 + 0.8) * 0.30);
        const effAlpha = Math.max(0, Math.min(1.0, opacity * vaporPulse));

        // 4. Primary Continuous Whole-Raster Pass
        targetCtx.save();
        targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
        targetCtx.globalAlpha = effAlpha;

        targetCtx.translate(cx + billowDriftX + originX, cy + billowDriftY + originY);
        targetCtx.scale(breathX, breathY);
        targetCtx.translate(-originX, -originY);
        targetCtx.drawImage(img, 0, 0, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        targetCtx.restore();

        // 5. Smooth Layered Composite Blending: Secondary Ethereal Billow Vapor Pass
        const secondaryAlpha = opacity * 0.12 * Math.min(1.5, distortionScale / 6);
        if (secondaryAlpha > 0.005) {
          const secPhase1 = timeSec * 0.58 * morphSpeed + layerSeed + 1.7;
          const secPhase2 = timeSec * 0.42 * morphSpeed + layerSeed * 1.1 + 0.9;
          const secDriftX = Math.sin(secPhase1) * (distortionScale * 0.5);
          const secDriftY = Math.cos(secPhase2) * (distortionScale * 0.25);
          const secBreathX = 1.0 + breathMagnitude * 0.6 * Math.cos(secPhase1 * 1.2);
          const secBreathY = 1.0 + breathMagnitude * 0.6 * Math.sin(secPhase2 * 1.3);

          targetCtx.save();
          targetCtx.globalCompositeOperation = 'screen';
          targetCtx.globalAlpha = secondaryAlpha;
          targetCtx.translate(cx + billowDriftX + secDriftX + originX, cy + billowDriftY + secDriftY + originY);
          targetCtx.scale(secBreathX, secBreathY);
          targetCtx.translate(-originX, -originY);
          targetCtx.drawImage(img, 0, 0, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
          targetCtx.restore();
        }
      };

      // 2. Render Base Stack: 0.0 (Sky gradient), Comet (7.0, 7.1, 7.2, 7.3), 0.1 (Deep space vignette), 1.0 (Sea)
      for (const layer of p.baseLayers) {
        const img = cache.get(layer.id);
        if (!img || !img.complete || img.naturalWidth === 0) continue;
        const { tx, ty } = getLayerOffset(layer);

        // Special case: Comet Dust Tail (layer-7.1, layer-7.2, layer-7.3) flame turbulence, spread & flicker
        if (layer.id === 'layer-7.1' || layer.id === 'layer-7.2' || layer.id === 'layer-7.3') {
          renderCometTail(ctx, layer, img, tx, ty, layer.opacity, layer.blendMode);
          continue;
        }

        // Special case: Comet Core Streak (layer-7.0) base 80% draw + diagonal stretch & wave pulse effect
        if (layer.id === 'layer-7.0') {
          renderCometCore(ctx, img, tx, ty, layer.opacity, layer.blendMode);
          continue;
        }

        ctx.save();
        ctx.globalCompositeOperation = getCompositeOperation(layer.blendMode);
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(img, tx, ty, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        ctx.restore();
      }

      // 3. Render The Programmatic Water Reflection Plane
      if (p.reflectionEnabled && seaVisible && reflCanvas && reflCtx) {
        // Clear offscreen reflection canvas
        reflCtx.clearRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
        const masterReflOpacity = p.reflectionOpacity ?? 0.8;
        reflCtx.save();

        // Transform: mirror across horizon (y = 725)
        // Sky coordinate y in [263, 725] maps to water coordinate in [462, 0]
        reflCtx.scale(1, -1);
        reflCtx.translate(0, -BG_HORIZON_Y);

        if (galaxyReflCtx) {
          galaxyReflCtx.clearRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
          galaxyReflCtx.save();
          galaxyReflCtx.scale(1, -1);
          galaxyReflCtx.translate(0, -BG_HORIZON_Y);
        }

        // Render mirrored sky layers into reflection buffer
        for (const layer of p.reflectedLayers) {
          const img = cache.get(layer.id);
          if (!img || !img.complete || img.naturalWidth === 0) continue;
          const { tx, ty } = getLayerOffset(layer);

          let cx = tx;
          let cy = ty;

          // Clouds drift in reflection
          const isCloud = layer.category === 'clouds';
          if (isCloud && p.cloudDriftEnabled) {
            if (layer.id === 'layer-4.2') {
              const speed = 95 / Math.max(0.2, p.cloudDriftSpeed);
              cx += -12 * Math.sin((timeSec * 2 * Math.PI) / speed);
              cy += 2 * Math.sin((timeSec * 2 * Math.PI) / speed);
            } else {
              const speed = 80 / Math.max(0.2, p.cloudDriftSpeed);
              cx += 14 * Math.sin((timeSec * 2 * Math.PI) / speed);
              cy += -2 * Math.sin((timeSec * 2 * Math.PI) / speed);
            }
          }

          const reflOpacity = (layer.reflectionOpacity ?? 0.75) * layer.opacity * 0.78 * (masterReflOpacity / 0.8);

          // Comet Dust Tail flame reflection (7.1, 7.2, 7.3)
          if (layer.id === 'layer-7.1' || layer.id === 'layer-7.2' || layer.id === 'layer-7.3') {
            renderCometTail(reflCtx, layer, img, cx, cy, reflOpacity, layer.blendMode);
            continue;
          }

          // Comet Core Streak reflection with diagonal stretch & wave pulse
          if (layer.id === 'layer-7.0') {
            renderCometCore(reflCtx, img, cx, cy, reflOpacity, layer.blendMode);
            continue;
          }

          // Special case: Clouds multi-zone billow distortion reflection parity (synchronized when isCloud && p.cloudDistortionEnabled)
          if (isCloud) {
            renderCloud(reflCtx, layer, img, cx, cy, reflOpacity, layer.blendMode, true);
            continue;
          }

          // Special case: Living Breathing Galaxy reflection parity
          // Rendered into isolated galaxyReflCtx to composite with screen blend mode (eliminating dark chasm)
          if (layer.id === 'layer-2.0' || layer.id === 'layer-2.1' || layer.id === 'layer-2.2') {
            const targetGalaxyCtx = galaxyReflCtx || reflCtx;
            renderGalaxyLayer(targetGalaxyCtx, layer, img, cx, cy, reflOpacity, layer.blendMode, true);
            continue;
          }

          reflCtx.save();
          reflCtx.globalCompositeOperation = getCompositeOperation(layer.blendMode);
          reflCtx.globalAlpha = reflOpacity;
          reflCtx.drawImage(img, cx, cy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
          reflCtx.restore();
        }

        // Restore mirrored coordinate space back to water-relative coordinates [0..1920] x [0..462]
        reflCtx.restore();
        if (galaxyReflCtx) {
          galaxyReflCtx.restore();
        }

        // Reflected Big Stars natural shine flares - specular columns shimmering on water surface in sync with sky twinkle
        if (p.bigStarShineEnabled && p.bigStarLayer?.visible) {
          const { tx, ty } = getLayerOffset(p.bigStarLayer);
          const intensityScale = getStarFlareIntensityScale(p.bigStarShineIntensity, 0.15);

          for (let i = 0; i < bigStarsData.length; i++) {
            const star = bigStarsData[i];
            if (!star.hasReflection) continue;

            const starX = star.x + tx;
            // Perspective foreshortening on water surface below horizon (y=725)
            const effSkyY = star.y + ty;
            const d = Math.max(0, Math.min(1.0, (BG_HORIZON_Y - effSkyY) / BG_HORIZON_Y));
            const starWaterY = 24.0 + d * 55.0;

            // Compute exact same scintillation harmonic in sync with sky star
            const t = timeSec * p.bigStarShineSpeed * star.speedMult + star.phase;
            const harm1 = Math.sin(t * 1.35);
            const harm2 = Math.sin(t * 3.1 + star.phase * 2.1) * 0.4;
            const harm3 = Math.sin(t * 6.7 + star.phase * 4.3) * 0.2;
            const rawHarmonic = (harm1 + harm2 + harm3) / 1.6;
            const rawNorm = 0.5 + 0.5 * rawHarmonic;

            // Duty cycle: stays off more often than on (~62% off time) and disappears completely when off
            const threshold = 0.60;
            let scintillation = 0.0;
            if (rawNorm > threshold) {
              const u = (rawNorm - threshold) / (1.0 - threshold);
              scintillation = u * u * (3.0 - 2.0 * u);
            }

            if (scintillation <= 0.001) continue;

            const flarePulse = 0.6 + 0.48 * scintillation;
            const flareSize = p.bigStarFlareSize * star.scale * intensityScale * flarePulse;
            const reflAlpha = p.bigStarShineIntensity * (0.90 * scintillation) * star.scale * 0.75 * (masterReflOpacity / 0.8);

            if (reflAlpha <= 0.001 || flareSize <= 0.5) continue;

            reflCtx.save();
            reflCtx.globalCompositeOperation = 'screen';
            reflCtx.globalAlpha = Math.min(1.0, reflAlpha);

            // Specular light reflection ellipse
            const grad = reflCtx.createRadialGradient(
              starX,
              starWaterY,
              0,
              starX,
              starWaterY,
              flareSize * 1.8
            );
            grad.addColorStop(0, 'rgba(255,255,255,0.92)');
            grad.addColorStop(0.3, 'rgba(186,230,253,0.65)');
            grad.addColorStop(0.65, 'rgba(56,189,248,0.2)');
            grad.addColorStop(0.85, 'transparent');

            reflCtx.fillStyle = grad;
            reflCtx.beginPath();
            reflCtx.ellipse(starX, starWaterY, flareSize * 2.6, flareSize * 1.1, 0, 0, Math.PI * 2);
            reflCtx.fill();

            // Horizontal wave shimmer line for major stars
            if (star.scale >= 0.7) {
              const lineGrad = reflCtx.createLinearGradient(
                starX - flareSize * 1.8,
                starWaterY,
                starX + flareSize * 1.8,
                starWaterY
              );
              lineGrad.addColorStop(0, 'transparent');
              lineGrad.addColorStop(0.5, 'rgba(255,255,255,0.85)');
              lineGrad.addColorStop(1, 'transparent');
              reflCtx.fillStyle = lineGrad;
              reflCtx.fillRect(starX - flareSize * 1.5, starWaterY - 0.75, flareSize * 3.0, 1.5);
            }
            reflCtx.restore();
          }
        }

        // Reflected dynamic comet streak
        const streak = streakRef.current;
        if (streak) {
          const elapsed = now - streak.startTime;
          const streakProg = Math.min(1, elapsed / streak.duration);
          if (streakProg < 1) {
            const currentX = streak.startX + (streak.endX - streak.startX) * streakProg;
            const currentSkyY = streak.startY + (streak.endY - streak.startY) * streakProg;
            const waterProgY = Math.max(
              15,
              Math.min(
                waterHeight - 20,
                ((BG_HORIZON_Y - currentSkyY) / BG_HORIZON_Y) * waterHeight * 0.65 + 30
              )
            );
            const spriteImg = cache.get('comet-sprite');
            const streakAlpha = Math.sin(streakProg * Math.PI) * 0.7 * (masterReflOpacity / 0.8);

            if (spriteImg && spriteImg.complete && spriteImg.naturalWidth > 0) {
              reflCtx.save();
              reflCtx.globalCompositeOperation = 'screen';
              reflCtx.globalAlpha = streakAlpha;
              reflCtx.translate(currentX, waterProgY);
              reflCtx.rotate(32 * (Math.PI / 180));
              reflCtx.drawImage(spriteImg, -90, -45, 180, 90);
              reflCtx.restore();
            }
          }
        }

        // Fast direct single-blit or perspective wave distortion bands (Locked 60 FPS)
        ctx.save();
        // Clip to exact sloped horizon (y=725 at x=0 to y=835 at x=1920) matching layer-1.0-sea.webp
        // (Replaces flat ctx.rect(0, BG_HORIZON_Y, BG_CANVAS_WIDTH, waterHeight) to eliminate sky piercing)
        ctx.beginPath();
        ctx.moveTo(0, BG_HORIZON_Y);
        ctx.lineTo(BG_CANVAS_WIDTH, 835);
        ctx.lineTo(BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        ctx.lineTo(0, BG_CANVAS_HEIGHT);
        ctx.closePath();
        ctx.clip();

        let currentFilter = 'none';
        const reflBlendOp = getCompositeOperation(p.reflectionBlendMode ?? 'normal');

        if (!p.waterDistortionEnabled || activeWaterScale <= 0) {
          // Direct single-blit reflection plane for static mirror mode
          if (peakWaterBlur >= 0.2 && 'filter' in ctx) {
            ctx.filter = `blur(${peakWaterBlur.toFixed(2)}px)`;
            currentFilter = ctx.filter;
          }
          ctx.save();
          ctx.globalCompositeOperation = reflBlendOp;
          ctx.drawImage(reflCanvas, 0, BG_HORIZON_Y);
          ctx.restore();

          if (galaxyReflCanvas) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.drawImage(galaxyReflCanvas, 0, BG_HORIZON_Y);
            ctx.restore();
          }
        } else if (p.waterWaveMode === 'bands') {
          // Perspective-accurate non-linear wave bands (Post-assembly depth blur - zero slice edge halos)
          const NUM_BANDS = 32;
          const bandCount = Math.max(4, Math.min(128, Math.round(p.waterBandCount ?? NUM_BANDS)));
          const power = p.waterPerspectivePower ?? 3.0;
          const scale = activeWaterScale;
          const padY = p.waterBandOffset ?? 0.2; // Vertical band offset / overdraw padding (distance between 2 bands)
          const padX = Math.ceil(scale) + 4; // Horizontal overdraw padding to eliminate canvas edge gaps

          // Continuous boundary nodes mesh: pin horizon (725) and bottom (1187) with shared undulating nodes
          if (waterMeshNodesRef.current.length < bandCount + 1) {
            waterMeshNodesRef.current = new Float64Array(bandCount + 1);
          }
          const nodeY = waterMeshNodesRef.current;
          nodeY[0] = BG_HORIZON_Y;
          nodeY[bandCount] = BG_CANVAS_HEIGHT;

          for (let i = 1; i < bandCount; i++) {
            const v = Math.pow(i / bandCount, 1.35);
            const k = 6.0 / Math.pow(v + 0.35, 2);
            const p1 = waterPhaseTime * 2.6 - k;
            const p2 = waterPhaseTime * 4.1 - k * 1.55 + 1.3;
            const normWy = (Math.cos(p1) + Math.cos(p2) * 0.28) * 0.78;
            const A = scale * Math.pow(v, power);
            const dispY = A * 0.15 * normWy;
            nodeY[i] = BG_HORIZON_Y + v * waterHeight + dispY;
          }

          // Optical depth distribution tiers: blurRatio: 1.0 at distant horizon down to blurRatio: 0.0 at crisp foreground
          const BLUR_TIERS = [
            { blurRatio: 1.0 },
            { blurRatio: 0.55 },
            { blurRatio: 0.20 },
            { blurRatio: 0.0 },
          ];
          void BLUR_TIERS;

          // PASS 1: Assemble all wave bands crisp onto offscreen buffer (zero per-slice blur, zero edge halos)
          const distCanvas = distortedWaterCanvasRef.current;
          const distCtx = distCanvas?.getContext('2d');
          const targetDistCtx = distCtx || ctx;

          if (distCtx) {
            distCtx.clearRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
          }
          if (distGalaxyCtx) {
            distGalaxyCtx.clearRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
          }

          for (let b = 0; b < bandCount; b++) {
            const v0 = Math.pow(b / bandCount, 1.35);
            const v1 = Math.pow((b + 1) / bandCount, 1.35);
            const sy = v0 * waterHeight;
            const sh = (v1 - v0) * waterHeight;
            const vMid = (v0 + v1) * 0.5;
            const A = scale * Math.pow(vMid, power);
            const kPerspective = 6.0 / Math.pow(vMid + 0.35, 2);
            const phase1 = waterPhaseTime * 2.6 - kPerspective;
            const phase2 = waterPhaseTime * 4.1 - kPerspective * 1.55 + 1.3;
            const phase3 = waterPhaseTime * 5.8 - kPerspective * 2.3 + 2.7;

            const wave1 = Math.sin(phase1);
            const wave2 = Math.sin(phase2) * 0.35;
            const wave3 = Math.sin(phase3) * 0.15;
            const normWaveX = (wave1 + wave2 + wave3) / 1.5;
            const dispX = A * normWaveX;

            const dx = dispX - padX;
            const dy = distCtx ? (nodeY[b] - BG_HORIZON_Y) : nodeY[b];
            const dw = BG_CANVAS_WIDTH + padX * 2;
            const dh = (nodeY[b + 1] - nodeY[b]) + padY;

            targetDistCtx.drawImage(
              reflCanvas,
              0,
              sy,
              BG_CANVAS_WIDTH,
              sh,
              dx,
              dy,
              dw,
              dh
            );

            if (galaxyReflCanvas && distGalaxyCtx) {
              distGalaxyCtx.drawImage(
                galaxyReflCanvas,
                0,
                sy,
                BG_CANVAS_WIDTH,
                sh,
                dx,
                dy,
                dw,
                dh
              );
            }
          }

          // PASS 2: Composite assembled water surface onto main canvas with post-assembly depth blur
          if (distCanvas && distCtx) {
            // Blit crisp assembled distorted reflection with configurable reflection blend mode
            ctx.save();
            ctx.globalCompositeOperation = reflBlendOp;
            ctx.drawImage(distCanvas, 0, BG_HORIZON_Y);
            ctx.restore();

            // Blit distorted galaxy reflection with screen mode for radiant celestial luminescence
            if (distGalaxyCanvas) {
              ctx.save();
              ctx.globalCompositeOperation = 'screen';
              ctx.drawImage(distGalaxyCanvas, 0, BG_HORIZON_Y);
              ctx.restore();
            }

            // Post-assembly depth blur: smooth gradient blur overlay applied to the finished surface (zero slice edge halos)
            if (peakWaterBlur >= 0.2 && blurredWaterCanvasRef.current) {
              const blurCanvas = blurredWaterCanvasRef.current;
              const blurCtx = blurCanvas.getContext('2d');
              if (blurCtx && 'filter' in blurCtx) {
                blurCtx.clearRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
                blurCtx.filter = `blur(${peakWaterBlur.toFixed(2)}px)`;
                blurCtx.drawImage(distCanvas, 0, 0);
                blurCtx.filter = 'none';

                // Apply vertical depth falloff mask (100% at horizon, fading to 0% in foreground)
                blurCtx.save();
                blurCtx.globalCompositeOperation = 'destination-in';
                const maskGrad = blurCtx.createLinearGradient(0, 0, 0, waterHeight);
                maskGrad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
                maskGrad.addColorStop(0.30, 'rgba(0, 0, 0, 0.70)');
                maskGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.20)');
                maskGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
                blurCtx.fillStyle = maskGrad;
                blurCtx.fillRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
                blurCtx.restore();

                // Composite post-blurred horizon layer smoothly over crisp base with reflection blend mode
                ctx.save();
                ctx.globalCompositeOperation = reflBlendOp;
                ctx.drawImage(blurCanvas, 0, BG_HORIZON_Y);
                ctx.restore();

                // Depth blur overlay for galaxy reflection
                if (distGalaxyCanvas) {
                  blurCtx.clearRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
                  blurCtx.filter = `blur(${peakWaterBlur.toFixed(2)}px)`;
                  blurCtx.drawImage(distGalaxyCanvas, 0, 0);
                  blurCtx.filter = 'none';

                  blurCtx.save();
                  blurCtx.globalCompositeOperation = 'destination-in';
                  blurCtx.fillStyle = maskGrad;
                  blurCtx.fillRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
                  blurCtx.restore();

                  ctx.save();
                  ctx.globalCompositeOperation = 'screen';
                  ctx.drawImage(blurCanvas, 0, BG_HORIZON_Y);
                  ctx.restore();
                }
              }
            }
          }
        } else {
          // Continuous Whole-Raster Wave Dynamics (Zero Slicing, Zero Horizontal Band Seams)
          if (peakWaterBlur >= 0.2 && 'filter' in ctx) {
            ctx.filter = `blur(${peakWaterBlur.toFixed(2)}px)`;
            currentFilter = ctx.filter;
          }
          const scale = activeWaterScale;

          // 1. Perspective Horizon Anchor (origin at horizon center)
          const originX = BG_CANVAS_WIDTH * 0.5;
          const originY = BG_HORIZON_Y;

          // 2. Multi-harmonic Rolling Wave Drift & Lateral Sway
          const wavePhase = waterPhaseTime * 2.2;
          const driftX = (Math.sin(wavePhase * 1.2) * 0.70 + Math.cos(wavePhase * 2.3 + 0.8) * 0.30) * (scale * 0.35);
          const swellY = Math.sin(wavePhase * 1.5) * (scale * 0.08);

          // 3. Perspective Swell Breathing (anchored at horizon, swells towards observer)
          const swellMagnitude = 0.018 * Math.min(2.0, scale / 40);
          const breathX = 1.0 + swellMagnitude * (Math.sin(wavePhase * 1.4) * 0.65 + Math.cos(wavePhase * 2.8) * 0.35);
          const breathY = 1.0 + swellMagnitude * 1.4 * (Math.cos(wavePhase * 1.1) * 0.75 + Math.sin(wavePhase * 2.2) * 0.25);

          // Primary Continuous Whole-Raster Reflection Pass
          ctx.save();
          ctx.globalCompositeOperation = reflBlendOp;
          ctx.translate(originX + driftX, originY + swellY);
          ctx.scale(breathX, breathY);
          ctx.translate(-originX, -originY);
          ctx.drawImage(reflCanvas, 0, BG_HORIZON_Y);
          ctx.restore();

          if (galaxyReflCanvas) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.translate(originX + driftX, originY + swellY);
            ctx.scale(breathX, breathY);
            ctx.translate(-originX, -originY);
            ctx.drawImage(galaxyReflCanvas, 0, BG_HORIZON_Y);
            ctx.restore();
          }

          // 4. Secondary Ethereal Surface Shimmer Wave Pass (Harmonic wave interference without discrete slicing)
          const secondaryScale = scale / 40;
          if (secondaryScale > 0.05) {
            const secPhase = waterPhaseTime * 3.4 + 1.7;
            const secDriftX = Math.cos(secPhase * 1.3) * (scale * 0.22);
            const secSwellY = Math.sin(secPhase * 1.6) * (scale * 0.05);
            const secBreathX = 1.0 + swellMagnitude * 0.6 * Math.cos(secPhase * 1.5);
            const secBreathY = 1.0 + swellMagnitude * 0.8 * Math.sin(secPhase * 1.8);

            ctx.save();
            ctx.globalAlpha = Math.min(0.22, 0.12 * secondaryScale);
            ctx.globalCompositeOperation = 'screen';
            ctx.translate(originX + secDriftX, originY + secSwellY);
            ctx.scale(secBreathX, secBreathY);
            ctx.translate(-originX, -originY);
            ctx.drawImage(reflCanvas, 0, BG_HORIZON_Y);
            if (galaxyReflCanvas) {
              ctx.drawImage(galaxyReflCanvas, 0, BG_HORIZON_Y);
            }
            ctx.restore();
          }
        }

        if ('filter' in ctx && currentFilter !== 'none') {
          ctx.filter = 'none';
        }
        ctx.restore();
      }

      // Oceanic depth gradient overlay (rendered whenever sea layer is visible)
      if (seaVisible) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, BG_HORIZON_Y);
        ctx.lineTo(BG_CANVAS_WIDTH, 835);
        ctx.lineTo(BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        ctx.lineTo(0, BG_CANVAS_HEIGHT);
        ctx.closePath();
        ctx.clip();

        const waterGrad = ctx.createLinearGradient(0, BG_HORIZON_Y, 0, BG_CANVAS_HEIGHT);
        waterGrad.addColorStop(0, 'rgba(0, 24, 36, 0.0)');
        waterGrad.addColorStop(0.5, 'rgba(0, 20, 32, 0.03)');
        waterGrad.addColorStop(1.0, 'rgba(0, 16, 26, 0.06)');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, BG_HORIZON_Y, BG_CANVAS_WIDTH, waterHeight);
        ctx.restore();
      }

      // 3.5. Deep Space Active Dynamic Comet Streak (rendered behind clouds and mist)
      const streak = streakRef.current;
      if (streak) {
        const elapsed = now - streak.startTime;
        const progress = Math.min(1, elapsed / streak.duration);
        if (progress < 1) {
          const currentX = streak.startX + (streak.endX - streak.startX) * progress;
          const currentY = streak.startY + (streak.endY - streak.startY) * progress;
          const spriteImg = cache.get('comet-sprite');
          const streakAlpha = Math.sin(progress * Math.PI) * 0.95;

          if (spriteImg && spriteImg.complete && spriteImg.naturalWidth > 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = streakAlpha;
            ctx.translate(currentX, currentY);
            ctx.rotate(32 * (Math.PI / 180));
            ctx.drawImage(spriteImg, -90, -45, 180, 90);
            ctx.restore();
          }
        } else {
          streakRef.current = null;
        }
      }

      // 4. Render Upper Stack: Milky Way, Stars, Clouds, Mist, Meteor
      for (const layer of p.upperLayers) {
        const img = cache.get(layer.id);
        if (!img || !img.complete || img.naturalWidth === 0) continue;
        const { tx, ty } = getLayerOffset(layer);

        // Special case: Disperse Mist (layer-5.3) phased dispersion loop
        if (layer.id === 'layer-5.3') {
          if (!p.mistDisperseEnabled) {
            ctx.save();
            ctx.globalCompositeOperation = getCompositeOperation(layer.blendMode);
            ctx.globalAlpha = layer.opacity;
            ctx.drawImage(img, tx, ty, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
            ctx.restore();
            continue;
          }

          const count = Math.max(1, Math.min(3, p.mistInstances));
          const cyclePeriod = 21 / Math.max(0.2, p.mistDisperseSpeed);

          for (let i = 0; i < count; i++) {
            const delaySec = -(i * (cyclePeriod / count));
            const cycleTime = (((timeSec + delaySec) % cyclePeriod) + cyclePeriod) % cyclePeriod;
            const prog = cycleTime / cyclePeriod;

            // Interpolate lifecycle: opacity, drift, scale
            let phaseAlpha = 0;
            let mistDx = 0;
            let mistDy = 0;
            let mistScale = 1.0;

            if (prog < 0.25) {
              const t = prog / 0.25;
              phaseAlpha = t * 0.85;
              mistDx = -20 + t * 15;
              mistDy = 0 - t * 3;
              mistScale = 0.98 + t * 0.03;
            } else if (prog < 0.65) {
              const t = (prog - 0.25) / 0.4;
              phaseAlpha = 0.85 - t * 0.2;
              mistDx = -5 + t * 19;
              mistDy = -3 - t * 3;
              mistScale = 1.01 + t * 0.03;
            } else {
              const t = (prog - 0.65) / 0.35;
              phaseAlpha = 0.65 * (1 - t);
              mistDx = 14 + t * 18;
              mistDy = -6 - t * 3;
              mistScale = 1.04 + t * 0.04;
            }

            if (p.mistDistortionEnabled) {
              const mistWobble = Math.sin(timeSec * 0.6 + i * 1.5) * (p.mistDistortionScale * 0.4);
              mistDx += mistWobble;
            }

            ctx.save();
            ctx.globalCompositeOperation = getCompositeOperation(layer.blendMode);
            ctx.globalAlpha = layer.opacity * 0.9 * phaseAlpha;
            ctx.translate(BG_CANVAS_WIDTH / 2, BG_CANVAS_HEIGHT / 2);
            ctx.scale(mistScale, mistScale);
            ctx.translate(-BG_CANVAS_WIDTH / 2, -BG_CANVAS_HEIGHT / 2);
            ctx.drawImage(img, tx + mistDx, ty + mistDy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
            ctx.restore();
          }
          continue;
        }

        // Special case: Clouds (4.0, 4.1, 4.2) slow harmonic drift
        const isCloud = layer.category === 'clouds';
        let cx = tx;
        let cy = ty;

        if (isCloud && p.cloudDriftEnabled) {
          if (layer.id === 'layer-4.2') {
            const speed = 95 / Math.max(0.2, p.cloudDriftSpeed);
            cx += -12 * Math.sin((timeSec * 2 * Math.PI) / speed);
            cy += 2 * Math.sin((timeSec * 2 * Math.PI) / speed);
          } else {
            const speed = 80 / Math.max(0.2, p.cloudDriftSpeed);
            cx += 14 * Math.sin((timeSec * 2 * Math.PI) / speed);
            cy += -2 * Math.sin((timeSec * 2 * Math.PI) / speed);
          }
        }

        // Special case: Clouds (4.0, 4.1, 4.2) multi-zone organic billow distortion
        if (isCloud) {
          renderCloud(ctx, layer, img, cx, cy, layer.opacity, layer.blendMode, false);
          continue;
        }

        // Special case: Living Breathing Galaxy (Milky Way layers 2.0, 2.1, 2.2)
        if (layer.id === 'layer-2.0' || layer.id === 'layer-2.1' || layer.id === 'layer-2.2') {
          renderGalaxyLayer(ctx, layer, img, cx, cy, layer.opacity, layer.blendMode);
          continue;
        }

        ctx.save();
        ctx.globalCompositeOperation = getCompositeOperation(layer.blendMode);
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(img, cx, cy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        ctx.restore();
      }

      // 5. Natural Scintillation Flares for All Big Stars in Sky
      if (p.bigStarShineEnabled && p.bigStarLayer?.visible) {
        const { tx, ty } = getLayerOffset(p.bigStarLayer);
        const intensityScale = getStarFlareIntensityScale(p.bigStarShineIntensity, 0.15);

        for (let i = 0; i < bigStarsData.length; i++) {
          const star = bigStarsData[i];
          const starX = star.x + tx;
          const starY = star.y + ty;

          // Decorrelated multi-octave harmonic scintillation
          const t = timeSec * p.bigStarShineSpeed * star.speedMult + star.phase;
          const harm1 = Math.sin(t * 1.35);
          const harm2 = Math.sin(t * 3.1 + star.phase * 2.1) * 0.4;
          const harm3 = Math.sin(t * 6.7 + star.phase * 4.3) * 0.2;
          const rawHarmonic = (harm1 + harm2 + harm3) / 1.6;
          const rawNorm = 0.5 + 0.5 * rawHarmonic;

          // Duty cycle: stays off more often than on (~62% off time) and disappears completely when off
          const threshold = 0.60;
          let scintillation = 0.0;
          if (rawNorm > threshold) {
            const u = (rawNorm - threshold) / (1.0 - threshold);
            scintillation = u * u * (3.0 - 2.0 * u);
          }

          if (scintillation <= 0.001) continue;

          const flarePulse = 0.6 + 0.48 * scintillation;
          const flareRot = 0.05 * Math.sin(t * 0.9 + star.phase);

          const flareSize = p.bigStarFlareSize * star.scale * intensityScale * flarePulse;
          const flareAlpha = p.bigStarShineIntensity * scintillation;

          if (flareAlpha <= 0.001 || flareSize <= 0.5) continue;

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = Math.min(1.0, flareAlpha);
          ctx.translate(starX, starY);
          ctx.rotate(flareRot);

          // Luminescent core glow
          const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, flareSize * 1.4);
          coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
          coreGrad.addColorStop(0.25, 'rgba(186, 230, 253, 0.75)');
          coreGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.25)');
          coreGrad.addColorStop(0.85, 'transparent');
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(0, 0, flareSize * 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Diffraction cross rays for prominent stars (scale >= 0.6)
          if (star.scale >= 0.6) {
            const rayLen = flareSize * 1.3;
            const rayW = Math.max(0.75, Math.min(1.5, flareSize * 0.08));

            // Vertical diffraction ray
            const vertGrad = ctx.createLinearGradient(0, -rayLen, 0, rayLen);
            vertGrad.addColorStop(0, 'transparent');
            vertGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.92)');
            vertGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = vertGrad;
            ctx.fillRect(-rayW / 2, -rayLen, rayW, rayLen * 2);

            // Horizontal diffraction ray
            const horizGrad = ctx.createLinearGradient(-rayLen, 0, rayLen, 0);
            horizGrad.addColorStop(0, 'transparent');
            horizGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.92)');
            horizGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = horizGrad;
            ctx.fillRect(-rayLen, -rayW / 2, rayLen * 2, rayW);
          }

          // Diagonal 45° diffraction rays for anchor giant star (scale >= 0.92)
          if (star.scale >= 0.92) {
            ctx.save();
            ctx.rotate(Math.PI / 4);
            const diagRayLen = flareSize * 0.75;
            const diagGrad = ctx.createLinearGradient(-diagRayLen, 0, diagRayLen, 0);
            diagGrad.addColorStop(0, 'transparent');
            diagGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.7)');
            diagGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = diagGrad;
            ctx.fillRect(-diagRayLen, -0.5, diagRayLen * 2, 1);
            ctx.rotate(Math.PI / 2);
            ctx.fillRect(-diagRayLen, -0.5, diagRayLen * 2, 1);
            ctx.restore();
          }

          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, []);

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
