import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CanvasBackground } from '../../src/components/background/CanvasBackground';
import { ControlsTab } from '../../src/pages/bg-canvas/components/tabs/ControlsTab';
import { ThemeProvider } from '../../src/context/ThemeContext';

describe('Ambient Scrim & Lightening/Darkening Controls in /bg', () => {
  it('renders CanvasBackground with dark scrim by default and handles custom opacities', () => {
    const { container, rerender } = render(
      <CanvasBackground scrimMode="dark" darkScrimOpacity={0.85} />
    );

    const scrims = container.querySelectorAll('.absolute.inset-0.pointer-events-none');
    expect(scrims.length).toBeGreaterThanOrEqual(2);

    // Dark scrim should have opacity 0.85, Light scrim opacity 0
    const darkScrim = scrims[0] as HTMLElement;
    const lightScrim = scrims[1] as HTMLElement;
    expect(darkScrim.style.opacity).toBe('0.85');
    expect(darkScrim.style.background).toContain('radial-gradient');
    expect(lightScrim.style.opacity).toBe('0');

    // Rerender with light scrim
    rerender(<CanvasBackground scrimMode="light" lightScrimOpacity={0.65} />);
    expect(darkScrim.style.opacity).toBe('0');
    expect(lightScrim.style.opacity).toBe('0.65');
    expect(lightScrim.style.background).toContain('radial-gradient');

    // Rerender with none
    rerender(<CanvasBackground scrimMode="none" />);
    expect(darkScrim.style.opacity).toBe('0');
    expect(lightScrim.style.opacity).toBe('0');
  });

  it('renders None/Dark/Light radio toggle in ControlsTab on top of options', () => {
    const setScrimMode = vi.fn();
    const setDarkScrimOpacity = vi.fn();
    const setLightScrimOpacity = vi.fn();

    render(
      <ThemeProvider>
        <ControlsTab
          scrimMode="dark"
          setScrimMode={setScrimMode}
          darkScrimOpacity={0.60}
          setDarkScrimOpacity={setDarkScrimOpacity}
          lightScrimOpacity={0.40}
          setLightScrimOpacity={setLightScrimOpacity}
          darkCenterGlowOpacity={0.38}
          setDarkCenterGlowOpacity={vi.fn()}
          darkMidHazeOpacity={0.49}
          setDarkMidHazeOpacity={vi.fn()}
          darkEdgeVignetteOpacity={0.83}
          setDarkEdgeVignetteOpacity={vi.fn()}
          lightTopSkyOpacity={0.86}
          setLightTopSkyOpacity={vi.fn()}
          lightMidAtmosphericOpacity={0.44}
          setLightMidAtmosphericOpacity={vi.fn()}
          lightBottomHorizonOpacity={0.19}
          setLightBottomHorizonOpacity={vi.fn()}
          applyPreset={vi.fn()}
          isSoloLayer0Active={false}
          colorGradingEnabled={true}
          setColorGradingEnabled={vi.fn()}
          vibrance={37}
          setVibrance={vi.fn()}
          saturation={-5}
          setSaturation={vi.fn()}
          inputBlack={19}
          setInputBlack={vi.fn()}
          gamma={0.85}
          setGamma={vi.fn()}
          inputWhite={255}
          setInputWhite={vi.fn()}
          outputBlack={0}
          setOutputBlack={vi.fn()}
          outputWhite={255}
          setOutputWhite={vi.fn()}
          parallaxEnabled={true}
          setParallaxEnabled={vi.fn()}
          parallaxIntensity={0.5}
          setParallaxIntensity={vi.fn()}
          reverseHorizontalParallax={true}
          setReverseHorizontalParallax={vi.fn()}
          waterDistortionEnabled={true}
          setWaterDistortionEnabled={vi.fn()}
          reflectionEnabled={true}
          setReflectionEnabled={vi.fn()}
          waterWaveMode="bands"
          setWaterWaveMode={vi.fn()}
          liveWaterSpeed={0.2}
          liveWaterBlur={0}
          waterDistortionSpeed={0.2}
          setWaterDistortionSpeed={vi.fn()}
          waterFarBackBlur={0}
          setWaterFarBackBlur={vi.fn()}
          waterPerspectivePower={3}
          setWaterPerspectivePower={vi.fn()}
          waterBandCount={50}
          setWaterBandCount={vi.fn()}
          waterBandOffset={0.2}
          setWaterBandOffset={vi.fn()}
          waterDistortionScale={40}
          setWaterDistortionScale={vi.fn()}
          waterBlurTransitionSpeed={1.8}
          setWaterBlurTransitionSpeed={vi.fn()}
          reflectionOpacity={0.4}
          setReflectionOpacity={vi.fn()}
          reflectionBlendMode="hard-light"
          setReflectionBlendMode={vi.fn()}
          waterBlur={0}
          setWaterBlur={vi.fn()}
          cometEnabled={true}
          cometFlameTailEnabled={true}
          setCometFlameTailEnabled={vi.fn()}
          cometFlameTailSpeed={0.2}
          setCometFlameTailSpeed={vi.fn()}
          cometTailTurbulence={0.2}
          setCometTailTurbulence={vi.fn()}
          cometTailFlickerIntensity={1.1}
          setCometTailFlickerIntensity={vi.fn()}
          cometTailFlickerSpeed={0.2}
          setCometTailFlickerSpeed={vi.fn()}
          cometTailSpreadFactor={2.2}
          setCometTailSpreadFactor={vi.fn()}
          cometTailFadePower={0.5}
          setCometTailFadePower={vi.fn()}
          cometCorePulseEnabled={true}
          setCometCorePulseEnabled={vi.fn()}
          cometCoreBaseOpacity={0.75}
          setCometCoreBaseOpacity={vi.fn()}
          cometCorePulseSpeed={0.2}
          setCometCorePulseSpeed={vi.fn()}
          cometCoreStretchScale={1.5}
          setCometCoreStretchScale={vi.fn()}
          cometCorePeakBrightness={0.74}
          setCometCorePeakBrightness={vi.fn()}
          cometCoreBaselineOpacity={0.04}
          setCometCoreBaselineOpacity={vi.fn()}
          galaxyBreathingEnabled={true}
          setGalaxyBreathingEnabled={vi.fn()}
          galaxyBreathingSpeed={2.5}
          setGalaxyBreathingSpeed={vi.fn()}
          galaxyBreathingIntensity={2}
          setGalaxyBreathingIntensity={vi.fn()}
          bigStarShineEnabled={true}
          setBigStarShineEnabled={vi.fn()}
          bigStarShineIntensity={0.12}
          setBigStarShineIntensity={vi.fn()}
          bigStarFlareSize={20}
          setBigStarFlareSize={vi.fn()}
          bigStarShineSpeed={0.4}
          setBigStarShineSpeed={vi.fn()}
          mistDisperseEnabled={true}
          setMistDisperseEnabled={vi.fn()}
          mistInstances={3}
          setMistInstances={vi.fn()}
          mistDisperseSpeed={1}
          setMistDisperseSpeed={vi.fn()}
          mistDistortionScale={8}
          setMistDistortionScale={vi.fn()}
          cloudDriftEnabled={true}
          setCloudDriftEnabled={vi.fn()}
          cloudDriftSpeed={0.8}
          setCloudDriftSpeed={vi.fn()}
          cloudDistortionEnabled={true}
          setCloudDistortionEnabled={vi.fn()}
          cloudDistortionScale={6}
          setCloudDistortionScale={vi.fn()}
          cloudMorphSpeed={0.8}
          setCloudMorphSpeed={vi.fn()}
        />
      </ThemeProvider>
    );

    // Radio group should be visible
    const radiogroup = screen.getByRole('radiogroup', { name: /ambient lighting and scrim mode/i });
    expect(radiogroup).toBeInTheDocument();

    const noneRadio = screen.getByRole('radio', { name: /none/i });
    const darkRadio = screen.getByRole('radio', { name: /dark/i });
    const lightRadio = screen.getByRole('radio', { name: /light/i });

    expect(noneRadio).toBeInTheDocument();
    expect(darkRadio).toBeInTheDocument();
    expect(lightRadio).toBeInTheDocument();
    expect(darkRadio).toBeChecked();

    // In Dark mode, shows values of darkening
    expect(screen.getByText(/darkening scrim/i)).toBeInTheDocument();
    expect(screen.getByText(/rgba\(9, 71, 87, 0.38\)/i)).toBeInTheDocument();
    expect(screen.getByText(/rgba\(3, 35, 44, 0.49\)/i)).toBeInTheDocument();
    expect(screen.getByText(/rgba\(2, 19, 25, 0.83\)/i)).toBeInTheDocument();

    // Check that dark stop sliders are rendered with initial values
    const centerGlowSlider = screen.getByRole('slider', { name: /center glow \(0%\) opacity/i });
    expect(centerGlowSlider).toHaveValue('0.38');
    const midHazeSlider = screen.getByRole('slider', { name: /mid haze \(60%\) opacity/i });
    expect(midHazeSlider).toHaveValue('0.49');
    const edgeVignetteSlider = screen.getByRole('slider', { name: /edge vignette \(100%\) opacity/i });
    expect(edgeVignetteSlider).toHaveValue('0.83');

    // Clicking light triggers setScrimMode('light')
    fireEvent.click(lightRadio);
    expect(setScrimMode).toHaveBeenCalledWith('light');

    // Clicking none triggers setScrimMode('none')
    fireEvent.click(noneRadio);
    expect(setScrimMode).toHaveBeenCalledWith('none');
  });

  it('displays lightening values and sliders when in light mode', () => {
    const setLightScrimOpacity = vi.fn();
    const setLightTopSkyOpacity = vi.fn();

    render(
      <ThemeProvider>
        <ControlsTab
          scrimMode="light"
          setScrimMode={vi.fn()}
          darkScrimOpacity={0.60}
          setDarkScrimOpacity={vi.fn()}
          lightScrimOpacity={0.40}
          setLightScrimOpacity={setLightScrimOpacity}
          darkCenterGlowOpacity={0.38}
          setDarkCenterGlowOpacity={vi.fn()}
          darkMidHazeOpacity={0.49}
          setDarkMidHazeOpacity={vi.fn()}
          darkEdgeVignetteOpacity={0.83}
          setDarkEdgeVignetteOpacity={vi.fn()}
          lightTopSkyOpacity={0.86}
          setLightTopSkyOpacity={setLightTopSkyOpacity}
          lightMidAtmosphericOpacity={0.44}
          setLightMidAtmosphericOpacity={vi.fn()}
          lightBottomHorizonOpacity={0.19}
          setLightBottomHorizonOpacity={vi.fn()}
          applyPreset={vi.fn()}
          isSoloLayer0Active={false}
          colorGradingEnabled={true}
          setColorGradingEnabled={vi.fn()}
          vibrance={37}
          setVibrance={vi.fn()}
          saturation={-5}
          setSaturation={vi.fn()}
          inputBlack={19}
          setInputBlack={vi.fn()}
          gamma={0.85}
          setGamma={vi.fn()}
          inputWhite={255}
          setInputWhite={vi.fn()}
          outputBlack={0}
          setOutputBlack={vi.fn()}
          outputWhite={255}
          setOutputWhite={vi.fn()}
          parallaxEnabled={true}
          setParallaxEnabled={vi.fn()}
          parallaxIntensity={0.5}
          setParallaxIntensity={vi.fn()}
          reverseHorizontalParallax={true}
          setReverseHorizontalParallax={vi.fn()}
          waterDistortionEnabled={true}
          setWaterDistortionEnabled={vi.fn()}
          reflectionEnabled={true}
          setReflectionEnabled={vi.fn()}
          waterWaveMode="bands"
          setWaterWaveMode={vi.fn()}
          liveWaterSpeed={0.2}
          liveWaterBlur={0}
          waterDistortionSpeed={0.2}
          setWaterDistortionSpeed={vi.fn()}
          waterFarBackBlur={0}
          setWaterFarBackBlur={vi.fn()}
          waterPerspectivePower={3}
          setWaterPerspectivePower={vi.fn()}
          waterBandCount={50}
          setWaterBandCount={vi.fn()}
          waterBandOffset={0.2}
          setWaterBandOffset={vi.fn()}
          waterDistortionScale={40}
          setWaterDistortionScale={vi.fn()}
          waterBlurTransitionSpeed={1.8}
          setWaterBlurTransitionSpeed={vi.fn()}
          reflectionOpacity={0.4}
          setReflectionOpacity={vi.fn()}
          reflectionBlendMode="hard-light"
          setReflectionBlendMode={vi.fn()}
          waterBlur={0}
          setWaterBlur={vi.fn()}
          cometEnabled={true}
          cometFlameTailEnabled={true}
          setCometFlameTailEnabled={vi.fn()}
          cometFlameTailSpeed={0.2}
          setCometFlameTailSpeed={vi.fn()}
          cometTailTurbulence={0.2}
          setCometTailTurbulence={vi.fn()}
          cometTailFlickerIntensity={1.1}
          setCometTailFlickerIntensity={vi.fn()}
          cometTailFlickerSpeed={0.2}
          setCometTailFlickerSpeed={vi.fn()}
          cometTailSpreadFactor={2.2}
          setCometTailSpreadFactor={vi.fn()}
          cometTailFadePower={0.5}
          setCometTailFadePower={vi.fn()}
          cometCorePulseEnabled={true}
          setCometCorePulseEnabled={vi.fn()}
          cometCoreBaseOpacity={0.75}
          setCometCoreBaseOpacity={vi.fn()}
          cometCorePulseSpeed={0.2}
          setCometCorePulseSpeed={vi.fn()}
          cometCoreStretchScale={1.5}
          setCometCoreStretchScale={vi.fn()}
          cometCorePeakBrightness={0.74}
          setCometCorePeakBrightness={vi.fn()}
          cometCoreBaselineOpacity={0.04}
          setCometCoreBaselineOpacity={vi.fn()}
          galaxyBreathingEnabled={true}
          setGalaxyBreathingEnabled={vi.fn()}
          galaxyBreathingSpeed={2.5}
          setGalaxyBreathingSpeed={vi.fn()}
          galaxyBreathingIntensity={2}
          setGalaxyBreathingIntensity={vi.fn()}
          bigStarShineEnabled={true}
          setBigStarShineEnabled={vi.fn()}
          bigStarShineIntensity={0.12}
          setBigStarShineIntensity={vi.fn()}
          bigStarFlareSize={20}
          setBigStarFlareSize={vi.fn()}
          bigStarShineSpeed={0.4}
          setBigStarShineSpeed={vi.fn()}
          mistDisperseEnabled={true}
          setMistDisperseEnabled={vi.fn()}
          mistInstances={3}
          setMistInstances={vi.fn()}
          mistDisperseSpeed={1}
          setMistDisperseSpeed={vi.fn()}
          mistDistortionScale={8}
          setMistDistortionScale={vi.fn()}
          cloudDriftEnabled={true}
          setCloudDriftEnabled={vi.fn()}
          cloudDriftSpeed={0.8}
          setCloudDriftSpeed={vi.fn()}
          cloudDistortionEnabled={true}
          setCloudDistortionEnabled={vi.fn()}
          cloudDistortionScale={6}
          setCloudDistortionScale={vi.fn()}
          cloudMorphSpeed={0.8}
          setCloudMorphSpeed={vi.fn()}
        />
      </ThemeProvider>
    );

    // In Light mode, shows values of lightening
    expect(screen.getByText(/lightening scrim/i)).toBeInTheDocument();
    expect(screen.getByText(/rgba\(235, 246, 250, 0.86\)/i)).toBeInTheDocument();
    expect(screen.getByText(/rgba\(218, 238, 246, 0.44\)/i)).toBeInTheDocument();
    expect(screen.getByText(/rgba\(195, 226, 238, 0.19\)/i)).toBeInTheDocument();

    // Check that light stop sliders are rendered with initial values
    const centerSkySlider = screen.getByRole('slider', { name: /center sky \(0%\) opacity/i });
    expect(centerSkySlider).toHaveValue('0.86');
    const midAtmosphericSlider = screen.getByRole('slider', { name: /mid atmospheric \(55%\) opacity/i });
    expect(midAtmosphericSlider).toHaveValue('0.44');
    const edgeHorizonSlider = screen.getByRole('slider', { name: /edge horizon \(100%\) opacity/i });
    expect(edgeHorizonSlider).toHaveValue('0.19');

    // Changing a slider triggers its setter
    fireEvent.change(centerSkySlider, { target: { value: '0.65' } });
    expect(setLightTopSkyOpacity).toHaveBeenCalledWith(0.65);
  });
});
