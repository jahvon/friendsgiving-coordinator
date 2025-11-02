import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in your environment variables.');
  }

  if (!twilioClient) {
    twilioClient = twilio(accountSid, authToken);
  }

  return twilioClient;
}

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    const client = getTwilioClient();

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
}

export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && fromNumber);
}
