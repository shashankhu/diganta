// ─────────────────────────────────────────────
// In-Memory Rate Limiter
// Sliding window counter — no external dependencies.
// Note: State is NOT shared across serverless instances.
// ─────────────────────────────────────────────

const rateLimitStore = new Map();

// Periodic cleanup — only runs in long-lived processes (not serverless cold starts)
if (typeof globalThis.__rateLimitCleanup === "undefined") {
  globalThis.__rateLimitCleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitStore.entries()) {
      if (data.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000);

  // Prevent the interval from keeping Node.js process alive
  if (globalThis.__rateLimitCleanup?.unref) {
    globalThis.__rateLimitCleanup.unref();
  }
}

/**
 * Checks if a given key has exceeded the rate limit.
 *
 * @param {string} key - The unique identifier (e.g. IP address or email)
 * @param {number} maxAttempts - Maximum allowed attempts within the window
 * @param {number} windowMs - The time window in milliseconds
 * @returns {object} { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(key, maxAttempts = 10, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record) {
    // First attempt
    const newRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newRecord);
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetTime: newRecord.resetTime,
    };
  }

  // Check if window has expired
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetTime: record.resetTime,
    };
  }

  // Still within window
  record.count += 1;
  const allowed = record.count <= maxAttempts;
  const remaining = Math.max(0, maxAttempts - record.count);

  return {
    allowed,
    remaining,
    resetTime: record.resetTime,
  };
}
