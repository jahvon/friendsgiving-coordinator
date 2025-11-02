import { NextResponse } from 'next/server';
import { getGuests, getDishes, getEventConfig } from '@/lib/storage';
import type { DashboardData, DishCategory } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [guests, dishes, event] = await Promise.all([
      getGuests(),
      getDishes(),
      getEventConfig(),
    ]);

    // Calculate balance for each category
    const categoryCounts: Record<DishCategory, number> = {
      appetizer: 0,
      main: 0,
      side: 0,
      dessert: 0,
      beverage: 0,
    };

    dishes.forEach(dish => {
      categoryCounts[dish.category]++;
    });

    const balance = Object.entries(event.category_targets).map(([category, target]) => ({
      category: category as DishCategory,
      current: categoryCounts[category as DishCategory],
      target,
      percentage: Math.round((categoryCounts[category as DishCategory] / target) * 100),
    }));

    const dashboardData: DashboardData = {
      guests,
      dishes,
      event,
      balance,
    };

    return NextResponse.json(dashboardData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
