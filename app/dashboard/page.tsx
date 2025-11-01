'use client';

import { useEffect, useState } from 'react';
import { Users, UtensilsCrossed, Calendar, MapPin, Target, ChefHat, Home } from 'lucide-react';
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
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <p className="text-terra-800 text-lg font-medium">Loading feast details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-warm-50 border border-warm-400 text-warm-900 px-6 py-4 rounded-xl font-medium">
        {error || 'Failed to load dashboard'}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <ChefHat className="w-10 h-10 text-warm-600" />
          <h2 className="font-display text-3xl font-semibold text-terra-900">Feast Overview</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-xl border border-sky-200">
            <Users className="w-10 h-10 mb-3 text-sky-700" />
            <p className="text-4xl font-bold text-terra-900">
              {data.guests.length + data.guests.filter(g => g.bringing_partner).length}
            </p>
            <p className="text-base text-terra-700 font-semibold">Guests Joining</p>
            {data.guests.filter(g => g.bringing_partner).length > 0 && (
              <p className="text-sm text-terra-600 mt-1">
                ({data.guests.length} guests + {data.guests.filter(g => g.bringing_partner).length} partner{data.guests.filter(g => g.bringing_partner).length !== 1 ? 's' : ''})
              </p>
            )}
          </div>

          <div className="bg-gradient-to-br from-warm-50 to-warm-100 p-6 rounded-xl border border-warm-200">
            <UtensilsCrossed className="w-10 h-10 mb-3 text-warm-700" />
            <p className="text-4xl font-bold text-terra-900">{data.dishes.length}</p>
            <p className="text-base text-terra-700 font-semibold">Dishes Claimed</p>
          </div>
        </div>

        <div className="bg-cream-100 rounded-xl p-5 border border-warm-200 space-y-2">
          <div className="flex items-center gap-2 text-terra-800">
            <Calendar className="w-5 h-5 text-warm-600" />
            <p className="text-base"><strong>Date:</strong> {new Date(data.event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2 text-terra-800">
            <MapPin className="w-5 h-5 text-warm-600" />
            <p className="text-base"><strong>Location:</strong> {data.event.location}</p>
          </div>
          <div className="flex items-center gap-2 text-terra-800">
            <Target className="w-5 h-5 text-warm-600" />
            <p className="text-base"><strong>Expected Guests:</strong> {data.event.target_guest_count}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="font-display text-2xl font-semibold mb-6 text-terra-900">Menu Balance</h2>
        <div className="space-y-5">
          {data.balance.map((item) => (
            <div key={item.category}>
              <div className="flex justify-between mb-2">
                <span className="text-lg font-semibold capitalize text-terra-900">
                  {item.category}
                </span>
                <span className="text-base text-terra-700 font-medium">
                  {item.current} / {item.target} {item.percentage >= 100 ? '✓' : ''}
                </span>
              </div>
              <div className="w-full bg-cream-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.percentage >= 100
                      ? 'bg-gradient-to-r from-sage-500 to-sage-600'
                      : item.percentage >= 50
                      ? 'bg-gradient-to-r from-warm-400 to-warm-500'
                      : 'bg-gradient-to-r from-sky-400 to-sky-500'
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="font-display text-2xl font-semibold mb-6 text-terra-900">The Menu</h2>
        {data.dishes.length === 0 ? (
          <p className="text-terra-700 text-center py-8 text-lg">No dishes claimed yet. Be the first to contribute!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-warm-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-terra-900 uppercase">
                    Guest
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-terra-900 uppercase">
                    Dish
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-terra-900 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-terra-900 uppercase">
                    Serves
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-terra-900 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {data.dishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-cream-100 transition-colors">
                    <td className="px-4 py-4 text-base text-terra-900 font-medium">{dish.guest_name}</td>
                    <td className="px-4 py-4 text-base text-terra-800">{dish.dish_name}</td>
                    <td className="px-4 py-4 text-base text-terra-700 capitalize">
                      {dish.category}
                    </td>
                    <td className="px-4 py-4 text-base text-terra-700">{dish.serves}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          dish.status === 'confirmed'
                            ? 'bg-sage-200 text-sage-900'
                            : dish.status === 'preparing'
                            ? 'bg-warm-200 text-warm-900'
                            : 'bg-sky-200 text-sky-900'
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

      <div className="bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="font-display text-2xl font-semibold mb-6 text-terra-900">Guest List</h2>
        {data.guests.length === 0 ? (
          <p className="text-terra-700 text-center py-8 text-lg">No guests signed up yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-warm-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-terra-900 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-terra-900 uppercase">
                    Cooking Skill
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-terra-900 uppercase">
                    Dietary Restrictions
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-terra-900 uppercase">
                    Dish Claimed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {data.guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-cream-100 transition-colors">
                    <td className="px-4 py-4 text-base text-terra-900 font-medium">{guest.name}</td>
                    <td className="px-4 py-4 text-base text-terra-800 capitalize">{guest.cooking_skill}</td>
                    <td className="px-4 py-4 text-base text-terra-700">
                      {guest.dietary_restrictions.length > 0
                        ? guest.dietary_restrictions.join(', ')
                        : 'None'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          guest.dish_claimed
                            ? 'bg-sage-200 text-sage-900'
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
          className="inline-flex items-center gap-2 bg-gradient-to-r from-warm-500 to-warm-600 text-white px-8 py-3 rounded-full hover:from-warm-600 hover:to-warm-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </a>
      </div>
    </div>
  );
}
