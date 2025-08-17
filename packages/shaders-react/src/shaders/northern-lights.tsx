import { memo } from 'react';
import { ShaderMount, type ShaderComponentProps } from '../shader-mount.js';
import {
  defaultObjectSizing,
  ShaderFitOptions,
  northernLightsFragmentShader,
  getShaderColorFromString,
  type NorthernLightsShaderParams,
  type NorthernLightsShaderUniforms,
  type ShaderPreset,
} from '@paper-design/shaders';

export interface NorthernLightsShaderProps extends ShaderComponentProps, NorthernLightsShaderParams {}

type NorthernLightsPreset = ShaderPreset<NorthernLightsShaderParams>;

export const defaultPreset: NorthernLightsPreset = {
  name: 'Original',
  params: {
    ...defaultObjectSizing,
    intensity: 1.0,
    speed: 1.0,
    colorMix: 0.0, // Use original colors
    color1: '#ff0000',
    color2: '#00ff00',
    color3: '#0000ff',
    color4: '#ffff00',
    color5: '#ff00ff',
    frame: 0,
  },
};

export const neonPreset: NorthernLightsPreset = {
  name: 'Neon Dreams',
  params: {
    ...defaultObjectSizing,
    intensity: 1.2,
    speed: 1.0,
    colorMix: 1.0, // Full custom colors
    color1: '#ff006e', // Hot pink
    color2: '#00ffff', // Cyan
    color3: '#ffff00', // Yellow
    color4: '#00ff00', // Lime
    color5: '#ff00ff', // Magenta
    frame: 0,
  },
};

export const sunsetPreset: NorthernLightsPreset = {
  name: 'Sunset',
  params: {
    ...defaultObjectSizing,
    intensity: 1.0,
    speed: 0.8,
    colorMix: 1.0,
    color1: '#ff6b35', // Orange
    color2: '#f77b71', // Salmon
    color3: '#b56576', // Dusty rose
    color4: '#6d597a', // Purple gray
    color5: '#355070', // Dark blue
    frame: 0,
  },
};

export const oceanPreset: NorthernLightsPreset = {
  name: 'Ocean',
  params: {
    ...defaultObjectSizing,
    intensity: 0.9,
    speed: 0.6,
    colorMix: 1.0,
    color1: '#0077be', // Ocean blue
    color2: '#00a8cc', // Light blue
    color3: '#74d3ae', // Seafoam
    color4: '#a0ecd0', // Mint
    color5: '#ffd23f', // Yellow accent
    frame: 0,
  },
};

export const galaxyPreset: NorthernLightsPreset = {
  name: 'Galaxy',
  params: {
    ...defaultObjectSizing,
    intensity: 1.1,
    speed: 1.2,
    colorMix: 1.0,
    color1: '#b721ff', // Purple
    color2: '#21d4fd', // Light blue
    color3: '#ff6ec7', // Pink
    color4: '#ffb900', // Gold
    color5: '#67e8f9', // Sky blue
    frame: 0,
  },
};

export const northernLightsPresets: NorthernLightsPreset[] = [defaultPreset, neonPreset, sunsetPreset, oceanPreset, galaxyPreset];

/**
 * Northern Lights shader component
 * Psychedelic wave interference patterns
 */
export const NorthernLights: React.FC<NorthernLightsShaderProps> = memo(function NorthernLights({
  // Own props
  intensity = defaultPreset.params.intensity,
  speed = defaultPreset.params.speed,
  colorMix = defaultPreset.params.colorMix,
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
}: NorthernLightsShaderProps) {
  const uniforms = {
    // Own uniforms
    u_intensity: intensity,
    u_speed: speed,
    u_colorMix: colorMix,
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