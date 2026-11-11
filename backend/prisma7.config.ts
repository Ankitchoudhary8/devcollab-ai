import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 reads connection settings here, not from schema.prisma.
// Use DIRECT_URL (non-pooled) for migrations. DATABASE_URL is a fallback for
// read-only schema checks; never run migrations against the wrong database.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
