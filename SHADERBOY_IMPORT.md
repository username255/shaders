# Importing Shaders from Shadertoy to Paper Shaders

This guide documents the process of importing GLSL shaders from Shadertoy (or similar platforms) into the Paper Shaders project.

## Overview

Shadertoy shaders need several modifications to work in this WebGL 2.0 ES project:
1. Convert Shadertoy's built-in uniforms to our uniform system
2. Add proper TypeScript interfaces
3. Include sizing variables for responsive behavior
4. Match precision declarations with vertex shader
5. Set up Leva controls and presets

## Step-by-Step Import Process

### 1. Create the Shader File

Create a new shader file in `/packages/shaders/src/shaders/[name].ts` with this structure:

```typescript
import type { vec2 } from '../types.js';
import type { ShaderMotionParams } from '../shader-mount.js';
import { sizingVariablesDeclaration, type ShaderSizingParams, type ShaderSizingUniforms } from '../shader-sizing.js';
import { colorBandingFix } from '../shader-utils.js';
```

### 2. Convert GLSL Code

#### Replace Shadertoy Built-ins
- `iResolution` → `u_resolution`
- `iTime` → `u_time`
- `iMouse` → `u_mouse`
- `fragCoord` → `gl_FragCoord.xy`
- `mainImage(out vec4 fragColor, in vec2 fragCoord)` → `void main()`
- Output variable → `out vec4 fragColor;`

#### Add Shader Boilerplate
```glsl
#version 300 es
precision mediump float;  // MUST match vertex shader (mediump, not highp!)

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_pixelRatio;

// Your custom uniforms here
uniform float u_customParam;

${sizingVariablesDeclaration}  // Required for responsive sizing

out vec4 fragColor;

// Your GLSL code here
void main() {
    vec2 C = gl_FragCoord.xy;  // Or use v_patternUV for pattern-based shaders
    
    // Your shader logic
    
    ${colorBandingFix}  // Optional: reduces color banding
    fragColor = color;
}
```

### 3. Define TypeScript Interfaces

```typescript
export interface YourShaderUniforms extends ShaderSizingUniforms {
  u_customParam: number;
  u_anotherParam: number;
  u_mouse: vec2;
}

export interface YourShaderParams extends ShaderSizingParams, ShaderMotionParams {
  customParam?: number;
  anotherParam?: number;
  mouseX?: number;
  mouseY?: number;
}
```

### 4. Create React Component

In `/packages/shaders-react/src/shaders/[name].tsx`:

```typescript
import { memo } from 'react';
import { ShaderMount, type ShaderComponentProps } from '../shader-mount.js';
import {
  defaultObjectSizing,  // or defaultPatternSizing
  ShaderFitOptions,
  yourShaderFragmentShader,
  type YourShaderParams,
  type YourShaderUniforms,
  type ShaderPreset,
} from '@paper-design/shaders';

export interface YourShaderProps extends ShaderComponentProps, YourShaderParams {}

type YourShaderPreset = ShaderPreset<YourShaderParams>;

export const defaultPreset: YourShaderPreset = {
  name: 'Default',
  params: {
    ...defaultObjectSizing,
    customParam: 1.0,
    anotherParam: 0.5,
    mouseX: 0,
    mouseY: 0,
    speed: 1,
    frame: 0,
  },
};

export const yourShaderPresets: YourShaderPreset[] = [defaultPreset];

export const YourShader: React.FC<YourShaderProps> = memo(function YourShader({
  // Own props
  customParam = defaultPreset.params.customParam,
  anotherParam = defaultPreset.params.anotherParam,
  mouseX = defaultPreset.params.mouseX,
  mouseY = defaultPreset.params.mouseY,
  speed = defaultPreset.params.speed,
  frame = defaultPreset.params.frame,
  
  // Sizing props (from defaultPreset.params)
  fit = defaultPreset.params.fit,
  scale = defaultPreset.params.scale,
  rotation = defaultPreset.params.rotation,
  offsetX = defaultPreset.params.offsetX,
  offsetY = defaultPreset.params.offsetY,
  originX = defaultPreset.params.originX,
  originY = defaultPreset.params.originY,
  worldWidth = defaultPreset.params.worldWidth,
  worldHeight = defaultPreset.params.worldHeight,
  ...props
}: YourShaderProps) {
  const uniforms = {
    // Own uniforms
    u_customParam: customParam,
    u_anotherParam: anotherParam,
    u_mouse: [mouseX, mouseY],
    
    // Sizing uniforms (required!)
    u_fit: ShaderFitOptions[fit],
    u_scale: scale,
    u_rotation: rotation,
    u_offsetX: offsetX,
    u_offsetY: offsetY,
    u_originX: originX,
    u_originY: originY,
    u_worldWidth: worldWidth,
    u_worldHeight: worldHeight,
  } satisfies YourShaderUniforms;  // Use 'satisfies' for type checking

  return (
    <ShaderMount
      {...props}
      speed={speed}
      frame={frame}
      fragmentShader={yourShaderFragmentShader}
      uniforms={uniforms}
    />
  );
});
```

### 5. Export from Package Indexes

#### In `/packages/shaders/src/index.ts`:
```typescript
export {
  yourShaderFragmentShader,
  type YourShaderParams,
  type YourShaderUniforms,
} from './shaders/your-shader.js';
```

