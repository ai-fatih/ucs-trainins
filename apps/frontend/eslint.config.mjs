import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['.next/**', 'public/**', 'service-worker/**', 'next-env.d.ts'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      'no-console': ['warn', { allow: ['debug', 'info', 'warn', 'error'] }],
    },
  },
);
