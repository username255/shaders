'use client';

import { Aurora } from '@paper-design/shaders-react';
import { folder, useControls } from 'leva';

export default function AuroraExample() {
  const { 
    stepSize,
    opacity,
    height,
    speed,
    noiseScale,
    contrast
  } = useControls({
    'Volumetric': folder({
      stepSize: { value: 0.1, min: 0.01, max: 0.3, step: 0.01, label: 'Step Size' },
      opacity: { value: 0.15, min: 0.01, max: 0.5, step: 0.01, label: 'Opacity' },
      height: { value: 1.5, min: 0.5, max: 3.0, step: 0.1, label: 'Height' },
    }),
    'Animation': folder({
      speed: { value: 1.0, min: 0, max: 3.0, step: 0.1, label: 'Speed' },
      noiseScale: { value: 0.8, min: 0.1, max: 2.0, step: 0.1, label: 'Noise Scale' },
      contrast: { value: 2.0, min: 1.0, max: 5.0, step: 0.1, label: 'Contrast' },
    }),
  });

  return (
    <Aurora
      stepSize={stepSize}
      opacity={opacity}
      height={height}
      speed={speed}
      noiseScale={noiseScale}
      contrast={contrast}
      color1="#00ff7f"
      color2="#00ffff"
      color3="#4169e1"
      color4="#9370db"
      color5="#ff1493"
      style={{ width: 400, height: 400 }}
    />
  );
}