import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/kv';

export async function GET() {
  try {
    const isHealthy = await healthCheck();
    
    return NextResponse.json(
      { ok: isHealthy },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
