# React Shaders Package

## Overview
React component wrappers for vanilla shader library.
Provides declarative API for WebGL shaders.

## Core Files
- `index.ts` - Re-exports all shader components
- `shader-mount.tsx` - React hook for shader mounting
- `use-merge-refs.ts` - Ref merging utility
- `color-props-are-equal.ts` - Color prop comparison

## `/src/shaders/` - React Components
Each shader has corresponding `.tsx` component:
- Props interface matching shader parameters
- Canvas element with ref handling
- Effect cleanup on unmount

## Component Pattern
```tsx
export function ShaderName({
  colors = ['#default'],
  speed = 0.5,
  ...canvasProps
}: ShaderProps) {
  // Mount shader with parameters
  // Return canvas element
}
```

## Usage
```jsx
import { MeshGradient } from '@paper-design/shaders-react';

<MeshGradient
  colors={['#ff0000', '#00ff00']}
  distortion={1.0}
  style={{ width: 400, height: 400 }}
/>
```