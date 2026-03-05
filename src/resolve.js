// @ts-check

/**
 * SigUI theme resolve module for resolve.
 * @module
 */
import { DEFAULT_CONFIG, DEFAULT_I18N_CONFIG, DEFAULT_COGA_CONFIG } from "./defaults.js";
import { DEFAULT_LIGHT_ROLES, deriveDarkRoles } from "./semantic-mapping.js";
import {
  generateFullPalette,
  generatePalette,
  generateTypeScale,
  computeLineHeight,
  computeLetterSpacing,
  getFontWeights,
  measureTokens,
  fluidTypeScale,
  deriveFluidMaxRatio,
  generateSpacingScale,
  fluidSpacingScale,
  generateShadowScale,
  getDurationScale,
  getScaledDurationScale,
  getEasingCurves,
  easingToCss,
  getFocusRingConfig,
  getStateLayerConfig,
  getBorderRadiusScale,
  getBorderScale,
  getZIndexScale,
  getMinTouchTarget,
  getDeviceParameters,
  getDarkModeWeightOffset,
  getMinAnimationDuration,
  fromOklch,
  toOklch,
  clamp,
  normalizeHue,
  deriveSurfaceScale,
  getSpringPresets,
  springToLinear,
  computeSpringDuration,
  assignSemanticRoles,
  computeVerticalRhythm,
  computeContentSpacing,
  getDyslexiaAdjustments,
  getFontSizeAdjust,
  generateFontSpacingSubsets
} from "@sig-ui/core";
import {
  resolveShape,
  resolveDepth,
  resolveDensity,
  resolveMotion,
  resolveAppearance
} from "./presets.js";

/** @typedef {any} JsonLike */
/**
 * @typedef {object} SiguiConfig
 * @property {string} brand
 * @property {"auto" | "light" | "dark"} [appearance]
 * @property {string | { preset?: string, radii?: { sm?: number, md?: number, lg?: number, xl?: number, "2xl"?: number } }} [shape]
 * @property {string | { preset?: string, shadowIntensity?: number }} [depth]
 * @property {string | { preset?: string, factor?: number, exempt?: string[] }} [density]
 * @property {string | { preset?: string, durationScale?: number, defaultSpring?: string, springs?: Partial<Record<string, { stiffness: number, damping: number, mass: number }>>, reducedMotion?: "crossfade" | "instant" | "reduce-duration" }} [motion]
 * @property {Record<string, string>} [colors]
 * @property {Record<string, string>} [roles]
 * @property {Record<string, JsonLike>} [typography]
 * @property {{ baseUnit?: number, includeExtended?: boolean }} [spacing]
 * @property {{ enabled?: boolean, minViewport?: number, maxViewport?: number, fluidEasing?: string }} [fluidTokens]
 * @property {{ mode?: "analogous" | "complementary" | "triadic" | "tetradic" | "split-complementary" }} [harmony]
 * @property {number} [tintStrength]
 * @property {Record<string, JsonLike>} [i18n]
 * @property {Record<string, JsonLike>} [cognitiveAccessibility]
 * @property {Record<string, JsonLike>} [performance]
 * @property {boolean} [utilities]
 * @property {Record<string, any>} [icons]
 * @property {{ dir?: string, splitFiles?: boolean, minify?: boolean, treeShake?: boolean, typescript?: boolean, json?: boolean }} [output]
 * @property {Record<string, JsonLike>} [brands]
 */
/**
 * @typedef {object} ResolveThemeContext
 * @property {string} class
 * @property {{ inferredType: string, refreshTier: string }} display
 * @property {{ committed: "touch" | "pointer" | "hybrid" }} input
 * @property {{ contrastBoost: number }} ambient
 */
/** @typedef {any} ResolvedTheme */
/**
 * mergeWithDefaults.
 * @param {SiguiConfig} raw
 * @returns {SiguiConfig}
 */
