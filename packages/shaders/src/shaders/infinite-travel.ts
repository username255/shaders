import type { vec2, vec4 } from '../types.js';
import type { ShaderMotionParams } from '../shader-mount.js';
import { sizingVariablesDeclaration, type ShaderSizingParams, type ShaderSizingUniforms } from '../shader-sizing.js';
import { colorBandingFix } from '../shader-utils.js';

/**
 * Infinite Travel shader
 * Raymarching fractal tunnel with dynamic lighting
 * 
 * This shader uses raymarching to render 3D fractals.
 * Think of it like casting rays from your eye through each pixel into a 3D world,
 * then stepping along each ray until we hit something interesting.
 */

// language=GLSL
export const infiniteTravelFragmentShader: string = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_pixelRatio;

// Raymarching parameters - exposed as uniforms for testing
uniform float u_iterations;      // Number of raymarching steps
uniform float u_stepSize;        // Step size multiplier
uniform float u_rotationSpeed;   // Rotation animation speed
uniform float u_colorShift;      // Color palette shift
uniform float u_shapeSize;       // Size of the repeated shapes
uniform float u_brightness;      // Overall brightness

// Color parameters
uniform vec4 u_color1;           // Primary color
uniform vec4 u_color2;           // Secondary color
uniform vec4 u_color3;           // Tertiary color
uniform vec4 u_backgroundColor;  // Background color

${sizingVariablesDeclaration}

out vec4 fragColor;

// Key GLSL concepts for C developers:
// - vec4/vec3/vec2: Like structs with x,y,z,w components (SIMD-style)
// - Swizzling: p.xy means "give me just the x,y parts of vector p"
// - mat2(): Creates a 2x2 rotation matrix
// - All math operations work on vectors component-wise
//
// ATTRIBUTION: Shader techniques inspired by (alphabetical):
//   @byt3_m3chanic, @FabriceNeyrat2, @iq, @shane, @XorDev + many more

void main() {
    // Pixel coordinates
    vec2 C = gl_FragCoord.xy;
    
    // Initialize variables
    float 
        i = 0.0,                           // Loop counter
        d,                                 // Distance to nearest surface
        z = fract(dot(C, sin(C))) - 0.5;  // Ray distance + noise for anti-banding
    
    vec3 accumulatedColor = vec3(0.0);  // Accumulated color
    float accumulatedAlpha = 0.0;       // Accumulated alpha/intensity
    vec4 p;                              // Current 3D position along ray
    vec4 O;                              // Saved position for lighting
    
    vec2 r = u_resolution.xy;  // Screen resolution
    
    // Main raymarching loop
    for(
        ; i < u_iterations;
        i++,
        z += u_stepSize * d  // Step forward (larger steps when far from surfaces)
    ) {
        // Convert 2D pixel to 3D ray direction
        p = vec4(z * normalize(vec3(C - 0.5 * r, r.y)), 0.1 * u_time * u_rotationSpeed);
        
        // Move through 3D space over time
        p.z += u_time * u_rotationSpeed;
        
        // Save position for lighting calculations
        O = p;
        
        // Apply rotation matrices to create fractal patterns
        // These transform the 3D coordinates in interesting ways
        p.xy *= mat2(cos(2.0 + O.z + vec4(0, 11, 33, 0)));
        
        // This was originally a bug in the matrix calculation
        // The incorrect transformation created an unexpectedly interesting pattern
        // Bob Ross would call this a "happy little accident"
        p.xy *= mat2(cos(O + vec4(0, 11, 33, 0)));
        
        // Calculate phase for color mixing
        float phase = 0.5 * O.z + length(p - O) + u_colorShift;
        
        // Create three different phases for color blending
        float phase1 = sin(phase * 0.7);
        float phase2 = sin(phase * 1.1 + 2.094);
        float phase3 = sin(phase * 0.9 + 4.189);
        
        // Normalize phases to 0-1 range
        phase1 = phase1 * 0.5 + 0.5;
        phase2 = phase2 * 0.5 + 0.5;
        phase3 = phase3 * 0.5 + 0.5;
        
        // Calculate which color dominates
        float total = phase1 + phase2 + phase3;
        phase1 /= total;
        phase2 /= total;
        phase3 /= total;
        
        // Mix the three colors based on phases
        vec3 colorMix = u_color1.rgb * phase1 + u_color2.rgb * phase2 + u_color3.rgb * phase3;
        
        // Calculate intensity falloff
        float intensity = 1.0 / (0.5 + 2.0 * dot(O.xy, O.xy));
        O = vec4(colorMix, intensity);
        
        // Domain repetition - repeats the shapes infinitely
        p = abs(fract(p) - 0.5);
        
        // Calculate distance to nearest surface
        // This combines a cylinder (length(p.xy) - shapeSize) with 2 planes (min(p.x, p.y))
        d = abs(min(length(p.xy) - u_shapeSize, min(p.x, p.y) + 1e-3)) + 1e-3;
        
        // Add lighting contribution (brighter when closer to surfaces)
        float contribution = O.w / d;
        accumulatedColor += O.rgb * contribution;
        accumulatedAlpha += contribution;
    }
    
    // Normalize and apply tone mapping
    accumulatedColor = accumulatedColor / max(accumulatedAlpha, 1.0);
    float alpha = tanh(accumulatedAlpha * 0.0001 * u_brightness);
    
    // Mix with background
    vec3 finalColor = mix(u_backgroundColor.rgb, accumulatedColor, alpha);
    
    vec4 color = vec4(finalColor, 1.0);
    
    ${colorBandingFix}
    
    fragColor = color;
}`;

export interface InfiniteTravelShaderUniforms extends ShaderSizingUniforms {
  u_iterations: number;
  u_stepSize: number;
  u_rotationSpeed: number;
  u_colorShift: number;
  u_shapeSize: number;
  u_brightness: number;
  u_mouse: vec2;
  u_color1: vec4;
  u_color2: vec4;
  u_color3: vec4;
  u_backgroundColor: vec4;
}

export interface InfiniteTravelShaderParams extends ShaderSizingParams, ShaderMotionParams {
  iterations?: number;
  stepSize?: number;
  rotationSpeed?: number;
  colorShift?: number;
  shapeSize?: number;
  brightness?: number;
  mouseX?: number;
  mouseY?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  backgroundColor?: string;
}