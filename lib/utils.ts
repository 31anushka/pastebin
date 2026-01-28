// import { Paste } from './types';

// /**
//  * Get current time in milliseconds, respecting TEST_MODE
//  */
// export function getCurrentTime(testNowMs?: string): number {
//   if (process.env.TEST_MODE === '1' && testNowMs) {
//     const timestamp = parseInt(testNowMs, 10);
//     if (!isNaN(timestamp)) {
//       return timestamp;
//     }
//   }
//   return Date.now();
// }

// /**
//  * Check if a paste has expired based on TTL
//  */
// export function isPasteExpired(paste: Paste, currentTime: number): boolean {
//   if (!paste.ttl_seconds) {
//     return false;
//   }
  
//   const expiryTime = paste.created_at + (paste.ttl_seconds * 1000);
//   return currentTime >= expiryTime;
// }

// /**
//  * Check if a paste has exceeded its view limit
//  */
// export function isPasteViewLimitExceeded(paste: Paste): boolean {
//   if (!paste.max_views) {
//     return false;
//   }
  
//   return paste.view_count >= paste.max_views;
// }

// /**
//  * Check if a paste is available (not expired and not view-limited)
//  */
// export function isPasteAvailable(paste: Paste, currentTime: number): boolean {
//   return !isPasteExpired(paste, currentTime) && !isPasteViewLimitExceeded(paste);
// }

// /**
//  * Get the expiry timestamp for a paste
//  */
// export function getExpiryTimestamp(paste: Paste): string | null {
//   if (!paste.ttl_seconds) {
//     return null;
//   }
  
//   const expiryTime = paste.created_at + (paste.ttl_seconds * 1000);
//   return new Date(expiryTime).toISOString();
// }

// /**
//  * Get remaining views for a paste
//  */
// export function getRemainingViews(paste: Paste): number | null {
//   if (!paste.max_views) {
//     return null;
//   }
  
//   return Math.max(0, paste.max_views - paste.view_count);
// }

// /**
//  * Validate paste creation request
//  */
// export function validateCreatePasteRequest(body: any): { valid: boolean; error?: string } {
//   if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
//     return { valid: false, error: 'content is required and must be a non-empty string' };
//   }
  
//   if (body.ttl_seconds !== undefined) {
//     if (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
//       return { valid: false, error: 'ttl_seconds must be an integer >= 1' };
//     }
//   }
  
//   if (body.max_views !== undefined) {
//     if (!Number.isInteger(body.max_views) || body.max_views < 1) {
//       return { valid: false, error: 'max_views must be an integer >= 1' };
//     }
//   }
  
//   return { valid: true };
// }

import { Paste } from './types';

/**
 * Get current time in milliseconds, respecting TEST_MODE
 */
export function getCurrentTime(testNowMs?: string): number {
  if (process.env.TEST_MODE === '1' && testNowMs) {
    const timestamp = parseInt(testNowMs, 10);
    if (!isNaN(timestamp)) {
      return timestamp;
    }
  }
  return Date.now();
}

/**
 * Check if a paste has expired based on TTL
 */
export function isPasteExpired(paste: Paste, currentTime: number): boolean {
  if (!paste.ttl_seconds) {
    return false;
  }
  
  const expiryTime = paste.created_at + (paste.ttl_seconds * 1000);
  return currentTime >= expiryTime;
}

/**
 * Check if a paste has exceeded its view limit
 */
export function isPasteViewLimitExceeded(paste: Paste): boolean {
  if (!paste.max_views) {
    return false;
  }
  
  return paste.view_count >= paste.max_views;
}

/**
 * Check if a paste is available (not expired and not view-limited)
 */
export function isPasteAvailable(paste: Paste, currentTime: number): boolean {
  return !isPasteExpired(paste, currentTime) && !isPasteViewLimitExceeded(paste);
}

/**
 * Get the expiry timestamp for a paste
 */
export function getExpiryTimestamp(paste: Paste): string | null {
  if (!paste.ttl_seconds) {
    return null;
  }
  
  const expiryTime = paste.created_at + (paste.ttl_seconds * 1000);
  return new Date(expiryTime).toISOString();
}

/**
 * Get remaining views for a paste
 */
export function getRemainingViews(paste: Paste): number | null {
  if (!paste.max_views) {
    return null;
  }
  
  return Math.max(0, paste.max_views - paste.view_count);
}

/**
 * Validate paste creation request
 */
export function validateCreatePasteRequest(body: any): { valid: boolean; error?: string } {
  if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
    return { valid: false, error: 'content is required and must be a non-empty string' };
  }
  
  if (body.ttl_seconds !== undefined) {
    if (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
      return { valid: false, error: 'ttl_seconds must be an integer >= 1' };
    }
  }
  
  if (body.max_views !== undefined) {
    if (!Number.isInteger(body.max_views) || body.max_views < 1) {
      return { valid: false, error: 'max_views must be an integer >= 1' };
    }
  }
  
  return { valid: true };
}
