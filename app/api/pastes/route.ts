import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { savePaste } from '@/lib/kv';
import { validateCreatePasteRequest, getCurrentTime } from '@/lib/utils';
import { Paste, CreatePasteRequest, CreatePasteResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreatePasteRequest = await request.json();
    
    // Validate request
    const validation = validateCreatePasteRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
    
    // Generate unique ID
    const id = nanoid(10);
    
    // Get current time (respecting TEST_MODE)
    const testNowMs = request.headers.get('x-test-now-ms') || undefined;
    const currentTime = getCurrentTime(testNowMs);
    
    // Create paste object
    const paste: Paste = {
      id,
      content: body.content,
      created_at: currentTime,
      ttl_seconds: body.ttl_seconds,
      max_views: body.max_views,
      view_count: 0,
    };
    
    // Save to KV
    await savePaste(paste);
    
    // Build URL
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const url = `${protocol}://${host}/p/${id}`;
    
    const response: CreatePasteResponse = {
      id,
      url,
    };
    
    return NextResponse.json(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
