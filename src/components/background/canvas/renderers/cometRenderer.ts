import { BgLayerConfig } from '../../../../types/background';
import { BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT } from '../../../../data/bgLayersData';
import { CanvasCometConfig } from '../types';
import { getCompositeOperation } from './helpers';

export const COMET_HEAD_X = 1385;
export const COMET_HEAD_Y = 318;
export const COMET_TAIL_X = 1680;
export const COMET_TAIL_Y = 155;
export const COMET_ANGLE = Math.atan2(COMET_TAIL_Y - COMET_HEAD_Y, COMET_TAIL_X - COMET_HEAD_X);

interface CachedFadeGrad {
  ctx: CanvasRenderingContext2D;
  power: number;
  gradient: CanvasGradient;
}

let cachedFadeGrad: CachedFadeGrad | null = null;

function getCachedFadeGrad(
  ctx: CanvasRenderingContext2D,
  startX: number,
  endX: number,
  tailFadePower: number
): CanvasGradient {
  if (
    cachedFadeGrad &&
    cachedFadeGrad.ctx === ctx &&
    cachedFadeGrad.power === tailFadePower
  ) {
    return cachedFadeGrad.gradient;
  }

  const grad = ctx.createLinearGradient(startX, 0, endX, 0);
  const steps = 24;
  for (let s = 0; s <= steps; s++) {
    const u = s / steps;
    const fadeAlpha = Math.max(0, 1.0 - 0.72 * Math.pow(u, tailFadePower));
    grad.addColorStop(u, `rgba(0,0,0,${fadeAlpha})`);
  }

  cachedFadeGrad = {
    ctx,
    power: tailFadePower,
    gradient: grad,
  };

  return grad;
}

