export type BlendMode = 'normal' | 'overlay' | 'screen' | 'color-dodge' | 'hard-light';

export type LayerCategory =
  | 'sky'
  | 'space'
  | 'stars'
  | 'clouds'
  | 'mist'
  | 'sea'
  | 'celestial';

export interface BgLayerConfig {
  id: string;
  depth: number;
  name: string;
  description: string;
  filename: string;
  blendMode: BlendMode;
  category: LayerCategory;
  defaultVisible: boolean;
  defaultOpacity: number;
  parallaxFactor: {
    x: number;
    y: number;
  };
  hasReflection: boolean;
  reflectionOpacity?: number;
}

export interface BigStarConfig {
  id: string;
  x: number;
  y: number;
  scale: number;
  phase: number;
  speedMult: number;
  hasReflection: boolean;
}

export type ReflectionBlendMode =
  | 'normal'
  | 'soft-light'
  | 'screen'
  | 'overlay'
  | 'hard-light'
  | 'color-dodge'
  | 'lighten'
  | 'plus-lighter'
  | 'multiply'
  | 'luminosity'
  | 'color';

export interface ReflectionBlendModeOption {
  value: ReflectionBlendMode;
  label: string;
  description: string;
}

export const REFLECTION_BLEND_MODES: ReflectionBlendModeOption[] = [
  {
    value: 'normal',
    label: 'Normal',
    description: 'Direct opaque reflection (source-over)',
  },
  {
    value: 'soft-light',
    label: 'Soft Light',
    description: 'Natural diffuse illumination; softly integrates with deep sea blue',
  },
  {
    value: 'screen',
    label: 'Screen',
    description: 'Luminous celestial highlights; preserves ocean depth without darkening',
  },
  {
    value: 'overlay',
    label: 'Overlay',
    description: 'Dynamic contrast; deepens wave troughs while highlighting wave crests',
  },
  {
    value: 'hard-light',
    label: 'Hard Light',
    description: 'Vivid specular clarity; bold reflective contrast across the water',
  },
  {
    value: 'color-dodge',
    label: 'Color Dodge',
    description: 'Glowing phosphorescent highlights; intense radiant reflection',
  },
  {
    value: 'lighten',
    label: 'Lighten',
    description: 'Selective highlight blend; retains water where darker than sky',
  },
  {
    value: 'plus-lighter',
    label: 'Plus Lighter',
    description: 'Pure additive photonic energy (lighter)',
  },
  {
    value: 'multiply',
    label: 'Multiply',
    description: 'Subtractive tint; darkens water with reflected celestial tones',
  },
  {
    value: 'luminosity',
    label: 'Luminosity',
    description: 'Locks oceanic turquoise hue while mirroring sky lightness & shading',
  },
  {
    value: 'color',
    label: 'Color',
    description: 'Tints water with sky chromaticity while preserving wave base lightness',
  },
];

export interface WaterSettings {
  enabled: boolean;
  distortionScale: number; // 0 to 40 (default ~16)
  distortionSpeed: number; // 0.1 to 3.0 (default 1.0)
  reflectionOpacity: number; // 0 to 1 (default 0.7)
  reflectionBlendMode?: ReflectionBlendMode;
  blurAmount: number; // 0 to 8 px (default 1.5)
  blurTransitionSpeed?: number;
  farBackBlur?: number;
  waterWaveMode?: 'continuous' | 'bands';
  waterBandCount?: number;
  waterBandOffset?: number;
}

export interface ParallaxSettings {
  enabled: boolean;
  intensity: number; // 0 to 3 (default 1.0)
  invert: boolean;
  reverseHorizontalParallax?: boolean;
  smoothness: number; // lerp factor (0.05 to 0.2)
  scrollParallax: boolean;
}

export interface ShootingStarState {
  active: boolean;
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  opacity: number;
}

export interface ColorGradingSettings {
  enabled: boolean;
  vibrance: number; // -100 to +100 (default 0)
  saturation: number; // -100 to +100 (default 0)
  inputBlack: number; // 0 to 255 (default 0)
  gamma: number; // 0.2 to 3.0 (default 1.0)
  inputWhite: number; // 0 to 255 (default 255)
  outputBlack: number; // 0 to 255 (default 0)
  outputWhite: number; // 0 to 255 (default 255)
}

