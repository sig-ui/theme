// @ts-check

/**
 * SigUI theme presets module for presets.
 * @module
 */
const SHAPE_RADII = {
  sharp: { sm: 0, md: 2, lg: 4, xl: 6, "2xl": 8 },
  rounded: { sm: 4, md: 8, lg: 12, xl: 16, "2xl": 24 },
  soft: { sm: 8, md: 16, lg: 24, xl: 32, "2xl": 48 },
  pill: { sm: 9999, md: 9999, lg: 9999, xl: 9999, "2xl": 9999 }
};
const SQUIRCLE_BASE = {
  "squircle-sharp": "sharp",
  squircle: "rounded",
  "squircle-soft": "soft"
};

/** @typedef {"sharp" | "rounded" | "soft" | "pill" | "squircle-sharp" | "squircle" | "squircle-soft"} ShapePreset */
/** @typedef {{ sm: number, md: number, lg: number, xl: number, "2xl": number }} RadiusScale */
/** @typedef {{ preset?: ShapePreset, radii?: Partial<RadiusScale> }} ShapeInputObject */
/** @typedef {{ radii: RadiusScale, squircle: boolean }} ResolvedShape */
/** @typedef {"flat" | "subtle" | "medium" | "pronounced"} DepthPreset */
/** @typedef {{ preset?: DepthPreset, shadowIntensity?: number }} DepthInputObject */
/** @typedef {{ keyOpacity: number, ambientOpacity: number, preset: DepthPreset }} ResolvedDepth */
/** @typedef {"compact" | "comfortable" | "spacious"} DensityPreset */
/** @typedef {{ preset?: DensityPreset, factor?: number, exempt?: string[] }} DensityInputObject */
/** @typedef {{ mode: DensityPreset, factor: number, exempt: string[] }} ResolvedDensity */
/** @typedef {"instant" | "snappy" | "smooth" | "playful"} MotionPreset */
/** @typedef {{ stiffness: number, damping: number, mass: number }} SpringConfig */
/** @typedef {{ preset?: MotionPreset, durationScale?: number, defaultSpring?: string, springs?: Partial<Record<string, SpringConfig>>, reducedMotion?: "crossfade" | "instant" | "reduce-duration" }} MotionInputObject */
/** @typedef {{ durationScale: number, defaultSpring: string, springs: Partial<Record<string, SpringConfig>>, reducedMotion: "crossfade" | "instant" | "reduce-duration" }} ResolvedMotion */
/** @typedef {"auto" | "light" | "dark"} Appearance */
/**
 * resolveShape.
 * @param {ShapePreset | ShapeInputObject} input
 * @returns {ResolvedShape}
 */
export function resolveShape(input) {
  if (!input)
    return { radii: SHAPE_RADII.rounded, squircle: false };
  const config = typeof input === "string" ? { preset: input } : input;
  const preset = config.preset ?? "rounded";
  const squircleBase = SQUIRCLE_BASE[preset];
  const squircle = squircleBase !== undefined;
  const baseKey = squircleBase ?? preset;
  const baseRadii = SHAPE_RADII[baseKey] ?? SHAPE_RADII.rounded;
  const radii = config.radii ? {
    sm: config.radii.sm ?? baseRadii.sm,
    md: config.radii.md ?? baseRadii.md,
    lg: config.radii.lg ?? baseRadii.lg,
    xl: config.radii.xl ?? baseRadii.xl,
    "2xl": config.radii["2xl"] ?? baseRadii["2xl"]
  } : { ...baseRadii };
  return { radii, squircle };
}
const DEPTH_PRESETS = {
  flat: { keyOpacity: 0, ambientOpacity: 0 },
  subtle: { keyOpacity: 0.04, ambientOpacity: 0.03 },
  medium: { keyOpacity: 0.08, ambientOpacity: 0.06 },
  pronounced: { keyOpacity: 0.16, ambientOpacity: 0.12 }
};
/**
 * resolveDepth.
 * @param {DepthPreset | DepthInputObject} input
 * @returns {ResolvedDepth}
 */
export function resolveDepth(input) {
  if (!input)
    return { ...DEPTH_PRESETS.medium, preset: "medium" };
  const config = typeof input === "string" ? { preset: input } : input;
  const preset = config.preset ?? "medium";
  const base = DEPTH_PRESETS[preset] ?? DEPTH_PRESETS.medium;
  if (config.shadowIntensity !== undefined) {
    return {
      keyOpacity: base.keyOpacity * config.shadowIntensity,
      ambientOpacity: base.ambientOpacity * config.shadowIntensity,
      preset
    };
  }
  return { ...base, preset };
}
const DENSITY_FACTORS = {
  compact: 0.75,
  comfortable: 1,
  spacious: 1.5
};
/**
 * resolveDensity.
 * @param {DensityPreset | DensityInputObject} input
 * @returns {ResolvedDensity}
 */
export function resolveDensity(input) {
  if (!input)
    return { mode: "comfortable", factor: 1, exempt: [] };
  const config = typeof input === "string" ? { preset: input } : input;
  const mode = config.preset ?? "comfortable";
  const factor = config.factor ?? DENSITY_FACTORS[mode] ?? 1;
  const exempt = config.exempt ?? [];
  return { mode, factor, exempt };
}
const MOTION_PRESETS = {
  instant: { durationScale: 0.05, defaultSpring: "snappy" },
  snappy: { durationScale: 0.5, defaultSpring: "snappy" },
  smooth: { durationScale: 1, defaultSpring: "default" },
  playful: { durationScale: 1.3, defaultSpring: "bouncy" }
};
/**
 * resolveMotion.
 * @param {MotionPreset | MotionInputObject} input
 * @returns {ResolvedMotion}
 */
export function resolveMotion(input) {
  if (!input) {
    return {
      durationScale: 1,
      defaultSpring: "default",
      springs: {},
      reducedMotion: "crossfade"
    };
  }
  const config = typeof input === "string" ? { preset: input } : input;
  const preset = config.preset ?? "smooth";
  const base = MOTION_PRESETS[preset] ?? MOTION_PRESETS.smooth;
  return {
    durationScale: config.durationScale ?? base.durationScale,
    defaultSpring: config.defaultSpring ?? base.defaultSpring,
    springs: config.springs ?? {},
    reducedMotion: config.reducedMotion ?? "crossfade"
  };
}
/**
 * resolveAppearance.
 * @param {Appearance} input
 * @returns {Appearance}
 */
export function resolveAppearance(input) {
  return input ?? "auto";
}
