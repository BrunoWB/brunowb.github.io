/**
 * Photoshop Color Grading Utilities: Vibrance, Saturation, and Levels
 * High-performance GPU-accelerated SVG Filter LUT generation
 */

export interface ColorGradingValues {
  vibrance: number; // -100 to 100, default 0
  saturation: number; // -100 to 100, default 0
  inputBlack: number; // 0 to 255, default 0
  gamma: number; // 0.2 to 3.0, default 1.0
  inputWhite: number; // 0 to 255, default 255
  outputBlack: number; // 0 to 255, default 0
  outputWhite: number; // 0 to 255, default 255
}

export const DEFAULT_COLOR_GRADING: ColorGradingValues = {
  vibrance: 37,
  saturation: -5,
  inputBlack: 19,
  gamma: 0.85,
  inputWhite: 255,
  outputBlack: 0,
  outputWhite: 255,
};

/**
 * Calculates the exact Photoshop Levels formula for an input value x in [0, 1]:
 * x' = clamp((x - inB) / (inW - inB), 0, 1)
 * x'' = (x')^(1 / gamma)
 * out = outB + x'' * (outW - outB)
 */
export function calculatePhotoshopLevels(
  x: number,
  inB: number = 0,
  gamma: number = 1.0,
  inW: number = 255,
  outB: number = 0,
  outW: number = 255
): number {
  if (typeof x !== 'number' || Number.isNaN(x)) return 0;
  const inBNorm = Math.max(0, Math.min(255, Number.isFinite(inB) ? inB : 0)) / 255;
  const inWNorm = Math.max(0, Math.min(255, Number.isFinite(inW) ? inW : 255)) / 255;
  const outBNorm = Math.max(0, Math.min(255, Number.isFinite(outB) ? outB : 0)) / 255;
  const outWNorm = Math.max(0, Math.min(255, Number.isFinite(outW) ? outW : 255)) / 255;

  const range = inWNorm - inBNorm;
  const safeRange = Math.abs(range) < 0.0001 ? (range >= 0 ? 0.0001 : -0.0001) : range;

  // Step 1: Input range mapping & clamping
  const xPrime = Math.max(0, Math.min(1, (x - inBNorm) / safeRange));

  // Step 2: Gamma midtone adjustment
  const safeGamma = Math.max(0.01, Number.isFinite(gamma) ? gamma : 1.0);
  const xDoublePrime = Math.pow(xPrime, 1 / safeGamma);

  // Step 3: Output range mapping & clamping
  const out = outBNorm + xDoublePrime * (outWNorm - outBNorm);
  return Math.max(0, Math.min(1, out));
}

/**
 * Computes 1D LUT tableValues string (256 samples) for feFuncR, feFuncG, feFuncB
 */
export function computeLevelsTableValues(
  inB: number = 0,
  gamma: number = 1.0,
  inW: number = 255,
  outB: number = 0,
  outW: number = 255,
  samples: number = 256
): string {
  const count = Math.max(2, Math.floor(Number.isFinite(samples) ? samples : 256));
  const values: string[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const x = i / (count - 1);
    const out = calculatePhotoshopLevels(x, inB, gamma, inW, outB, outW);
    values[i] = out.toFixed(4);
  }
  return values.join(' ');
}

/**
 * Computes the 4x5 color matrix for Photoshop Vibrance & Saturation.
 * Preserves skin tones and natural highlights when boosting vibrance,
 * while saturation applies a uniform chromatic multiplier.
 */
export function computeVibranceSaturationMatrix(
  vibrance: number = 0,
  saturation: number = 0
): string {
  const safeSat = Number.isFinite(saturation) ? saturation : 0;
  const safeVib = Number.isFinite(vibrance) ? vibrance : 0;
  // Saturation multiplier: -100 -> 0.0, 0 -> 1.0, +100 -> 2.0
  const satMult = Math.max(0, 1 + safeSat / 100);

  // Vibrance factor: -100 -> -1.0, 0 -> 0.0, +100 -> 1.0
  const vibNorm = Math.max(-1, Math.min(1, safeVib / 100));

  // Channel-selective vibrance: protect warm tones (R), amplify cool & mid tones (G, B)
  let vibR: number;
  let vibG: number;
  let vibB: number;

  if (vibNorm >= 0) {
    vibR = 1 + vibNorm * 0.5;
    vibG = 1 + vibNorm * 1.0;
    vibB = 1 + vibNorm * 1.35;
  } else {
    vibR = 1 + vibNorm * 0.7;
    vibG = 1 + vibNorm * 1.0;
    vibB = 1 + vibNorm * 1.0;
  }

  const scaleR = Math.max(0, satMult * vibR);
  const scaleG = Math.max(0, satMult * vibG);
  const scaleB = Math.max(0, satMult * vibB);

  // ITU-R BT.709 sRGB luminance coefficients
  const wr = 0.2126;
  const wg = 0.7152;
  const wb = 0.0722;

  // Row 0: Red
  const m00 = (1 - scaleR) * wr + scaleR;
  const m01 = (1 - scaleR) * wg;
  const m02 = (1 - scaleR) * wb;

  // Row 1: Green
  const m10 = (1 - scaleG) * wr;
  const m11 = (1 - scaleG) * wg + scaleG;
  const m12 = (1 - scaleG) * wb;

  // Row 2: Blue
  const m20 = (1 - scaleB) * wr;
  const m21 = (1 - scaleB) * wg;
  const m22 = (1 - scaleB) * wb + scaleB;

  return [
    m00.toFixed(4), m01.toFixed(4), m02.toFixed(4), '0', '0',
    m10.toFixed(4), m11.toFixed(4), m12.toFixed(4), '0', '0',
    m20.toFixed(4), m21.toFixed(4), m22.toFixed(4), '0', '0',
    '0', '0', '0', '1', '0'
  ].join(' ');
}

