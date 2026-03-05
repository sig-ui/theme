// @ts-check

/**
 * Repository module for resolve aesthetics.test.
 * @module
 */
import { test, expect, describe } from "bun:test";
import { resolveTheme } from "../src/resolve.js";
const BASE_CONFIG = { brand: "#6366f1" };
describe("resolveTheme defaults", () => {
  const resolved = resolveTheme(BASE_CONFIG);
  test("appearance defaults to auto", () => {
    expect(resolved.appearance).toBe("auto");
  });
  test("density defaults to comfortable/1.0", () => {
    expect(resolved.density.mode).toBe("comfortable");
    expect(resolved.density.factor).toBe(1);
  });
  test("squircle defaults to false", () => {
    expect(resolved.squircle).toBe(false);
  });
  test("depthPreset defaults to medium", () => {
    expect(resolved.depthPreset).toBe("medium");
  });
  test("default radii match rounded preset", () => {
    expect(resolved.elevation.radii.sm).toBe(4);
    expect(resolved.elevation.radii.md).toBe(8);
    expect(resolved.elevation.radii.lg).toBe(12);
    expect(resolved.elevation.radii.xl).toBe(16);
    expect(resolved.elevation.radii["2xl"]).toBe(24);
  });
  test("none and full radius are always constant", () => {
    expect(resolved.elevation.radii.none).toBe(0);
    expect(resolved.elevation.radii.full).toBe(9999);
  });
});
describe("resolveTheme with shape presets", () => {
  test("sharp shape produces small radii", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, shape: "sharp" });
    expect(resolved.elevation.radii.sm).toBe(0);
    expect(resolved.elevation.radii.md).toBe(2);
    expect(resolved.elevation.radii.lg).toBe(4);
    expect(resolved.squircle).toBe(false);
  });
  test("squircle shape enables squircle flag", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, shape: "squircle" });
    expect(resolved.squircle).toBe(true);
    expect(resolved.elevation.radii.md).toBe(8);
  });
  test("pill shape sets all variable radii to 9999", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, shape: "pill" });
    expect(resolved.elevation.radii.sm).toBe(9999);
    expect(resolved.elevation.radii.md).toBe(9999);
    expect(resolved.elevation.radii.full).toBe(9999);
  });
  test("shape object with radii overrides", () => {
    const resolved = resolveTheme({
      ...BASE_CONFIG,
      shape: { preset: "rounded", radii: { md: 10 } }
    });
    expect(resolved.elevation.radii.md).toBe(10);
    expect(resolved.elevation.radii.sm).toBe(4);
  });
});
describe("resolveTheme with depth presets", () => {
  test("flat depth produces zero-opacity shadows", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, depth: "flat" });
    expect(resolved.depthPreset).toBe("flat");
    expect(resolved.elevation.shadowsFallback[0].css).toBe("none");
    const level1 = resolved.elevation.shadowsFallback[1];
    expect(level1.css).toContain("rgba(0, 0, 0, 0)");
    const level2 = resolved.elevation.shadowsFallback[2];
    expect(level2.css).toContain("rgba(0, 0, 0, 0)");
  });
  test("pronounced depth has higher shadow opacities than default", () => {
    const defaultResolved = resolveTheme(BASE_CONFIG);
    const pronounced = resolveTheme({ ...BASE_CONFIG, depth: "pronounced" });
    expect(pronounced.elevation.shadowsFallback[2].css).not.toBe(defaultResolved.elevation.shadowsFallback[2].css);
  });
});
describe("resolveTheme with density presets", () => {
  test("compact density", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, density: "compact" });
    expect(resolved.density.mode).toBe("compact");
    expect(resolved.density.factor).toBe(0.75);
  });
  test("spacious density", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, density: "spacious" });
    expect(resolved.density.mode).toBe("spacious");
    expect(resolved.density.factor).toBe(1.5);
  });
  test("custom density factor", () => {
    const resolved = resolveTheme({
      ...BASE_CONFIG,
      density: { preset: "comfortable", factor: 1.1 }
    });
    expect(resolved.density.factor).toBe(1.1);
  });
});
describe("resolveTheme with motion presets", () => {
  test("instant motion produces near-zero durations", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, motion: "instant" });
    expect(resolved.motion.durations["normal"]).toBeLessThanOrEqual(10);
  });
  test("snappy motion produces halved durations", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, motion: "snappy" });
    expect(resolved.motion.durations["normal"]).toBe(100);
  });
  test("smooth motion (default) keeps original durations", () => {
    const resolved = resolveTheme(BASE_CONFIG);
    expect(resolved.motion.durations["normal"]).toBe(200);
  });
  test("playful motion scales durations up", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, motion: "playful" });
    expect(resolved.motion.durations["normal"]).toBe(260);
  });
  test("motion object with custom durationScale", () => {
    const resolved = resolveTheme({
      ...BASE_CONFIG,
      motion: { preset: "smooth", durationScale: 0.8 }
    });
    expect(resolved.motion.durations["normal"]).toBe(160);
  });
  test("spring easings are still present", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, motion: "playful" });
    expect(resolved.motion.easings["spring-bouncy"]).toBeDefined();
    expect(resolved.motion.easings["spring-snappy"]).toBeDefined();
  });
});
describe("resolveTheme with appearance", () => {
  test("light appearance", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, appearance: "light" });
    expect(resolved.appearance).toBe("light");
  });
  test("dark appearance", () => {
    const resolved = resolveTheme({ ...BASE_CONFIG, appearance: "dark" });
    expect(resolved.appearance).toBe("dark");
  });
});
