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
uniform float u_colorMix;       // How much to blend custom colors vs original

// Color uniforms (up to 5 colors)
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform vec4 u_color4;
uniform vec4 u_color5;

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
    
    // Create the original color
    vec3 originalColor = vec3(c1, c2, c3);
    
    // Create custom color blend
    // Map the values to blend between the custom colors
    float totalWeight = c1 + c2 + c3;
    totalWeight = max(totalWeight, 0.001); // Avoid division by zero
    
    // Normalize weights
    float w1 = c1 / totalWeight;
    float w2 = c2 / totalWeight;
    float w3 = c3 / totalWeight;
    
    // Create a gradient through all 5 colors based on position and time
    float gradientPos = (c1 + c2 * 2.0 + c3 * 3.0) / 6.0;
    gradientPos = fract(gradientPos + u_time * u_speed * 0.1);
    
    vec3 customColor;
    if (gradientPos < 0.2) {
        customColor = mix(u_color1.rgb, u_color2.rgb, gradientPos * 5.0);
    } else if (gradientPos < 0.4) {
        customColor = mix(u_color2.rgb, u_color3.rgb, (gradientPos - 0.2) * 5.0);
    } else if (gradientPos < 0.6) {
        customColor = mix(u_color3.rgb, u_color4.rgb, (gradientPos - 0.4) * 5.0);
    } else if (gradientPos < 0.8) {
        customColor = mix(u_color4.rgb, u_color5.rgb, (gradientPos - 0.6) * 5.0);
    } else {
        customColor = mix(u_color5.rgb, u_color1.rgb, (gradientPos - 0.8) * 5.0);
    }
    
    // Apply the wave patterns as brightness modulation
    customColor *= (c1 + c2 + c3) / 3.0;
    
    // Mix between original and custom colors
    vec3 finalColor = mix(originalColor, customColor, u_colorMix);
    
    vec4 color = vec4(finalColor, 1.0);
    
    ${colorBandingFix}
    
    fragColor = color;
}`;

export interface NorthernLightsShaderUniforms extends ShaderSizingUniforms {
  u_intensity: number;
  u_speed: number;
  u_colorMix: number;
  u_color1: vec4;
  u_color2: vec4;
  u_color3: vec4;
  u_color4: vec4;
  u_color5: vec4;
}

export interface NorthernLightsShaderParams extends ShaderSizingParams, ShaderMotionParams {
  intensity?: number;
  speed?: number;
  colorMix?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  color5?: string;
}