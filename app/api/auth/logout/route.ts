import { NextResponse } from 'next/server';
import { clearAuth } from '@/lib/auth';

export async function POST() {
  try {
    clearAuth();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
