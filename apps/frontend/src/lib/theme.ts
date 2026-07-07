// ============================================
// UCS Service — Design Tokens
// Фирменные цвета: синий, бирюзовый, чёрный
// Источник: CASTCOM brand identity for UCS-Service
// ============================================

export const colors = {
  // Primary — синий (основной бренд)
  primary: {
    DEFAULT: '#1a56db',
    hover: '#1648c0',
    light: '#e8effa',
    dark: '#1e40af',
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#1a56db',
    600: '#1648c0',
    700: '#1e40af',
    800: '#1e3a8a',
    900: '#1e3a5f',
  },

  // Accent — бирюзовый (вторичный бренд)
  accent: {
    DEFAULT: '#0d9488',
    hover: '#0f766e',
    light: '#ccfbf1',
    dark: '#115e59',
  },

  // Semantic
  success: { DEFAULT: '#059669', light: '#d1fae5', dark: '#047857' },
  warning: { DEFAULT: '#d97706', light: '#fef3c7', dark: '#b45309' },
  danger: { DEFAULT: '#dc2626', light: '#fee2e2', dark: '#b91c1c' },
  info: { DEFAULT: '#0284c7', light: '#dbeafe' },

  // Neutrals
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Brand dark (чёрный из фирстиля)
  black: '#111827',
  white: '#ffffff',
} as const;

export const typography = {
  fontFamily: {
    heading: 'Manrope, sans-serif',
    body: 'Manrope, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const borderRadius = {
  none: '0',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

// CSS custom properties для globals.css
export const cssVariables = `
  :root {
    --color-primary: ${colors.primary.DEFAULT};
    --color-primary-hover: ${colors.primary.hover};
    --color-primary-light: ${colors.primary.light};
    --color-primary-dark: ${colors.primary.dark};
    --color-accent: ${colors.accent.DEFAULT};
    --color-accent-light: ${colors.accent.light};
    --color-success: ${colors.success.DEFAULT};
    --color-success-light: ${colors.success.light};
    --color-warning: ${colors.warning.DEFAULT};
    --color-warning-light: ${colors.warning.light};
    --color-danger: ${colors.danger.DEFAULT};
    --color-danger-light: ${colors.danger.light};
    --color-info: ${colors.info.DEFAULT};
    --color-info-light: ${colors.info.light};
    --color-gray-50: ${colors.gray[50]};
    --color-gray-100: ${colors.gray[100]};
    --color-gray-200: ${colors.gray[200]};
    --color-gray-300: ${colors.gray[300]};
    --color-gray-400: ${colors.gray[400]};
    --color-gray-500: ${colors.gray[500]};
    --color-gray-600: ${colors.gray[600]};
    --color-gray-700: ${colors.gray[700]};
    --color-gray-800: ${colors.gray[800]};
    --color-gray-900: ${colors.gray[900]};
    --font-heading: ${typography.fontFamily.heading};
    --font-body: ${typography.fontFamily.body};
    --radius-sm: ${borderRadius.sm};
    --radius-md: ${borderRadius.md};
    --radius-lg: ${borderRadius.lg};
    --shadow-sm: ${shadows.sm};
    --shadow-md: ${shadows.md};
    --shadow-lg: ${shadows.lg};
  }
`;

// Утилита для получения Tailwind-классов из темы
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
} as const;

export type Theme = typeof theme;
