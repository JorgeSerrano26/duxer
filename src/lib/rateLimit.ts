interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitRecord>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (record.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export function rateLimit(
  ip: string,
  maxRequests = Number(import.meta.env.RATE_LIMIT_MAX_REQUESTS ?? 5),
  windowMs = Number(import.meta.env.RATE_LIMIT_WINDOW_MS ?? 60_000)
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || record.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}