export function mergeWithDefaults(raw) {
  return {
    brand: raw.brand,
    appearance: raw.appearance,
    shape: raw.shape,
    depth: raw.depth,
    density: raw.density,
    motion: raw.motion,
    colors: raw.colors,
    roles: { ...DEFAULT_CONFIG.roles, ...raw.roles },
    typography: { ...DEFAULT_CONFIG.typography, ...raw.typography },
    spacing: { ...DEFAULT_CONFIG.spacing, ...raw.spacing },
    utilities: raw.utilities ?? true,
    brands: raw.brands,
    fluidTokens: { ...DEFAULT_CONFIG.fluidTokens, ...raw.fluidTokens },
    ...raw.i18n ? {
      i18n: {
        ...DEFAULT_I18N_CONFIG,
        ...raw.i18n,
        rtl: { ...DEFAULT_I18N_CONFIG.rtl, ...raw.i18n.rtl },
        cjk: { ...DEFAULT_I18N_CONFIG.cjk, ...raw.i18n.cjk },
        pseudoLocalization: { ...DEFAULT_I18N_CONFIG.pseudoLocalization, ...raw.i18n.pseudoLocalization },
        fontLoading: { ...DEFAULT_I18N_CONFIG.fontLoading, ...raw.i18n.fontLoading }
      }
    } : {},
    ...raw.cognitiveAccessibility ? {
      cognitiveAccessibility: {
        ...DEFAULT_COGA_CONFIG,
        ...raw.cognitiveAccessibility,
        highContrast: { ...DEFAULT_COGA_CONFIG.highContrast, ...raw.cognitiveAccessibility.highContrast },
        reducedTransparency: { ...DEFAULT_COGA_CONFIG.reducedTransparency, ...raw.cognitiveAccessibility.reducedTransparency },
        errorPrevention: { ...DEFAULT_COGA_CONFIG.errorPrevention, ...raw.cognitiveAccessibility.errorPrevention },
        session: { ...DEFAULT_COGA_CONFIG.session, ...raw.cognitiveAccessibility.session },
        loading: { ...DEFAULT_COGA_CONFIG.loading, ...raw.cognitiveAccessibility.loading },
        content: { ...DEFAULT_COGA_CONFIG.content, ...raw.cognitiveAccessibility.content },
        cognitiveLoad: { ...DEFAULT_COGA_CONFIG.cognitiveLoad, ...raw.cognitiveAccessibility.cognitiveLoad }
      }
    } : {},
    ...raw.performance ? {
      performance: {
        ...raw.performance,
        ...raw.performance.dom ? { dom: { ...raw.performance.dom } } : {},
        ...raw.performance.css ? { css: { ...raw.performance.css } } : {},
        ...raw.performance.javascript ? { javascript: { ...raw.performance.javascript } } : {},
        ...raw.performance.ci ? { ci: { ...raw.performance.ci } } : {}
      }
    } : {},
    output: { ...DEFAULT_CONFIG.output, ...raw.output }
  };
}
const LIGHT_BG = "#ffffff";
const SCALE_KEYS = ["2xs", "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"];
function makePalette(hex) {
  const result = generatePalette(hex, { background: LIGHT_BG });
  return { ramp: result.ramp };
}
/**
 * resolveTheme.
 * @param {SiguiConfig} config
 * @param {DeviceContext} context
 * @returns {ResolvedTheme}
 */
