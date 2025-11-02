import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';
import { getGuests } from '@/lib/storage';
import { sendSMS, isTwilioConfigured } from '@/lib/twilio';

export const runtime = 'nodejs'; // Twilio requires Node.js runtime
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if Twilio is configured
  if (!isTwilioConfigured()) {
    return NextResponse.json(
      { error: 'Twilio not configured. Please add TWILIO credentials to environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get all guests
    const guests = await getGuests();

    if (guests.length === 0) {
      return NextResponse.json(
        { error: 'No guests to send messages to' },
        { status: 400 }
      );
    }

    const results = {
      total: guests.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send SMS to each guest
    for (const guest of guests) {
      try {
        const success = await sendSMS(guest.phone_number, message);
        if (success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(`Failed to send to ${guest.name} (${guest.phone_number})`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Error sending to ${guest.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(`Failed to send SMS to ${guest.name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('Error sending mass SMS:', error);
    return NextResponse.json(
      { error: 'Failed to send messages', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
