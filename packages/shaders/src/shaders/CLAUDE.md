# Shader Implementations

## Structure
Each `.ts` file contains one shader effect with:
1. Fragment shader GLSL code
2. Mount function for WebGL setup
3. Optional metadata/constants

## Shader Categories

### Gradient Effects
- `mesh-gradient.ts` - Animated mesh of colors
- `grain-gradient.ts` - Textured gradients
- `static-mesh-gradient.ts` - Static version
- `static-radial-gradient.ts` - Radial gradients

### Noise-Based
- `perlin-noise.ts` - Classic Perlin noise
- `simplex-noise.ts` - Simplex noise algorithm
- `neuro-noise.ts` - Neural-inspired patterns
- `paper-texture.ts` - Paper-like texture

### Geometric Patterns
- `dot-grid.ts` - Grid of dots
- `dot-orbit.ts` - Orbiting dots
- `voronoi.ts` - Voronoi cells
- `spiral.ts` - Spiral patterns
- `color-panels.ts` - Color blocks

### Fluid Effects
- `water.ts` - Water simulation
- `waves.ts` - Wave patterns
- `liquid-metal.ts` - Metallic fluid
- `smoke-ring.ts` - Smoke effects

### Distortion Effects
- `swirl.ts` - Vortex distortion
- `warp.ts` - Space warping
- `fluted-glass.ts` - Glass distortion

### Special Effects
- `god-rays.ts` - Light rays
- `metaballs.ts` - Blob merging
- `pulsing-border.ts` - Animated borders
- `dithering.ts` - Dithering patterns
- `image-dithering.ts` - Image processing

## Common Uniforms
All shaders share:
- Time, resolution, colors
- Sizing/positioning from vertex shader
- Custom effect parameters