/**
 * Computes a 3x3 column-major Float32Array for WebGL mat3 uniform.
 * Follows exact ITU-R BT.709 sRGB luminance coefficients and channel-selective vibrance.
 */
export function computeVibranceSaturationMatrix3x3(
  vibrance: number = 0,
  saturation: number = 0
): Float32Array {
  const safeSat = Number.isFinite(saturation) ? saturation : 0;
  const safeVib = Number.isFinite(vibrance) ? vibrance : 0;
  const satMult = Math.max(0, 1 + safeSat / 100);
  const vibNorm = Math.max(-1, Math.min(1, safeVib / 100));

  let vibR: number;
  let vibG: number;
  let vibB: number;

  if (vibNorm >= 0) {
    vibR = 1 + vibNorm * 0.5;
    vibG = 1 + vibNorm * 1.0;
    vibB = 1 + vibNorm * 1.35;
  } else {
    vibR = 1 + vibNorm * 0.7;
    vibG = 1 + vibNorm * 1.0;
    vibB = 1 + vibNorm * 1.0;
  }

  const scaleR = Math.max(0, satMult * vibR);
  const scaleG = Math.max(0, satMult * vibG);
  const scaleB = Math.max(0, satMult * vibB);

  const wr = 0.2126;
  const wg = 0.7152;
  const wb = 0.0722;

  // Row 0: Red
  const m00 = (1 - scaleR) * wr + scaleR;
  const m01 = (1 - scaleR) * wg;
  const m02 = (1 - scaleR) * wb;

  // Row 1: Green
  const m10 = (1 - scaleG) * wr;
  const m11 = (1 - scaleG) * wg + scaleG;
  const m12 = (1 - scaleG) * wb;

  // Row 2: Blue
  const m20 = (1 - scaleB) * wr;
  const m21 = (1 - scaleB) * wg;
  const m22 = (1 - scaleB) * wb + scaleB;

  // WebGL column-major order: Column 0, Column 1, Column 2
  return new Float32Array([
    m00, m10, m20,
    m01, m11, m21,
    m02, m12, m22,
  ]);
}

export interface CssColorGradingOptions {
  colorGradingEnabled?: boolean;
  useCleanComposite?: boolean;
  vibrance?: number;
  saturation?: number;
  inputBlack?: number;
  gamma?: number;
  inputWhite?: number;
  outputBlack?: number;
  outputWhite?: number;
}

/**
 * Computes standard CSS filter functions (contrast, brightness, saturate)
 * for hardware-accelerated color grading in the browser compositor (0ms CPU).
 */
export function computeCssColorGradingFilter(options: CssColorGradingOptions): string | undefined {
  if (!options.colorGradingEnabled || options.useCleanComposite) {
    return undefined;
  }

  const inB = options.inputBlack ?? 19;
  const inW = options.inputWhite ?? 255;
  const outB = options.outputBlack ?? 0;
  const outW = options.outputWhite ?? 255;
  const gamma = Math.max(0.1, options.gamma ?? 0.85);
  const sat = options.saturation ?? -5;
  const vib = options.vibrance ?? 37;

  // 1. Contrast: derived from input black/white range expansion
  const inRange = Math.max(1, inW - inB);
  const contrastFactor = +(255 / inRange).toFixed(3);

  // 2. Brightness: derived from output range, input black pedestal, and gamma midtone curve
  const outRange = (outW - outB) / 255;
  const gammaShift = Math.pow(0.5, 1 / gamma) / 0.5;
  const blackShift = 1 - inB / 510;
  const brightnessFactor = +(outRange * gammaShift * blackShift + outB / 255).toFixed(3);

  // 3. Saturation: combined channel saturation and vibrance boost
  const vibFactor = vib >= 0 ? 1 + (vib / 100) * 0.35 : 1 + (vib / 100) * 0.5;
  const satFactor = Math.max(0, 1 + sat / 100);
  const saturateFactor = +(satFactor * vibFactor).toFixed(3);

  return `contrast(${contrastFactor}) brightness(${brightnessFactor}) saturate(${saturateFactor})`;
}

