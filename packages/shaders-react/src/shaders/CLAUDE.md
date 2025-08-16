# React Shader Components

## Available Components
All components accept:
- `colors?: string[]` - Color palette
- Standard canvas HTML attributes
- Shader-specific parameters

## Components by Category

### Gradients
- `MeshGradient` - Animated mesh
- `GrainGradient` - Textured gradient
- `StaticMeshGradient` - Static version
- `StaticRadialGradient` - Radial

### Patterns
- `DotGrid`, `DotOrbit` - Dot patterns
- `Voronoi` - Cell patterns
- `Spiral` - Spiral motion
- `ColorPanels` - Color blocks

### Effects
- `Water`, `Waves` - Fluid simulation
- `LiquidMetal` - Metallic effect
- `GodRays` - Light rays
- `Metaballs` - Blob merging

### Noise
- `PerlinNoise`, `SimplexNoise`
- `NeuroNoise` - Neural patterns
- `PaperTexture` - Paper effect

### Distortion
- `Swirl`, `Warp`
- `FlutedGlass` - Glass effect

## Props Interface
Each component has typed props for its specific parameters.
Check individual files for available options.