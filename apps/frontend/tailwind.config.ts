import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1a56db', hover: '#1648c0', light: '#e8effa', dark: '#1e40af' },
        success: { DEFAULT: '#059669', light: '#d1fae5' },
        warning: { DEFAULT: '#d97706', light: '#fef3c7' },
        danger: { DEFAULT: '#dc2626', light: '#fee2e2' },
        info: { DEFAULT: '#0284c7', light: '#dbeafe' },
        gray: {
          50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb',
          300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280',
          600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827',
        },
      },
      fontFamily: { sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'] },
      boxShadow: { 'card': '0 1px 2px rgba(0,0,0,0.05)', 'md': '0 4px 6px -1px rgba(0,0,0,0.1)', 'lg': '0 10px 15px -3px rgba(0,0,0,0.1)' },
      borderRadius: { 'sm': '6px', 'md': '8px', 'lg': '12px' },
    },
  },
  plugins: [],
};
export default config;
