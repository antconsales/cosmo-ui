# Aura UI

**AI-first cross-reality UI framework**

> A UI framework designed for AI models to generate, manipulate, and reason about interfaces across Web, AR, and Mobile.

## Vision

Aura UI is **not** a classic UI library for humans.
Aura UI is a **UI framework for AIs** that also renders for humans.

### Core Concept

- **Schema Layer**: JSON/TypeScript schemas that AI models can output reliably
- **Component Abstraction**: Abstract components with clear constraints and variants
- **Multi-Runtime**: One schema, three renderers (Web, AR, React Native)

### Design Principles

✅ **AI-first**: Predictable, constrained, unambiguous schemas
✅ **Non-invasive AR**: Small, glanceable, ephemeral UI elements
✅ **Cross-reality consistency**: Same component concept across all platforms
✅ **Safety & validation**: Strict constraints prevent visual overload

## Current Status

**v0.1** - Initial implementation with `HUDCard` component

### Packages

- `@aura/core-schema` - Type definitions and schemas
- `@aura/validator` - Runtime validation and sanitization
- `@aura/renderer-web` - React renderer for web

### Examples

- `examples/web-basic` - Next.js demo app

## Getting Started

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run example app
cd examples/web-basic
pnpm dev
```

## Roadmap

- [x] v0.1: HUDCard schema + web renderer
- [ ] v0.2: Additional components (ContextBadge, FloatingTooltip, etc.)
- [ ] v0.3: AR renderer (WebXR)
- [ ] v0.4: React Native renderer
- [ ] v1.0: Stable, documented AI-first framework

## Author

**Antonio Consales** - Frontend/Mobile Developer exploring AI-first AR interfaces

---

*Built with the vision of AI-generated cross-reality interfaces*
