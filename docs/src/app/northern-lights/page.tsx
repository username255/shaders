'use client';

import { NorthernLights, northernLightsPresets } from '@paper-design/shaders-react';
import { folder, useControls, button } from 'leva';
import { setParamsSafe, useResetLevaParams } from '@/helpers/use-reset-leva-params';
import { BackButton } from '@/components/back-button';
import { cleanUpLevaParams } from '@/helpers/clean-up-leva-params';
import { ShaderFit, ShaderFitOptions } from '@paper-design/shaders';
import Link from 'next/link';

const { worldWidth, worldHeight, ...defaults } = northernLightsPresets[0].params;

export default function NorthernLightsPage() {
  const [params, setParams] = useControls(() => ({
    'Effect': folder({
      intensity: { value: defaults.intensity, min: 0.1, max: 2.0, step: 0.05, label: 'Intensity' },
      speed: { value: defaults.speed, min: 0, max: 3.0, step: 0.1, label: 'Speed (0 = paused)' },
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
      northernLightsPresets.map(({ name, params: { worldWidth, worldHeight, ...preset } }) => [
        name,
        button(() => {
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
        className="fixed size-full"
      />
    </>
  );
}