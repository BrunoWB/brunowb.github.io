export interface LayerState {
  visible: boolean;
  opacity: number;
}

export type PlaygroundPreset = 'default' | 'cinematic' | 'ethereal' | 'minimal' | 'storm' | 'cosmic';

export type PlaygroundTab = 'controls' | 'layers' | 'info';

export interface WaterTelemetry {
  liveWaterSpeed: number;
  liveWaterBlur: number;
}

export type { ScrimMode } from '../../types/background';
