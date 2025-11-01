import { NextRequest, NextResponse } from 'next/server';
import { getGuests, addGuest, findGuestByPhone } from '@/lib/storage';
import type { Guest } from '@/types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get('phone');

    if (phone) {
      // Look up specific guest by phone
      const guest = await findGuestByPhone(phone);
      if (!guest) {
        return NextResponse.json(
          { error: 'No RSVP found with this phone number' },
          { status: 404 }
        );
      }
      return NextResponse.json(guest);
    }

    // Return all guests
    const guests = await getGuests();
    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.phone_number || !body.cooking_skill) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone_number, cooking_skill' },
        { status: 400 }
      );
    }

    const newGuest = await addGuest({
      name: body.name,
      phone_number: body.phone_number,
      cooking_skill: body.cooking_skill,
      dietary_restrictions: body.dietary_restrictions || [],
      dish_claimed: false,
      bringing_partner: body.bringing_partner || false,
    });

    return NextResponse.json(newGuest, { status: 201 });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json(
      { error: 'Failed to create guest' },
      { status: 500 }
    );
  }
}
