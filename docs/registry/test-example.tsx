'use client';

import { Test } from '@paper-design/shaders-react';
import { folder, useControls } from 'leva';

export default function TestExample() {
  const { 
    iterations,
    stepSize,
    rotationSpeed,
    colorShift,
    shapeSize,
    brightness,
    mouseX, 
    mouseY,
    speed
  } = useControls({
    'Raymarching': folder({
      iterations: { value: 77, min: 20, max: 150, step: 1, label: 'Ray Steps' },
      stepSize: { value: 0.6, min: 0.1, max: 1.0, step: 0.05, label: 'Step Size' },
    }),
    'Visuals': folder({
      rotationSpeed: { value: 1.0, min: 0, max: 3.0, step: 0.1, label: 'Rotation Speed' },
      colorShift: { value: 0, min: -10, max: 10, step: 0.1, label: 'Color Shift' },
      shapeSize: { value: 0.125, min: 0.01, max: 0.5, step: 0.01, label: 'Shape Size' },
      brightness: { value: 1.0, min: 0.1, max: 3.0, step: 0.1, label: 'Brightness' },
    }),
    'Interaction': folder({
      mouseX: { value: 0, min: 0, max: 1000, step: 1 },
      mouseY: { value: 0, min: 0, max: 1000, step: 1 },
    }),
    'Animation': folder({
      speed: { value: 1, min: 0, max: 5, step: 0.1, label: 'Speed (0 = paused)' },
    }),
  });

  return (
    <Test
      iterations={iterations}
      stepSize={stepSize}
      rotationSpeed={rotationSpeed}
      colorShift={colorShift}
      shapeSize={shapeSize}
      brightness={brightness}
      mouseX={mouseX}
      mouseY={mouseY}
      speed={speed}
      style={{ width: 400, height: 400 }}
    />
  );
}