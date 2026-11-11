import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma CLI uses the DIRECT (non-pooled) Neon URL for migrations.
// Keep this separate from the pooled DATABASE_URL used by the application.
// A missing DIRECT_URL fails fast instead of silently falling back to another DB.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
