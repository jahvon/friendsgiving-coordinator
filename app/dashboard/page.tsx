'use client';

import { useEffect, useState } from 'react';
import { Users, UtensilsCrossed, TrendingUp, Calendar, MapPin, Target, ChefHat, Home } from 'lucide-react';
import type { DashboardData } from '@/types';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-8 text-center border-2 border-autumn-200">
        <p className="text-harvest-800 text-lg font-medium">Loading feast details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-cranberry-50 border-2 border-cranberry-400 text-cranberry-900 px-6 py-4 rounded-xl font-medium">
        {error || 'Failed to load dashboard'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-xl rounded-xl p-8 border-2 border-autumn-200">
        <div className="flex items-center gap-3 mb-6">
          <ChefHat className="w-10 h-10 text-harvest-700" />
          <h2 className="text-3xl font-bold text-harvest-900">Feast Overview</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-harvest-100 to-autumn-100 p-6 rounded-xl border-2 border-harvest-300">
            <Users className="w-10 h-10 mb-3 text-harvest-700" />
            <p className="text-4xl font-bold text-harvest-900">{data.guests.length}</p>
            <p className="text-base text-harvest-700 font-semibold">Guests Joining</p>
          </div>

          <div className="bg-gradient-to-br from-autumn-100 to-harvest-100 p-6 rounded-xl border-2 border-autumn-300">
            <UtensilsCrossed className="w-10 h-10 mb-3 text-autumn-700" />
            <p className="text-4xl font-bold text-autumn-900">{data.dishes.length}</p>
            <p className="text-base text-autumn-700 font-semibold">Dishes Claimed</p>
          </div>

          <div className="bg-gradient-to-br from-cranberry-100 to-cranberry-50 p-6 rounded-xl border-2 border-cranberry-300">
            <TrendingUp className="w-10 h-10 mb-3 text-cranberry-700" />
            <p className="text-4xl font-bold text-cranberry-900">{data.total_servings}</p>
            <p className="text-base text-cranberry-700 font-semibold">Total Servings</p>
          </div>
        </div>

        <div className="bg-autumn-50 rounded-lg p-5 border border-autumn-300 space-y-2">
          <div className="flex items-center gap-2 text-harvest-800">
            <Calendar className="w-5 h-5 text-harvest-700" />
            <p className="text-base"><strong>Date:</strong> {new Date(data.event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2 text-harvest-800">
            <MapPin className="w-5 h-5 text-harvest-700" />
            <p className="text-base"><strong>Location:</strong> {data.event.location}</p>
          </div>
          <div className="flex items-center gap-2 text-harvest-800">
            <Target className="w-5 h-5 text-harvest-700" />
            <p className="text-base"><strong>Expected Guests:</strong> {data.event.target_guest_count}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl p-8 border-2 border-autumn-200">
        <h2 className="text-2xl font-bold mb-6 text-harvest-900">Menu Balance</h2>
        <div className="space-y-5">
          {data.balance.map((item) => (
            <div key={item.category}>
              <div className="flex justify-between mb-2">
                <span className="text-lg font-semibold capitalize text-harvest-900">
                  {item.category}
                </span>
                <span className="text-base text-harvest-700 font-medium">
                  {item.current} / {item.target} {item.percentage >= 100 ? '✓' : ''}
                </span>
              </div>
              <div className="w-full bg-autumn-100 rounded-full h-4 border border-autumn-300">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.percentage >= 100
                      ? 'bg-gradient-to-r from-harvest-500 to-harvest-600'
                      : item.percentage >= 50
                      ? 'bg-gradient-to-r from-autumn-400 to-autumn-500'
                      : 'bg-gradient-to-r from-cranberry-400 to-cranberry-500'
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl p-8 border-2 border-autumn-200">
        <h2 className="text-2xl font-bold mb-6 text-harvest-900">The Menu</h2>
        {data.dishes.length === 0 ? (
          <p className="text-harvest-700 text-center py-8 text-lg">No dishes claimed yet. Be the first to contribute!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-autumn-300">
                  <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900 uppercase">
                    Guest
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900 uppercase">
                    Dish
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900 uppercase">
                    Serves
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-autumn-200">
                {data.dishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-autumn-50 transition-colors">
                    <td className="px-4 py-4 text-base text-harvest-900 font-medium">{dish.guest_name}</td>
                    <td className="px-4 py-4 text-base text-harvest-800">{dish.dish_name}</td>
                    <td className="px-4 py-4 text-base text-harvest-700 capitalize">
                      {dish.category}
                    </td>
                    <td className="px-4 py-4 text-base text-harvest-700">{dish.serves}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          dish.status === 'confirmed'
                            ? 'bg-harvest-200 text-harvest-900'
                            : dish.status === 'preparing'
                            ? 'bg-autumn-200 text-autumn-900'
                            : 'bg-cranberry-200 text-cranberry-900'
                        }`}
                      >
                        {dish.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white shadow-xl rounded-xl p-8 border-2 border-autumn-200">
        <h2 className="text-2xl font-bold mb-6 text-harvest-900">Guest List</h2>
        {data.guests.length === 0 ? (
          <p className="text-harvest-700 text-center py-8 text-lg">No guests signed up yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-autumn-300">
                  <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900 uppercase">
                    Cooking Skill
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900 uppercase">
                    Dietary Restrictions
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900 uppercase">
                    Dish Claimed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-autumn-200">
                {data.guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-autumn-50 transition-colors">
                    <td className="px-4 py-4 text-base text-harvest-900 font-medium">{guest.name}</td>
                    <td className="px-4 py-4 text-base text-harvest-700">{guest.email}</td>
                    <td className="px-4 py-4 text-base text-harvest-800 capitalize">{guest.cooking_skill}</td>
                    <td className="px-4 py-4 text-base text-harvest-700">
                      {guest.dietary_restrictions.length > 0
                        ? guest.dietary_restrictions.join(', ')
                        : 'None'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          guest.dish_claimed
                            ? 'bg-harvest-200 text-harvest-900'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {guest.dish_claimed ? 'Yes' : 'Not yet'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-harvest-600 text-white px-8 py-3 rounded-lg hover:bg-harvest-700 font-semibold text-lg shadow-lg"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </a>
      </div>
    </div>
  );
}