export function resolveTheme(config, context) {
  const resolvedAppearance = resolveAppearance(config.appearance);
  const resolvedShape = resolveShape(/** @type {any} */ (config.shape));
  const resolvedDepthResult = resolveDepth(/** @type {any} */ (config.depth));
  const resolvedDensity = resolveDensity(/** @type {any} */ (config.density));
  const resolvedMotionPreset = resolveMotion(/** @type {any} */ (config.motion));
  const allPalettes = {};
  const brandPalette = makePalette(config.brand);
  allPalettes["brand"] = brandPalette;
  {
    const harmonyMode = config.harmony?.mode ?? "triadic";
    const theme = generateFullPalette(config.brand, {
      harmony: harmonyMode,
      mode: "light"
    });
    const harmonyNames = ["secondary", "tertiary", "accent", "neutral", "success", "warning", "danger", "info"];
    for (const name of harmonyNames) {
      const palette = theme.palettes[name];
      if (!palette)
        continue;
      allPalettes[name] = { ramp: palette.ramp };
    }
  }
  if (config.colors) {
    for (const [name, hex] of Object.entries(config.colors)) {
      const palette = makePalette(hex);
      allPalettes[name] = palette;
    }
  }
  if (!allPalettes["neutral"]) {
    const brandOklchForNeutral = toOklch(config.brand);
    const tint = config.tintStrength ?? 0.1;
    const neutralChroma = Math.min(Math.max(brandOklchForNeutral.c * tint, 0.005), 0.03);
    const neutralHex = fromOklch({ l: 0.5, c: neutralChroma, h: brandOklchForNeutral.h, alpha: 1 }, "hex");
    allPalettes["neutral"] = makePalette(neutralHex);
  }
  const roles = { ...DEFAULT_CONFIG.roles, ...config.roles };
  for (const [role, hex] of Object.entries(roles)) {
    if (!hex)
      continue;
    if (allPalettes[role] && !config.roles?.[role])
      continue;
    const palette = makePalette(hex);
    allPalettes[role] = palette;
  }
  const brandOklch = toOklch(config.brand);
  const tintStrength = config.tintStrength ?? 0.1;
  const surfaces = {
    light: deriveSurfaceScale(brandOklch.h, brandOklch.c, "light", tintStrength),
    dark: deriveSurfaceScale(brandOklch.h, brandOklch.c, "dark", tintStrength)
  };
  const typoOpts = /** @type {any} */ ({ ...DEFAULT_CONFIG.typography, ...config.typography });
  const useFluid = config.typography?.fluid === true;
  const typeScale = generateTypeScale({
    base: typoOpts.base,
    ratio: typoOpts.ratio
  });
  const lineHeights = {};
  const letterSpacingMap = {};
  for (const step of SCALE_KEYS) {
    lineHeights[step] = computeLineHeight(typeScale[step]).computed;
    letterSpacingMap[step] = computeLetterSpacing(typeScale[step]);
  }
  const semanticRoleResult = assignSemanticRoles(typeScale, {});
  const spacingBaseUnit = config.spacing?.baseUnit ?? DEFAULT_CONFIG.spacing.baseUnit;
  const verticalRhythmResult = computeVerticalRhythm({
    baseUnit: spacingBaseUnit
  });
  const bodyLineHeightRatio = parseFloat(lineHeights["base"]);
  const contentSpacingResult = computeContentSpacing(typoOpts.base ?? 16, bodyLineHeightRatio, { gridUnit: spacingBaseUnit });
  const dyslexiaResult = typoOpts.dyslexiaMode ? getDyslexiaAdjustments() : null;
  const fontSizeAdjustValue = typoOpts.fontSizeAdjust != null ? getFontSizeAdjust(typoOpts.fontSizeAdjust) : null;
  const fluidMaxRatio = typoOpts.fluidMaxRatio ?? deriveFluidMaxRatio(typoOpts.ratio ?? 1.2);
  const typography = {
    fontFamily: typoOpts.fontFamily,
    monoFontFamily: typoOpts.monoFontFamily,
    ...typoOpts.displayFontFamily ? { displayFontFamily: typoOpts.displayFontFamily } : {},
    scale: typeScale,
    lineHeights,
    letterSpacing: letterSpacingMap,
    fontWeights: getFontWeights(),
    measures: measureTokens(),
    semanticRoles: semanticRoleResult,
    verticalRhythm: verticalRhythmResult,
    contentSpacing: contentSpacingResult,
    dyslexia: dyslexiaResult,
    fontSizeAdjust: fontSizeAdjustValue,
    ...useFluid ? {
      fluidScale: fluidTypeScale({
        baseMin: typoOpts.fluidMinRatio ? undefined : undefined,
        minRatio: typoOpts.fluidMinRatio ?? 1.15,
        maxRatio: fluidMaxRatio,
        scaleRatio: typoOpts.ratio ?? 1.2
      })
    } : {}
  };
  const spacingOpts = { ...DEFAULT_CONFIG.spacing, ...config.spacing };
  const useFluidSpacing = config.fluidTokens?.enabled !== false;
  const fontSpacingEntries = /** @type {Array<[string, number, number]>} */ (SCALE_KEYS.map((step) => {
    const fontSizePx = typeScale[step] * (typoOpts.base ?? 16);
    const lhRatio = parseFloat(lineHeights[step]);
    return [step, fontSizePx, lhRatio];
  }));
  const spacing = {
    baseUnit: spacingOpts.baseUnit,
    scale: generateSpacingScale({ baseUnit: spacingOpts.baseUnit, includeExtended: spacingOpts.includeExtended }),
    fontSpacing: generateFontSpacingSubsets(fontSpacingEntries, {
      baseUnit: spacingOpts.baseUnit
    }),
    ...useFluidSpacing ? {
      fluidScale: fluidSpacingScale({
        baseUnit: spacingOpts.baseUnit,
        includeExtended: spacingOpts.includeExtended,
        minVw: ((config.fluidTokens && config.fluidTokens.minViewport) ?? 320) / 16,
        maxVw: ((config.fluidTokens && config.fluidTokens.maxViewport) ?? 1440) / 16,
        fluidEasing: (config.fluidTokens && config.fluidTokens.fluidEasing) ?? "ease-out"
      })
    } : {}
  };
  const { keyOpacity, ambientOpacity } = resolvedDepthResult;
  const darkKeyOpacity = Math.min(Math.round(keyOpacity * 3.75 * 1000) / 1000, 0.5);
  const darkAmbientOpacity = Math.min(Math.round(ambientOpacity * 10 / 3 * 1000) / 1000, 0.4);
  const elevation = {
    shadows: generateShadowScale({ keyOpacity, ambientOpacity }),
    shadowsFallback: generateShadowScale({ keyOpacity, ambientOpacity, colorFormat: "rgba" }),
    darkShadows: generateShadowScale({ keyOpacity: darkKeyOpacity, ambientOpacity: darkAmbientOpacity }),
    darkShadowsFallback: generateShadowScale({ keyOpacity: darkKeyOpacity, ambientOpacity: darkAmbientOpacity, colorFormat: "rgba" }),
    radii: getBorderRadiusScale(resolvedShape.radii),
    borders: getBorderScale(),
    zIndex: getZIndexScale()
  };
  const easingsRaw = getEasingCurves();
  const easingEntries = {};
  for (const name of Object.keys(easingsRaw)) {
    easingEntries[name] = easingToCss(name);
  }
  const springOverrides = Object.keys(resolvedMotionPreset.springs).length > 0 ? resolvedMotionPreset.springs : undefined;
  const springPresets = getSpringPresets(springOverrides);
  for (const [name, springConfig] of Object.entries(springPresets)) {
    easingEntries[`spring-${name}`] = springToLinear(springConfig);
  }
  const baseDurations = getDurationScale();
  const scaledDurations = resolvedMotionPreset.durationScale !== 1 ? getScaledDurationScale(baseDurations, resolvedMotionPreset.durationScale) : baseDurations;
  const durations = scaledDurations;
  for (const [name, springConfig] of Object.entries(springPresets)) {
    durations[`spring-${name}`] = computeSpringDuration(springConfig);
  }
  const motion = {
    durations,
    easings: easingEntries,
    durationScale: resolvedMotionPreset.durationScale
  };
  const focus = getFocusRingConfig();
  const stateLayers = getStateLayerConfig();
  const interactive = {
    focusColor: focus.color,
    focusWidth: focus.width,
    focusOffset: focus.offset,
    stateHoverOpacity: stateLayers.hover,
    stateFocusOpacity: stateLayers.focus,
    stateActiveOpacity: stateLayers.active,
    touchMin: getMinTouchTarget()
  };
  const icons = {
    fontVariant: config.icons?.fontVariant ?? "outlined",
    filled: config.icons?.filled ?? false,
    fontWeight: config.icons?.fontWeight ?? 400,
    fontGrade: config.icons?.fontGrade ?? 0
  };
  const pOklch = toOklch(config.brand);
  const dataL = 0.55;
  const dataC = clamp(pOklch.c, 0.08, 0.15);
  const dataColors = [];
  for (let i = 0;i < 12; i++) {
    const hue = normalizeHue(pOklch.h + i * 30);
    dataColors.push(fromOklch({ l: dataL, c: dataC, h: hue, alpha: 1 }, "hex"));
  }
  let adaptive = null;
  if (context) {
    const params = getDeviceParameters(context.class);
    const weightOffset = getDarkModeWeightOffset(context.display.inferredType);
    const minAnimDuration = getMinAnimationDuration(context.display.refreshTier);
    const densityByInput = context.input.committed === "touch" ? 1 : context.input.committed === "pointer" ? 0.75 : 0.875;
    adaptive = {
      deviceClass: context.class,
      baseSize: params.baseFontSize,
      density: densityByInput,
      touchTargetMin: params.minInteractiveTarget,
      minAnimationDuration: minAnimDuration,
      weightOffset,
      contrastBoost: context.ambient.contrastBoost,
      durationScalarBase: params.durationScalarBase,
      maxLineLength: params.maxLineLength
    };
  }
  return {
    palettes: allPalettes,
    surfaces,
    typography,
    spacing,
    elevation,
    motion,
    interactive,
    icons,
    dataColors,
    semanticRoles: {
      light: DEFAULT_LIGHT_ROLES,
      dark: deriveDarkRoles(DEFAULT_LIGHT_ROLES)
    },
    appearance: resolvedAppearance,
    density: { mode: resolvedDensity.mode, factor: resolvedDensity.factor },
    squircle: resolvedShape.squircle,
    depthPreset: resolvedDepthResult.preset,
    adaptive
  };
}
