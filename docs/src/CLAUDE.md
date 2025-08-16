# Documentation Source

## `/app/` - Next.js App Router
Each shader gets a route with:
- Interactive demo
- Leva controls for parameters
- Code examples

### Pattern
```
/[shader-name]/
  ├── layout.tsx - Page layout
  └── page.tsx - Demo implementation
```

## `/components/`
- `back-button.tsx` - Navigation
- `shader-item.tsx` - Shader card display

## `/helpers/` - Utilities
- `leva-image-button.ts` - Image picker for Leva
- `use-colors.ts` - Color management
- `use-preset-highlight.ts` - Preset highlighting
- `use-reset-leva-params.ts` - Reset controls
- `clean-up-leva-params.ts` - Parameter cleanup
- `to-hsla.ts` - Color conversion

## Key Files
- `home-shaders.ts` - Shader catalog with metadata
- `icons.tsx` - Icon components
- `globals.css` - Global styles