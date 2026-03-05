// @ts-check

/**
 * Repository module for presets.test.
 * @module
 */
import { test, expect, describe } from "bun:test";
import {
  resolveShape,
  resolveDepth,
  resolveDensity,
  resolveMotion,
  resolveAppearance
} from "../src/presets.js";
describe("resolveShape", () => {
  test("defaults to rounded with no squircle when input is undefined", () => {
    const result = resolveShape();
    expect(result.squircle).toBe(false);
    expect(result.radii.sm).toBe(4);
    expect(result.radii.md).toBe(8);
    expect(result.radii.lg).toBe(12);
    expect(result.radii.xl).toBe(16);
    expect(result.radii["2xl"]).toBe(24);
  });
  test("sharp preset has small radii", () => {
    const result = resolveShape("sharp");
    expect(result.radii.sm).toBe(0);
    expect(result.radii.md).toBe(2);
    expect(result.radii.lg).toBe(4);
    expect(result.squircle).toBe(false);
  });
  test("soft preset has large radii", () => {
    const result = resolveShape("soft");
    expect(result.radii.sm).toBe(8);
    expect(result.radii.md).toBe(16);
    expect(result.radii.lg).toBe(24);
    expect(result.radii.xl).toBe(32);
    expect(result.radii["2xl"]).toBe(48);
    expect(result.squircle).toBe(false);
  });
  test("pill preset sets all radii to 9999", () => {
    const result = resolveShape("pill");
    expect(result.radii.sm).toBe(9999);
    expect(result.radii.md).toBe(9999);
    expect(result.radii.lg).toBe(9999);
    expect(result.radii.xl).toBe(9999);
    expect(result.radii["2xl"]).toBe(9999);
    expect(result.squircle).toBe(false);
  });
  test("squircle preset enables squircle flag with rounded radii", () => {
    const result = resolveShape("squircle");
    expect(result.squircle).toBe(true);
    expect(result.radii.md).toBe(8);
  });
  test("squircle-sharp enables squircle with sharp radii", () => {
    const result = resolveShape("squircle-sharp");
    expect(result.squircle).toBe(true);
    expect(result.radii.md).toBe(2);
  });
  test("squircle-soft enables squircle with soft radii", () => {
    const result = resolveShape("squircle-soft");
    expect(result.squircle).toBe(true);
    expect(result.radii.md).toBe(16);
  });
  test("object config with preset", () => {
    const result = resolveShape({ preset: "soft" });
    expect(result.radii.md).toBe(16);
    expect(result.squircle).toBe(false);
  });
  test("object config with partial radii overrides", () => {
    const result = resolveShape({ preset: "rounded", radii: { md: 10, lg: 16 } });
    expect(result.radii.sm).toBe(4);
    expect(result.radii.md).toBe(10);
    expect(result.radii.lg).toBe(16);
    expect(result.radii.xl).toBe(16);
  });
  test("object config without preset defaults to rounded", () => {
    const result = resolveShape({ radii: { md: 6 } });
    expect(result.radii.sm).toBe(4);
    expect(result.radii.md).toBe(6);
  });
});
describe("resolveDepth", () => {
  test("defaults to medium when input is undefined", () => {
    const result = resolveDepth();
    expect(result.preset).toBe("medium");
    expect(result.keyOpacity).toBe(0.08);
    expect(result.ambientOpacity).toBe(0.06);
  });
  test("flat preset has zero opacities", () => {
    const result = resolveDepth("flat");
    expect(result.preset).toBe("flat");
    expect(result.keyOpacity).toBe(0);
    expect(result.ambientOpacity).toBe(0);
  });
  test("subtle preset has half intensity", () => {
    const result = resolveDepth("subtle");
    expect(result.keyOpacity).toBe(0.04);
    expect(result.ambientOpacity).toBe(0.03);
  });
  test("pronounced preset has double intensity", () => {
    const result = resolveDepth("pronounced");
    expect(result.keyOpacity).toBe(0.16);
    expect(result.ambientOpacity).toBe(0.12);
  });
  test("object config with preset", () => {
    const result = resolveDepth({ preset: "subtle" });
    expect(result.preset).toBe("subtle");
    expect(result.keyOpacity).toBe(0.04);
  });
  test("shadowIntensity multiplies preset opacities", () => {
    const result = resolveDepth({ preset: "medium", shadowIntensity: 0.5 });
    expect(result.keyOpacity).toBeCloseTo(0.04);
    expect(result.ambientOpacity).toBeCloseTo(0.03);
  });
  test("shadowIntensity of 0 produces zero opacities", () => {
    const result = resolveDepth({ preset: "pronounced", shadowIntensity: 0 });
    expect(result.keyOpacity).toBe(0);
    expect(result.ambientOpacity).toBe(0);
  });
  test("shadowIntensity of 2 doubles opacities", () => {
    const result = resolveDepth({ preset: "medium", shadowIntensity: 2 });
    expect(result.keyOpacity).toBeCloseTo(0.16);
    expect(result.ambientOpacity).toBeCloseTo(0.12);
  });
});
describe("resolveDensity", () => {
  test("defaults to comfortable with factor 1.0", () => {
    const result = resolveDensity();
    expect(result.mode).toBe("comfortable");
    expect(result.factor).toBe(1);
    expect(result.exempt).toEqual([]);
  });
  test("compact string preset", () => {
    const result = resolveDensity("compact");
    expect(result.mode).toBe("compact");
    expect(result.factor).toBe(0.75);
  });
  test("spacious string preset", () => {
    const result = resolveDensity("spacious");
    expect(result.mode).toBe("spacious");
    expect(result.factor).toBe(1.5);
  });
  test("object config with custom factor overrides preset factor", () => {
    const result = resolveDensity({ preset: "compact", factor: 0.8 });
    expect(result.mode).toBe("compact");
    expect(result.factor).toBe(0.8);
  });
  test("object config with exempt components", () => {
    const result = resolveDensity({ preset: "compact", exempt: ["table", "form"] });
    expect(result.exempt).toEqual(["table", "form"]);
  });
});
describe("resolveMotion", () => {
  test("defaults to smooth with durationScale 1.0", () => {
    const result = resolveMotion();
    expect(result.durationScale).toBe(1);
    expect(result.defaultSpring).toBe("default");
    expect(result.reducedMotion).toBe("crossfade");
  });
  test("instant preset has near-zero durationScale", () => {
    const result = resolveMotion("instant");
    expect(result.durationScale).toBe(0.05);
    expect(result.defaultSpring).toBe("snappy");
  });
  test("snappy preset has 0.5 durationScale", () => {
    const result = resolveMotion("snappy");
    expect(result.durationScale).toBe(0.5);
    expect(result.defaultSpring).toBe("snappy");
  });
  test("playful preset has 1.3 durationScale and bouncy spring", () => {
    const result = resolveMotion("playful");
    expect(result.durationScale).toBe(1.3);
    expect(result.defaultSpring).toBe("bouncy");
  });
  test("object config with custom durationScale", () => {
    const result = resolveMotion({ preset: "smooth", durationScale: 0.8 });
    expect(result.durationScale).toBe(0.8);
    expect(result.defaultSpring).toBe("default");
  });
  test("object config with spring overrides", () => {
    const result = resolveMotion({
      preset: "smooth",
      springs: { bouncy: { stiffness: 180, damping: 8, mass: 1 } }
    });
    expect(result.springs).toEqual({ bouncy: { stiffness: 180, damping: 8, mass: 1 } });
  });
  test("object config with reducedMotion strategy", () => {
    const result = resolveMotion({ preset: "smooth", reducedMotion: "instant" });
    expect(result.reducedMotion).toBe("instant");
  });
  test("object config with custom defaultSpring", () => {
    const result = resolveMotion({ preset: "smooth", defaultSpring: "gentle" });
    expect(result.defaultSpring).toBe("gentle");
  });
});
describe("resolveAppearance", () => {
  test("defaults to auto when undefined", () => {
    expect(resolveAppearance()).toBe("auto");
  });
  test("returns light when given light", () => {
    expect(resolveAppearance("light")).toBe("light");
  });
  test("returns dark when given dark", () => {
    expect(resolveAppearance("dark")).toBe("dark");
  });
  test("returns auto when given auto", () => {
    expect(resolveAppearance("auto")).toBe("auto");
  });
});
