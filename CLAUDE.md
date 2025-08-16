# Paper Shaders - Project Index

## Project Overview
WebGL shader library with vanilla JS and React bindings for creating animated visual effects.
Monorepo structure using Bun workspaces.

## Key Directories

### `/packages/` - Core library code
- `shaders/` - Vanilla JS shader implementations
- `shaders-react/` - React component wrappers

### `/docs/` - Documentation & demo site
- Next.js app showcasing all shaders
- Interactive controls via Leva
- Registry patterns for examples

## Quick Start for Shader Development

### Adding a New Shader
1. Create shader in `/packages/shaders/src/shaders/[name].ts`
2. Add React wrapper in `/packages/shaders-react/src/shaders/[name].tsx`
3. Create demo page in `/docs/src/app/[name]/`
4. Add to registry in `/docs/registry/[name]-example.tsx`

### Build Commands
- `bun run dev` - Start development (watches packages)
- `bun run build` - Build all packages
- `bun run dev:docs` - Run documentation site only

### Key Files
- `vertex-shader.ts` - Shared vertex shader for all effects
- `shader-mount.ts` - WebGL context management
- `shader-utils.ts` - GLSL utility functions

## Shader Conventions
- Fragment shaders use GLSL ES 3.0
- Uniforms: `u_time`, `u_colors[]`, effect-specific params
- Color space conversions in `shader-color-spaces.ts`
- Sizing/positioning via vertex shader uniforms