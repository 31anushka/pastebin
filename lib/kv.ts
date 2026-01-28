// import { Redis } from '@upstash/redis';
// import { Paste } from './types';

// const PASTE_PREFIX = 'paste:';

// // Initialize Upstash Redis client
// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// });

// export async function savePaste(paste: Paste): Promise<void> {
//   const key = `${PASTE_PREFIX}${paste.id}`;
  
//   // If TTL is set, use Redis SETEX for automatic expiry
//   if (paste.ttl_seconds) {
//     await redis.setex(key, paste.ttl_seconds, JSON.stringify(paste));
//   } else {
//     await redis.set(key, JSON.stringify(paste));
//   }
// }

// export async function getPaste(id: string): Promise<Paste | null> {
//   const key = `${PASTE_PREFIX}${id}`;
//   const data = await redis.get(key);
  
//   if (!data) {
//     return null;
//   }
  
//   return JSON.parse(data as string) as Paste;
// }

// export async function updatePaste(paste: Paste): Promise<void> {
//   const key = `${PASTE_PREFIX}${paste.id}`;
  
//   // Calculate remaining TTL if it exists
//   if (paste.ttl_seconds) {
//     const elapsed = Math.floor((Date.now() - paste.created_at) / 1000);
//     const remainingTtl = paste.ttl_seconds - elapsed;
    
//     if (remainingTtl > 0) {
//       await redis.setex(key, remainingTtl, JSON.stringify(paste));
//     } else {
//       // Already expired, delete it
//       await redis.del(key);
//     }
//   } else {
//     await redis.set(key, JSON.stringify(paste));
//   }
// }

// export async function healthCheck(): Promise<boolean> {
//   try {
//     // Try a simple ping operation
//     const result = await redis.ping();
//     return result === 'PONG';
//   } catch (error) {
//     console.error('Redis health check failed:', error);
//     return false;
//   }
// }

import { Redis } from '@upstash/redis';
import { Paste } from './types';

const PASTE_PREFIX = 'paste:';

// Initialize Upstash Redis client with explicit env vars
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function savePaste(paste: Paste): Promise<void> {
  const key = `${PASTE_PREFIX}${paste.id}`;
  
  // If TTL is set, use Redis SETEX for automatic expiry
  if (paste.ttl_seconds) {
    await redis.setex(key, paste.ttl_seconds, JSON.stringify(paste));
  } else {
    await redis.set(key, JSON.stringify(paste));
  }
}

export async function getPaste(id: string): Promise<Paste | null> {
  const key = `${PASTE_PREFIX}${id}`;
  const data = await redis.get(key);
  
  if (!data) {
    return null;
  }
  
  return JSON.parse(data as string) as Paste;
}

export async function updatePaste(paste: Paste): Promise<void> {
  const key = `${PASTE_PREFIX}${paste.id}`;
  
  // Calculate remaining TTL if it exists
  if (paste.ttl_seconds) {
    const elapsed = Math.floor((Date.now() - paste.created_at) / 1000);
    const remainingTtl = paste.ttl_seconds - elapsed;
    
    if (remainingTtl > 0) {
      await redis.setex(key, remainingTtl, JSON.stringify(paste));
    } else {
      // Already expired, delete it
      await redis.del(key);
    }
  } else {
    await redis.set(key, JSON.stringify(paste));
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