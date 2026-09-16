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

export interface WaterSettings {
  enabled: boolean;
  distortionScale: number; // 0 to 40 (default ~16)
  distortionSpeed: number; // 0.1 to 3.0 (default 1.0)
  reflectionOpacity: number; // 0 to 1 (default 0.7)
  blurAmount: number; // 0 to 8 px (default 1.5)
}

export interface ParallaxSettings {
  enabled: boolean;
  intensity: number; // 0 to 3 (default 1.0)
  invert: boolean;
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
