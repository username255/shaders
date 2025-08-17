import type { vec2, vec4 } from '../types.js';
import type { ShaderMotionParams } from '../shader-mount.js';
import { sizingVariablesDeclaration, type ShaderSizingParams, type ShaderSizingUniforms } from '../shader-sizing.js';
import { colorBandingFix } from '../shader-utils.js';

/**
 * Northern Lights shader
 * Psychedelic wave interference patterns
 * Direct port of the original ShaderToy implementation
 */

// language=GLSL
export const northernLightsFragmentShader: string = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

// Effect parameters
uniform float u_intensity;      // Overall brightness/intensity
uniform float u_speed;          // Animation speed multiplier

${sizingVariablesDeclaration}

out vec4 fragColor;

void main() {
    // Direct port of the original shader
    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / u_resolution.xy;
    float x = p.x;
    float y = p.y;
    
    // Original shader calculations with u_time instead of iGlobalTime
    float mov0 = x + y + cos(sin(u_time * u_speed) * 2.0) * 100.0 + sin(x / 100.0) * 1000.0;
    float mov1 = y / 0.9 + u_time * u_speed;
    float mov2 = x / 0.2;
    
    float c1 = abs(sin(mov1 + u_time * u_speed) / 2.0 + mov2 / 2.0 - mov1 - mov2 + u_time * u_speed);
    float c2 = abs(sin(c1 + sin(mov0 / 1000.0 + u_time * u_speed) + sin(y / 40.0 + u_time * u_speed) + sin((x + y) / 100.0) * 3.0));
    float c3 = abs(sin(c2 + cos(mov1 + mov2 + c2) + cos(mov2) + sin(x / 1000.0)));
    
    // Apply intensity multiplier
    c1 *= u_intensity;
    c2 *= u_intensity;
    c3 *= u_intensity;
    
    // Direct output like the original
    vec4 color = vec4(c1, c2, c3, 1.0);
    
    ${colorBandingFix}
    
    fragColor = color;
}`;

export interface NorthernLightsShaderUniforms extends ShaderSizingUniforms {
  u_intensity: number;
  u_speed: number;
}

export interface NorthernLightsShaderParams extends ShaderSizingParams, ShaderMotionParams {
  intensity?: number;
  speed?: number;
}