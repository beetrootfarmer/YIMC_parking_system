export const theme = {
  colors: {
    white: '#ffffff',
    black: '#000000',

    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray700: '#374151',
    gray800: '#1f2937',

    slate50: '#f8fafc',
    slate100: '#f1f5f9',
    slate200: '#e2e8f0',
    slate300: '#cbd5e1',
    slate400: '#94a3b8',
    slate500: '#64748b',
    slate600: '#475569',
    slate700: '#334155',
    slate800: '#1e293b',
    slate900: '#0f172a',

    blue50: '#eff6ff',
    blue100: '#dbeafe',
    blue200: '#bfdbfe',
    blue500: '#3b82f6',
    blue600: '#2563eb',
    blue700: '#1d4ed8',
    blue900: '#1e3a8a',

    yellow100: '#fef9c3',
    yellow400: '#facc15',
    yellow500: '#eab308',
    yellow800: '#854d0e',

    green50: '#f0fdf4',
    green100: '#dcfce7',
    green500: '#22c55e',
    green600: '#16a34a',
    green800: '#166534',

    red50: '#fef2f2',
    red100: '#fee2e2',
    red200: '#fecaca',
    red500: '#ef4444',
    red600: '#dc2626',
    red800: '#991b1b',

    orange500: '#f97316',
    orange600: '#ea580c',
  },
  fonts: {
    sans: "'Noto Sans KR', sans-serif",
  },
} as const;

export type Theme = typeof theme;
