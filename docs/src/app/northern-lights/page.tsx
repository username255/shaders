'use client';

import { NorthernLights, northernLightsPresets } from '@paper-design/shaders-react';
import { folder, useControls, button } from 'leva';
import { setParamsSafe, useResetLevaParams } from '@/helpers/use-reset-leva-params';
import { useColors } from '@/helpers/use-colors';
import { BackButton } from '@/components/back-button';
import { cleanUpLevaParams } from '@/helpers/clean-up-leva-params';
import { ShaderFit, ShaderFitOptions } from '@paper-design/shaders';
import Link from 'next/link';

const { worldWidth, worldHeight, color1, color2, color3, color4, color5, ...defaults } = northernLightsPresets[0].params;

export default function NorthernLightsPage() {
  const { colors: colorsArray, setColors } = useColors({
    defaultColors: [color1, color2, color3, color4, color5],
    maxColorCount: 5,
  });

  const [params, setParams] = useControls(() => ({
    'Effect': folder({
      intensity: { value: defaults.intensity, min: 0.1, max: 2.0, step: 0.05, label: 'Intensity' },
      speed: { value: defaults.speed, min: 0, max: 3.0, step: 0.1, label: 'Speed (0 = paused)' },
      colorMix: { value: defaults.colorMix, min: 0, max: 1.0, step: 0.05, label: 'Color Mix (0=Original, 1=Custom)' },
    }, { order: 1 }),
    'Transform': folder({
      scale: { value: defaults.scale, min: 0.01, max: 4, order: 400 },
      rotation: { value: defaults.rotation, min: 0, max: 360, order: 401 },
      offsetX: { value: defaults.offsetX, min: -1, max: 1, order: 402 },
      offsetY: { value: defaults.offsetY, min: -1, max: 1, order: 403 },
    }, { order: 3, collapsed: true }),
    'Fit': folder({
      fit: { value: defaults.fit, options: Object.keys(ShaderFitOptions) as ShaderFit[], order: 404 },
      worldWidth: { value: 1000, min: 0, max: 5120, order: 405 },
      worldHeight: { value: 500, min: 0, max: 5120, order: 406 },
      originX: { value: defaults.originX, min: 0, max: 1, order: 407 },
      originY: { value: defaults.originY, min: 0, max: 1, order: 408 },
    }, { order: 4, collapsed: true }),
  }), []);

  // Add preset buttons
  useControls(() => {
    const presets = Object.fromEntries(
      northernLightsPresets.map(({ name, params: { worldWidth, worldHeight, color1, color2, color3, color4, color5, ...preset } }) => [
        name,
        button(() => {
          setColors([color1, color2, color3, color4, color5]);
          setParamsSafe(params, setParams, preset);
        }),
      ])
    );
    return {
      Presets: folder(presets, { order: -1 }),
    };
  });

  useResetLevaParams(params, setParams, defaults);
  cleanUpLevaParams(params);

  return (
    <>
      <Link href="/">
        <BackButton />
      </Link>
      <NorthernLights
        {...params}
        color1={colorsArray[0]}
        color2={colorsArray[1]}
        color3={colorsArray[2]}
        color4={colorsArray[3]}
        color5={colorsArray[4]}
        className="fixed size-full"
      />
    </>
  );
}