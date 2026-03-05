// @ts-check

/**
 * SigUI theme semantic mapping module for semantic mapping.
 * @module
 */
const VALID_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
/** @typedef {{ palette: string, shade: number }} RoleMapping */
/** @typedef {Record<string, RoleMapping>} RoleMap */
export const DEFAULT_LIGHT_ROLES = {
  primary: { palette: "brand", shade: 700 },
  secondary: { palette: "secondary", shade: 500 },
  tertiary: { palette: "tertiary", shade: 500 },
  accent: { palette: "accent", shade: 500 },
  highlight: { palette: "accent", shade: 200 },
  text: { palette: "neutral", shade: 800 },
  "text-secondary": { palette: "neutral", shade: 600 },
  "text-muted": { palette: "neutral", shade: 400 },
  "text-inverse": { palette: "brand", shade: 50 },
  title: { palette: "neutral", shade: 900 },
  subtitle: { palette: "neutral", shade: 700 },
  link: { palette: "brand", shade: 600 },
  "link-visited": { palette: "brand", shade: 800 },
  emphasis: { palette: "brand", shade: 700 },
  border: { palette: "neutral", shade: 300 },
  "border-light": { palette: "neutral", shade: 200 },
  "border-focus": { palette: "brand", shade: 500 },
  shadow: { palette: "neutral", shade: 900 },
  success: { palette: "success", shade: 500 },
  warning: { palette: "warning", shade: 500 },
  danger: { palette: "danger", shade: 700 },
  info: { palette: "info", shade: 500 }
};
/**
 * deriveDarkRoles.
 * @param {RoleMap} lightRoles
 * @returns {RoleMap}
 */
export function deriveDarkRoles(lightRoles) {
  const dark = {};
  for (const [role, mapping] of Object.entries(lightRoles)) {
    const darkShade = 1000 - mapping.shade;
    const clampedShade = clampToValidStop(darkShade);
    dark[role] = { palette: mapping.palette, shade: clampedShade };
  }
  dark["text-inverse"] = { palette: "brand", shade: 50 };
  dark["highlight"] = { palette: "accent", shade: 700 };
  for (const role of ["primary", "secondary", "danger", "success", "info"]) {
    dark[role] = { palette: dark[role].palette, shade: 700 };
  }
  dark.warning = { palette: dark.warning.palette, shade: 800 };
  return dark;
}
export const DEFAULT_DARK_ROLES = deriveDarkRoles(DEFAULT_LIGHT_ROLES);
/**
 * roleToCssVar.
 * @param {RoleMapping} mapping
 * @returns {string}
 */
export function roleToCssVar(mapping) {
  return `var(--${mapping.palette}-${mapping.shade})`;
}
/**
 * parseRoleMapping.
 * @param {string} value
 * @returns {RoleMapping | undefined}
 */
export function parseRoleMapping(value) {
  const match = /^([a-zA-Z0-9_-]+)@(\d+)$/.exec(value);
  if (!match)
    return;
  const shade = parseInt(match[2], 10);
  if (!VALID_STOPS.includes(shade))
    return;
  return { palette: match[1], shade };
}
/**
 * serializeRoleMapping.
 * @param {RoleMapping} mapping
 * @returns {string}
 */
export function serializeRoleMapping(mapping) {
  return `${mapping.palette}@${mapping.shade}`;
}
/**
 * getInteractionShades.
 * @param {number} baseShade
 * @param {"light" | "dark"} [mode]
 * @returns {{ hover: number, active: number, subtle: number }}
 */
export function getInteractionShades(baseShade, mode = "light") {
  return {
    hover: clampToValidStop(baseShade + 100),
    active: clampToValidStop(baseShade + 200),
    subtle: mode === "dark" ? 900 : 100
  };
}
function clampToValidStop(shade) {
  return VALID_STOPS.reduce((prev, curr) => Math.abs(curr - shade) < Math.abs(prev - shade) ? curr : prev);
}
const INTERACTIVE_ROLES = new Set([
  "primary",
  "secondary",
  "tertiary",
  "accent",
  "highlight",
  "success",
  "warning",
  "danger",
  "info",
  "link",
  "emphasis"
]);
/**
 * generateSemanticTokenDeclarations.
 * @param {RoleMap} roles
 * @param {"light" | "dark"} [mode]
 * @returns {string[]}
 */
export function generateSemanticTokenDeclarations(roles, mode = "light") {
  const lines = [];
  for (const [role, mapping] of Object.entries(roles)) {
    const { palette, shade } = mapping;
    lines.push(`--sg-color-${role}: var(--${palette}-${shade});`);
    if (INTERACTIVE_ROLES.has(role)) {
      const { hover, active, subtle } = getInteractionShades(shade, mode);
      lines.push(`--sg-color-${role}-hover: var(--${palette}-${hover});`);
      lines.push(`--sg-color-${role}-active: var(--${palette}-${active});`);
      lines.push(`--sg-color-${role}-subtle: var(--${palette}-${subtle});`);
    }
  }
  return lines;
}
