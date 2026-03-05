# @sig-ui/theme

Theme resolution layer for SigUI.
It merges user configuration with defaults and resolves final theme values for token generation/runtime use.

## Install

```bash
bun add @sig-ui/theme
```

## Quick start

```js
import { mergeWithDefaults, resolveTheme } from "@sig-ui/theme";
import { DEFAULT_DEVICE_CONTEXT } from "@sig-ui/core";

const config = mergeWithDefaults({ brand: "#6366f1" });
const theme = resolveTheme(config, DEFAULT_DEVICE_CONTEXT);

console.log(theme.palettes.brand.ramp[500]);
console.log(theme.spacing.baseUnit);
```

## API

- `mergeWithDefaults(config)`: fills optional fields from SigUI defaults
- `resolveTheme(config, deviceContext)`: computes resolved palettes, semantic roles, spacing, typography, motion, and adaptive values
- Preset resolvers: `resolveShape`, `resolveDepth`, `resolveDensity`, `resolveMotion`, `resolveAppearance`
- Semantic mapping helpers: `deriveDarkRoles`, `parseRoleMapping`, `generateSemanticTokenDeclarations`

## Config highlights

- Required: `brand`
- Optional: `roles`, `colors`, `typography`, `spacing`
- Presets: `shape`, `depth`, `density`, `motion`, `appearance`
- Advanced: `fluidTokens`, `harmony`, `i18n`, `cognitiveAccessibility`, `performance`, `brands`, `output`
