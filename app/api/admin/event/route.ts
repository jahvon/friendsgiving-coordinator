import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';
import { getEventConfig, saveEventConfig } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = await getEventConfig();
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching event config:', error);
    return NextResponse.json({ error: 'Failed to fetch event config' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await saveEventConfig(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating event config:', error);
    return NextResponse.json({ error: 'Failed to update event config' }, { status: 500 });
  }
}
