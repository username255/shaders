import { memo } from 'react';
import { ShaderMount, type ShaderComponentProps } from '../shader-mount.js';
import {
  defaultObjectSizing,
  ShaderFitOptions,
  auroraFragmentShader,
  getShaderColorFromString,
  type AuroraShaderParams,
  type AuroraShaderUniforms,
  type ShaderPreset,
} from '@paper-design/shaders';

export interface AuroraShaderProps extends ShaderComponentProps, AuroraShaderParams {}

type AuroraPreset = ShaderPreset<AuroraShaderParams>;

export const defaultPreset: AuroraPreset = {
  name: 'Classic Aurora',
  params: {
    ...defaultObjectSizing,
    stepSize: 0.1,
    opacity: 1.0,
    height: 1.5,
    speed: 1.0,
    noiseScale: 0.8,
    contrast: 2.0,
    brightness: 2.0,
    shape: 'horizontal' as const,
    color1: '#00ff7f',  // Spring green
    color2: '#00ffff',  // Cyan
    color3: '#4169e1',  // Royal blue
    color4: '#9370db',  // Medium purple
    color5: '#ff1493',  // Deep pink
    frame: 0,
  },
};

export const northernPreset: AuroraPreset = {
  name: 'Northern Lights',
  params: {
    ...defaultObjectSizing,
    stepSize: 0.08,
    opacity: 0.8,
    height: 2.0,
    speed: 0.8,
    noiseScale: 0.6,
    contrast: 2.5,
    brightness: 1.8,
    shape: 'horizontal' as const,
    color1: '#00ff00',  // Pure green
    color2: '#40e0d0',  // Turquoise
    color3: '#00ced1',  // Dark turquoise
    color4: '#291d95',  // Blue
    color5: '#e200e6',  // Violet pink
    frame: 0,
  },
};

export const cosmicPreset: AuroraPreset = {
  name: 'Cosmic Curtains',
  params: {
    ...defaultObjectSizing,
    stepSize: 0.12,
    opacity: 1.2,
    height: 1.2,
    speed: 1.2,
    noiseScale: 1.0,
    contrast: 1.8,
    brightness: 2.5,
    shape: 'horizontal' as const,
    color1: '#ff00ff',  // Magenta
    color2: '#ff69b4',  // Hot pink
    color3: '#ff4500',  // Orange red
    color4: '#ffd700',  // Gold
    color5: '#00ffff',  // Cyan
    frame: 0,
  },
};

export const subtlePreset: AuroraPreset = {
  name: 'Subtle Glow',
  params: {
    ...defaultObjectSizing,
    stepSize: 0.15,
    opacity: 0.6,
    height: 1.8,
    speed: 0.5,
    noiseScale: 0.5,
    contrast: 3.0,
    brightness: 1.5,
    shape: 'horizontal' as const,
    color1: '#87ceeb',  // Sky blue
    color2: '#98fb98',  // Pale green
    color3: '#dda0dd',  // Plum
    color4: '#f0e68c',  // Khaki
    color5: '#ffa07a',  // Light salmon
    frame: 0,
  },
};

export const firePreset: AuroraPreset = {
  name: 'Fire Aurora',
  params: {
    ...defaultObjectSizing,
    stepSize: 0.1,
    opacity: 1.4,
    height: 1.0,
    speed: 1.5,
    noiseScale: 1.2,
    contrast: 2.2,
    brightness: 3.0,
    shape: 'horizontal' as const,
    color1: '#ff0000',  // Red
    color2: '#ff4500',  // Orange red
    color3: '#ff8c00',  // Dark orange
    color4: '#ffd700',  // Gold
    color5: '#ffff00',  // Yellow
    frame: 0,
  },
};

export const auroraPresets: AuroraPreset[] = [defaultPreset, northernPreset, cosmicPreset, subtlePreset, firePreset];

/**
 * Aurora shader component
 * Volumetric aurora borealis effect with customizable colors
 */
export const Aurora: React.FC<AuroraShaderProps> = memo(function Aurora({
  // Own props
  stepSize = defaultPreset.params.stepSize,
  opacity = defaultPreset.params.opacity,
  height = defaultPreset.params.height,
  speed = defaultPreset.params.speed,
  noiseScale = defaultPreset.params.noiseScale,
  contrast = defaultPreset.params.contrast,
  brightness = defaultPreset.params.brightness,
  shape = defaultPreset.params.shape,
  color1 = defaultPreset.params.color1,
  color2 = defaultPreset.params.color2,
  color3 = defaultPreset.params.color3,
  color4 = defaultPreset.params.color4,
  color5 = defaultPreset.params.color5,
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
}: AuroraShaderProps) {
  const uniforms = {
    // Own uniforms
    u_stepSize: stepSize,
    u_opacity: opacity,
    u_height: height,
    u_speed: speed,
    u_noiseScale: noiseScale,
    u_contrast: contrast,
    u_brightness: brightness,
    u_shape: shape === 'horizontal' ? 1.0 : 0.0,
    u_color1: getShaderColorFromString(color1),
    u_color2: getShaderColorFromString(color2),
    u_color3: getShaderColorFromString(color3),
    u_color4: getShaderColorFromString(color4),
    u_color5: getShaderColorFromString(color5),
    
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
  } satisfies AuroraShaderUniforms;

  return (
    <ShaderMount
      {...props}
      speed={speed}
      frame={frame}
      fragmentShader={auroraFragmentShader}
      uniforms={uniforms}
    />
  );
});