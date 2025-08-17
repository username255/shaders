'use client';

import { NorthernLights } from '@paper-design/shaders-react';
import { useControls } from 'leva';

export default function NorthernLightsExample() {
  const { 
    intensity,
    speed
  } = useControls({
    intensity: { value: 1.0, min: 0.1, max: 2.0, step: 0.05, label: 'Intensity' },
    speed: { value: 1.0, min: 0, max: 3.0, step: 0.1, label: 'Speed' },
  });

  return (
    <NorthernLights
      intensity={intensity}
      speed={speed}
      style={{ width: 400, height: 400 }}
    />
  );
}