# React Shaders Source

## Core Infrastructure
- `shader-mount.tsx` - `useShaderMount` hook for WebGL lifecycle
- `use-merge-refs.ts` - Combines multiple refs
- `color-props-are-equal.ts` - Optimized color array comparison

## `/shaders/` - Component Library
25+ React components, each wrapping vanilla shader:
- Accepts shader-specific props
- Handles canvas lifecycle
- Auto-cleanup on unmount

## Component Structure
```tsx
interface Props extends CanvasHTMLAttributes {
  colors?: string[];
  // Shader-specific params
}

export function Component(props) {
  const canvasRef = useShaderMount(
    mountFunction,
    shaderParams
  );
  return <canvas ref={canvasRef} {...props} />;
}
```