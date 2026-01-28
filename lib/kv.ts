import { Redis } from '@upstash/redis';
import { Paste } from './types';

const PASTE_PREFIX = 'paste:';

// ✅ Fail fast if environment variables are missing
if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('Missing UPSTASH_REDIS_REST_URL');
}
if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing UPSTASH_REDIS_REST_TOKEN');
}

// ✅ Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Save a paste to Redis
 */
export async function savePaste(paste: Paste): Promise<void> {
  const key = `${PASTE_PREFIX}${paste.id}`;

  const value = JSON.stringify(paste);

  if (paste.ttl_seconds) {
    // Redis SETEX automatically expires key
    await redis.setex(key, paste.ttl_seconds, value);
  } else {
    await redis.set(key, value);
  }
}

/**
 * Get a paste from Redis
 * ✅ Handles both string and object returns safely
 */
export async function getPaste(id: string): Promise<Paste | null> {
  const key = `${PASTE_PREFIX}${id}`;
  const data = await redis.get(key);

  if (!data) return null;

  try {
    return typeof data === 'object' ? data as Paste : JSON.parse(data as string) as Paste;
  } catch (err) {
    console.error('Error parsing paste JSON', data, err);
    return null;
  }
}


/**
 * Update a paste (e.g., increment view count)
 */
export async function updatePaste(paste: Paste): Promise<void> {
  const key = `${PASTE_PREFIX}${paste.id}`;

  const value = JSON.stringify(paste);

  if (paste.ttl_seconds) {
    // Calculate remaining TTL
    const elapsed = Math.floor((Date.now() - paste.created_at) / 1000);
    const remainingTtl = paste.ttl_seconds - elapsed;

    if (remainingTtl > 0) {
      await redis.setex(key, remainingTtl, value);
    } else {
      // Already expired, delete key
      await redis.del(key);
    }
  } else {
    await redis.set(key, value);
  }
}

/**
 * Simple Redis health check (production-safe for REST API)
 */
export async function healthCheck(): Promise<boolean> {
  try {
    // Use a temporary key with short TTL
    await redis.set('__healthcheck', 'ok', { ex: 5 });
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}
