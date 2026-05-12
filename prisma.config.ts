// Prisma v7 configuration — manages CLI operations (db push, migrate, studio)
// The runtime connection is handled by the PrismaClient adapter in src/lib/prisma.js
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local first (higher priority), then .env as fallback
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
