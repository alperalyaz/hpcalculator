export const Colors = {
  background: '#111111',
  surface: '#1A1A1A',
  surfaceElevated: '#222222',
  accent: '#F5C400',
  accentDark: '#C49B00',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#888888',
  border: '#2A2A2A',
  borderAccent: '#F5C40033',
  error: '#FF4444',
  success: '#44BB44',
  inputBackground: '#1E1E1E',
};

export const Typography = {
  fontFamily: 'System',

  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.textMuted,
  },
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  accent: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  accent: {
    shadowColor: '#F5C400',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Callouts = {
  result: {
    container: {
      backgroundColor: Colors.surfaceElevated,
      borderLeftWidth: 4,
      borderLeftColor: Colors.accent,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Radius.md,
      padding: Spacing.md,
    },
    title: {
      color: Colors.accent,
      fontSize: 16,
      fontWeight: '800' as const,
      marginBottom: 6,
    },
    text: {
      color: Colors.textPrimary,
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
  },
  warning: {
    container: {
      backgroundColor: '#2A2418',
      borderLeftWidth: 4,
      borderLeftColor: Colors.accent,
      borderWidth: 1,
      borderColor: '#4A3D14',
      borderRadius: Radius.md,
      padding: Spacing.md,
    },
    text: {
      color: '#E8D9A8',
      fontSize: 13,
      lineHeight: 18,
    },
  },
  error: {
    container: {
      backgroundColor: '#2A1717',
      borderLeftWidth: 4,
      borderLeftColor: '#D93025',
      borderWidth: 1,
      borderColor: '#5C2424',
      borderRadius: Radius.md,
      padding: Spacing.md,
    },
    title: {
      color: '#F2B8B5',
      fontWeight: '800' as const,
      marginBottom: 6,
    },
    text: {
      color: '#E8B4B0',
      fontWeight: '700' as const,
    },
  },
};
