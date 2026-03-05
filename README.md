# @sig-ui/theme

Theme resolution layer for SigUI. It merges user config with defaults and resolves final token-ready theme values.

## Install

```bash
bun add @sig-ui/theme
```

## Quick start

```js
import { mergeWithDefaults, resolveTheme } from "@sig-ui/theme";
import { DEFAULT_DEVICE_CONTEXT } from "@sig-ui/core";

const rawConfig = { brand: "#6366f1" };
const config = mergeWithDefaults(rawConfig);
const theme = resolveTheme(config, DEFAULT_DEVICE_CONTEXT);

console.log(theme["color.primary"]);
```

## What it provides

- `mergeWithDefaults(config)` - fills optional settings with SigUI defaults.
- `resolveTheme(config, deviceContext)` - computes full resolved theme output.
- Preset resolvers: `resolveShape`, `resolveDepth`, `resolveDensity`, `resolveMotion`, `resolveAppearance`.
- Semantic role helpers like `deriveDarkRoles` and `generateSemanticTokenDeclarations`.

## Config shape

`SiguiConfig` includes:

- `brand` (required)
- `roles`, `colors`, `typography`, `spacing`
- `shape`, `depth`, `density`, `motion`, `appearance`
- `fluidTokens`, `harmony`, `i18n`, `cognitiveAccessibility`, `performance`
- `brands` (multi-brand overrides)
- `output` (e.g. output directory and generation options)
