import type { TextStyle } from 'react-native';

export const Serene = {
  surface: '#f8f9ff',
  surfaceDim: '#cbdbf5',
  surfaceBright: '#f8f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerHigh: '#dce9ff',
  surfaceContainerHighest: '#d3e4fe',
  onSurface: '#0b1c30',
  onSurfaceVariant: '#45464d',
  outline: '#76777d',
  outlineVariant: '#c6c6cd',
  primary: '#000000',
  onPrimary: '#ffffff',
  primaryContainer: '#131b2e',
  secondary: '#006a61',
  onSecondary: '#ffffff',
  secondaryContainer: '#86f2e4',
  onSecondaryContainer: '#006f66',
  secondaryFixed: '#89f5e7',
  onSecondaryFixed: '#00201d',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  warningContainer: '#fef3c7',
  warning: '#b45309',
  successContainer: '#f0fdf4',
  success: '#15803d',
} as const;

/**
 * Teinte validée sur l'écran de connexion (reprise de la maquette « Documents & IA ») :
 * fond blanc lavande, panneaux bleutés, reflet turquoise, accent #006a61 et bouton principal noir.
 */
export const Tint = {
  primary: '#006a61',
  navy: '#131b2e',
  soft: '#eff4ff',
  softer: '#f8f9ff',
  border: '#d3e4fe',
  lavender: '#e5eeff',
  glow: '#86f2e4',
  amber: '#f59e0b',
  red: '#ef4444',
  black: '#000000',
  blackPressed: '#1f2329',
} as const;

export const FontFamily = {
  heading: 'PlusJakartaSans_600SemiBold',
  headingBold: 'PlusJakartaSans_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  icon: 'MaterialSymbols_400Regular',
  iconFilled: 'MaterialSymbols_400Regular_Filled',
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 999,
} as const;

export const Space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  gutter: 16,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  floating: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const Typography: Record<string, TextStyle> = {
  displayLg: {
    fontFamily: FontFamily.headingBold,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.8,
  },
  displayLgMobile: {
    fontFamily: FontFamily.headingBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  headlineLg: {
    fontFamily: FontFamily.heading,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.28,
  },
  headlineMd: {
    fontFamily: FontFamily.heading,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.22,
  },
  headlineSm: {
    fontFamily: FontFamily.heading,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.09,
  },
  titleMd: {
    fontFamily: FontFamily.heading,
    fontSize: 16,
    lineHeight: 22,
  },
  bodyLg: {
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySm: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    lineHeight: 16,
  },
  labelMd: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  labelSm: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.44,
  },
  dataMono: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    fontVariant: ['tabular-nums'],
  },
};