export function renderCometTail(
  targetCtx: CanvasRenderingContext2D,
  layer: BgLayerConfig,
  img: HTMLImageElement,
  tx: number,
  ty: number,
  opacity: number,
  blendMode: string,
  timeSec: number,
  config: CanvasCometConfig,
  cometFlameCanvas: HTMLCanvasElement | null,
  cometFlameCtx: CanvasRenderingContext2D | null
): void {
  if (!config.flameTailEnabled || !cometFlameCanvas || !cometFlameCtx) {
    targetCtx.save();
    targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
    targetCtx.globalAlpha = opacity;
    targetCtx.drawImage(img, tx, ty, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
    targetCtx.restore();
    return;
  }

  const {
    flameTailSpeed,
    tailTurbulence,
    tailFlickerIntensity,
    tailFlickerSpeed,
    tailSpreadFactor,
    tailFadePower,
  } = config;

  const layerSeed = layer.id === 'layer-7.1' ? 0.0 : layer.id === 'layer-7.2' ? 2.35 : 4.71;
  const spreadAmount = layer.id === 'layer-7.1' ? 0.50 : layer.id === 'layer-7.2' ? 0.38 : 0.62;

  const bufW = 440;
  const bufH = 280;
  const anchorBufX = 40;
  const anchorBufY = 140;

  cometFlameCtx.clearRect(0, 0, bufW, bufH);
  cometFlameCtx.save();
  cometFlameCtx.translate(anchorBufX, anchorBufY);
  cometFlameCtx.rotate(-COMET_ANGLE);
  cometFlameCtx.translate(-COMET_HEAD_X, -COMET_HEAD_Y);
  cometFlameCtx.drawImage(img, 0, 0);
  cometFlameCtx.restore();

  // Smooth continuous terminal fade out toward tail tip
  const startX = 16;
  const endX = 385;
  cometFlameCtx.save();
  cometFlameCtx.globalCompositeOperation = 'destination-in';
  const fadeGrad = getCachedFadeGrad(cometFlameCtx, startX, endX, tailFadePower);
  cometFlameCtx.fillStyle = fadeGrad;
  cometFlameCtx.fillRect(0, 0, bufW, bufH);
  cometFlameCtx.restore();

  // Turbulent flame flicker
  const flicker =
    1.0 +
    (0.16 * Math.sin(timeSec * 18.5 * tailFlickerSpeed + layerSeed * 3.0) +
      0.09 * Math.cos(timeSec * 28.0 * tailFlickerSpeed + layerSeed * 1.7)) *
      tailFlickerIntensity;
  const baseAlpha = Math.max(0, Math.min(1.0, opacity * flicker));

  // Continuous multi-harmonic flame wave sway and shear lick
  const p1 = timeSec * 6.5 * flameTailSpeed + layerSeed;
  const p2 = timeSec * 13.0 * flameTailSpeed + layerSeed * 1.6 + 1.2;
  const p3 = timeSec * 21.5 * flameTailSpeed + 2.1;
  const totalWave =
    (Math.sin(p1) * 0.65 + Math.sin(p2) * 0.25 + Math.sin(p3) * 0.10) *
    (tailTurbulence * 14.0) / 14.0;

  const swayAngle = totalWave * 0.024 * tailTurbulence;
  const shearY =
    (Math.sin(timeSec * 5.2 * flameTailSpeed + layerSeed) * 0.032 +
      Math.cos(timeSec * 11.4 * flameTailSpeed + layerSeed * 1.4) * 0.016) *
    tailTurbulence;

  const spreadY = 1.0 + spreadAmount * (tailSpreadFactor - 1.0) * 0.40;
  const spreadX = 1.0 + (tailSpreadFactor - 1.0) * 0.06;

  // Primary Flame Pass
  targetCtx.save();
  targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
  targetCtx.globalAlpha = baseAlpha;
  targetCtx.translate(COMET_HEAD_X + tx, COMET_HEAD_Y + ty);
  targetCtx.rotate(COMET_ANGLE + swayAngle);
  targetCtx.transform(spreadX, shearY, 0, spreadY, 0, 0);
  targetCtx.drawImage(cometFlameCanvas, -anchorBufX, -anchorBufY);
  targetCtx.restore();

  // Secondary Ethereal Vapor Pass
  if (tailTurbulence > 0.08) {
    const vaporAlpha = Math.max(0, Math.min(1.0, baseAlpha * 0.32 * Math.min(1.5, tailTurbulence)));
    const vaporSway = -swayAngle * 0.65 + 0.008 * Math.sin(timeSec * 8.0 * flameTailSpeed + layerSeed);
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
}

export function renderCometCore(
  targetCtx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  tx: number,
  ty: number,
  opacity: number,
  blendMode: string,
  timeSec: number,
  config: CanvasCometConfig,
  cometPulseCanvas: HTMLCanvasElement | null,
  cometPulseCtx: CanvasRenderingContext2D | null
): void {
  const {
    coreBaseOpacity,
    corePulseEnabled,
    corePulseSpeed,
    coreStretchScale,
    corePeakBrightness,
    coreBaselineOpacity,
  } = config;

  // Base clean pass
  targetCtx.save();
  targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
  targetCtx.globalAlpha = coreBaseOpacity * opacity;
  targetCtx.drawImage(img, tx, ty, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
  targetCtx.restore();

  if (!corePulseEnabled || !cometPulseCanvas || !cometPulseCtx) return;

  const cropX = 1340;
  const cropY = 30;
  const cropW = 540;
  const cropH = 360;

  const anchorX = COMET_HEAD_X - cropX;
  const anchorY = COMET_HEAD_Y - cropY;
  const endRelX = COMET_TAIL_X - cropX;
  const endRelY = COMET_TAIL_Y - cropY;

  const cycleDuration = 3.2 / Math.max(0.2, corePulseSpeed);
  const cycleProg = ((timeSec / cycleDuration) % 1.0 + 1.0) % 1.0;
  const isSurging = cycleProg <= 0.70;
  const uWave = isSurging ? cycleProg / 0.70 : 2.0;

  const surgeStretch = isSurging ? Math.sin(uWave * Math.PI) : 0;
  const stretchX = 1.0 + (0.04 + 0.12 * surgeStretch) * coreStretchScale;
  const stretchY = 1.0 + 0.02 * surgeStretch * coreStretchScale;

  cometPulseCtx.clearRect(0, 0, cropW, cropH);
  cometPulseCtx.save();
  cometPulseCtx.translate(anchorX, anchorY);
  cometPulseCtx.rotate(COMET_ANGLE);
  cometPulseCtx.scale(stretchX, stretchY);
  cometPulseCtx.rotate(-COMET_ANGLE);
  cometPulseCtx.translate(-anchorX, -anchorY);
  cometPulseCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  cometPulseCtx.restore();

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

  targetCtx.save();
  targetCtx.globalCompositeOperation = 'screen';
  targetCtx.globalAlpha = opacity;
  targetCtx.drawImage(cometPulseCanvas, 0, 0, cropW, cropH, cropX + tx, cropY + ty, cropW, cropH);
  targetCtx.restore();
}

