import { BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT, BG_HORIZON_Y } from '../../../../data/bgLayersData';
import { CanvasWaterConfig } from '../types';
import { getCompositeOperation } from './helpers';

export function clipToSlopedHorizon(ctx: CanvasRenderingContext2D): void {
  ctx.beginPath();
  ctx.moveTo(0, BG_HORIZON_Y);
  ctx.lineTo(BG_CANVAS_WIDTH, 835);
  ctx.lineTo(BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
  ctx.lineTo(0, BG_CANVAS_HEIGHT);
  ctx.closePath();
  ctx.clip();
}

export function renderOceanicDepthGradient(
  ctx: CanvasRenderingContext2D,
  waterHeight: number
): void {
  ctx.save();
  clipToSlopedHorizon(ctx);

  const waterGrad = ctx.createLinearGradient(0, BG_HORIZON_Y, 0, BG_CANVAS_HEIGHT);
  waterGrad.addColorStop(0, 'rgba(0, 24, 36, 0.0)');
  waterGrad.addColorStop(0.5, 'rgba(0, 20, 32, 0.03)');
  waterGrad.addColorStop(1.0, 'rgba(0, 16, 26, 0.06)');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, BG_HORIZON_Y, BG_CANVAS_WIDTH, waterHeight);
  ctx.restore();
}

export function renderWaterSurface(
  ctx: CanvasRenderingContext2D,
  reflCanvas: HTMLCanvasElement,
  galaxyReflCanvas: HTMLCanvasElement | null,
  distortedWaterCanvas: HTMLCanvasElement | null,
  distortedGalaxyCanvas: HTMLCanvasElement | null,
  blurredWaterCanvas: HTMLCanvasElement | null,
  waterMeshNodes: Float64Array,
  waterPhaseTime: number,
  peakWaterBlur: number,
  config: CanvasWaterConfig,
  waterHeight: number
): void {
  ctx.save();
  clipToSlopedHorizon(ctx);

  let currentFilter = 'none';
  const reflBlendOp = getCompositeOperation(config.reflectionBlendMode ?? 'hard-light');
  const activeWaterScale = config.distortionScale;

  if (!config.distortionEnabled || activeWaterScale <= 0) {
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
  } else if (config.waveMode === 'bands') {
    const NUM_BANDS = 32;
    const bandCount = Math.max(4, Math.min(128, Math.round(config.bandCount ?? NUM_BANDS)));
    const power = config.perspectivePower ?? 3.0;
    const scale = activeWaterScale;
    const padY = config.bandOffset ?? 0.2;
    const padX = Math.ceil(scale) + 4;

    const nodeY = waterMeshNodes;
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

    const distCtx = distortedWaterCanvas?.getContext('2d');
    const targetDistCtx = distCtx || ctx;
    const distGalaxyCtx = distortedGalaxyCanvas?.getContext('2d');

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
      const dy = distCtx ? nodeY[b] - BG_HORIZON_Y : nodeY[b];
      const dw = BG_CANVAS_WIDTH + padX * 2;
      const dh = nodeY[b + 1] - nodeY[b] + padY;

      targetDistCtx.drawImage(reflCanvas, 0, sy, BG_CANVAS_WIDTH, sh, dx, dy, dw, dh);

      if (galaxyReflCanvas && distGalaxyCtx) {
        distGalaxyCtx.drawImage(galaxyReflCanvas, 0, sy, BG_CANVAS_WIDTH, sh, dx, dy, dw, dh);
      }
    }

    if (distortedWaterCanvas && distCtx) {
      ctx.save();
      ctx.globalCompositeOperation = reflBlendOp;
      ctx.drawImage(distortedWaterCanvas, 0, BG_HORIZON_Y);
      ctx.restore();

      if (distortedGalaxyCanvas) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(distortedGalaxyCanvas, 0, BG_HORIZON_Y);
        ctx.restore();
      }

      if (peakWaterBlur >= 0.2 && blurredWaterCanvas) {
        const blurCtx = blurredWaterCanvas.getContext('2d');
        if (blurCtx && 'filter' in blurCtx) {
          blurCtx.clearRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
          blurCtx.filter = `blur(${peakWaterBlur.toFixed(2)}px)`;
          blurCtx.drawImage(distortedWaterCanvas, 0, 0);
          blurCtx.filter = 'none';

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

          ctx.save();
          ctx.globalCompositeOperation = reflBlendOp;
          ctx.drawImage(blurredWaterCanvas, 0, BG_HORIZON_Y);
          ctx.restore();

          if (distortedGalaxyCanvas) {
            blurCtx.clearRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
            blurCtx.filter = `blur(${peakWaterBlur.toFixed(2)}px)`;
            blurCtx.drawImage(distortedGalaxyCanvas, 0, 0);
            blurCtx.filter = 'none';

            blurCtx.save();
            blurCtx.globalCompositeOperation = 'destination-in';
            blurCtx.fillStyle = maskGrad;
            blurCtx.fillRect(0, 0, BG_CANVAS_WIDTH, waterHeight);
            blurCtx.restore();

            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.drawImage(blurredWaterCanvas, 0, BG_HORIZON_Y);
            ctx.restore();
          }
        }
      }
    }
  } else {
    // Continuous Whole-Raster Wave Dynamics
    if (peakWaterBlur >= 0.2 && 'filter' in ctx) {
      ctx.filter = `blur(${peakWaterBlur.toFixed(2)}px)`;
      currentFilter = ctx.filter;
    }
    const scale = activeWaterScale;
    const originX = BG_CANVAS_WIDTH * 0.5;
    const originY = BG_HORIZON_Y;

    const wavePhase = waterPhaseTime * 2.2;
    const driftX =
      (Math.sin(wavePhase * 1.2) * 0.70 + Math.cos(wavePhase * 2.3 + 0.8) * 0.30) *
      (scale * 0.35);
    const swellY = Math.sin(wavePhase * 1.5) * (scale * 0.08);

    const swellMagnitude = 0.018 * Math.min(2.0, scale / 40);
    const breathX =
      1.0 + swellMagnitude * (Math.sin(wavePhase * 1.4) * 0.65 + Math.cos(wavePhase * 2.8) * 0.35);
    const breathY =
      1.0 +
      swellMagnitude *
        1.4 *
        (Math.cos(wavePhase * 1.1) * 0.75 + Math.sin(wavePhase * 2.2) * 0.25);

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

