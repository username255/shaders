# Documentation Site

## Overview
Next.js app showcasing all shaders with interactive controls.
Live at production URL with demos and code examples.

## Structure

### `/src/app/` - Pages
- Each shader has dedicated route
- `layout.tsx` + `page.tsx` pattern
- Interactive Leva controls

### `/registry/` - Example Components
- `*-example.tsx` files for each shader
- Used in documentation
- Copy-paste ready code

### `/src/` - Core App
- `components/` - UI components
- `helpers/` - Leva utilities
- `home-shaders.ts` - Shader catalog

### `/public/` - Assets
- `shaders/` - Preview images
- `images/` - Sample images for filters

## Key Files
- `registry.json` - Shader registry metadata
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Styling setup

## Development
```bash
bun run dev  # Start dev server
```

## Adding New Shader Demo
1. Create `/src/app/[shader-name]/` directory
2. Add `layout.tsx` and `page.tsx`
3. Create `/registry/[shader-name]-example.tsx`
4. Add preview image to `/public/shaders/`
5. Update `home-shaders.ts` catalog