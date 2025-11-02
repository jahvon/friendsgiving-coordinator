import { NextRequest, NextResponse } from 'next/server';
import { getPendingReminders, markReminderAsSent } from '@/lib/storage';
import { sendSMS, isTwilioConfigured } from '@/lib/twilio';

// Note: Must use Node.js runtime for Twilio SDK (requires 'net' module)
export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if Twilio is configured
    if (!isTwilioConfigured()) {
      return NextResponse.json(
        { error: 'Twilio not configured. Please add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to your environment variables.' },
        { status: 500 }
      );
    }

    const reminders = await getPendingReminders();
    const reminder = reminders.find(r => r.id === params.id);

    if (!reminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    if (reminder.sent) {
      return NextResponse.json(
        { error: 'Reminder already sent' },
        { status: 400 }
      );
    }

    const message = `Hey ${reminder.guest_name}! Just a friendly reminder to pick what you're bringing to my Friendsgiving 🍂 Check out the options here: ${process.env.NEXT_PUBLIC_APP_URL || 'your-app-url'}/rsvp`;

    let success = false;
    try {
      success = await sendSMS(reminder.phone_number, message);
    } catch (smsError) {
      console.error('SMS send exception:', smsError);
      return NextResponse.json(
        {
          error: 'Failed to send SMS. Exception occurred.',
          details: smsError instanceof Error ? smsError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    if (!success) {
      console.error(`Failed to send SMS to ${reminder.phone_number} for guest ${reminder.guest_name}`);
      return NextResponse.json(
        { error: 'Failed to send SMS. Please check your Twilio configuration and phone number format.' },
        { status: 500 }
      );
    }

    try {
      await markReminderAsSent(reminder.id);
      console.log(`✓ Marked reminder ${reminder.id} as sent for ${reminder.guest_name}`);
    } catch (markError) {
      console.error('Failed to mark reminder as sent (message was sent successfully):', markError);
      // Don't return error - message was sent successfully
    }

    return NextResponse.json({
      success: true,
      message: 'Reminder sent successfully',
    });
  } catch (error) {
    console.error('Unexpected error sending reminder:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      {
        error: 'Failed to send reminder',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
