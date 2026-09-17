import { bigStarsData, getStarFlareIntensityScale, BG_HORIZON_Y } from '../../../../data/bgLayersData';
import { ActiveStreak, CanvasStarConfig } from '../types';

export function renderBigStarsFlares(
  targetCtx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  timeSec: number,
  config: CanvasStarConfig
): void {
  const intensityScale = getStarFlareIntensityScale(config.bigStarShineIntensity, 0.15);

  for (let i = 0; i < bigStarsData.length; i++) {
    const star = bigStarsData[i];
    const starX = star.x + tx;
    const starY = star.y + ty;

    const t = timeSec * config.bigStarShineSpeed * star.speedMult + star.phase;
    const harm1 = Math.sin(t * 1.35);
    const harm2 = Math.sin(t * 3.1 + star.phase * 2.1) * 0.4;
    const harm3 = Math.sin(t * 6.7 + star.phase * 4.3) * 0.2;
    const rawHarmonic = (harm1 + harm2 + harm3) / 1.6;
    const rawNorm = 0.5 + 0.5 * rawHarmonic;

    const threshold = 0.60;
    let scintillation = 0.0;
    if (rawNorm > threshold) {
      const u = (rawNorm - threshold) / (1.0 - threshold);
      scintillation = u * u * (3.0 - 2.0 * u);
    }

    if (scintillation <= 0.001) continue;

    const flarePulse = 0.6 + 0.48 * scintillation;
    const flareRot = 0.05 * Math.sin(t * 0.9 + star.phase);
    const flareSize = config.bigStarFlareSize * star.scale * intensityScale * flarePulse;
    const flareAlpha = config.bigStarShineIntensity * scintillation;

    if (flareAlpha <= 0.001 || flareSize <= 0.5) continue;

    targetCtx.save();
    targetCtx.globalCompositeOperation = 'screen';
    targetCtx.globalAlpha = Math.min(1.0, flareAlpha);
    targetCtx.translate(starX, starY);
    targetCtx.rotate(flareRot);

    // Luminescent core glow
    const coreGrad = targetCtx.createRadialGradient(0, 0, 0, 0, 0, flareSize * 1.4);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
    coreGrad.addColorStop(0.25, 'rgba(186, 230, 253, 0.75)');
    coreGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.25)');
    coreGrad.addColorStop(0.85, 'transparent');
    targetCtx.fillStyle = coreGrad;
    targetCtx.beginPath();
    targetCtx.arc(0, 0, flareSize * 1.4, 0, Math.PI * 2);
    targetCtx.fill();

    // Diffraction cross rays for prominent stars
    if (star.scale >= 0.6) {
      const rayLen = flareSize * 1.3;
      const rayW = Math.max(0.75, Math.min(1.5, flareSize * 0.08));

      // Vertical ray
      const vertGrad = targetCtx.createLinearGradient(0, -rayLen, 0, rayLen);
      vertGrad.addColorStop(0, 'transparent');
      vertGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.92)');
      vertGrad.addColorStop(1, 'transparent');
      targetCtx.fillStyle = vertGrad;
      targetCtx.fillRect(-rayW / 2, -rayLen, rayW, rayLen * 2);

      // Horizontal ray
      const horizGrad = targetCtx.createLinearGradient(-rayLen, 0, rayLen, 0);
      horizGrad.addColorStop(0, 'transparent');
      horizGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.92)');
      horizGrad.addColorStop(1, 'transparent');
      targetCtx.fillStyle = horizGrad;
      targetCtx.fillRect(-rayLen, -rayW / 2, rayLen * 2, rayW);
    }

    // Diagonal 45° diffraction rays for giant star
    if (star.scale >= 0.92) {
      targetCtx.save();
      targetCtx.rotate(Math.PI / 4);
      const diagRayLen = flareSize * 0.75;
      const diagGrad = targetCtx.createLinearGradient(-diagRayLen, 0, diagRayLen, 0);
      diagGrad.addColorStop(0, 'transparent');
      diagGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.7)');
      diagGrad.addColorStop(1, 'transparent');
      targetCtx.fillStyle = diagGrad;
      targetCtx.fillRect(-diagRayLen, -0.5, diagRayLen * 2, 1);
      targetCtx.rotate(Math.PI / 2);
      targetCtx.fillRect(-diagRayLen, -0.5, diagRayLen * 2, 1);
      targetCtx.restore();
    }

    targetCtx.restore();
  }
}

export function renderBigStarsReflection(
  reflCtx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  timeSec: number,
  config: CanvasStarConfig,
  masterReflOpacity: number
): void {
  const intensityScale = getStarFlareIntensityScale(config.bigStarShineIntensity, 0.15);

  for (let i = 0; i < bigStarsData.length; i++) {
    const star = bigStarsData[i];
    if (!star.hasReflection) continue;

    const starX = star.x + tx;
    const effSkyY = star.y + ty;
    const d = Math.max(0, Math.min(1.0, (BG_HORIZON_Y - effSkyY) / BG_HORIZON_Y));
    const starWaterY = 24.0 + d * 55.0;

    const t = timeSec * config.bigStarShineSpeed * star.speedMult + star.phase;
    const harm1 = Math.sin(t * 1.35);
    const harm2 = Math.sin(t * 3.1 + star.phase * 2.1) * 0.4;
    const harm3 = Math.sin(t * 6.7 + star.phase * 4.3) * 0.2;
    const rawHarmonic = (harm1 + harm2 + harm3) / 1.6;
    const rawNorm = 0.5 + 0.5 * rawHarmonic;

    const threshold = 0.60;
    let scintillation = 0.0;
    if (rawNorm > threshold) {
      const u = (rawNorm - threshold) / (1.0 - threshold);
      scintillation = u * u * (3.0 - 2.0 * u);
    }

    if (scintillation <= 0.001) continue;

    const flarePulse = 0.6 + 0.48 * scintillation;
    const flareSize = config.bigStarFlareSize * star.scale * intensityScale * flarePulse;
    const reflAlpha =
      config.bigStarShineIntensity *
      (0.90 * scintillation) *
      star.scale *
      0.75 *
      (masterReflOpacity / 0.8);

    if (reflAlpha <= 0.001 || flareSize <= 0.5) continue;

    reflCtx.save();
    reflCtx.globalCompositeOperation = 'screen';
    reflCtx.globalAlpha = Math.min(1.0, reflAlpha);

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

export function renderShootingStarStreak(
  targetCtx: CanvasRenderingContext2D,
  streak: ActiveStreak,
  now: number,
  spriteImg: HTMLImageElement | undefined
): boolean {
  const elapsed = now - streak.startTime;
  const progress = Math.min(1, elapsed / streak.duration);
  if (progress < 1) {
    const currentX = streak.startX + (streak.endX - streak.startX) * progress;
    const currentY = streak.startY + (streak.endY - streak.startY) * progress;
    const streakAlpha = Math.sin(progress * Math.PI) * 0.95;

    if (spriteImg && spriteImg.complete && spriteImg.naturalWidth > 0) {
      targetCtx.save();
      targetCtx.globalCompositeOperation = 'screen';
      targetCtx.globalAlpha = streakAlpha;
      targetCtx.translate(currentX, currentY);
      targetCtx.rotate(32 * (Math.PI / 180));
      targetCtx.drawImage(spriteImg, -90, -45, 180, 90);
      targetCtx.restore();
    }
    return true; // still active
  }
  return false; // finished
}

