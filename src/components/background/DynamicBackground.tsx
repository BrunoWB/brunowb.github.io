import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { bgLayers, BG_HORIZON_RATIO, BG_HORIZON_Y, BG_CANVAS_HEIGHT } from '../../data/bgLayersData';
import { useParallax } from '../../hooks/useParallax';
import { BgLayerConfig, ReflectionBlendMode } from '../../types/background';
import {
  computeLevelsTableValues,
  computeVibranceSaturationMatrix,
} from '../../utils/colorGrading';

export interface DynamicBackgroundProps {
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
  waterBlur?: number;
  waterBlurTransitionSpeed?: number;
  waterFarBackBlur?: number;
  waterWaveMode?: 'continuous' | 'bands';
  waterBandCount?: number;
  waterBandOffset?: number;
  blurTransitionSpeed?: number; // alias
  farBackBlurPeak?: number; // alias
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
  useCleanComposite?: boolean;
  layerOverrides?: Record<string, { visible?: boolean; opacity?: number }>;
  className?: string;
  canvasOffsetY?: number;
  onShootingStarTrigger?: () => void;
}

interface ActiveStreak {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
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
  waterReactiveMode = true,
  waterRestingScale = 0.0,
  waterDistortionScale = 18,
  waterDistortionSpeed = 1.0,
  waterBlur = 0,
  waterBlurTransitionSpeed = 1.8,
  waterFarBackBlur = 0.0,
  waterWaveMode: _waterWaveMode = 'bands',
  waterBandCount: _waterBandCount = 50,
  waterBandOffset: _waterBandOffset = 0.2,
  blurTransitionSpeed,
  farBackBlurPeak,
  bigStarShineEnabled = true,
  bigStarShineIntensity = 1.0,
  bigStarShineSpeed = 0.4,
  bigStarFlareSize = 28,
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
  useCleanComposite = false,
  layerOverrides = {},
  className = '',
  canvasOffsetY = 0,
}) => {
  const motion = useParallax({
    enabled: interactive,
    intensity: parallaxIntensity,
    smoothness: 0.08,
    autoDrift: true,
  });

  const [activeStreak, setActiveStreak] = useState<ActiveStreak | null>(null);
  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

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

  // Water dynamic wave excitation tracking (water is still until mouse passes through)
  const displacementMapRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const waveExcitationRef = useRef<number>(0);
  const lastMousePosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Horizon line percentage bit-matched to canvas (y = 725 / 1187)
  const horizonPercent = BG_HORIZON_RATIO * 100; // ~61.0783%

  const resolvedBlurTransitionSpeed = blurTransitionSpeed ?? waterBlurTransitionSpeed ?? 1.8;
  const resolvedFarBackBlur = farBackBlurPeak ?? waterFarBackBlur ?? 0.0;
  const blurTransitionDuration = (1.2 / Math.max(0.2, resolvedBlurTransitionSpeed)).toFixed(2);

  // Track mouse movement to excite water waves when mouse moves or passes through water
  useEffect(() => {
    if (!interactive || !waterDistortionEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastMousePosRef.current.time);
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const dist = Math.hypot(dx, dy);
      const speed = dist / dt; // pixels per ms

      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };

      if (waterReactiveMode) {
        const windowHeight = window.innerHeight || 1;
        const windowWidth = window.innerWidth || 1;
        const canvasHeight = Math.max(windowHeight, windowWidth * (1187 / 1920));
        const canvasWidth = Math.max(windowWidth, windowHeight * (1920 / 1187));
        const canvasLeft = (windowWidth - canvasWidth) / 2;
        const canvasTop = (windowHeight - canvasHeight) / 2 + (canvasOffsetY ?? 0);
        const normX = Math.max(0, Math.min(1, (e.clientX - canvasLeft) / canvasWidth));
        const horizonClientY = canvasTop + canvasHeight * ((BG_HORIZON_Y + normX * (835 - BG_HORIZON_Y)) / BG_CANVAS_HEIGHT);
        const inWaterZone = e.clientY >= horizonClientY;

        // Water only reacts when mouse is physically passing through the water zone
        if (inWaterZone) {
          const impulse = Math.min(waterDistortionScale, speed * 28);
          waveExcitationRef.current = Math.min(
            waterDistortionScale,
            waveExcitationRef.current + impulse * 0.6
          );
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, waterDistortionEnabled, waterReactiveMode, waterDistortionScale]);

  // Smooth wave settling / decay loop (throttled DOM mutations to prevent GPU filter thrashing)
  useEffect(() => {
    if (!waterDistortionEnabled) {
      if (displacementMapRef.current) {
        displacementMapRef.current.setAttribute('scale', '0');
      }
      return;
    }

    let animationId: number;
    let lastTick = performance.now();
    let lastAppliedScale = -1;

    const updateWaves = (now: number) => {
      const dt = Math.min(0.1, (now - lastTick) / 1000);
      lastTick = now;

      if (waterReactiveMode) {
        // Exponential decay towards 0 (settles back to glassy stillness)
        waveExcitationRef.current *= Math.exp(-dt * 2.5);
        if (waveExcitationRef.current < 0.02) waveExcitationRef.current = 0;

        const effectiveScale = waterRestingScale + waveExcitationRef.current;
        if (displacementMapRef.current && Math.abs(effectiveScale - lastAppliedScale) >= 0.02) {
          lastAppliedScale = effectiveScale;
          displacementMapRef.current.setAttribute('scale', effectiveScale.toFixed(2));
        }
      } else {
        if (displacementMapRef.current && lastAppliedScale !== waterDistortionScale) {
          lastAppliedScale = waterDistortionScale;
          displacementMapRef.current.setAttribute('scale', String(waterDistortionScale));
        }
      }

      animationId = requestAnimationFrame(updateWaves);
    };

    animationId = requestAnimationFrame(updateWaves);
    return () => cancelAnimationFrame(animationId);
  }, [waterDistortionEnabled, waterReactiveMode, waterRestingScale, waterDistortionScale]);

  // Compute resolved layer states
  const resolvedLayers = useMemo(() => {
    return bgLayers.map((layer) => {
      const override = layerOverrides[layer.id];
      let visible: boolean;
      if (override?.visible !== undefined) {
        visible = override.visible;
      } else if (layer.id === 'layer-4.1') {
        visible = turmoilEnabled;
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
  }, [layerOverrides, turmoilEnabled]);

  // Base layers: 0.0 (Sky gradient), 0.1 (Deep space darkening), 1.0 (Sea)
  const baseLayers = useMemo(() => {
    return resolvedLayers.filter((l) => l.depth <= 1.0 && l.visible);
  }, [resolvedLayers]);

  // Upper layers: 2.0+ (Milky way, stars, clouds, mist, static shooting stars)
  const upperLayers = useMemo(() => {
    return resolvedLayers.filter((l) => l.depth > 1.0 && l.visible);
  }, [resolvedLayers]);

  // Reflected sky layers: upper layers that have hasReflection = true
  const reflectedLayers = useMemo(() => {
    return resolvedLayers.filter((l) => l.hasReflection && l.visible);
  }, [resolvedLayers]);

  // Big star reference for matching parallax
  const bigStarLayer = useMemo(() => {
    return bgLayers.find((l) => l.id === 'layer-3.0') || bgLayers[7];
  }, []);

  // Dynamic shooting star trigger
  const triggerShootingStar = useCallback(() => {
    if (activeStreak) return;
    const startX = 65 + Math.random() * 25; // 65% to 90%
    const startY = 5 + Math.random() * 20; // 5% to 25%
    const length = 25 + Math.random() * 15; // 25% to 40% distance
    const angle = 35 * (Math.PI / 180); // ~35 degree dive

    const endX = startX - Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;

    const streakId = Date.now();
    setActiveStreak({
      id: streakId,
      startX,
      startY,
      endX,
      endY,
      progress: 0,
    });

    const startTime = performance.now();
    const duration = 1100; // ms

    const animateStreak = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      if (p < 1) {
        setActiveStreak((prev) => (prev?.id === streakId ? { ...prev, progress: p } : prev));
        requestAnimationFrame(animateStreak);
      } else {
        setActiveStreak((prev) => (prev?.id === streakId ? null : prev));
      }
    };

    requestAnimationFrame(animateStreak);
  }, [activeStreak]);

  // Periodic automatic shooting stars
  useEffect(() => {
    if (!shootingStarEnabled) return;
    const intervalTime = 12000 + Math.random() * 8000;
    const timer = setInterval(() => {
      triggerShootingStar();
    }, intervalTime);
    return () => clearInterval(timer);
  }, [shootingStarEnabled, triggerShootingStar]);

  // Helper for computing parallax transform (pure translation to maintain coordinate and horizon registration)
  const getTransform = (layer: BgLayerConfig) => {
    const motionX = reverseHorizontalParallax ? -motion.x : motion.x;
    const tx = motionX * layer.parallaxFactor.x * 45;
    const ty = motion.y * layer.parallaxFactor.y * 30 - (motion.scrollY * layer.parallaxFactor.y * 0.12);
    return `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0px)`;
  };

  // Render Big Star natural shining flare
  const renderBigStarFlare = (isReflected: boolean = false) => {
    if (!bigStarShineEnabled) return null;
    const starLayer = resolvedLayers.find((l) => l.id === 'layer-3.0');
    if (starLayer && !starLayer.visible) return null;
    const size = bigStarFlareSize;
    const speedSec = (4.8 / Math.max(0.2, bigStarShineSpeed)).toFixed(2);
    const opacity = bigStarShineIntensity * (isReflected ? 0.75 : 1.0);

    if (isReflected) {
      // Specular aquatic reflection column shimmering on water surface below the star
      return (
        <div
          className="absolute pointer-events-none"
          style={{
            left: '59.45%', // x = 1141.5 px on 1920 canvas
            top: '66.5%',   // on water surface below horizon (y=725 px)
            transform: getTransform(bigStarLayer),
            opacity: opacity * 0.75,
            mixBlendMode: 'screen',
          }}
        >
          <div
            className="relative"
            style={{
              animation: `starScintillation ${speedSec}s ease-in-out infinite`,
            }}
          >
            {/* Elongated specular light reflection along wave ripples */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: `${size * 2.8}px`,
                height: `${size * 1.2}px`,
                background:
                  'radial-gradient(ellipse at center, rgba(255,255,255,0.92) 0%, rgba(186,230,253,0.65) 30%, rgba(56,189,248,0.2) 65%, transparent 80%)',
                filter: 'blur(1px)',
              }}
            />
            {/* Horizontal wave reflection shimmer line */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: `${size * 3.4}px`,
                height: '2px',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)',
                filter: 'drop-shadow(0 0 4px rgba(186,230,253,0.85))',
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: '59.45%', // x = 1141.5 px on 1920 canvas
          top: '13.86%',  // y = 164.5 px on 1187 canvas
          transform: getTransform(bigStarLayer),
          opacity,
        }}
      >
        <div
          className="relative"
          style={{
            animation: `starScintillation ${speedSec}s ease-in-out infinite`,
          }}
        >
          {/* Core White/Cyan Luminescence */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: `${size * 2}px`,
              height: `${size * 2}px`,
              background:
                'radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(186,230,253,0.75) 20%, rgba(56,189,248,0.25) 50%, transparent 70%)',
            }}
          />

          {/* Primary Vertical Diffraction Ray */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: '1.5px',
              height: `${size * 2.8}px`,
              background:
                'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.95) 50%, transparent 100%)',
              filter: 'drop-shadow(0 0 3px rgba(186,230,253,0.8))',
            }}
          />

          {/* Primary Horizontal Diffraction Ray */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: `${size * 2.8}px`,
              height: '1.5px',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 50%, transparent 100%)',
              filter: 'drop-shadow(0 0 3px rgba(186,230,253,0.8))',
            }}
          />

          {/* Diagonal 45° Diffraction Spike */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rotate-45 pointer-events-none"
            style={{
              width: `${size * 1.5}px`,
              height: '1px',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(186,230,253,0.7) 50%, transparent 100%)',
            }}
          />
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none"
            style={{
              width: `${size * 1.5}px`,
              height: '1px',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(186,230,253,0.7) 50%, transparent 100%)',
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* 1. SVG Filter Definitions: Water Ripple, Cloud Organic Morph, Mist Curl */}
      <svg className="sr-only" aria-hidden="true" width="0" height="0">
        <defs>
          {/* Water Surface Ripple Distortion */}
          <filter
            id="water-distortion"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`0.012 ${0.038 * waterDistortionSpeed}`}
              numOctaves="2"
              result="noise"
              seed="5"
            >
              <animate
                attributeName="baseFrequency"
                dur={`${10 / Math.max(0.2, waterDistortionSpeed)}s`}
                values={`0.012 ${0.038 * waterDistortionSpeed};0.015 ${0.052 * waterDistortionSpeed};0.010 ${0.032 * waterDistortionSpeed};0.012 ${0.038 * waterDistortionSpeed}`}
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              ref={displacementMapRef}
              in="SourceGraphic"
              in2="noise"
              scale={waterDistortionEnabled ? (waterReactiveMode ? waterRestingScale : waterDistortionScale) : 0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Cloud Super-Slow Organic Morphing Distortion */}
          <filter
            id="cloud-distortion"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.005"
              numOctaves="2"
              result="cloudNoise"
              seed="12"
            >
              <animate
                attributeName="baseFrequency"
                dur={`${45 / Math.max(0.2, cloudMorphSpeed)}s`}
                values="0.003 0.005;0.0042 0.007;0.0026 0.0042;0.003 0.005"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="cloudNoise"
              scale={cloudDistortionEnabled ? cloudDistortionScale : 0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Mist Gaseous Dissipation & Curl Distortion */}
          <filter
            id="mist-distortion"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005 0.009"
              numOctaves="2"
              result="mistNoise"
              seed="23"
            >
              <animate
                attributeName="baseFrequency"
                dur={`${22 / Math.max(0.2, mistDisperseSpeed)}s`}
                values="0.005 0.009;0.007 0.013;0.004 0.007;0.005 0.009"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="mistNoise"
              scale={mistDistortionEnabled ? mistDistortionScale : 0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Master Post-Processing: Photoshop Vibrance & Levels */}
          <filter
            id="dynamic-color-grading"
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

      {/* 2. Aspect-Ratio Locked Master Canvas (Exact 1920:1187 Alignment Across All Screens) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 'max(105vw, calc(105vh * 1920 / 1187))',
          height: 'max(105vh, calc(105vw * 1187 / 1920))',
          aspectRatio: '1920 / 1187',
          isolation: 'isolate',
          backgroundColor: '#021319',
          top: canvasOffsetY ? `calc(50% + ${canvasOffsetY}px)` : undefined,
          filter: colorGradingEnabled && !useCleanComposite ? 'url(#dynamic-color-grading)' : undefined,
        }}
      >
        {useCleanComposite ? (
          <img
            src={`${cleanBase}bg-layers/bgclean.webp`}
            alt="Original Composite Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            {/* 3. Base Stack: Sky Gradient (0.0), Deep Space (0.1), Sea (1.0) */}
            {baseLayers.map((layer) => (
              <img
                key={layer.id}
                src={`${cleanBase}bg-layers/${layer.filename}`}
                alt={layer.name}
                className="absolute inset-0 w-full h-full object-cover will-change-transform transition-opacity duration-700"
                style={{
                  mixBlendMode: layer.blendMode,
                  opacity: layer.opacity,
                  transform: getTransform(layer),
                }}
                loading="eager"
                decoding="async"
              />
            ))}

            {/* 4. The Water Reflection Plane (Mirrors sky objects into the water across the horizon) */}
            {reflectionEnabled && (
              <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  clipPath: 'polygon(0% 61.078%, 100% 70.345%, 100% 100%, 0% 100%)',
                  filter: waterDistortionEnabled ? 'url(#water-distortion)' : undefined,
                }}
              >
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    transformOrigin: `50% ${horizonPercent}%`,
                    transform: 'scaleY(-1)',
                    opacity: 0.78 * (reflectionOpacity / 0.8),
                    mixBlendMode: reflectionBlendMode !== 'normal' ? (reflectionBlendMode as React.CSSProperties['mixBlendMode']) : undefined,
                  }}
                >
                  {reflectedLayers.map((layer) => {
                    const isCloud = layer.category === 'clouds';
                    const cloudDriftAnim =
                      isCloud && cloudDriftEnabled
                        ? layer.id === 'layer-4.2'
                          ? `cloudHarmonicDriftRight ${(95 / Math.max(0.2, cloudDriftSpeed)).toFixed(1)}s ease-in-out infinite`
                          : `cloudHarmonicDriftLeft ${(80 / Math.max(0.2, cloudDriftSpeed)).toFixed(1)}s ease-in-out infinite`
                        : undefined;

                    if (!isCloud) {
                      return (
                        <img
                          key={`refl-${layer.id}`}
                          src={`${cleanBase}bg-layers/${layer.filename}`}
                          alt={`${layer.name} Reflection`}
                          className="absolute inset-0 w-full h-full object-cover will-change-transform"
                          style={{
                            mixBlendMode: layer.blendMode,
                            opacity: (layer.reflectionOpacity ?? 0.75) * layer.opacity,
                            transform: getTransform(layer),
                          }}
                          loading="lazy"
                          decoding="async"
                        />
                      );
                    }

                    return (
                      <div
                        key={`refl-${layer.id}`}
                        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
                        style={{
                          transform: getTransform(layer),
                          mixBlendMode: layer.blendMode,
                        }}
                      >
                        <img
                          src={`${cleanBase}bg-layers/${layer.filename}`}
                          alt={`${layer.name} Reflection`}
                          className="w-full h-full object-cover"
                          style={{
                            opacity: (layer.reflectionOpacity ?? 0.75) * layer.opacity,
                            animation: cloudDriftAnim,
                          }}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    );
                  })}

                  {/* Reflected Big Star Natural Shine */}
                  {renderBigStarFlare(true)}

                  {/* Reflected Dynamic Shooting Star */}
                  {activeStreak && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        left: `${activeStreak.startX + (activeStreak.endX - activeStreak.startX) * activeStreak.progress}%`,
                        top: `${activeStreak.startY + (activeStreak.endY - activeStreak.startY) * activeStreak.progress}%`,
                        width: '180px',
                        height: '90px',
                        transform: 'translate(-50%, -50%) rotate(32deg)',
                        opacity: Math.sin(activeStreak.progress * Math.PI) * 0.7,
                        mixBlendMode: 'screen',
                      }}
                    >
                      <img
                        src={`${cleanBase}bg-layers/comet-sprite.webp`}
                        alt="Comet Streak Reflection"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. Upper Stack: Milky Way, Stars, Clouds, Mist, Meteor */}
            {upperLayers.map((layer) => {
              // Special case 1: Disperse Mist (5.3) multi-instance calm dispersion loop
              if (layer.id === 'layer-5.3') {
                if (!mistDisperseEnabled) {
                  return (
                    <img
                      key={layer.id}
                      src={`${cleanBase}bg-layers/${layer.filename}`}
                      alt={layer.name}
                      className="absolute inset-0 w-full h-full object-cover will-change-transform transition-opacity duration-700"
                      style={{
                        mixBlendMode: layer.blendMode,
                        opacity: layer.opacity,
                        transform: getTransform(layer),
                        filter: mistDistortionEnabled ? 'url(#mist-distortion)' : undefined,
                      }}
                      loading="eager"
                      decoding="async"
                    />
                  );
                }

                // Render overlapping phased mist instances with decoupled parallax and keyframe transform
                const cyclePeriod = 21 / Math.max(0.2, mistDisperseSpeed);
                const count = Math.max(1, Math.min(3, mistInstances));

                return (
                  <div
                    key="mist-disperse-group"
                    className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
                    style={{
                      transform: getTransform(layer),
                      mixBlendMode: layer.blendMode,
                      filter: mistDistortionEnabled ? 'url(#mist-distortion)' : undefined,
                    }}
                  >
                    {Array.from({ length: count }).map((_, index) => {
                      const delaySec = (-(index * (cyclePeriod / count))).toFixed(2);
                      return (
                        <img
                          key={`mist-instance-${index}`}
                          src={`${cleanBase}bg-layers/${layer.filename}`}
                          alt={`${layer.name} Phased Instance ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          style={{
                            opacity: layer.opacity * 0.9,
                            animation: `mistDisperseCycle ${cyclePeriod.toFixed(1)}s ease-in-out ${delaySec}s infinite`,
                          }}
                          loading="eager"
                          decoding="async"
                        />
                      );
                    })}
                  </div>
                );
              }

              // Special case 2: Clouds (4.0, 4.1, 4.2) slow ambient drift & organic morphing
              const isCloud = layer.category === 'clouds';
              const cloudDriftAnim =
                isCloud && cloudDriftEnabled
                  ? layer.id === 'layer-4.2'
                    ? `cloudHarmonicDriftRight ${(95 / Math.max(0.2, cloudDriftSpeed)).toFixed(1)}s ease-in-out infinite`
                    : `cloudHarmonicDriftLeft ${(80 / Math.max(0.2, cloudDriftSpeed)).toFixed(1)}s ease-in-out infinite`
                  : undefined;

              if (isCloud) {
                return (
                  <div
                    key={layer.id}
                    className="absolute inset-0 w-full h-full pointer-events-none will-change-transform transition-opacity duration-700"
                    style={{
                      transform: getTransform(layer),
                      opacity: layer.opacity,
                      mixBlendMode: layer.blendMode,
                    }}
                  >
                    <img
                      src={`${cleanBase}bg-layers/${layer.filename}`}
                      alt={layer.name}
                      className="w-full h-full object-cover"
                      style={{
                        filter: cloudDistortionEnabled ? 'url(#cloud-distortion)' : undefined,
                        animation: cloudDriftAnim,
                      }}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                );
              }

              // Standard upper layers (Milky Way, Stars, Mist, Meteors):
              // Render directly as <img> (matching baseLayers) so mixBlendMode: screen / color-dodge
              // blends directly against the canvas backdrop without being trapped in an isolated wrapper <div>
              return (
                <img
                  key={layer.id}
                  src={`${cleanBase}bg-layers/${layer.filename}`}
                  alt={layer.name}
                  className="absolute inset-0 w-full h-full object-cover will-change-transform transition-opacity duration-700"
                  style={{
                    mixBlendMode: layer.blendMode,
                    opacity: layer.opacity,
                    transform: getTransform(layer),
                  }}
                  loading="eager"
                  decoding="async"
                />
              );
            })}

            {/* 6. Big Star Natural Luminous Scintillation Flare */}
            {renderBigStarFlare(false)}

            {/* 7. Active Dynamic Shooting Star in Sky */}
            {activeStreak && (
              <div
                className="absolute pointer-events-none transition-opacity duration-150"
                style={{
                  left: `${activeStreak.startX + (activeStreak.endX - activeStreak.startX) * activeStreak.progress}%`,
                  top: `${activeStreak.startY + (activeStreak.endY - activeStreak.startY) * activeStreak.progress}%`,
                  width: '180px',
                  height: '90px',
                  transform: 'translate(-50%, -50%) rotate(32deg)',
                  opacity: Math.sin(activeStreak.progress * Math.PI) * 0.95,
                  mixBlendMode: 'screen',
                }}
              >
                <img
                  src={`${cleanBase}bg-layers/comet-sprite.webp`}
                  alt="Comet Streak"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* 8. Water Surface Distortion & Depth Gradient (Only rendered when sea layer is visible) */}
            {(!resolvedLayers.find((l) => l.id === 'layer-1.0') || resolvedLayers.find((l) => l.id === 'layer-1.0')?.visible) && (
              <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  clipPath: 'polygon(0% 61.078%, 100% 70.345%, 100% 100%, 0% 100%)',
                }}
              >
                {/* 8a. Far-Back Horizon Depth Blur Layer (increased blur on the far back near the horizon) */}
                {resolvedFarBackBlur > 0 && (
                  <div
                    className="absolute inset-x-0 pointer-events-none will-change-[backdrop-filter]"
                    style={{
                      top: `${horizonPercent}%`,
                      height: '45%',
                      backdropFilter: `blur(${resolvedFarBackBlur}px)`,
                      WebkitBackdropFilter: `blur(${resolvedFarBackBlur}px)`,
                      maskImage:
                        'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)',
                      WebkitMaskImage:
                        'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 100%)',
                      transition: `backdrop-filter ${blurTransitionDuration}s ease-out, -webkit-backdrop-filter ${blurTransitionDuration}s ease-out`,
                    }}
                  />
                )}

                {/* 8b. Water Surface Distortion & Depth Gradient */}
                <div
                  className="absolute inset-x-0 bottom-0 pointer-events-none will-change-[backdrop-filter]"
                  style={{
                    top: `${horizonPercent}%`,
                    backdropFilter: waterBlur > 0 ? `blur(${waterBlur}px)` : undefined,
                    WebkitBackdropFilter: waterBlur > 0 ? `blur(${waterBlur}px)` : undefined,
                    transition: `backdrop-filter ${blurTransitionDuration}s ease-out, -webkit-backdrop-filter ${blurTransitionDuration}s ease-out`,
                    background:
                      'linear-gradient(180deg, rgba(0, 24, 36, 0.0) 0%, rgba(0, 20, 32, 0.03) 50%, rgba(0, 16, 26, 0.06) 100%)',
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* 9. Light Theme Ambient Lighting Scrim */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background:
              'linear-gradient(180deg, rgba(240, 248, 255, 0.55) 0%, rgba(228, 244, 250, 0.72) 65%, rgba(215, 238, 246, 0.88) 100%)',
            opacity: 'var(--bg-light-tint-opacity, 0)',
          }}
        />
      </div>
    </div>
  );
};

export default DynamicBackground;
