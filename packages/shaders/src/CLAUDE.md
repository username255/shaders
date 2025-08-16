# Shaders Source Directory

## Core Infrastructure

### WebGL Management
- `shader-mount.ts` - Creates canvas, WebGL context, handles animation loop
- `vertex-shader.ts` - Shared vertex shader with multiple UV coordinate systems
- `shader-sizing.ts` - Responsive sizing, pixel ratio, fit modes

### Utilities
- `shader-utils.ts` - GLSL snippets: rotation, noise, color banding fixes
- `shader-color-spaces.ts` - sRGB, HSL, LAB, OKLab conversions
- `get-shader-color-from-string.ts` - Parse CSS colors to vec4
- `get-shader-noise-texture.ts` - Generate noise textures for effects

### Type System
- `types.ts` - Core types: vec2/3/4, shader params, uniforms

## `/shaders/` Subdirectory
Contains 25+ shader implementations. Each exports:
- Fragment shader GLSL string
- Mount function with parameters
- Optional metadata (max colors, etc.)

## Key Patterns for New Shaders

### Uniform Naming
- `u_time` - Animation time
- `u_colors[]` - Color array
- `u_resolution` - Canvas dimensions
- Custom params: `u_[effectName]`

### GLSL Utilities Available
```glsl
${declarePI} - PI constant
${declareRotate} - 2D rotation
${colorBandingFix} - Reduce banding
${sizingVariablesDeclaration} - Sizing uniforms
```