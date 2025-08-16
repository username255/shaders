# Packages Directory

## Structure
- `shaders/` - Core vanilla JavaScript shader library
- `shaders-react/` - React component wrappers for shaders

## Package Architecture
Both packages follow same pattern:
1. Core shader logic in vanilla JS
2. React wrapper adds component interface
3. Each shader is self-contained module

## Publishing
- Private scoped packages: `@paper-design/*`
- Built with esbuild
- Publishes to npm via `publish.js` script