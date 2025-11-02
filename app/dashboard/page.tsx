'use client';

import { useEffect, useState } from 'react';
import { Users, UtensilsCrossed, Calendar, MapPin, Target, ChefHat, Home } from 'lucide-react';
import type { DashboardData } from '@/types';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuickClaim, setShowQuickClaim] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard', {
        cache: 'no-store',
      });
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

  const handlePhoneLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/guests?phone=${encodeURIComponent(phoneNumber)}`);
      if (!response.ok) {
        throw new Error('Phone number not found. Please RSVP first!');
      }
      const guest = await response.json();
      setGuestId(guest.id);
      setGuestName(guest.name);
      setShowQuickClaim(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find RSVP');
    } finally {
      setClaimLoading(false);
    }
  };

  const handleQuickClaim = async (dishId: string) => {
    if (!guestId || !guestName) return;

    setClaimLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dishes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dishId,
          guest_id: guestId,
          guest_name: guestName,
          status: 'claimed',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to claim dish');
      }

      alert('Dish claimed successfully!');
      fetchDashboardData(); // Refresh the data
      setShowQuickClaim(false);
      setPhoneNumber('');
      setGuestId(null);
      setGuestName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim dish');
    } finally {
      setClaimLoading(false);
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
          </div>

          <div className="bg-gradient-to-br from-warm-50 to-warm-100 p-6 rounded-xl border border-warm-200">
            <UtensilsCrossed className="w-10 h-10 mb-3 text-warm-700" />
            <p className="text-4xl font-bold text-terra-900">{data.dishes.filter(d => d.status !== 'requested').length}</p>
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
        </div>
      </div>

      {/* Quick Claim Section */}
      {data.dishes.filter(d => d.status === 'requested').length > 0 && (
        <div className="bg-gradient-to-br from-harvest-50 to-warm-50 shadow-2xl rounded-2xl p-8 border-2 border-harvest-300">
          <h2 className="font-display text-2xl font-semibold mb-4 text-terra-900">Quick Claim a Requested Dish</h2>

          {!showQuickClaim ? (
            <div>
              <p className="text-terra-700 mb-4">Already RSVP&apos;d? Enter your phone number to quickly claim a dish someone requested.</p>
              <form onSubmit={handlePhoneLookup} className="flex gap-3">
                <input
                  type="tel"
                  placeholder="Your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  pattern="[0-9]{10,15}"
                  required
                  className="flex-1 px-4 py-3 border-2 border-harvest-300 rounded-lg text-terra-900 font-medium"
                />
                <button
                  type="submit"
                  disabled={claimLoading}
                  className="px-6 py-3 bg-gradient-to-r from-harvest-500 to-harvest-600 text-white rounded-lg hover:from-harvest-600 hover:to-harvest-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold shadow-md"
                >
                  {claimLoading ? 'Looking up...' : 'Continue'}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-terra-700">Welcome back, <strong>{guestName}</strong>! Pick a dish to claim:</p>
                <button
                  onClick={() => {
                    setShowQuickClaim(false);
                    setPhoneNumber('');
                    setGuestId(null);
                    setGuestName('');
                  }}
                  className="text-terra-600 hover:text-terra-800 underline text-sm"
                >
                  Cancel
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {data.dishes.filter(d => d.status === 'requested').map((dish) => (
                  <div key={dish.id} className="bg-white border-2 border-harvest-300 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-terra-900 text-lg">{dish.dish_name}</p>
                      <p className="text-terra-700 capitalize text-sm">{dish.category}</p>
                      <p className="text-harvest-700 text-sm italic">Requested by {dish.guest_name}</p>
                    </div>
                    <button
                      onClick={() => handleQuickClaim(dish.id)}
                      disabled={claimLoading}
                      className="px-4 py-2 bg-gradient-to-r from-warm-500 to-warm-600 text-white rounded-lg hover:from-warm-600 hover:to-warm-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold shadow-md whitespace-nowrap"
                    >
                      Claim
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-warm-100 border border-warm-400 text-warm-900 px-4 py-3 rounded-lg font-medium">
              {error}
            </div>
          )}
        </div>
      )}

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
        {data.dishes.filter(d => d.status !== 'requested').length === 0 ? (
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {data.dishes.filter(d => d.status !== 'requested').map((dish) => (
                  <tr key={dish.id} className="hover:bg-cream-100 transition-colors">
                    <td className="px-4 py-4 text-base text-terra-900 font-medium">{dish.guest_name}</td>
                    <td className="px-4 py-4 text-base text-terra-800">{dish.dish_name}</td>
                    <td className="px-4 py-4 text-base text-terra-700 capitalize">
                      {dish.category}
                    </td>
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
