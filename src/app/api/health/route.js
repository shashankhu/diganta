// ─────────────────────────────────────────────
// GET /api/health — Production health check endpoint
// Used by Vercel, uptime monitors, and deployment verification
// ─────────────────────────────────────────────

import { NextResponse } from "next/server";

export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
    version: process.env.npm_package_version || "0.1.0",
  };

  // Optional: lightweight DB check
  try {
    const prisma = (await import("@/lib/prisma")).default;
    await prisma.$queryRaw`SELECT 1`;
    health.database = "connected";
  } catch {
    health.database = "disconnected";
    health.status = "degraded";
  }

  const statusCode = health.status === "ok" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
