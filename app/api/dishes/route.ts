import { NextRequest, NextResponse } from 'next/server';
import { getDishes, addDish, updateDish, deleteDish } from '@/lib/storage';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const dishes = await getDishes();
    return NextResponse.json(dishes, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dishes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.guest_id || !body.guest_name || !body.category || !body.dish_name) {
      return NextResponse.json(
        { error: 'Missing required fields: guest_id, guest_name, category, dish_name' },
        { status: 400 }
      );
    }

    const newDish = await addDish({
      guest_id: body.guest_id,
      guest_name: body.guest_name,
      category: body.category,
      dish_name: body.dish_name,
      status: body.status || 'claimed',
      recipe: body.recipe,
    });

    return NextResponse.json(newDish, { status: 201 });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json(
      { error: 'Failed to create dish' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing dish id' },
        { status: 400 }
      );
    }

    const updatedDish = await updateDish(body.id, body);

    if (!updatedDish) {
      return NextResponse.json(
        { error: 'Dish not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedDish);
  } catch (error) {
    console.error('Error updating dish:', error);
    return NextResponse.json(
      { error: 'Failed to update dish' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing dish id' },
        { status: 400 }
      );
    }

    const success = await deleteDish(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Dish not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json(
      { error: 'Failed to delete dish' },
      { status: 500 }
    );
  }
}
