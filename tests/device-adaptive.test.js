// @ts-check

/**
 * Repository module for device adaptive.test.
 * @module
 */
import { test, expect, describe } from "bun:test";
import { resolveTheme } from "../src/resolve.js";
import { DEFAULT_CONFIG } from "../src/defaults.js";
import { DEFAULT_DEVICE_CONTEXT } from "@sig-ui/core";
const baseConfig = { ...DEFAULT_CONFIG, brand: "#3b82f6" };
describe("resolveTheme without DeviceContext", () => {
  test("adaptive is null when no context provided", () => {
    const theme = resolveTheme(baseConfig);
    expect(theme.adaptive).toBeNull();
  });
});
describe("resolveTheme with DeviceContext", () => {
  test("desktop context produces adaptive parameters", () => {
    const theme = resolveTheme(baseConfig, DEFAULT_DEVICE_CONTEXT);
    expect(theme.adaptive).not.toBeNull();
    expect(theme.adaptive.deviceClass).toBe("desktop");
    expect(theme.adaptive.baseSize).toBe(20);
    expect(theme.adaptive.touchTargetMin).toBe(24);
    expect(theme.adaptive.density).toBe(0.75);
    expect(theme.adaptive.weightOffset).toBe(-100);
    expect(theme.adaptive.contrastBoost).toBe(1);
    expect(theme.adaptive.minAnimationDuration).toBe(67);
    expect(theme.adaptive.durationScalarBase).toBe(1);
    expect(theme.adaptive.maxLineLength).toBe(75);
  });
  test("phone context adapts for touch input", () => {
    const phoneContext = {
      ...DEFAULT_DEVICE_CONTEXT,
      class: "phone",
      viewingDistanceCm: 37,
      screenPpi: 160,
      input: { committed: "touch", transient: "touch", maxTouchPoints: 5 },
      display: {
        ...DEFAULT_DEVICE_CONTEXT.display,
        dpr: 3,
        gamut: "p3",
        inferredType: "oled",
        orientation: "portrait"
      }
    };
    const theme = resolveTheme(baseConfig, phoneContext);
    expect(theme.adaptive).not.toBeNull();
    expect(theme.adaptive.deviceClass).toBe("phone");
    expect(theme.adaptive.baseSize).toBe(17);
    expect(theme.adaptive.touchTargetMin).toBe(44);
    expect(theme.adaptive.density).toBe(1);
    expect(theme.adaptive.weightOffset).toBe(-50);
    expect(theme.adaptive.maxLineLength).toBe(45);
  });
  test("tv context has spacious defaults", () => {
    const tvContext = {
      ...DEFAULT_DEVICE_CONTEXT,
      class: "tv",
      viewingDistanceCm: 250,
      screenPpi: 40
    };
    const theme = resolveTheme(baseConfig, tvContext);
    expect(theme.adaptive).not.toBeNull();
    expect(theme.adaptive.deviceClass).toBe("tv");
    expect(theme.adaptive.baseSize).toBe(48);
    expect(theme.adaptive.touchTargetMin).toBe(48);
    expect(theme.adaptive.durationScalarBase).toBe(1.2);
  });
  test("watch context has compact defaults", () => {
    const watchContext = {
      ...DEFAULT_DEVICE_CONTEXT,
      class: "watch",
      viewingDistanceCm: 25,
      screenPpi: 326,
      input: { committed: "touch", transient: "touch", maxTouchPoints: 1 }
    };
    const theme = resolveTheme(baseConfig, watchContext);
    expect(theme.adaptive).not.toBeNull();
    expect(theme.adaptive.deviceClass).toBe("watch");
    expect(theme.adaptive.baseSize).toBe(14);
    expect(theme.adaptive.durationScalarBase).toBe(0.8);
  });
  test("hybrid input produces intermediate density", () => {
    const hybridContext = {
      ...DEFAULT_DEVICE_CONTEXT,
      input: { committed: "hybrid", transient: "mouse", maxTouchPoints: 10 }
    };
    const theme = resolveTheme(baseConfig, hybridContext);
    expect(theme.adaptive.density).toBe(0.875);
  });
  test("high contrast preference boosts contrast", () => {
    const highContrastContext = {
      ...DEFAULT_DEVICE_CONTEXT,
      ambient: {
        ...DEFAULT_DEVICE_CONTEXT.ambient,
        contrastPreference: "more",
        contrastBoost: 1.25
      }
    };
    const theme = resolveTheme(baseConfig, highContrastContext);
    expect(theme.adaptive.contrastBoost).toBe(1.25);
  });
  test("high refresh rate produces shorter min animation", () => {
    const highRefreshContext = {
      ...DEFAULT_DEVICE_CONTEXT,
      display: {
        ...DEFAULT_DEVICE_CONTEXT.display,
        refreshTier: "high",
        refreshRate: 120
      }
    };
    const theme = resolveTheme(baseConfig, highRefreshContext);
    expect(theme.adaptive.minAnimationDuration).toBe(44);
  });
  test("all non-adaptive fields still present", () => {
    const theme = resolveTheme(baseConfig, DEFAULT_DEVICE_CONTEXT);
    expect(theme.palettes).toBeDefined();
    expect(theme.surfaces).toBeDefined();
    expect(theme.typography).toBeDefined();
    expect(theme.spacing).toBeDefined();
    expect(theme.elevation).toBeDefined();
    expect(theme.motion).toBeDefined();
    expect(theme.interactive).toBeDefined();
    expect(theme.icons).toBeDefined();
    expect(theme.dataColors).toBeDefined();
    expect(theme.semanticRoles).toBeDefined();
    expect(theme.density).toBeDefined();
  });
});
