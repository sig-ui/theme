// @ts-check

/**
 * SigUI theme index module for index.
 * @module
 */
export { DEFAULT_CONFIG, DEFAULT_I18N_CONFIG, DEFAULT_COGA_CONFIG } from "./defaults.js";
export { mergeWithDefaults, resolveTheme } from "./resolve.js";
export { resolveShape, resolveDepth, resolveDensity, resolveMotion, resolveAppearance } from "./presets.js";
export {
  DEFAULT_LIGHT_ROLES,
  DEFAULT_DARK_ROLES,
  deriveDarkRoles,
  roleToCssVar,
  parseRoleMapping,
  serializeRoleMapping,
  getInteractionShades,
  generateSemanticTokenDeclarations
} from "./semantic-mapping.js";
