// ─────────────────────────────────────────────
// Diganta — Singleton Prisma Client
// Production-safe: single pool, edge-compatible, hot-reload safe
// ─────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

if (!globalForPrisma.__digantaPrisma) {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "FATAL: DATABASE_URL is not set. Check your .env.local or Vercel environment variables."
    );
  }

  const pool = new Pool({
    connectionString,
    max: parseInt(process.env.DATABASE_POOL_SIZE || "3", 10),
    idleTimeoutMillis: 10000,      // release idle connections after 10s (was 30s)
    connectionTimeoutMillis: 5000, // fail fast if no connection available (was 10s)
  });

  const adapter = new PrismaPg(pool);

  globalForPrisma.__digantaPrisma = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

const prisma = globalForPrisma.__digantaPrisma;
export default prisma;
