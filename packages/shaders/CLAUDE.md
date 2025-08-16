# Vanilla Shaders Package

## Core Files
- `index.ts` - Main exports
- `vertex-shader.ts` - Shared vertex shader for all effects
- `shader-mount.ts` - WebGL context & animation loop management
- `shader-utils.ts` - GLSL helper functions (rotate, noise, etc.)
- `shader-sizing.ts` - Canvas sizing & pixel ratio handling
- `shader-color-spaces.ts` - Color space conversion utilities
- `types.ts` - TypeScript definitions

## `/src/shaders/` - Shader Implementations
Each shader exports:
- Fragment shader string (GLSL)
- Metadata (max colors, params)
- Mount function for initialization

### Available Shaders
- `mesh-gradient.ts` - Animated color mesh
- `liquid-metal.ts` - Metallic fluid effect
- `grain-gradient.ts` - Textured gradients
- `neuro-noise.ts` - Neural network patterns
- `dot-grid.ts`, `dot-orbit.ts` - Dot patterns
- `perlin-noise.ts`, `simplex-noise.ts` - Noise generators
- `voronoi.ts` - Cell patterns
- `water.ts`, `waves.ts` - Fluid simulations
- `god-rays.ts` - Light ray effects
- `spiral.ts`, `swirl.ts` - Rotation effects
- And more...

## Shader Development Pattern
```typescript
// Fragment shader as template literal
export const shaderFragmentShader = \`#version 300 es
// GLSL code
\`;

// Mount function
export function mountShader(params) {
  return shaderMount({
    fragmentShader: shaderFragmentShader,
    uniforms: { /* ... */ }
  });
}
```