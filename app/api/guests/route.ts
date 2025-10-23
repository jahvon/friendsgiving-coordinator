import { NextRequest, NextResponse } from 'next/server';
import { getGuests, addGuest } from '@/lib/storage';
import type { Guest } from '@/types';

export const runtime = 'edge';

export async function GET() {
  try {
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
    if (!body.name || !body.email || !body.cooking_skill) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, cooking_skill' },
        { status: 400 }
      );
    }

    const newGuest = await addGuest({
      name: body.name,
      email: body.email,
      cooking_skill: body.cooking_skill,
      dietary_restrictions: body.dietary_restrictions || [],
      dish_claimed: false,
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
