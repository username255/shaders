'use client';

import { NorthernLights } from '@paper-design/shaders-react';
import { useControls } from 'leva';

export default function NorthernLightsExample() {
  const { 
    intensity,
    speed,
    colorMix
  } = useControls({
    intensity: { value: 1.0, min: 0.1, max: 2.0, step: 0.05, label: 'Intensity' },
    speed: { value: 1.0, min: 0, max: 3.0, step: 0.1, label: 'Speed' },
    colorMix: { value: 1.0, min: 0, max: 1.0, step: 0.05, label: 'Color Mix' },
  });

  return (
    <NorthernLights
      intensity={intensity}
      speed={speed}
      colorMix={colorMix}
      color1="#ff006e"
      color2="#00ffff"
      color3="#ffff00"
      color4="#00ff00"
      color5="#ff00ff"
      style={{ width: 400, height: 400 }}
    />
  );
}