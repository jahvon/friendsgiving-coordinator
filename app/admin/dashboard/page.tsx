'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Save, X, LogOut, Shield, Calendar, MapPin, Target } from 'lucide-react';
import type { Guest, Dish, EventConfig, DishCategory, CookingSkill } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
  const [editingGuest, setEditingGuest] = useState<string | null>(null);
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [guestsRes, dishesRes, eventRes] = await Promise.all([
        fetch('/api/guests'),
        fetch('/api/dishes'),
        fetch('/api/admin/event'),
      ]);

      if (!guestsRes.ok || !dishesRes.ok || !eventRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [guestsData, dishesData, eventData] = await Promise.all([
        guestsRes.json(),
        dishesRes.json(),
        eventRes.json(),
      ]);

      setGuests(guestsData);
      setDishes(dishesData);
      setEventConfig(eventData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      const response = await fetch(`/api/admin/guests?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete guest');
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleUpdateGuest = async (id: string, updates: Partial<Guest>) => {
    try {
      const response = await fetch('/api/admin/guests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!response.ok) throw new Error('Failed to update guest');
      setEditingGuest(null);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;

    try {
      const response = await fetch(`/api/admin/dishes?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete dish');
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleUpdateDish = async (id: string, updates: Partial<Dish>) => {
    try {
      const response = await fetch('/api/admin/dishes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!response.ok) throw new Error('Failed to update dish');
      setEditingDish(null);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleUpdateEvent = async () => {
    if (!eventConfig) return;

    try {
      const response = await fetch('/api/admin/event', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventConfig),
      });
      if (!response.ok) throw new Error('Failed to update event');
      setEditingEvent(false);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-harvest-800">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-cranberry-50 border-2 border-cranberry-400 text-cranberry-900 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white shadow-xl rounded-xl p-6 border-2 border-autumn-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-harvest-700" />
            <h1 className="text-3xl font-bold text-harvest-900">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-cranberry-600 text-white rounded-lg hover:bg-cranberry-700 font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Event Configuration */}
      {eventConfig && (
        <div className="bg-white shadow-xl rounded-xl p-6 border-2 border-autumn-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-harvest-900">Event Configuration</h2>
            {!editingEvent ? (
              <button
                onClick={() => setEditingEvent(true)}
                className="flex items-center gap-2 px-4 py-2 bg-harvest-600 text-white rounded-lg hover:bg-harvest-700 font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateEvent}
                  className="flex items-center gap-2 px-4 py-2 bg-harvest-600 text-white rounded-lg hover:bg-harvest-700 font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingEvent(false);
                    fetchData();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingEvent ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-harvest-900 mb-2">Date</label>
                  <input
                    type="datetime-local"
                    value={eventConfig.date.slice(0, 16)}
                    onChange={(e) => setEventConfig({ ...eventConfig, date: new Date(e.target.value).toISOString() })}
                    className="w-full px-4 py-2 border-2 border-autumn-300 rounded-lg text-harvest-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-harvest-900 mb-2">Location</label>
                  <input
                    type="text"
                    value={eventConfig.location}
                    onChange={(e) => setEventConfig({ ...eventConfig, location: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-autumn-300 rounded-lg text-harvest-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-harvest-900 mb-2">Target Guest Count</label>
                <input
                  type="number"
                  value={eventConfig.target_guest_count}
                  onChange={(e) => setEventConfig({ ...eventConfig, target_guest_count: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-autumn-300 rounded-lg text-harvest-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-harvest-900 mb-2">Category Targets</label>
                <div className="grid md:grid-cols-5 gap-4">
                  {Object.entries(eventConfig.category_targets).map(([category, target]) => (
                    <div key={category}>
                      <label className="block text-xs text-harvest-700 mb-1 capitalize">{category}</label>
                      <input
                        type="number"
                        value={target}
                        onChange={(e) => setEventConfig({
                          ...eventConfig,
                          category_targets: { ...eventConfig.category_targets, [category]: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border-2 border-autumn-300 rounded-lg text-harvest-900"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-harvest-800">
                <Calendar className="w-5 h-5 text-harvest-700" />
                <p><strong>Date:</strong> {new Date(eventConfig.date).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 text-harvest-800">
                <MapPin className="w-5 h-5 text-harvest-700" />
                <p><strong>Location:</strong> {eventConfig.location}</p>
              </div>
              <div className="flex items-center gap-2 text-harvest-800">
                <Target className="w-5 h-5 text-harvest-700" />
                <p><strong>Target Guests:</strong> {eventConfig.target_guest_count}</p>
              </div>
              <p className="text-harvest-800"><strong>Category Targets:</strong> {Object.entries(eventConfig.category_targets).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>
            </div>
          )}
        </div>
      )}

      {/* Guests Table */}
      <div className="bg-white shadow-xl rounded-xl p-6 border-2 border-autumn-200">
        <h2 className="text-2xl font-bold text-harvest-900 mb-4">Guests ({guests.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-autumn-300">
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Name</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Email</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Skill</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Restrictions</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-autumn-200">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-autumn-50">
                  <td className="px-4 py-3">
                    {editingGuest === guest.id ? (
                      <input
                        type="text"
                        defaultValue={guest.name}
                        onBlur={(e) => handleUpdateGuest(guest.id, { name: e.target.value })}
                        className="px-2 py-1 border rounded text-harvest-900"
                      />
                    ) : (
                      <span className="text-harvest-900">{guest.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingGuest === guest.id ? (
                      <input
                        type="email"
                        defaultValue={guest.email}
                        onBlur={(e) => handleUpdateGuest(guest.id, { email: e.target.value })}
                        className="px-2 py-1 border rounded text-harvest-900"
                      />
                    ) : (
                      <span className="text-harvest-800">{guest.email}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingGuest === guest.id ? (
                      <select
                        defaultValue={guest.cooking_skill}
                        onBlur={(e) => handleUpdateGuest(guest.id, { cooking_skill: e.target.value as CookingSkill })}
                        className="px-2 py-1 border rounded text-harvest-900"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    ) : (
                      <span className="text-harvest-800 capitalize">{guest.cooking_skill}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-harvest-700 text-sm">
                    {guest.dietary_restrictions.join(', ') || 'None'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingGuest(editingGuest === guest.id ? null : guest.id)}
                        className="p-2 text-harvest-600 hover:bg-harvest-100 rounded"
                      >
                        {editingGuest === guest.id ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="p-2 text-cranberry-600 hover:bg-cranberry-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-white shadow-xl rounded-xl p-6 border-2 border-autumn-200">
        <h2 className="text-2xl font-bold text-harvest-900 mb-4">Dishes ({dishes.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-autumn-300">
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Dish</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Guest</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Category</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Serves</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-harvest-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-autumn-200">
              {dishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-autumn-50">
                  <td className="px-4 py-3">
                    {editingDish === dish.id ? (
                      <input
                        type="text"
                        defaultValue={dish.dish_name}
                        onBlur={(e) => handleUpdateDish(dish.id, { dish_name: e.target.value })}
                        className="px-2 py-1 border rounded text-harvest-900"
                      />
                    ) : (
                      <span className="text-harvest-900">{dish.dish_name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-harvest-800">{dish.guest_name}</td>
                  <td className="px-4 py-3">
                    {editingDish === dish.id ? (
                      <select
                        defaultValue={dish.category}
                        onBlur={(e) => handleUpdateDish(dish.id, { category: e.target.value as DishCategory })}
                        className="px-2 py-1 border rounded text-harvest-900"
                      >
                        <option value="appetizer">Appetizer</option>
                        <option value="main">Main</option>
                        <option value="side">Side</option>
                        <option value="dessert">Dessert</option>
                        <option value="beverage">Beverage</option>
                      </select>
                    ) : (
                      <span className="text-harvest-800 capitalize">{dish.category}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingDish === dish.id ? (
                      <input
                        type="number"
                        defaultValue={dish.serves}
                        onBlur={(e) => handleUpdateDish(dish.id, { serves: parseInt(e.target.value) })}
                        className="px-2 py-1 border rounded w-20 text-harvest-900"
                      />
                    ) : (
                      <span className="text-harvest-800">{dish.serves}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-harvest-800 capitalize">{dish.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingDish(editingDish === dish.id ? null : dish.id)}
                        className="p-2 text-harvest-600 hover:bg-harvest-100 rounded"
                      >
                        {editingDish === dish.id ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteDish(dish.id)}
                        className="p-2 text-cranberry-600 hover:bg-cranberry-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
