import { BgLayerConfig } from '../../../../types/background';
import { BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT, BG_HORIZON_Y } from '../../../../data/bgLayersData';
import { CanvasGalaxyConfig } from '../types';
import { getCompositeOperation } from './helpers';

export function renderGalaxyLayer(
  targetCtx: CanvasRenderingContext2D,
  layer: BgLayerConfig,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  baseOpacity: number,
  blendMode: string,
  timeSec: number,
  config: CanvasGalaxyConfig,
  isReflection: boolean = false,
  seaVisible: boolean = true
): void {
  if (!config.breathingEnabled || config.breathingIntensity <= 0) {
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

  const speed = Math.max(0.1, config.breathingSpeed);
  const intensity = config.breathingIntensity;

  let effAlpha = baseOpacity;
  let bloomAlpha = 0;
  let bloomMode: GlobalCompositeOperation = 'screen';

  if (layer.id === 'layer-2.0') {
    const phaseDust = (timeSec * 2 * Math.PI * speed) / 26.0;
    const waveDust = Math.sin(phaseDust) * 0.75 + Math.sin(phaseDust * 0.5 + 0.6) * 0.25;
    effAlpha = Math.max(0, Math.min(1.0, baseOpacity * (1.0 + 0.05 * waveDust * intensity)));
    if (waveDust > 0) {
      bloomAlpha = Math.max(0, Math.min(1.0, baseOpacity * (0.03 * waveDust * intensity)));
      bloomMode = 'screen';
    }
  } else if (layer.id === 'layer-2.1') {
    const phaseCore = (timeSec * 2 * Math.PI * speed) / 21.0 + 1.0;
    const waveCore = Math.sin(phaseCore) * 0.70 + Math.sin(phaseCore * 1.4 - 0.4) * 0.30;
    effAlpha = Math.max(0, Math.min(1.0, baseOpacity * (1.0 + 0.08 * waveCore * intensity)));
    if (waveCore > 0) {
      bloomAlpha = Math.max(0, Math.min(1.0, baseOpacity * (0.07 * waveCore * intensity)));
      bloomMode = 'screen';
    }
  } else if (layer.id === 'layer-2.2') {
    const phaseBright = (timeSec * 2 * Math.PI * speed) / 18.0 + 2.1;
    const waveBright = Math.sin(phaseBright) * 0.68 + Math.cos(phaseBright * 1.3 + 0.5) * 0.32;
    effAlpha = Math.max(0, Math.min(1.0, baseOpacity * (1.0 + 0.10 * waveBright * intensity)));
    if (waveBright > 0) {
      bloomAlpha = Math.max(0, Math.min(1.0, baseOpacity * (0.08 * waveBright * intensity)));
      bloomMode = 'screen';
    }
  }

  // Primary base pass
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

  // Secondary ethereal bloom pass
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
}

