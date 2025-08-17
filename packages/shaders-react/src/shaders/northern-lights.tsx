import { memo } from 'react';
import { ShaderMount, type ShaderComponentProps } from '../shader-mount.js';
import {
  defaultObjectSizing,
  ShaderFitOptions,
  northernLightsFragmentShader,
  type NorthernLightsShaderParams,
  type NorthernLightsShaderUniforms,
  type ShaderPreset,
} from '@paper-design/shaders';

export interface NorthernLightsShaderProps extends ShaderComponentProps, NorthernLightsShaderParams {}

type NorthernLightsPreset = ShaderPreset<NorthernLightsShaderParams>;

export const defaultPreset: NorthernLightsPreset = {
  name: 'Default',
  params: {
    ...defaultObjectSizing,
    intensity: 1.0,
    speed: 1.0,
    frame: 0,
  },
};

export const intensePreset: NorthernLightsPreset = {
  name: 'Intense',
  params: {
    ...defaultObjectSizing,
    intensity: 1.5,
    speed: 1.2,
    frame: 0,
  },
};

export const slowPreset: NorthernLightsPreset = {
  name: 'Slow Motion',
  params: {
    ...defaultObjectSizing,
    intensity: 1.0,
    speed: 0.5,
    frame: 0,
  },
};

export const subtlePreset: NorthernLightsPreset = {
  name: 'Subtle',
  params: {
    ...defaultObjectSizing,
    intensity: 0.7,
    speed: 0.8,
    frame: 0,
  },
};

export const northernLightsPresets: NorthernLightsPreset[] = [defaultPreset, intensePreset, slowPreset, subtlePreset];

/**
 * Northern Lights shader component
 * Psychedelic wave interference patterns
 */
export const NorthernLights: React.FC<NorthernLightsShaderProps> = memo(function NorthernLights({
  // Own props
  intensity = defaultPreset.params.intensity,
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
}: NorthernLightsShaderProps) {
  const uniforms = {
    // Own uniforms
    u_intensity: intensity,
    u_speed: speed,
    
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
  } satisfies NorthernLightsShaderUniforms;

  return (
    <ShaderMount
      {...props}
      speed={speed}
      frame={frame}
      fragmentShader={northernLightsFragmentShader}
      uniforms={uniforms}
    />
  );
});