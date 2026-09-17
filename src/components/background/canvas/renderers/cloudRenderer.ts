import { BgLayerConfig } from '../../../../types/background';
import { BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT } from '../../../../data/bgLayersData';
import { CanvasCloudConfig } from '../types';
import { getCompositeOperation } from './helpers';

export function renderCloud(
  targetCtx: CanvasRenderingContext2D,
  layer: BgLayerConfig,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  opacity: number,
  blendMode: string,
  timeSec: number,
  config: CanvasCloudConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isReflection: boolean = false
): void {
  if (!config.distortionEnabled || config.distortionScale <= 0) {
    targetCtx.save();
    targetCtx.globalCompositeOperation = getCompositeOperation(blendMode);
    targetCtx.globalAlpha = opacity;
    targetCtx.drawImage(img, cx, cy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
    targetCtx.restore();
    return;
  }

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

  const distortionScale = config.distortionScale;
  const morphSpeed = config.morphSpeed;

  // 1. Dual Multi-Frequency Harmonic Billow Drift
  const phaseDrift1 = timeSec * 0.38 * morphSpeed + layerSeed;
  const phaseDrift2 = timeSec * 0.72 * morphSpeed + layerSeed * 1.3 + 0.8;
  const billowDriftX =
    (Math.sin(phaseDrift1) * 0.65 + Math.cos(phaseDrift2) * 0.35) * (distortionScale * 0.8);

  const phaseDriftY1 = timeSec * 0.32 * morphSpeed + layerSeed * 0.9 + 1.2;
  const phaseDriftY2 = timeSec * 0.64 * morphSpeed + layerSeed * 1.4 + 2.1;
  const billowDriftY =
    (Math.sin(phaseDriftY1) * 0.70 + Math.sin(phaseDriftY2) * 0.30) * (distortionScale * 0.4);

  // 2. Subtle Anisotropic Aspect Breathing
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

  // 5. Secondary Ethereal Billow Vapor Pass
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
}

