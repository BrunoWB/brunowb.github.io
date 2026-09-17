import { ResolvedBgLayerConfig } from '../types';
import { BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT } from '../../../../data/bgLayersData';
import { CanvasMistConfig } from '../types';
import { getCompositeOperation } from './helpers';

export function renderMistDispersal(
  targetCtx: CanvasRenderingContext2D,
  layer: ResolvedBgLayerConfig,
  img: HTMLImageElement,
  tx: number,
  ty: number,
  timeSec: number,
  config: CanvasMistConfig
): void {
  if (!config.disperseEnabled) {
    targetCtx.save();
    targetCtx.globalCompositeOperation = getCompositeOperation(layer.blendMode);
    targetCtx.globalAlpha = layer.opacity;
    targetCtx.drawImage(img, tx, ty, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
    targetCtx.restore();
    return;
  }

  const count = Math.max(1, Math.min(3, config.instances));
  const cyclePeriod = 21 / Math.max(0.2, config.disperseSpeed);

  for (let i = 0; i < count; i++) {
    const delaySec = -(i * (cyclePeriod / count));
    const cycleTime = (((timeSec + delaySec) % cyclePeriod) + cyclePeriod) % cyclePeriod;
    const prog = cycleTime / cyclePeriod;

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

    if (config.distortionEnabled) {
      const mistWobble = Math.sin(timeSec * 0.6 + i * 1.5) * (config.distortionScale * 0.4);
      mistDx += mistWobble;
    }

    targetCtx.save();
    targetCtx.globalCompositeOperation = getCompositeOperation(layer.blendMode);
    targetCtx.globalAlpha = layer.opacity * 0.9 * phaseAlpha;
    targetCtx.translate(BG_CANVAS_WIDTH / 2, BG_CANVAS_HEIGHT / 2);
    targetCtx.scale(mistScale, mistScale);
    targetCtx.translate(-BG_CANVAS_WIDTH / 2, -BG_CANVAS_HEIGHT / 2);
    targetCtx.drawImage(img, tx + mistDx, ty + mistDy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT);
    targetCtx.restore();
  }
}
