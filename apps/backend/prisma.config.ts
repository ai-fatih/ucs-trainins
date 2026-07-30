import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrate: {
    adapter: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL!,
    },
  },
  studio: {
    adapter: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL!,
    },
  },
});
