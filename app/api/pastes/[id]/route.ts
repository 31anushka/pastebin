import { NextRequest, NextResponse } from 'next/server';
import { getPaste, updatePaste } from '@/lib/kv';
import { 
  getCurrentTime, 
  isPasteAvailable, 
  getExpiryTimestamp, 
  getRemainingViews 
} from '@/lib/utils';
import { FetchPasteResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get current time (respecting TEST_MODE)
    const testNowMs = request.headers.get('x-test-now-ms') || undefined;
    const currentTime = getCurrentTime(testNowMs);
    
    // Fetch paste from KV
    const paste = await getPaste(id);
    
    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
    
    // Check if paste is available
    if (!isPasteAvailable(paste, currentTime)) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
    
    // Increment view count
    paste.view_count += 1;
    
    // Prepare response before updating (in case the update changes availability)
    const response: FetchPasteResponse = {
      content: paste.content,
      remaining_views: getRemainingViews(paste),
      expires_at: getExpiryTimestamp(paste),
    };
    
    // Update paste with new view count
    await updatePaste(paste);
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error fetching paste:', error);
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
