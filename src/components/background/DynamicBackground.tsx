import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { bgLayers, BG_HORIZON_RATIO } from '../../data/bgLayersData';
import { useParallax } from '../../hooks/useParallax';
import { BgLayerConfig } from '../../types/background';

export interface DynamicBackgroundProps {
  interactive?: boolean;
  parallaxIntensity?: number;
  reflectionEnabled?: boolean;
  waterDistortionEnabled?: boolean;
  waterReactiveMode?: boolean;
  waterRestingScale?: number;
  waterDistortionScale?: number;
  waterDistortionSpeed?: number;
  waterBlur?: number;
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
  parallaxIntensity = 1.0,
  reflectionEnabled = true,
  waterDistortionEnabled = true,
  waterReactiveMode = true,
  waterRestingScale = 0.0,
  waterDistortionScale = 18,
  waterDistortionSpeed = 1.0,
  waterBlur = 1.2,
  bigStarShineEnabled = true,
  bigStarShineIntensity = 1.0,
  bigStarShineSpeed = 1.0,
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
  shootingStarEnabled = true,
  useCleanComposite = false,
  layerOverrides = {},
  className = '',
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

  // Water dynamic wave excitation tracking (water is still until mouse passes through)
  const displacementMapRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const waveExcitationRef = useRef<number>(0);
  const lastMousePosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  // Horizon line percentage bit-matched to canvas (y = 725 / 1187)
  const horizonPercent = BG_HORIZON_RATIO * 100; // ~61.0783%

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
        const horizonClientY = canvasHeight * BG_HORIZON_RATIO;
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

  // Smooth wave settling / decay loop
  useEffect(() => {
    if (!waterDistortionEnabled) {
      if (displacementMapRef.current) {
        displacementMapRef.current.setAttribute('scale', '0');
      }
      return;
    }

    let animationId: number;
    let lastTick = performance.now();

    const updateWaves = (now: number) => {
      const dt = Math.min(0.1, (now - lastTick) / 1000);
      lastTick = now;

      if (waterReactiveMode) {
        // Exponential decay towards 0 (settles back to glassy stillness)
        waveExcitationRef.current *= Math.exp(-dt * 2.5);
        if (waveExcitationRef.current < 0.02) waveExcitationRef.current = 0;

        const effectiveScale = waterRestingScale + waveExcitationRef.current;
        if (displacementMapRef.current) {
          displacementMapRef.current.setAttribute('scale', effectiveScale.toFixed(2));
        }
      } else {
        if (displacementMapRef.current) {
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
      let visible = override?.visible !== undefined ? override.visible : layer.defaultVisible;
      if (layer.id === 'layer-4.1') {
        visible = turmoilEnabled;
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
    const tx = motion.x * layer.parallaxFactor.x * 45;
    const ty = motion.y * layer.parallaxFactor.y * 30 - (motion.scrollY * layer.parallaxFactor.y * 0.12);
    return `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0px)`;
  };

  // Render Big Star natural shining flare
  const renderBigStarFlare = (isReflected: boolean = false) => {
    if (!bigStarShineEnabled) return null;
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
        </defs>
      </svg>

      {/* 2. Aspect-Ratio Locked Master Canvas (Exact 1920:1187 Alignment Across All Screens) */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none"
        style={{
          width: 'max(104vw, calc(104vh * 1920 / 1187))',
          height: 'max(104vh, calc(104vw * 1187 / 1920))',
          aspectRatio: '1920 / 1187',
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
                  clipPath: `inset(${horizonPercent}% 0 0 0)`,
                  filter: waterDistortionEnabled ? 'url(#water-distortion)' : undefined,
                }}
              >
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    transformOrigin: `50% ${horizonPercent}%`,
                    transform: 'scaleY(-1)',
                    opacity: 0.78,
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

                    return (
                      <div
                        key={`refl-${layer.id}`}
                        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
                        style={{
                          transform: getTransform(layer),
                        }}
                      >
                        <img
                          src={`${cleanBase}bg-layers/${layer.filename}`}
                          alt={`${layer.name} Reflection`}
                          className="w-full h-full object-cover"
                          style={{
                            mixBlendMode: layer.blendMode,
                            opacity: (layer.reflectionOpacity ?? 0.75) * layer.opacity,
                            filter: isCloud && cloudDistortionEnabled ? 'url(#cloud-distortion)' : undefined,
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
                        src={`${cleanBase}bg-layers/shooting-sprite.webp`}
                        alt="Shooting Star Reflection"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,210,235,0.7)]"
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
                  <React.Fragment key="mist-disperse-group">
                    {Array.from({ length: count }).map((_, index) => {
                      const delaySec = (-(index * (cyclePeriod / count))).toFixed(2);
                      return (
                        <div
                          key={`mist-instance-${index}`}
                          className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
                          style={{
                            transform: getTransform(layer),
                          }}
                        >
                          <img
                            src={`${cleanBase}bg-layers/${layer.filename}`}
                            alt={`${layer.name} Phased Instance ${index + 1}`}
                            className="w-full h-full object-cover pointer-events-none"
                            style={{
                              mixBlendMode: layer.blendMode,
                              opacity: layer.opacity * 0.9,
                              filter: mistDistortionEnabled ? 'url(#mist-distortion)' : undefined,
                              animation: `mistDisperseCycle ${cyclePeriod.toFixed(1)}s ease-in-out ${delaySec}s infinite`,
                            }}
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                      );
                    })}
                  </React.Fragment>
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

              return (
                <div
                  key={layer.id}
                  className="absolute inset-0 w-full h-full pointer-events-none will-change-transform transition-opacity duration-700"
                  style={{
                    transform: getTransform(layer),
                    opacity: layer.opacity,
                  }}
                >
                  <img
                    src={`${cleanBase}bg-layers/${layer.filename}`}
                    alt={layer.name}
                    className="w-full h-full object-cover"
                    style={{
                      mixBlendMode: layer.blendMode,
                      filter: isCloud && cloudDistortionEnabled ? 'url(#cloud-distortion)' : undefined,
                      animation: cloudDriftAnim,
                    }}
                    loading="eager"
                    decoding="async"
                  />
                </div>
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
                  src={`${cleanBase}bg-layers/shooting-sprite.webp`}
                  alt="Shooting Star"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]"
                />
              </div>
            )}

            {/* 8. Water Surface Distortion & Depth Gradient */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                top: `${horizonPercent}%`,
                backdropFilter: `blur(${waterBlur}px)`,
                WebkitBackdropFilter: `blur(${waterBlur}px)`,
                background:
                  'linear-gradient(180deg, rgba(2, 19, 25, 0.10) 0%, rgba(2, 22, 29, 0.35) 45%, rgba(1, 14, 18, 0.70) 100%)',
              }}
            />
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
