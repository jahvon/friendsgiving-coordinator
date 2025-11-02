import { NextRequest, NextResponse } from 'next/server';
import { getPendingReminders, markReminderAsSent } from '@/lib/storage';
import { sendSMS, isTwilioConfigured } from '@/lib/twilio';

// Note: Must use Node.js runtime for Twilio SDK (requires 'net' module)
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Twilio is configured
    if (!isTwilioConfigured()) {
      return NextResponse.json(
        { error: 'Twilio not configured' },
        { status: 500 }
      );
    }

    const reminders = await getPendingReminders();
    const now = new Date();
    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
    };

    // Process reminders that are due and haven't been sent
    for (const reminder of reminders) {
      if (reminder.sent) continue;

      const scheduledTime = new Date(reminder.scheduled_for);
      if (scheduledTime <= now) {
        results.processed++;

        const message = `Hey ${reminder.guest_name}! Just a friendly reminder to pick what you're bringing to my Friendsgiving 🍂 Check out the options here: ${process.env.NEXT_PUBLIC_APP_URL || 'your-app-url'}/rsvp`;

        const success = await sendSMS(reminder.phone_number, message);

        if (success) {
          await markReminderAsSent(reminder.id);
          results.sent++;
        } else {
          results.failed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    );
  }
}
