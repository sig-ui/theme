// @ts-check

/**
 * SigUI theme defaults module for defaults.
 * @module
 */
export const DEFAULT_CONFIG = {
  roles: {
    danger: "#be123c",
    success: "#16a34a",
    warning: "#d97706",
    info: "#2563eb"
  },
  typography: {
    base: 16,
    ratio: 1.2,
    fontFamily: "system-ui, -apple-system, sans-serif",
    monoFontFamily: "ui-monospace, 'Cascadia Code', monospace",
    leadingBase: 1.2,
    leadingScale: 5.6,
    fluidMinRatio: 1.15,
    dyslexiaMode: false,
    opticalSizing: true,
    fontSizeAdjust: null
  },
  spacing: {
    baseUnit: 4
  },
  fluidTokens: {
    enabled: true,
    minViewport: 320,
    maxViewport: 1440,
    fluidEasing: "ease-out"
  },
  output: {
    dir: "src/sigui",
    typescript: false,
    json: false,
    splitFiles: false,
    minify: false
  }
};
export const DEFAULT_I18N_CONFIG = {
  defaultLocale: "en",
  defaultDirection: "ltr",
  rtl: {
    mirrorIcons: true,
    mirrorMotion: true,
    lintPhysicalProperties: true
  },
  cjk: {
    fontLoading: "unicode-range",
    punctuationTrim: true,
    verticalWriting: false
  },
  pseudoLocalization: {
    enabled: false,
    mode: "expanded",
    expansionRatio: 0.4
  },
  fontLoading: {
    strategy: "swap",
    preloadLocales: [],
    fontBasePath: "/fonts"
  }
};
export const DEFAULT_COGA_CONFIG = {
  highContrast: {
    borderWidthIncrease: 1,
    focusWidthIncrease: 1,
    focusOffsetIncrease: 1,
    apcaLcBoost: 5,
    stateLayerOpacityBoost: 0.04,
    disabledOpacity: 0.5,
    dividerOpacity: 0.5,
    removeGlassMaterial: true
  },
  reducedTransparency: {
    removeGlassMaterial: true,
    opaqueBackdrop: true,
    lightnessShiftHover: -0.04,
    lightnessShiftFocus: -0.06,
    lightnessShiftActive: -0.08
  },
  errorPrevention: {
    destructiveConfirmation: true,
    highRiskTypingConfirmation: true,
    undoWindowSeconds: 8,
    undoMaxActions: 5,
    autoSaveIntervalSeconds: 30,
    navigationGuard: true
  },
  session: {
    timeoutWarningSeconds: 120,
    preserveFormStateOnTimeout: true,
    restoreFormStateOnReturn: true
  },
  loading: {
    skeletonAppearDelayMs: 200,
    progressUpdateIntervalMs: 1000,
    estimatedTimeThresholdMs: 4000
  },
  content: {
    maxReadingLevel: 8,
    maxUIStringWords: 12,
    enforceSentenceCase: true,
    prohibitAllCapsBody: true
  },
  cognitiveLoad: {
    maxInteractivePerSection: 7,
    maxNavItems: 7,
    maxDropdownWithoutSearch: 15,
    maxFormFieldsPerSection: 7,
    maxTableColumns: 7,
    maxToolbarPrimaryActions: 5
  },
  defaultDensityForAccessibility: "comfortable"
};
