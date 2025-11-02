import { NextRequest, NextResponse } from 'next/server';
import { addPendingReminder, getEventConfig, getPendingReminders } from '@/lib/storage';

export const runtime = 'edge';

export async function GET() {
  try {
    const reminders = await getPendingReminders();
    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.guest_id || !body.guest_name || !body.phone_number) {
      return NextResponse.json(
        { error: 'Missing required fields: guest_id, guest_name, phone_number' },
        { status: 400 }
      );
    }

    // Get the configured delay from event config
    const eventConfig = await getEventConfig();
    const delayHours = eventConfig.reminder_delay_hours || 24;

    // Calculate scheduled time
    const scheduledFor = new Date();
    scheduledFor.setHours(scheduledFor.getHours() + delayHours);

    const reminder = await addPendingReminder({
      guest_id: body.guest_id,
      guest_name: body.guest_name,
      phone_number: body.phone_number,
      scheduled_for: scheduledFor.toISOString(),
      sent: false,
    });

    return NextResponse.json({
      ...reminder,
      message: `Reminder scheduled for ${delayHours} hours from now`,
    }, { status: 201 });
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return NextResponse.json(
      { error: 'Failed to schedule reminder' },
      { status: 500 }
    );
  }
}
