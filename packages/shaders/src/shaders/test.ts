import type { vec2 } from '../types.js';
import type { ShaderMotionParams } from '../shader-mount.js';
import { sizingVariablesDeclaration, type ShaderSizingParams, type ShaderSizingUniforms } from '../shader-sizing.js';
import { colorBandingFix } from '../shader-utils.js';

/**
 * Test shader for GLSL experimentation
 * Raymarching fractal tunnel with dynamic lighting
 * 
 * This shader uses raymarching to render 3D fractals.
 * Think of it like casting rays from your eye through each pixel into a 3D world,
 * then stepping along each ray until we hit something interesting.
 */

// language=GLSL
export const testFragmentShader: string = `#version 300 es
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
    
    vec4 
        o = vec4(0.0),  // Accumulated color/lighting
        p,              // Current 3D position along ray
        O;              // Saved position for lighting
    
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
        
        // Calculate color based on position and space distortion
        // The sin() creates a nice looking palette, division by dot() creates falloff
        O = (1.0 + sin(0.5 * O.z + length(p - O) + vec4(0, 4, 3, 6) + u_colorShift))
            / (0.5 + 2.0 * dot(O.xy, O.xy));
        
        // Domain repetition - repeats the shapes infinitely
        p = abs(fract(p) - 0.5);
        
        // Calculate distance to nearest surface
        // This combines a cylinder (length(p.xy) - shapeSize) with 2 planes (min(p.x, p.y))
        d = abs(min(length(p.xy) - u_shapeSize, min(p.x, p.y) + 1e-3)) + 1e-3;
        
        // Add lighting contribution (brighter when closer to surfaces)
        o += O.w / d * O;
    }
    
    // tanh() compresses the accumulated brightness to 0-1 range
    // (Like HDR tone mapping in photography)
    vec4 color = tanh(o / (20000.0 / u_brightness));
    
    ${colorBandingFix}
    
    fragColor = color;
}`;

export interface TestShaderUniforms extends ShaderSizingUniforms {
  u_iterations: number;
  u_stepSize: number;
  u_rotationSpeed: number;
  u_colorShift: number;
  u_shapeSize: number;
  u_brightness: number;
  u_mouse: vec2;
}

export interface TestShaderParams extends ShaderSizingParams, ShaderMotionParams {
  iterations?: number;
  stepSize?: number;
  rotationSpeed?: number;
  colorShift?: number;
  shapeSize?: number;
  brightness?: number;
  mouseX?: number;
  mouseY?: number;
}