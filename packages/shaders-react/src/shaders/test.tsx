import { memo } from 'react';
import { ShaderMount, type ShaderComponentProps } from '../shader-mount.js';
import {
  defaultObjectSizing,
  ShaderFitOptions,
  testFragmentShader,
  type TestShaderParams,
  type TestShaderUniforms,
  type ShaderPreset,
} from '@paper-design/shaders';

export interface TestShaderProps extends ShaderComponentProps, TestShaderParams {}

type TestPreset = ShaderPreset<TestShaderParams>;

export const defaultPreset: TestPreset = {
  name: 'Default',
  params: {
    ...defaultObjectSizing,
    iterations: 77,
    stepSize: 0.6,
    rotationSpeed: 1.0,
    colorShift: 0,
    shapeSize: 0.125,
    brightness: 1.0,
    mouseX: 0,
    mouseY: 0,
    speed: 1,
    frame: 0,
  },
};

export const testPresets: TestPreset[] = [defaultPreset];

/**
 * Test shader component for GLSL experimentation
 * Raymarching fractal tunnel with dynamic lighting and customizable parameters
 */
export const Test: React.FC<TestShaderProps> = memo(function Test({
  // Own props
  iterations = defaultPreset.params.iterations,
  stepSize = defaultPreset.params.stepSize,
  rotationSpeed = defaultPreset.params.rotationSpeed,
  colorShift = defaultPreset.params.colorShift,
  shapeSize = defaultPreset.params.shapeSize,
  brightness = defaultPreset.params.brightness,
  mouseX = defaultPreset.params.mouseX,
  mouseY = defaultPreset.params.mouseY,
  speed = defaultPreset.params.speed,
  frame = defaultPreset.params.frame,
  
  // Sizing props
  fit = defaultPreset.params.fit,
  scale = defaultPreset.params.scale,
  rotation = defaultPreset.params.rotation,
  offsetX = defaultPreset.params.offsetX,
  offsetY = defaultPreset.params.offsetY,
  originX = defaultPreset.params.originX,
  originY = defaultPreset.params.originY,
  worldWidth = defaultPreset.params.worldWidth,
  worldHeight = defaultPreset.params.worldHeight,
  ...props
}: TestShaderProps) {
  const uniforms = {
    // Own uniforms
    u_iterations: iterations,
    u_stepSize: stepSize,
    u_rotationSpeed: rotationSpeed,
    u_colorShift: colorShift,
    u_shapeSize: shapeSize,
    u_brightness: brightness,
    u_mouse: [mouseX, mouseY],
    
    // Sizing uniforms
    u_fit: ShaderFitOptions[fit],
    u_scale: scale,
    u_rotation: rotation,
    u_offsetX: offsetX,
    u_offsetY: offsetY,
    u_originX: originX,
    u_originY: originY,
    u_worldWidth: worldWidth,
    u_worldHeight: worldHeight,
  } satisfies TestShaderUniforms;

  return (
    <ShaderMount
      {...props}
      speed={speed}
      frame={frame}
      fragmentShader={testFragmentShader}
      uniforms={uniforms}
    />
  );
});