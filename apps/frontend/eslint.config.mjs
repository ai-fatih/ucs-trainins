import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: ['.next/**', 'public/**', 'service-worker/**'],
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['debug', 'info', 'warn', 'error'] }],
    },
  },
];
