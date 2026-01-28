

import { Redis } from '@upstash/redis';
import { Paste } from './types';

const PASTE_PREFIX = 'paste:';
console.log(
  "Redis env loaded:",
  !!process.env.UPSTASH_REDIS_REST_URL,
  !!process.env.UPSTASH_REDIS_REST_TOKEN
);
// Initialize Upstash Redis client with explicit env vars
// import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function savePaste(paste: Paste): Promise<void> {
  const key = `${PASTE_PREFIX}${paste.id}`;
  
  // If TTL is set, use Redis SETEX for automatic expiry
  // Upstash handles JSON serialization automatically
  if (paste.ttl_seconds) {
    await redis.setex(key, paste.ttl_seconds, paste);
  } else {
    await redis.set(key, paste);
  }
}

export async function getPaste(id: string): Promise<Paste | null> {
  const key = `${PASTE_PREFIX}${id}`;
  const data = await redis.get<Paste>(key);
  
  if (!data) {
    return null;
  }
  
  // Upstash automatically deserializes, return directly
  return data;
}

export async function updatePaste(paste: Paste): Promise<void> {
  const key = `${PASTE_PREFIX}${paste.id}`;
  
  // Calculate remaining TTL if it exists
  if (paste.ttl_seconds) {
    const elapsed = Math.floor((Date.now() - paste.created_at) / 1000);
    const remainingTtl = paste.ttl_seconds - elapsed;
    
    if (remainingTtl > 0) {
      await redis.setex(key, remainingTtl, paste);
    } else {
      // Already expired, delete it
      await redis.del(key);
    }
  } else {
    await redis.set(key, paste);
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    // Try a simple ping operation
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}