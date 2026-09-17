import React, { useState, useCallback } from 'react';
import { CanvasBackground } from '../components/background/CanvasBackground';
import { bgLayers } from '../data/bgLayersData';
import { Sliders, Layers, Info, RotateCcw } from 'lucide-react';
import { useCanvasPlaygroundState, isOffRequested } from './bg-canvas/hooks/useCanvasPlaygroundState';
import { PlaygroundHeader } from './bg-canvas/components/PlaygroundHeader';
import { ControlsTab } from './bg-canvas/components/tabs/ControlsTab';
import { LayersTab } from './bg-canvas/components/tabs/LayersTab';
import { BenchmarkTab } from './bg-canvas/components/tabs/BenchmarkTab';
import type { PlaygroundTab } from './bg-canvas/types';

export { isOffRequested };

export const BgCanvasPlaygroundPage: React.FC = () => {
  const [hudMinimized, setHudMinimized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('controls');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const state = useCanvasPlaygroundState();
  const {
    parallaxIntensity,
    parallaxEnabled,
    reverseHorizontalParallax,
    reflectionEnabled,
    reflectionOpacity,
    reflectionBlendMode,
    waterDistortionEnabled,
    waterReactiveMode,
    waterRestingScale,
    waterDistortionScale,
    waterDistortionSpeed,
    waterPerspectivePower,
    waterBlur,
    waterBlurTransitionSpeed,
    waterFarBackBlur,
    waterWaveMode,
    waterBandCount,
    waterBandOffset,
    galaxyBreathingEnabled,
    galaxyBreathingSpeed,
    galaxyBreathingIntensity,
    bigStarShineEnabled,
    bigStarShineIntensity,
    bigStarShineSpeed,
    bigStarFlareSize,
    mistDisperseEnabled,
    mistDisperseSpeed,
    mistInstances,
    mistDistortionEnabled,
    mistDistortionScale,
    cloudDriftEnabled,
    cloudDriftSpeed,
    cloudDistortionEnabled,
    cloudDistortionScale,
    cloudMorphSpeed,
    turmoilEnabled,
    shootingStarEnabled,
    cometEnabled,
    cometFlameTailEnabled,
    cometFlameTailSpeed,
    cometTailTurbulence,
    cometTailFlickerIntensity,
    cometTailFlickerSpeed,
    cometTailSpreadFactor,
    cometTailFadePower,
    cometCorePulseEnabled,
    cometCoreBaseOpacity,
    cometCorePulseSpeed,
    cometCoreStretchScale,
    cometCorePeakBrightness,
    cometCoreBaselineOpacity,
    useCleanComposite,
    layerOverrides,
    colorGradingEnabled,
    vibrance,
    saturation,
    inputBlack,
    gamma,
    inputWhite,
    outputBlack,
    outputWhite,
    handleFpsUpdate,
    handleWaterTelemetry,
  } = state;

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#021319]">
      {/* 1. The HTML5 Canvas Background Engine */}
      <CanvasBackground
        interactive={parallaxEnabled}
        parallaxIntensity={parallaxIntensity}
        reverseHorizontalParallax={reverseHorizontalParallax}
        colorGradingEnabled={colorGradingEnabled}
        vibrance={vibrance}
        saturation={saturation}
        inputBlack={inputBlack}
        gamma={gamma}
        inputWhite={inputWhite}
        outputBlack={outputBlack}
        outputWhite={outputWhite}
        reflectionEnabled={reflectionEnabled}
        reflectionOpacity={reflectionOpacity}
        reflectionBlendMode={reflectionBlendMode}
        waterDistortionEnabled={waterDistortionEnabled}
        waterReactiveMode={waterReactiveMode}
        waterRestingScale={waterRestingScale}
        waterDistortionScale={waterDistortionScale}
        waterDistortionSpeed={waterDistortionSpeed}
        waterPerspectivePower={waterPerspectivePower}
        waterBlur={waterBlur}
        waterBlurTransitionSpeed={waterBlurTransitionSpeed}
        waterFarBackBlur={waterFarBackBlur}
        waterWaveMode={waterWaveMode}
        waterBandCount={waterBandCount}
        waterBandOffset={waterBandOffset}
        galaxyBreathingEnabled={galaxyBreathingEnabled}
        galaxyBreathingSpeed={galaxyBreathingSpeed}
        galaxyBreathingIntensity={galaxyBreathingIntensity}
        bigStarShineEnabled={bigStarShineEnabled}
        bigStarShineIntensity={bigStarShineIntensity}
        bigStarShineSpeed={bigStarShineSpeed}
        bigStarFlareSize={bigStarFlareSize}
        mistDisperseEnabled={mistDisperseEnabled}
        mistDisperseSpeed={mistDisperseSpeed}
        mistInstances={mistInstances}
        mistDistortionEnabled={mistDistortionEnabled}
        mistDistortionScale={mistDistortionScale}
        cloudDriftEnabled={cloudDriftEnabled}
        cloudDriftSpeed={cloudDriftSpeed}
        cloudDistortionEnabled={cloudDistortionEnabled}
        cloudDistortionScale={cloudDistortionScale}
        cloudMorphSpeed={cloudMorphSpeed}
        turmoilEnabled={turmoilEnabled}
        shootingStarEnabled={shootingStarEnabled}
        cometEnabled={cometEnabled}
        cometFlameTailEnabled={cometFlameTailEnabled}
        cometFlameTailSpeed={cometFlameTailSpeed}
        cometTailTurbulence={cometTailTurbulence}
        cometTailFlickerIntensity={cometTailFlickerIntensity}
        cometTailFlickerSpeed={cometTailFlickerSpeed}
        cometTailSpreadFactor={cometTailSpreadFactor}
        cometTailFadePower={cometTailFadePower}
        cometCorePulseEnabled={cometCorePulseEnabled}
        cometCoreBaseOpacity={cometCoreBaseOpacity}
        cometCorePulseSpeed={cometCorePulseSpeed}
        cometCoreStretchScale={cometCoreStretchScale}
        cometCorePeakBrightness={cometCorePeakBrightness}
        cometCoreBaselineOpacity={cometCoreBaselineOpacity}
        useCleanComposite={useCleanComposite}
        layerOverrides={layerOverrides}
        onFpsUpdate={handleFpsUpdate}
        onWaterTelemetry={handleWaterTelemetry}
      />

      {/* 2. Top Navigation Bar */}
      <PlaygroundHeader
        fps={state.fps}
        frameTimeMs={state.frameTimeMs}
        isSoloLayer0Active={state.isSoloLayer0Active}
        toggleSoloLayer0={state.toggleSoloLayer0}
        handleReset={state.handleReset}
        useCleanComposite={state.useCleanComposite}
        setUseCleanComposite={state.setUseCleanComposite}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        hudMinimized={hudMinimized}
        setHudMinimized={setHudMinimized}
      />

      {/* 3. Floating Interactive HUD Deck */}
      {!hudMinimized && (
        <aside className="absolute bottom-4 right-4 w-[94vw] sm:w-[460px] max-h-[84vh] flex flex-col rounded-2xl bg-[var(--bg-paper)]/90 backdrop-blur-xl border border-[var(--border-subtle)] shadow-2xl z-30 pointer-events-auto overflow-hidden animate-fadeIn">
          {/* HUD Header & Tabs */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)]/70 px-4 py-3 bg-[var(--bg-card)]/50">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('controls')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'controls'
                    ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Controls</span>
              </button>

              <button
                onClick={() => setActiveTab('layers')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'layers'
                    ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layers ({bgLayers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'info'
                    ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/40'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Benchmark & Specs</span>
              </button>
            </div>

            <button
              onClick={state.handleReset}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 transition-all"
              title="Reset all settings to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(84vh-60px)] space-y-4 text-xs">
            {activeTab === 'controls' && (
              <ControlsTab
                applyPreset={state.applyPreset}
                isSoloLayer0Active={state.isSoloLayer0Active}
                colorGradingEnabled={state.colorGradingEnabled}
                setColorGradingEnabled={state.setColorGradingEnabled}
                vibrance={state.vibrance}
                setVibrance={state.setVibrance}
                saturation={state.saturation}
                setSaturation={state.setSaturation}
                inputBlack={state.inputBlack}
                setInputBlack={state.setInputBlack}
                gamma={state.gamma}
                setGamma={state.setGamma}
                inputWhite={state.inputWhite}
                setInputWhite={state.setInputWhite}
                outputBlack={state.outputBlack}
                setOutputBlack={state.setOutputBlack}
                outputWhite={state.outputWhite}
                setOutputWhite={state.setOutputWhite}
                parallaxEnabled={state.parallaxEnabled}
                setParallaxEnabled={state.setParallaxEnabled}
                parallaxIntensity={state.parallaxIntensity}
                setParallaxIntensity={state.setParallaxIntensity}
                reverseHorizontalParallax={state.reverseHorizontalParallax}
                setReverseHorizontalParallax={state.setReverseHorizontalParallax}
                waterDistortionEnabled={state.waterDistortionEnabled}
                setWaterDistortionEnabled={state.setWaterDistortionEnabled}
                reflectionEnabled={state.reflectionEnabled}
                setReflectionEnabled={state.setReflectionEnabled}
                waterWaveMode={state.waterWaveMode}
                setWaterWaveMode={state.setWaterWaveMode}
                liveWaterSpeed={state.liveWaterSpeed}
                liveWaterBlur={state.liveWaterBlur}
                waterDistortionSpeed={state.waterDistortionSpeed}
                setWaterDistortionSpeed={state.setWaterDistortionSpeed}
                waterFarBackBlur={state.waterFarBackBlur}
                setWaterFarBackBlur={state.setWaterFarBackBlur}
                waterPerspectivePower={state.waterPerspectivePower}
                setWaterPerspectivePower={state.setWaterPerspectivePower}
                waterBandCount={state.waterBandCount}
                setWaterBandCount={state.setWaterBandCount}
                waterBandOffset={state.waterBandOffset}
                setWaterBandOffset={state.setWaterBandOffset}
                waterDistortionScale={state.waterDistortionScale}
                setWaterDistortionScale={state.setWaterDistortionScale}
                waterBlurTransitionSpeed={state.waterBlurTransitionSpeed}
                setWaterBlurTransitionSpeed={state.setWaterBlurTransitionSpeed}
                reflectionOpacity={state.reflectionOpacity}
                setReflectionOpacity={state.setReflectionOpacity}
                reflectionBlendMode={state.reflectionBlendMode}
                setReflectionBlendMode={state.setReflectionBlendMode}
                waterBlur={state.waterBlur}
                setWaterBlur={state.setWaterBlur}
                cometEnabled={state.cometEnabled}
                cometFlameTailEnabled={state.cometFlameTailEnabled}
                setCometFlameTailEnabled={state.setCometFlameTailEnabled}
                cometFlameTailSpeed={state.cometFlameTailSpeed}
                setCometFlameTailSpeed={state.setCometFlameTailSpeed}
                cometTailTurbulence={state.cometTailTurbulence}
                setCometTailTurbulence={state.setCometTailTurbulence}
                cometTailFlickerIntensity={state.cometTailFlickerIntensity}
                setCometTailFlickerIntensity={state.setCometTailFlickerIntensity}
                cometTailFlickerSpeed={state.cometTailFlickerSpeed}
                setCometTailFlickerSpeed={state.setCometTailFlickerSpeed}
                cometTailSpreadFactor={state.cometTailSpreadFactor}
                setCometTailSpreadFactor={state.setCometTailSpreadFactor}
                cometTailFadePower={state.cometTailFadePower}
                setCometTailFadePower={state.setCometTailFadePower}
                cometCorePulseEnabled={state.cometCorePulseEnabled}
                setCometCorePulseEnabled={state.setCometCorePulseEnabled}
                cometCoreBaseOpacity={state.cometCoreBaseOpacity}
                setCometCoreBaseOpacity={state.setCometCoreBaseOpacity}
                cometCorePulseSpeed={state.cometCorePulseSpeed}
                setCometCorePulseSpeed={state.setCometCorePulseSpeed}
                cometCoreStretchScale={state.cometCoreStretchScale}
                setCometCoreStretchScale={state.setCometCoreStretchScale}
                cometCorePeakBrightness={state.cometCorePeakBrightness}
                setCometCorePeakBrightness={state.setCometCorePeakBrightness}
                cometCoreBaselineOpacity={state.cometCoreBaselineOpacity}
                setCometCoreBaselineOpacity={state.setCometCoreBaselineOpacity}
                galaxyBreathingEnabled={state.galaxyBreathingEnabled}
                setGalaxyBreathingEnabled={state.setGalaxyBreathingEnabled}
                galaxyBreathingSpeed={state.galaxyBreathingSpeed}
                setGalaxyBreathingSpeed={state.setGalaxyBreathingSpeed}
                galaxyBreathingIntensity={state.galaxyBreathingIntensity}
                setGalaxyBreathingIntensity={state.setGalaxyBreathingIntensity}
                bigStarShineEnabled={state.bigStarShineEnabled}
                setBigStarShineEnabled={state.setBigStarShineEnabled}
                bigStarShineIntensity={state.bigStarShineIntensity}
                setBigStarShineIntensity={state.setBigStarShineIntensity}
                bigStarFlareSize={state.bigStarFlareSize}
                setBigStarFlareSize={state.setBigStarFlareSize}
                bigStarShineSpeed={state.bigStarShineSpeed}
                setBigStarShineSpeed={state.setBigStarShineSpeed}
                mistDisperseEnabled={state.mistDisperseEnabled}
                setMistDisperseEnabled={state.setMistDisperseEnabled}
                mistInstances={state.mistInstances}
                setMistInstances={state.setMistInstances}
                mistDisperseSpeed={state.mistDisperseSpeed}
                setMistDisperseSpeed={state.setMistDisperseSpeed}
                mistDistortionScale={state.mistDistortionScale}
                setMistDistortionScale={state.setMistDistortionScale}
                cloudDriftEnabled={state.cloudDriftEnabled}
                setCloudDriftEnabled={state.setCloudDriftEnabled}
                cloudDriftSpeed={state.cloudDriftSpeed}
                setCloudDriftSpeed={state.setCloudDriftSpeed}
                cloudDistortionEnabled={state.cloudDistortionEnabled}
                setCloudDistortionEnabled={state.setCloudDistortionEnabled}
                cloudDistortionScale={state.cloudDistortionScale}
                setCloudDistortionScale={state.setCloudDistortionScale}
                cloudMorphSpeed={state.cloudMorphSpeed}
                setCloudMorphSpeed={state.setCloudMorphSpeed}
              />
            )}

            {activeTab === 'layers' && (
              <LayersTab
                layerOverrides={state.layerOverrides}
                isSoloLayer0Active={state.isSoloLayer0Active}
                applySoloLayer0={state.applySoloLayer0}
                restoreAllLayers={state.restoreAllLayers}
                handleToggleLayer={state.handleToggleLayer}
                handleOpacityChange={state.handleOpacityChange}
              />
            )}

            {activeTab === 'info' && (
              <BenchmarkTab
                fps={state.fps}
                frameTimeMs={state.frameTimeMs}
              />
            )}
          </div>
        </aside>
      )}
    </div>
  );
};

export default BgCanvasPlaygroundPage;
