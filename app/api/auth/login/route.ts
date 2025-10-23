import { NextRequest, NextResponse } from 'next/server';
import { verifyGuestPassword, verifyAdminPassword, setGuestAuth, setAdminAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, type } = body;

    if (!password || !type) {
      return NextResponse.json(
        { error: 'Missing password or type' },
        { status: 400 }
      );
    }

    if (type === 'guest') {
      if (verifyGuestPassword(password)) {
        setGuestAuth();
        return NextResponse.json({ success: true, type: 'guest' });
      }
    } else if (type === 'admin') {
      if (verifyAdminPassword(password)) {
        setAdminAuth();
        return NextResponse.json({ success: true, type: 'admin' });
      }
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
