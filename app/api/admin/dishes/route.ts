import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';
import { deleteDish, updateDish } from '@/lib/storage';

export async function DELETE(request: NextRequest) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing dish id' }, { status: 400 });
    }

    const success = await deleteDish(id);

    if (!success) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json({ error: 'Failed to delete dish' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing dish id' }, { status: 400 });
    }

    const updatedDish = await updateDish(id, updates);

    if (!updatedDish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    return NextResponse.json(updatedDish);
  } catch (error) {
    console.error('Error updating dish:', error);
    return NextResponse.json({ error: 'Failed to update dish' }, { status: 500 });
  }
}
