import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import type { PendingReminder } from '../../types';

// Import Twilio - need to use dynamic import for ES modules
const getTwilioClient = async () => {
  const twilio = await import('twilio');
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio credentials not configured');
  }

  return twilio.default(accountSid, authToken);
};

const sendSMS = async (to: string, message: string): Promise<boolean> => {
  try {
    const client = await getTwilioClient();
    const fromNumber = process.env.TWILIO_PHONE_NUMBER!;

    await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });

    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
};

export default async (req: Request) => {
  console.log('Running scheduled SMS reminder check...');

  try {
    // Get blob store
    const store = getStore({
      name: 'friendsgiving-data',
      consistency: 'strong',
    });

    // Get pending reminders
    const data = await store.get('pending-reminders', { type: 'json' });
    const reminders = (data as PendingReminder[]) || [];

    const now = new Date();
    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
    };

    console.log(`Found ${reminders.length} total reminders`);

    // Process reminders that are due and haven't been sent
    const updatedReminders = [...reminders];
    for (let i = 0; i < updatedReminders.length; i++) {
      const reminder = updatedReminders[i];

      if (reminder.sent) continue;

      const scheduledTime = new Date(reminder.scheduled_for);
      if (scheduledTime <= now) {
        results.processed++;
        console.log(`Processing reminder for ${reminder.guest_name} (${reminder.phone_number})`);

        try {
          const message = `Hey ${reminder.guest_name}! Just a friendly reminder to pick what you're bringing to my Friendsgiving 🍂 Check out the options here: ${process.env.URL || process.env.NEXT_PUBLIC_APP_URL || 'your-app-url'}/rsvp`;

          const success = await sendSMS(reminder.phone_number, message);

          if (success) {
            updatedReminders[i] = { ...reminder, sent: true };
            results.sent++;
            console.log(`✓ Sent reminder to ${reminder.guest_name}`);
          } else {
            results.failed++;
            console.error(`✗ Failed to send reminder to ${reminder.guest_name} - SMS send returned false`);
          }
        } catch (smsError) {
          // Catch any errors in SMS sending to prevent crashing the entire function
          results.failed++;
          console.error(`✗ Exception sending reminder to ${reminder.guest_name}:`, smsError instanceof Error ? smsError.message : smsError);
        }
      }
    }

    // Save updated reminders back to blob store
    if (results.sent > 0 || results.failed > 0) {
      try {
        await store.setJSON('pending-reminders', updatedReminders);
        console.log('✓ Updated reminders in blob store');
      } catch (storeError) {
        console.error('✗ Failed to update blob store:', storeError instanceof Error ? storeError.message : storeError);
        // Continue anyway - we've already sent the messages
      }
    }

    console.log('Reminder check complete:', results);

    return new Response(JSON.stringify({
      success: true,
      ...results,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Top-level error handler - catches blob store access errors, etc.
    console.error('✗ Critical error in scheduled function:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to process reminders',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config: Config = {
  schedule: '@hourly',
};