#### In `/packages/shaders-react/src/index.ts`:
```typescript
export { YourShader, yourShaderPresets } from './shaders/your-shader.js';
export type { YourShaderProps } from './shaders/your-shader.js';
export type { YourShaderParams, YourShaderUniforms } from '@paper-design/shaders';
```

### 6. Create Demo Page

In `/docs/src/app/[shader-name]/page.tsx`:

```typescript
'use client';

import { YourShader, yourShaderPresets } from '@paper-design/shaders-react';
import { folder, useControls, button } from 'leva';
import { setParamsSafe, useResetLevaParams } from '@/helpers/use-reset-leva-params';
import { BackButton } from '@/components/back-button';
import { cleanUpLevaParams } from '@/helpers/clean-up-leva-params';
import { ShaderFit, ShaderFitOptions } from '@paper-design/shaders';
import Link from 'next/link';

const { worldWidth, worldHeight, ...defaults } = yourShaderPresets[0].params;

export default function YourShaderPage() {
  const [params, setParams] = useControls(() => ({
    'Parameters': folder({
      customParam: { value: defaults.customParam, min: 0, max: 2, step: 0.1 },
      anotherParam: { value: defaults.anotherParam, min: 0, max: 1, step: 0.01 },
    }, { order: 1 }),
    'Animation': folder({
      speed: { value: defaults.speed, min: 0, max: 5, step: 0.1 },
    }, { order: 2 }),
    'Transform': folder({
      scale: { value: defaults.scale, min: 0.01, max: 4 },
      rotation: { value: defaults.rotation, min: 0, max: 360 },
      offsetX: { value: defaults.offsetX, min: -1, max: 1 },
      offsetY: { value: defaults.offsetY, min: -1, max: 1 },
    }, { order: 3, collapsed: true }),
    'Fit': folder({
      fit: { value: defaults.fit, options: Object.keys(ShaderFitOptions) as ShaderFit[] },
      worldWidth: { value: 1000, min: 0, max: 5120 },
      worldHeight: { value: 500, min: 0, max: 5120 },
      originX: { value: defaults.originX, min: 0, max: 1 },
      originY: { value: defaults.originY, min: 0, max: 1 },
    }, { order: 4, collapsed: true }),
  }), []);

  useResetLevaParams(params, setParams, defaults);
  cleanUpLevaParams(params);

  return (
    <>
      <Link href="/">
        <BackButton />
      </Link>
      <YourShader {...params} className="fixed size-full" />
    </>
  );
}
```

## Common Pitfalls & Solutions

### 1. Precision Mismatch Error
**Error**: "Precisions of uniform 'u_resolution' differ between VERTEX and FRAGMENT shaders"
**Solution**: Always use `precision mediump float;` (not `highp`) to match the vertex shader

### 2. Missing Sizing Uniforms
**Error**: Type errors about missing `u_fit`, `u_scale`, etc.
**Solution**: 
- Extend `ShaderSizingUniforms` in your uniforms interface
- Include all sizing uniforms in the React component
- Add `${sizingVariablesDeclaration}` to fragment shader

### 3. useResetLevaParams Error
**Error**: "Cannot read properties of undefined (reading '0')" or Object.entries error
**Solution**: 
- Export presets from React component
- Pass `params`, `setParams`, and `defaults` to `useResetLevaParams`
- Use `const [params, setParams] = useControls(() => ({...}))` pattern

### 4. Shader Variables Not Recognized
**Error**: GLSL compilation errors about undefined variables
**Solution**: Import and use shader utilities:
- `${sizingVariablesDeclaration}` - for UV coordinates
- `${colorBandingFix}` - for smooth gradients
- `${declarePI}`, `${declareRotate}`, etc. - from shader-utils.js

### 5. Props Not Recognized on DOM Element
**Warning**: React warnings about custom props on DOM elements
**Solution**: This is usually harmless, but ensure you're using the spread operator correctly: `{...props}`

## Testing Checklist

After importing a shader, verify:
- [ ] Build succeeds: `bun run build`
- [ ] Demo page loads at `/[shader-name]`
- [ ] Leva controls appear and work
- [ ] Animation plays (if applicable)
- [ ] Responsive sizing works
- [ ] No console errors
- [ ] Hot reload works when editing GLSL

## Tips for Specific Shader Types

### Raymarching Shaders
- Keep iterations as a uniform for performance tuning
- Consider using `gl_FragCoord.xy` for screen-space effects

### Pattern Shaders
- Use `v_patternUV` instead of `gl_FragCoord.xy` for repeating patterns
- Import `defaultPatternSizing` instead of `defaultObjectSizing`

### Color-based Shaders
- Use `getShaderColorFromString()` for color conversion
- Consider using `vec4` for colors with alpha support

## Example: Converting a Simple Shadertoy Shader

### Original Shadertoy Code:
```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord/iResolution.xy;
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    fragColor = vec4(col,1.0);
}
```

### Converted for Paper Shaders:
```glsl
#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

${sizingVariablesDeclaration}

out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4));
    
    ${colorBandingFix}
    fragColor = vec4(col, 1.0);
}
```

This documentation should be updated as new patterns and solutions are discovered.