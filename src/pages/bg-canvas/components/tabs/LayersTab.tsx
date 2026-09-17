import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { bgLayers } from '../../../../data/bgLayersData';
import type { LayerState } from '../../types';

interface LayersTabProps {
  layerOverrides: Record<string, LayerState>;
  isSoloLayer0Active: boolean;
  applySoloLayer0: () => void;
  restoreAllLayers: () => void;
  handleToggleLayer: (id: string) => void;
  handleOpacityChange: (id: string, opacity: number) => void;
}

export const LayersTab: React.FC<LayersTabProps> = ({
  layerOverrides,
  isSoloLayer0Active,
  applySoloLayer0,
  restoreAllLayers,
  handleToggleLayer,
  handleOpacityChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50">
        <div className="text-[11px] text-[var(--text-muted)] font-medium">
          Quick Isolation:
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={applySoloLayer0}
            className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-all ${
              isSoloLayer0Active
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border-[var(--border-subtle)]'
            }`}
            title="Turns off all layers except Layer 0.0"
          >
            Solo Layer 0 (#off)
          </button>
          <button
            onClick={restoreAllLayers}
            className="px-2 py-1 rounded-lg text-[10px] font-medium bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)] transition-all"
            title="Restore all layers to default visibility"
          >
            Show All
          </button>
        </div>
      </div>

      <div className="text-[11px] text-[var(--text-muted)] flex justify-between px-1">
        <span>Layer Depth & Mode</span>
        <span>Visibility & Opacity</span>
      </div>

      {bgLayers.map((layer) => {
        const state = layerOverrides[layer.id] || {
          visible: layer.defaultVisible,
          opacity: layer.defaultOpacity,
        };

        return (
          <div
            key={layer.id}
            className={`p-2.5 rounded-xl border transition-all ${
              state.visible
                ? 'bg-[var(--bg-card)]/70 border-[var(--border-subtle)]'
                : 'bg-black/20 border-slate-800/50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleLayer(layer.id)}
                  className="text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  {state.visible ? (
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
                <div>
                  <div className="font-semibold text-[var(--text-primary)] leading-tight">
                    {layer.name}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    Depth {layer.depth.toFixed(1)} • {layer.category} • Parallax ({layer.parallaxFactor.x}, {layer.parallaxFactor.y})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                    layer.blendMode === 'normal'
                      ? 'bg-slate-700/40 text-slate-300'
                      : layer.blendMode === 'screen'
                      ? 'bg-blue-500/20 text-blue-300'
                      : layer.blendMode === 'color-dodge'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}
                >
                  {layer.blendMode}
                </span>
                {layer.hasReflection && (
                  <span className="px-1 py-0.5 rounded text-[8px] bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono">
                    REFL
                  </span>
                )}
              </div>
            </div>

            {/* Opacity slider */}
            <div className="flex items-center gap-2 mt-1 pt-1 border-t border-slate-800/40">
              <span className="text-[10px] text-[var(--text-muted)] w-12">Opacity:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.opacity}
                onChange={(e) => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                disabled={!state.visible}
                className="flex-1 accent-cyan-400 h-1 bg-slate-700 rounded cursor-pointer disabled:opacity-30"
              />
              <span className="text-[10px] font-mono text-[var(--text-secondary)] w-8 text-right">
                {Math.round(state.opacity * 100)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LayersTab;
