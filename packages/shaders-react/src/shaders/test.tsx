import { memo } from 'react';
import { ShaderMount, type ShaderComponentProps } from '../shader-mount.js';
import {
  defaultObjectSizing,
  ShaderFitOptions,
  testFragmentShader,
  getShaderColorFromString,
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
    color1: '#ff6b6b',  // Coral red
    color2: '#4ecdc4',  // Turquoise
    color3: '#ffe66d',  // Golden yellow
    backgroundColor: '#0a0a0a',  // Dark background
    speed: 1,
    frame: 0,
  },
};

export const neonPreset: TestPreset = {
  name: 'Neon',
  params: {
    ...defaultObjectSizing,
    iterations: 77,
    stepSize: 0.6,
    rotationSpeed: 1.0,
    colorShift: 0,
    shapeSize: 0.125,
    brightness: 1.2,
    mouseX: 0,
    mouseY: 0,
    color1: '#00ff00',  // Neon green
    color2: '#ff00ff',  // Magenta
    color3: '#00ffff',  // Cyan
    backgroundColor: '#000000',  // Black
    speed: 1,
    frame: 0,
  },
};

export const sunsetPreset: TestPreset = {
  name: 'Sunset',
  params: {
    ...defaultObjectSizing,
    iterations: 77,
    stepSize: 0.6,
    rotationSpeed: 0.8,
    colorShift: 0,
    shapeSize: 0.125,
    brightness: 0.9,
    mouseX: 0,
    mouseY: 0,
    color1: '#ff6b35',  // Orange
    color2: '#f77b71',  // Salmon
    color3: '#b56576',  // Dusty rose
    backgroundColor: '#2d1b69',  // Deep purple
    speed: 0.8,
    frame: 0,
  },
};

export const oceanPreset: TestPreset = {
  name: 'Ocean',
  params: {
    ...defaultObjectSizing,
    iterations: 77,
    stepSize: 0.6,
    rotationSpeed: 0.6,
    colorShift: 0,
    shapeSize: 0.125,
    brightness: 0.8,
    mouseX: 0,
    mouseY: 0,
    color1: '#0077be',  // Ocean blue
    color2: '#00a8cc',  // Light blue
    color3: '#74d3ae',  // Seafoam
    backgroundColor: '#001f3f',  // Navy
    speed: 0.6,
    frame: 0,
  },
};

export const testPresets: TestPreset[] = [defaultPreset, neonPreset, sunsetPreset, oceanPreset];

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
  color1 = defaultPreset.params.color1,
  color2 = defaultPreset.params.color2,
  color3 = defaultPreset.params.color3,
  backgroundColor = defaultPreset.params.backgroundColor,
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
    u_color1: getShaderColorFromString(color1),
    u_color2: getShaderColorFromString(color2),
    u_color3: getShaderColorFromString(color3),
    u_backgroundColor: getShaderColorFromString(backgroundColor),
    
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