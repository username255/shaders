'use client';

import { InfiniteTravel, infiniteTravelPresets } from '@paper-design/shaders-react';
import { folder, useControls, button } from 'leva';
import { setParamsSafe, useResetLevaParams } from '@/helpers/use-reset-leva-params';
import { useColors } from '@/helpers/use-colors';
import { BackButton } from '@/components/back-button';
import { cleanUpLevaParams } from '@/helpers/clean-up-leva-params';
import { ShaderFit, ShaderFitOptions } from '@paper-design/shaders';
import Link from 'next/link';

const { worldWidth, worldHeight, color1, color2, color3, backgroundColor, ...defaults } = infiniteTravelPresets[0].params;

export default function InfiniteTravelPage() {
  const { colors: colorsArray, setColors } = useColors({
    defaultColors: [color1, color2, color3, backgroundColor],
    maxColorCount: 4,
  });

  const [params, setParams] = useControls(() => ({
    'Raymarching': folder({
      iterations: { value: defaults.iterations, min: 20, max: 150, step: 1, label: 'Ray Steps' },
      stepSize: { value: defaults.stepSize, min: 0.1, max: 1.0, step: 0.05, label: 'Step Size' },
    }, { order: 1 }),
    'Visuals': folder({
      rotationSpeed: { value: defaults.rotationSpeed, min: 0, max: 3.0, step: 0.1, label: 'Rotation Speed' },
      colorShift: { value: defaults.colorShift, min: -10, max: 10, step: 0.1, label: 'Color Shift' },
      shapeSize: { value: defaults.shapeSize, min: 0.01, max: 0.5, step: 0.01, label: 'Shape Size' },
      brightness: { value: defaults.brightness, min: 0.1, max: 3.0, step: 0.1, label: 'Brightness' },
    }, { order: 2 }),
    'Animation': folder({
      speed: { value: defaults.speed, min: 0, max: 5, step: 0.1, label: 'Speed (0 = paused)' },
    }, { order: 3 }),
    'Transform': folder({
      scale: { value: defaults.scale, min: 0.01, max: 4, order: 400 },
      rotation: { value: defaults.rotation, min: 0, max: 360, order: 401 },
      offsetX: { value: defaults.offsetX, min: -1, max: 1, order: 402 },
      offsetY: { value: defaults.offsetY, min: -1, max: 1, order: 403 },
    }, { order: 4, collapsed: true }),
    'Fit': folder({
      fit: { value: defaults.fit, options: Object.keys(ShaderFitOptions) as ShaderFit[], order: 404 },
      worldWidth: { value: 1000, min: 0, max: 5120, order: 405 },
      worldHeight: { value: 500, min: 0, max: 5120, order: 406 },
      originX: { value: defaults.originX, min: 0, max: 1, order: 407 },
      originY: { value: defaults.originY, min: 0, max: 1, order: 408 },
    }, { order: 5, collapsed: true }),
  }), []);

  // Add preset buttons
  useControls(() => {
    const presets = Object.fromEntries(
      infiniteTravelPresets.map(({ name, params: { worldWidth, worldHeight, color1, color2, color3, backgroundColor, ...preset } }) => [
        name,
        button(() => {
          setColors([color1, color2, color3, backgroundColor]);
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
      <InfiniteTravel
        {...params}
        color1={colorsArray[0]}
        color2={colorsArray[1]}
        color3={colorsArray[2]}
        backgroundColor={colorsArray[3]}
        className="fixed size-full"
      />
    </>
  );
}