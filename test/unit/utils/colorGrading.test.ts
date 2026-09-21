import { describe, it, expect } from 'vitest';
import {
  calculatePhotoshopLevels,
  computeLevelsTableValues,
  computeVibranceSaturationMatrix,
  computeVibranceSaturationMatrix3x3,
  computeCssColorGradingFilter,
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

  it('generates a valid 3x3 column-major Float32Array matching the 4x5 SVG matrix coefficients', () => {
    const mat3 = computeVibranceSaturationMatrix3x3(10, -5);
    expect(mat3).toBeInstanceOf(Float32Array);
    expect(mat3.length).toBe(9);

    const svgParts = computeVibranceSaturationMatrix(10, -5).trim().split(/\s+/).map(Number);
    // Row 0 in SVG: m00, m01, m02, 0, 0
    // Row 1 in SVG: m10, m11, m12, 0, 0
    // Row 2 in SVG: m20, m21, m22, 0, 0
    const m00 = svgParts[0], m01 = svgParts[1], m02 = svgParts[2];
    const m10 = svgParts[5], m11 = svgParts[6], m12 = svgParts[7];
    const m20 = svgParts[10], m21 = svgParts[11], m22 = svgParts[12];

    // Column 0
    expect(mat3[0]).toBeCloseTo(m00, 3);
    expect(mat3[1]).toBeCloseTo(m10, 3);
    expect(mat3[2]).toBeCloseTo(m20, 3);

    // Column 1
    expect(mat3[3]).toBeCloseTo(m01, 3);
    expect(mat3[4]).toBeCloseTo(m11, 3);
    expect(mat3[5]).toBeCloseTo(m21, 3);

    // Column 2
    expect(mat3[6]).toBeCloseTo(m02, 3);
    expect(mat3[7]).toBeCloseTo(m12, 3);
    expect(mat3[8]).toBeCloseTo(m22, 3);
  });

  it('computes CSS filter string with contrast, brightness, and saturate functions', () => {
    const filter = computeCssColorGradingFilter({
      colorGradingEnabled: true,
      vibrance: 37,
      saturation: -5,
      inputBlack: 19,
      gamma: 0.85,
      inputWhite: 255,
      outputBlack: 0,
      outputWhite: 255,
    });

    expect(filter).toBeDefined();
    expect(filter).toContain('contrast(');
    expect(filter).toContain('brightness(');
    expect(filter).toContain('saturate(');

    // Bypasses when disabled or clean composite
    expect(computeCssColorGradingFilter({ colorGradingEnabled: false })).toBeUndefined();
    expect(computeCssColorGradingFilter({ colorGradingEnabled: true, useCleanComposite: true })).toBeUndefined();
  });
});


