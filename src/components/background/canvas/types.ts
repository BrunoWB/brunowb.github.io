import { BgLayerConfig, ReflectionBlendMode } from '../../../types/background';

export interface ResolvedBgLayerConfig extends BgLayerConfig {
  visible: boolean;
  opacity: number;
}

export interface ActiveStreak {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTime: number;
  duration: number;
}

export interface CanvasCometConfig {
  flameTailEnabled: boolean;
  flameTailSpeed: number;
  tailTurbulence: number;
  tailFlickerIntensity: number;
  tailFlickerSpeed: number;
  tailSpreadFactor: number;
  tailFadePower: number;
  corePulseEnabled: boolean;
  coreBaseOpacity: number;
  corePulseSpeed: number;
  coreStretchScale: number;
  corePeakBrightness: number;
  coreBaselineOpacity: number;
}

export interface CanvasGalaxyConfig {
  breathingEnabled: boolean;
  breathingSpeed: number;
  breathingIntensity: number;
}

export interface CanvasCloudConfig {
  driftEnabled: boolean;
  driftSpeed: number;
  distortionEnabled: boolean;
  distortionScale: number;
  morphSpeed: number;
}

export interface CanvasMistConfig {
  disperseEnabled: boolean;
  disperseSpeed: number;
  instances: number;
  distortionEnabled: boolean;
  distortionScale: number;
}

export interface CanvasStarConfig {
  bigStarShineEnabled: boolean;
  bigStarShineIntensity: number;
  bigStarShineSpeed: number;
  bigStarFlareSize: number;
  shootingStarEnabled: boolean;
}

export interface CanvasWaterConfig {
  reflectionEnabled: boolean;
  reflectionOpacity: number;
  reflectionBlendMode: ReflectionBlendMode;
  distortionEnabled: boolean;
  reactiveMode: boolean;
  restingScale: number;
  distortionScale: number;
  distortionSpeed: number;
  perspectivePower: number;
  blur: number;
  blurTransitionSpeed: number;
  farBackBlur: number;
  waveMode: 'continuous' | 'bands';
  bandCount: number;
  bandOffset: number;
}

export interface CanvasColorGradingConfig {
  colorGradingEnabled: boolean;
  vibrance: number;
  saturation: number;
  inputBlack: number;
  gamma: number;
  inputWhite: number;
  outputBlack: number;
  outputWhite: number;
}

export interface ResolvedCanvasParams {
  baseLayers: ResolvedBgLayerConfig[];
  upperLayers: ResolvedBgLayerConfig[];
  reflectedLayers: ResolvedBgLayerConfig[];
  bigStarLayer?: ResolvedBgLayerConfig;
  resolvedLayers: ResolvedBgLayerConfig[];
  interactive: boolean;
  reverseHorizontalParallax: boolean;
  useCleanComposite: boolean;
  comet: CanvasCometConfig;
  galaxy: CanvasGalaxyConfig;
  cloud: CanvasCloudConfig;
  mist: CanvasMistConfig;
  star: CanvasStarConfig;
  water: CanvasWaterConfig;
  onFpsUpdate?: (fps: number, frameTimeMs: number) => void;
  onWaterTelemetry?: (speed: number, blur: number) => void;
}

