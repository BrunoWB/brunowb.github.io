import { useEffect, useRef, useCallback } from 'react';
import {
  bgLayers,
  BG_CANVAS_WIDTH,
  BG_CANVAS_HEIGHT,
  BG_HORIZON_Y,
} from '../../../../data/bgLayersData';
import { useParallax } from '../../../../hooks/useParallax';
import { BgLayerConfig } from '../../../../types/background';
import { ActiveStreak, ResolvedCanvasParams } from '../types';
import { getCompositeOperation } from '../renderers/helpers';
import { renderCometTail, renderCometCore } from '../renderers/cometRenderer';
import { renderGalaxyLayer } from '../renderers/galaxyRenderer';
import { renderCloud } from '../renderers/cloudRenderer';
import { renderMistDispersal } from '../renderers/mistRenderer';
import {
  renderBigStarsFlares,
  renderBigStarsReflection,
  renderShootingStarStreak,
} from '../renderers/starsRenderer';
import {
  renderWaterSurface,
  renderOceanicDepthGradient,
} from '../renderers/waterRenderer';

export function useCanvasEngine(
  params: ResolvedCanvasParams,
  onShootingStarTrigger?: () => void,
  onCometTrigger?: () => void
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reflectionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const distortedWaterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const blurredWaterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const galaxyReflectionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const distortedGalaxyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cometFlameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cometPulseCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const motionRef = useParallax({
    enabled: params.interactive,
    intensity: 0.5,
    smoothness: 0.08,
    autoDrift: true,
  });

  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const imagesLoadedRef = useRef<boolean>(false);
  const streakRef = useRef<ActiveStreak | null>(null);
  const waterMeshNodesRef = useRef<Float64Array>(new Float64Array(256));

  const waterExcitationRef = useRef<number>(0);
  const waterPhaseRef = useRef<number>(0);
  const waterBlurSmoothedRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(performance.now());

  const fpsStatsRef = useRef({
    frames: 0,
    lastTime: performance.now(),
    fps: 60,
    frameTime: 16.6,
  });

  const animParamsRef = useRef(params);

  animParamsRef.current = params;

  // Water excitation listeners
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

  // Preload layer images
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

  // Shooting star trigger
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

  const updateRunningStateRef = useRef<(() => void) | null>(null);

  // Periodic automatic shooting stars
  useEffect(() => {
    if (!params.star.shootingStarEnabled || params.isPaused) return;
    const intervalTime = 12000 + Math.random() * 8000;
    const timer = setInterval(() => {
      triggerShootingStar();
    }, intervalTime);
    return () => clearInterval(timer);
  }, [params.star.shootingStarEnabled, params.isPaused, triggerShootingStar]);


  // Offscreen buffer setup
  useEffect(() => {
    const waterH = BG_CANVAS_HEIGHT - BG_HORIZON_Y;
    const initBuffer = (ref: React.MutableRefObject<HTMLCanvasElement | null>, w: number, h: number) => {
      if (!ref.current) {
        const off = document.createElement('canvas');
        off.width = w;
        off.height = h;
        ref.current = off;
      }
    };
    initBuffer(reflectionCanvasRef, BG_CANVAS_WIDTH, waterH);
    initBuffer(distortedWaterCanvasRef, BG_CANVAS_WIDTH, waterH);
    initBuffer(blurredWaterCanvasRef, BG_CANVAS_WIDTH, waterH);
    initBuffer(galaxyReflectionCanvasRef, BG_CANVAS_WIDTH, waterH);
    initBuffer(distortedGalaxyCanvasRef, BG_CANVAS_WIDTH, waterH);
    initBuffer(cometFlameCanvasRef, 440, 280);
    initBuffer(cometPulseCanvasRef, 540, 360);
  }, []);

  // Main Render Loop
  useEffect(() => {
    let animationId: number = 0;
    let isLoopRunning = false;
    let frameCount = 0;
    let lastFpsReport = performance.now();
    let lastWaterTelemetryReport = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;



    const waterHeight = BG_CANVAS_HEIGHT - BG_HORIZON_Y;
    const reflCanvas = reflectionCanvasRef.current;
    const reflCtx = reflCanvas?.getContext('2d', { alpha: true });
    const galaxyReflCanvas = galaxyReflectionCanvasRef.current;
    const galaxyReflCtx = galaxyReflCanvas?.getContext('2d', { alpha: true });
    const cometFlameCanvas = cometFlameCanvasRef.current;
    const cometFlameCtx = cometFlameCanvas?.getContext('2d', { alpha: true });
    const cometPulseCanvas = cometPulseCanvasRef.current;
    const cometPulseCtx = cometPulseCanvas?.getContext('2d', { alpha: true });

    const render = (now: number) => {
      if (!isLoopRunning) return;
      const p = animParamsRef.current;
      const currentMotion = motionRef.current;
      const timeSec = now / 1000;


      const dt = Math.max(0.001, Math.min(0.1, (now - lastFrameTimeRef.current) / 1000));
      lastFrameTimeRef.current = now;

      waterExcitationRef.current = Math.max(0, waterExcitationRef.current - dt * 0.55);
      const excitation = waterExcitationRef.current;

      const baseWaveSpeed = p.water.distortionSpeed ?? 0.2;
      const effectiveWaveSpeed = baseWaveSpeed + excitation * 0.8;

      waterPhaseRef.current += dt * effectiveWaveSpeed;
      const waterPhaseTime = waterPhaseRef.current;

      const farBackBlurPeak = p.water.farBackBlur ?? 0.0;
      const surgeRatio = Math.min(1.0, Math.max(0, (effectiveWaveSpeed - 0.2) / 0.8));
      const targetWaterBlur = (p.water.blur ?? 0) + farBackBlurPeak * (1.0 + 0.35 * surgeRatio);

      const blurTransitionSpeed = p.water.blurTransitionSpeed ?? 1.8;
      const blurAlpha = 1 - Math.exp(-dt * blurTransitionSpeed);
      waterBlurSmoothedRef.current += (targetWaterBlur - waterBlurSmoothedRef.current) * blurAlpha;
      if (Math.abs(waterBlurSmoothedRef.current) < 0.01) {
        waterBlurSmoothedRef.current = 0;
      }
      const peakWaterBlur = waterBlurSmoothedRef.current;

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

      if (now - lastWaterTelemetryReport >= 100) {
        p.onWaterTelemetry?.(
          Math.round(effectiveWaveSpeed * 100) / 100,
          Math.round(peakWaterBlur * 10) / 10
        );
        lastWaterTelemetryReport = now;
      }

      const getLayerOffset = (layer: BgLayerConfig) => {
        const motionX = p.reverseHorizontalParallax ? -currentMotion.x : currentMotion.x;
        const tx = motionX * layer.parallaxFactor.x * 45;
        const ty =
          currentMotion.y * layer.parallaxFactor.y * 30 -
          currentMotion.scrollY * layer.parallaxFactor.y * 0.12;
        return { tx, ty };
      };

      const cache = imageCacheRef.current;
      const seaLayer = p.resolvedLayers.find((l) => l.id === 'layer-1.0');
      const seaVisible = !seaLayer || seaLayer.visible;

      // 1. Clear background
      ctx.fillStyle = '#021319';
      ctx.fillRect(0, 0, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);

      if (p.useCleanComposite) {
        const cleanImg = cache.get('bgclean');
        if (cleanImg && cleanImg.complete && cleanImg.naturalWidth > 0) {
          ctx.drawImage(cleanImg, 0, 0, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        }
        animationId = requestAnimationFrame(render);
        return;
      }


      // 2. Render Base Stack
      for (const layer of p.baseLayers) {
        const img = cache.get(layer.id);
        if (!img || !img.complete || img.naturalWidth === 0) continue;
        const { tx, ty } = getLayerOffset(layer);

        if (layer.id === 'layer-7.1' || layer.id === 'layer-7.2' || layer.id === 'layer-7.3') {
          renderCometTail(
            ctx,
            layer,
            img,
            tx,
            ty,
            layer.opacity,
            layer.blendMode,
            timeSec,
            p.comet,
            cometFlameCanvasRef.current,
            cometFlameCtx || null
          );
          continue;
        }

        if (layer.id === 'layer-7.0') {
          renderCometCore(
            ctx,
            img,
            tx,
            ty,
            layer.opacity,
            layer.blendMode,
            timeSec,
            p.comet,
            cometPulseCanvasRef.current,
            cometPulseCtx || null
          );
          continue;
        }

        ctx.save();
        ctx.globalCompositeOperation = getCompositeOperation(layer.blendMode);
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(img, tx, ty, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        ctx.restore();
      }

      // 3. Render Programmatic Water Reflection Plane
      if (p.water.reflectionEnabled && seaVisible && reflCanvas && reflCtx) {
        reflCtx.clearRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
        const masterReflOpacity = p.water.reflectionOpacity ?? 0.4;
        reflCtx.save();
        reflCtx.scale(1, -1);
        reflCtx.translate(0, -BG_HORIZON_Y);

        if (galaxyReflCtx) {
          galaxyReflCtx.clearRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
          galaxyReflCtx.save();
          galaxyReflCtx.scale(1, -1);
          galaxyReflCtx.translate(0, -BG_HORIZON_Y);
        }

        for (const layer of p.reflectedLayers) {
          const img = cache.get(layer.id);
          if (!img || !img.complete || img.naturalWidth === 0) continue;
          const { tx, ty } = getLayerOffset(layer);

          let cx = tx;
          let cy = ty;

          const isCloud = layer.category === 'clouds';
          if (isCloud && p.cloud.driftEnabled) {
            if (layer.id === 'layer-4.2') {
              const speed = 95 / Math.max(0.2, p.cloud.driftSpeed);
              cx += -12 * Math.sin((timeSec * 2 * Math.PI) / speed);
              cy += 2 * Math.sin((timeSec * 2 * Math.PI) / speed);
            } else {
              const speed = 80 / Math.max(0.2, p.cloud.driftSpeed);
              cx += 14 * Math.sin((timeSec * 2 * Math.PI) / speed);
              cy += -2 * Math.sin((timeSec * 2 * Math.PI) / speed);
            }
          }

          const reflOpacity =
            (layer.reflectionOpacity ?? 0.75) * layer.opacity * 0.78 * (masterReflOpacity / 0.8);

          if (layer.id === 'layer-7.1' || layer.id === 'layer-7.2' || layer.id === 'layer-7.3') {
            renderCometTail(
              reflCtx,
              layer,
              img,
              cx,
              cy,
              reflOpacity,
              layer.blendMode,
              timeSec,
              p.comet,
              cometFlameCanvasRef.current,
              cometFlameCtx || null
            );
            continue;
          }

          if (layer.id === 'layer-7.0') {
            renderCometCore(
              reflCtx,
              img,
              cx,
              cy,
              reflOpacity,
              layer.blendMode,
              timeSec,
              p.comet,
              cometPulseCanvasRef.current,
              cometPulseCtx || null
            );
            continue;
          }

          if (isCloud) {
            renderCloud(reflCtx, layer, img, cx, cy, reflOpacity, layer.blendMode, timeSec, p.cloud, true);
            continue;
          }

          if (layer.id === 'layer-2.0' || layer.id === 'layer-2.1' || layer.id === 'layer-2.2') {
            const targetGalaxyCtx = galaxyReflCtx || reflCtx;
            renderGalaxyLayer(
              targetGalaxyCtx,
              layer,
              img,
              cx,
              cy,
              reflOpacity,
              layer.blendMode,
              timeSec,
              p.galaxy,
              true,
              seaVisible
            );
            continue;
          }

          reflCtx.save();
          reflCtx.globalCompositeOperation = getCompositeOperation(layer.blendMode);
          reflCtx.globalAlpha = reflOpacity;
          reflCtx.drawImage(img, cx, cy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
          reflCtx.restore();
        }

        reflCtx.restore();
        if (galaxyReflCtx) {
          galaxyReflCtx.restore();
        }

        // Reflected stars & comet
        if (p.star.bigStarShineEnabled && p.bigStarLayer?.visible) {
          const { tx, ty } = getLayerOffset(p.bigStarLayer);
          renderBigStarsReflection(reflCtx, tx, ty, timeSec, p.star, masterReflOpacity);
        }

        // Render water surface waves & depth blur
        renderWaterSurface(
          ctx,
          reflCanvas,
          galaxyReflectionCanvasRef.current,
          distortedWaterCanvasRef.current,
          distortedGalaxyCanvasRef.current,
          blurredWaterCanvasRef.current,
          waterMeshNodesRef.current,
          waterPhaseTime,
          peakWaterBlur,
          p.water,
          waterHeight
        );
      }

      // Oceanic depth gradient
      if (seaVisible) {
        renderOceanicDepthGradient(ctx, waterHeight);
      }

      // 4. Deep Space Comet Streak
      const streak = streakRef.current;
      if (streak) {
        const active = renderShootingStarStreak(ctx, streak, now, cache.get('comet-sprite'));
        if (!active) {
          streakRef.current = null;
        }
      }

      // 5. Upper Stack: Milky Way, Stars, Clouds, Mist
      for (const layer of p.upperLayers) {
        const img = cache.get(layer.id);
        if (!img || !img.complete || img.naturalWidth === 0) continue;
        const { tx, ty } = getLayerOffset(layer);

        if (layer.id === 'layer-5.3') {
          renderMistDispersal(ctx, layer, img, tx, ty, timeSec, p.mist);
          continue;
        }

        const isCloud = layer.category === 'clouds';
        let cx = tx;
        let cy = ty;

        if (isCloud && p.cloud.driftEnabled) {
          if (layer.id === 'layer-4.2') {
            const speed = 95 / Math.max(0.2, p.cloud.driftSpeed);
            cx += -12 * Math.sin((timeSec * 2 * Math.PI) / speed);
            cy += 2 * Math.sin((timeSec * 2 * Math.PI) / speed);
          } else {
            const speed = 80 / Math.max(0.2, p.cloud.driftSpeed);
            cx += 14 * Math.sin((timeSec * 2 * Math.PI) / speed);
            cy += -2 * Math.sin((timeSec * 2 * Math.PI) / speed);
          }
        }

        if (isCloud) {
          renderCloud(ctx, layer, img, cx, cy, layer.opacity, layer.blendMode, timeSec, p.cloud, false);
          continue;
        }

        if (layer.id === 'layer-2.0' || layer.id === 'layer-2.1' || layer.id === 'layer-2.2') {
          renderGalaxyLayer(
            ctx,
            layer,
            img,
            cx,
            cy,
            layer.opacity,
            layer.blendMode,
            timeSec,
            p.galaxy,
            false,
            seaVisible
          );
          continue;
        }

        ctx.save();
        ctx.globalCompositeOperation = getCompositeOperation(layer.blendMode);
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(img, cx, cy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
        ctx.restore();
      }

      // 6. Natural Scintillation Flares for Big Stars
      if (p.star.bigStarShineEnabled && p.bigStarLayer?.visible) {
        const { tx, ty } = getLayerOffset(p.bigStarLayer);
        renderBigStarsFlares(ctx, tx, ty, timeSec, p.star);
      }

      if (isLoopRunning) {
        animationId = requestAnimationFrame(render);
      }
    };

    const startLoop = () => {
      if (isLoopRunning) return;
      isLoopRunning = true;
      lastFrameTimeRef.current = performance.now();
      animationId = requestAnimationFrame(render);
    };

    const stopLoop = () => {
      if (!isLoopRunning) return;
      isLoopRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = 0;
      }
    };

    const checkShouldRun = () => {
      if (typeof document !== 'undefined' && document.hidden) return false;
      if (animParamsRef.current.isPaused) return false;
      return true;
    };

    const updateRunningState = () => {
      if (checkShouldRun()) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    updateRunningStateRef.current = updateRunningState;

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', updateRunningState, { passive: true });
    }

    updateRunningState();

    return () => {
      stopLoop();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', updateRunningState);
      }
      updateRunningStateRef.current = null;
    };
  }, []);

  useEffect(() => {
    updateRunningStateRef.current?.();
  }, [params.isPaused]);



  return {
    canvasRef,
    triggerShootingStar,
  };
}

