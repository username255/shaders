'use client';

import { Aurora, auroraPresets } from '@paper-design/shaders-react';
import { folder, useControls, button } from 'leva';
import { setParamsSafe, useResetLevaParams } from '@/helpers/use-reset-leva-params';
import { useColors } from '@/helpers/use-colors';
import { BackButton } from '@/components/back-button';
import { cleanUpLevaParams } from '@/helpers/clean-up-leva-params';
import { ShaderFit, ShaderFitOptions } from '@paper-design/shaders';
import Link from 'next/link';

const { worldWidth, worldHeight, color1, color2, color3, color4, color5, shape, ...defaults } = auroraPresets[0].params;

export default function AuroraPage() {
  const { colors: colorsArray, setColors } = useColors({
    defaultColors: [color1, color2, color3, color4, color5],
    maxColorCount: 5,
  });

  const [params, setParams] = useControls(() => ({
    shape: {
      value: shape || 'vertical',
      options: ['vertical', 'horizontal'],
      order: 0,
      label: 'Shape'
    },
    'Volumetric': folder({
      stepSize: { value: defaults.stepSize || 0.1, min: 0.01, max: 0.3, step: 0.01, label: 'Step Size' },
      opacity: { value: defaults.opacity || 1.0, min: 0.01, max: 2.0, step: 0.01, label: 'Opacity' },
      height: { value: defaults.height || 1.5, min: 0.5, max: 3.0, step: 0.1, label: 'Height' },
    }, { order: 1 }),
    'Animation': folder({
      speed: { value: defaults.speed || 1.0, min: 0, max: 3.0, step: 0.1, label: 'Speed (0 = paused)' },
      noiseScale: { value: defaults.noiseScale || 0.8, min: 0.1, max: 2.0, step: 0.1, label: 'Noise Scale' },
      contrast: { value: defaults.contrast || 2.0, min: 1.0, max: 5.0, step: 0.1, label: 'Contrast' },
      brightness: { value: defaults.brightness || 2.0, min: 0.5, max: 5.0, step: 0.1, label: 'Brightness' },
    }, { order: 2 }),
    'Transform': folder({
      scale: { value: defaults.scale || 1, min: 0.01, max: 4, order: 400 },
      rotation: { value: defaults.rotation || 0, min: 0, max: 360, order: 401 },
      offsetX: { value: defaults.offsetX || 0, min: -1, max: 1, order: 402 },
      offsetY: { value: defaults.offsetY || 0, min: -1, max: 1, order: 403 },
    }, { order: 3, collapsed: true }),
    'Fit': folder({
      fit: { value: defaults.fit || 'object-fit', options: Object.keys(ShaderFitOptions) as ShaderFit[], order: 404 },
      worldWidth: { value: 1000, min: 0, max: 5120, order: 405 },
      worldHeight: { value: 500, min: 0, max: 5120, order: 406 },
      originX: { value: defaults.originX || 0.5, min: 0, max: 1, order: 407 },
      originY: { value: defaults.originY || 0.5, min: 0, max: 1, order: 408 },
    }, { order: 4, collapsed: true }),
  }), []);

  // Add preset buttons - use a separate hook to avoid serialization warnings
  useControls(
    'Presets',
    () => {
      const presets = Object.fromEntries(
        auroraPresets.map(({ name, params: { worldWidth, worldHeight, color1, color2, color3, color4, color5, shape: presetShape, ...preset } }) => [
          name,
          button(() => {
            setColors([color1, color2, color3, color4, color5]);
            setParamsSafe(params, setParams, { ...preset, shape: presetShape });
          }),
        ])
      );
      return presets;
    },
    { order: -1 },
    []
  );

  useResetLevaParams(params, setParams, defaults);
  cleanUpLevaParams(params);

  return (
    <>
      <Link href="/">
        <BackButton />
      </Link>
      <Aurora
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