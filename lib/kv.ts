import { Redis } from '@upstash/redis';
import { Paste } from './types';

const PASTE_PREFIX = 'paste:';

if (!process.env.UPSTASH_REDIS_REST_URL) throw new Error('Missing UPSTASH_REDIS_REST_URL');
if (!process.env.UPSTASH_REDIS_REST_TOKEN) throw new Error('Missing UPSTASH_REDIS_REST_TOKEN');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function savePaste(paste: Paste): Promise<void> {
  const key = `${PASTE_PREFIX}${paste.id}`;
  const value = JSON.stringify(paste);
  if (paste.ttl_seconds) await redis.setex(key, paste.ttl_seconds, value);
  else await redis.set(key, value);
}

export async function getPaste(id: string): Promise<Paste | null> {
  const key = `${PASTE_PREFIX}${id}`;
  const data = await redis.get(key);

  if (!data) return null;

  // ✅ Safely handle string vs object
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Paste;
    } catch (err) {
      console.error('Failed to parse paste JSON:', data, err);
      return null;
    }
  }

  // Already an object
  return data as Paste;
}

export async function updatePaste(paste: Paste): Promise<void> {
  const key = `${PASTE_PREFIX}${paste.id}`;
  const value = JSON.stringify(paste);

  if (paste.ttl_seconds) {
    const elapsed = Math.floor((Date.now() - paste.created_at) / 1000);
    const remainingTtl = paste.ttl_seconds - elapsed;
    if (remainingTtl > 0) await redis.setex(key, remainingTtl, value);
    else await redis.del(key);
  } else {
    await redis.set(key, value);
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    await redis.set('__healthcheck', 'ok', { ex: 5 });
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}
