import type { vec2, vec4 } from '../types.js';
import type { ShaderMotionParams } from '../shader-mount.js';
import { sizingVariablesDeclaration, type ShaderSizingParams, type ShaderSizingUniforms } from '../shader-sizing.js';
import { colorBandingFix, declareRandom } from '../shader-utils.js';

/**
 * Aurora shader
 * Volumetric aurora borealis effect using raymarching and Perlin noise
 */

// language=GLSL
export const auroraFragmentShader: string = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

// Effect parameters
uniform float u_stepSize;       // Ray marching step size
uniform float u_opacity;        // Overall opacity
uniform float u_height;         // Height of aurora curtains
uniform float u_speed;          // Animation speed
uniform float u_noiseScale;    // Scale of noise patterns
uniform float u_contrast;      // Contrast of the effect
uniform float u_brightness;     // Overall brightness multiplier
uniform float u_shape;          // Shape mode: 0 = vertical, 1 = horizontal

// Color uniforms (up to 5 colors for gradient)
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform vec4 u_color4;
uniform vec4 u_color5;

${sizingVariablesDeclaration}
${declareRandom}

out vec4 fragColor;

// Simple 2D noise function
float noise2D(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Smooth noise interpolation
float smoothNoise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    float a = noise2D(i);
    float b = noise2D(i + vec2(1.0, 0.0));
    float c = noise2D(i + vec2(0.0, 1.0));
    float d = noise2D(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractal Brownian Motion for more complex noise
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 4; i++) {
        value += amplitude * smoothNoise2D(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

// Get aurora density at a 3D position (simplified, not used in main anymore)
float getAuroraDensity(vec3 pos) {
    // Create scrolling noise layers
    vec2 offset1 = vec2(u_time * u_speed * 0.1, u_time * u_speed * 0.05);
    vec2 offset2 = vec2(-u_time * u_speed * 0.08, u_time * u_speed * 0.12);
    
    // Sample two noise layers
    float noise1 = fbm((pos.xz + offset1) * u_noiseScale);
    float noise2 = fbm((pos.xz + offset2) * u_noiseScale * 0.7);
    
    // Create "difference clouds" effect
    float noise = abs(noise1 - noise2);
    
    return noise;
}

// Get color based on position and band index
vec3 getAuroraColor(float y, float bandIndex, float layer) {
    // Use band and layer to select different colors
    float colorOffset = bandIndex * 0.3 + layer * 0.15;
    float t = fract(y * 0.5 + 0.5 + colorOffset);
    
    // Create gradient through all 5 colors
    vec3 color;
    if (t < 0.2) {
        color = mix(u_color1.rgb, u_color2.rgb, t * 5.0);
    } else if (t < 0.4) {
        color = mix(u_color2.rgb, u_color3.rgb, (t - 0.2) * 5.0);
    } else if (t < 0.6) {
        color = mix(u_color3.rgb, u_color4.rgb, (t - 0.4) * 5.0);
    } else if (t < 0.8) {
        color = mix(u_color4.rgb, u_color5.rgb, (t - 0.6) * 5.0);
    } else {
        color = mix(u_color5.rgb, u_color1.rgb, (t - 0.8) * 5.0);
    }
    
    return color;
}

void main() {
    // Use the transformed UV coordinates from the vertex shader
    vec2 uv = v_objectUV * 2.0; // Scale to -1 to 1
    
    // Swap coordinates for horizontal mode
    if (u_shape > 0.5) {
        uv = uv.yx;
    }
    
    // Start with transparent black
    vec3 finalColor = vec3(0.0);
    float totalAlpha = 0.0;
    
    // Create more varied aurora curtains
    float numCurtains = 5.0;
    
    for(float curtain = 0.0; curtain < numCurtains; curtain++) {
        // Randomize curtain properties using curtain index as seed
        float curtainSeed = curtain * 7.13;
        float curtainX = (random(vec2(curtainSeed, 1.0)) - 0.5) * 2.0;
        float curtainWidth = 0.3 + random(vec2(curtainSeed, 2.0)) * 0.3;
        float curtainPhase = random(vec2(curtainSeed, 3.0)) * 6.28;
        
        // Create vertical bands within each curtain
        float numBands = 2.0 + floor(random(vec2(curtainSeed, 4.0)) * 3.0);
        
        for(float band = 0.0; band < numBands; band++) {
            float bandOffset = (band / numBands - 0.5) * curtainWidth;
            
            // Create more complex wave patterns
            float wave1 = sin(uv.y * 2.0 + u_time * u_speed * 0.5 + curtainPhase) * 0.2;
            float wave2 = sin(uv.y * 5.0 - u_time * u_speed * 0.3 + band * 1.5) * 0.08;
            float wave3 = sin(uv.y * 9.0 + u_time * u_speed * 0.7 + curtain) * 0.04;
            float wave4 = cos(uv.y * 3.5 + u_time * u_speed * 0.4) * 0.06;
            
            // Combine waves for natural undulation
            float xWave = wave1 + wave2 + wave3 + wave4;
            float xCenter = curtainX + bandOffset + xWave;
            
            // Distance from band center
            float xDist = abs(uv.x - xCenter);
            
            // Create varying width along the curtain
            vec2 widthPos = vec2(curtain * 2.1, uv.y * 1.5 + u_time * u_speed * 0.1);
            float widthNoise = smoothNoise2D(widthPos * 3.0);
            float baseWidth = 0.08 + widthNoise * 0.12;
            
            // Height-based width variation (narrower at top and bottom)
            float heightWidth = 1.0 - pow(abs(uv.y), 2.0) * 0.5;
            baseWidth *= heightWidth;
            
            // Soft falloff for natural edges
            float bandIntensity = exp(-xDist * xDist / (baseWidth * baseWidth));
            
            // Add vertical structure
            vec2 structurePos = vec2(xCenter * 3.0, uv.y * 2.0) * u_noiseScale;
            structurePos.y += u_time * u_speed * 0.15;
            float structure1 = fbm(structurePos);
            float structure2 = fbm(structurePos * 1.3 + vec2(5.32, 2.14));
            
            // Create vertical streaks
            float streaks = abs(structure1 - structure2);
            streaks = pow(streaks, 1.2) * 0.8 + 0.2;
            
            // Vertical fade for aurora shape
            float topFade = smoothstep(1.0, 0.3, uv.y);
            float bottomFade = smoothstep(-1.0, -0.2, uv.y);
            float heightFactor = topFade * bottomFade;
            
            // Combine intensity factors
            float intensity = bandIntensity * streaks * heightFactor;
            
            // Add dancing shimmer
            float shimmerFreq = 15.0 + curtain * 3.0;
            float shimmer = sin(uv.y * shimmerFreq + u_time * u_speed * 2.0 + xCenter * 8.0);
            shimmer = max(0.0, shimmer * shimmer) * 0.15;
            intensity *= (1.0 + shimmer);
            
            // Only process visible parts
            if(intensity > 0.01) {
                // Use varied colors based on curtain, band, and height
                vec3 bandColor = getAuroraColor(uv.y, band, curtain);
                
                // Add color variation
                float colorMod = structure1 * 0.4 + 0.6;
                bandColor *= colorMod;
                
                // Add subtle color shift over time
                float timeShift = sin(u_time * u_speed * 0.1 + curtain) * 0.1;
                bandColor = mix(bandColor, bandColor.gbr, timeShift + 0.1);
                
                // Layer blending with depth
                float depthFactor = 1.0 - curtain / numCurtains * 0.3;
                float alpha = intensity * u_opacity * depthFactor;
                
                // Additive blending for glow effect
                finalColor += bandColor * alpha;
                totalAlpha = min(1.0, totalAlpha + alpha * 0.25);
            }
        }
    }
    
    // Apply brightness multiplier for better control
    finalColor *= u_brightness;
    
    // Clamp to valid range
    finalColor = clamp(finalColor, vec3(0.0), vec3(1.0));
    
    vec4 color = vec4(finalColor, 1.0);
    
    ${colorBandingFix}
    
    fragColor = color;
}`;

export interface AuroraShaderUniforms extends ShaderSizingUniforms {
  u_stepSize: number;
  u_opacity: number;
  u_height: number;
  u_speed: number;
  u_noiseScale: number;
  u_contrast: number;
  u_brightness: number;
  u_shape: number;
  u_color1: vec4;
  u_color2: vec4;
  u_color3: vec4;
  u_color4: vec4;
  u_color5: vec4;
}

export interface AuroraShaderParams extends ShaderSizingParams, ShaderMotionParams {
  stepSize?: number;
  opacity?: number;
  height?: number;
  speed?: number;
  noiseScale?: number;
  contrast?: number;
  brightness?: number;
  shape?: 'vertical' | 'horizontal';
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  color5?: string;
}