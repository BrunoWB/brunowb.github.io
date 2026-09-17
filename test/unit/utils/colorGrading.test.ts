import { describe, it, expect } from 'vitest';
import {
  calculatePhotoshopLevels,
  computeLevelsTableValues,
  computeVibranceSaturationMatrix,
} from '../../../src/utils/colorGrading';

describe('colorGrading Algorithms & LUT Generation', () => {
  it('correctly maps Photoshop Levels input bounds to output bounds for x in [0, 1]', () => {
    // Value below inB (20/255 = 0.078) clamps to outB (0)
    expect(calculatePhotoshopLevels(0.02, 20, 1.0, 240, 0, 255)).toBe(0);

    // Value above inW (240/255 = 0.941) clamps to outW (1)
    expect(calculatePhotoshopLevels(0.98, 20, 1.0, 240, 0, 255)).toBe(1);

    // Midpoint with gamma=1.0 maps linearly between outB and outW
    const midIn = (20 / 255 + 240 / 255) / 2;
    const mid = calculatePhotoshopLevels(midIn, 20, 1.0, 240, 0, 255);
    expect(mid).toBeCloseTo(0.5, 0.01);
  });

  it('generates a 256-step levels table space-separated string', () => {
    const tableStr = computeLevelsTableValues(19, 0.85, 255, 0, 255);
    const parts = tableStr.trim().split(/\s+/);
    expect(parts.length).toBe(256);

    // Verify all parts are numbers between 0.0 and 1.0
    for (const p of parts) {
      const num = parseFloat(p);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(1.0);
    }
  });

  it('generates a valid 20-number SVG feColorMatrix string', () => {
    const matrixStr = computeVibranceSaturationMatrix(10, -5);
    const parts = matrixStr.trim().split(/\s+/);
    expect(parts.length).toBe(20);
    for (const p of parts) {
      expect(Number.isFinite(parseFloat(p))).toBe(true);
    }
  });
});

