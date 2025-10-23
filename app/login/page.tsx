'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, Utensils } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, type: 'guest' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid password');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <Utensils className="w-16 h-16 mx-auto mb-4 text-warm-600" />
            <h1 className="font-display text-3xl font-semibold text-terra-900 mb-2">
              Friendsgiving Coordinator
            </h1>
            <p className="text-terra-700">
              Enter password to access the event
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-base font-semibold text-terra-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terra-600" />
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-warm-400 focus:border-warm-500 text-base text-terra-900 bg-white"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-warm-50 border border-warm-400 text-warm-900 px-4 py-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-warm-500 to-warm-600 text-white py-4 px-6 rounded-full hover:from-warm-600 hover:to-warm-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Access Event'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/admin/login"
              className="text-sm text-terra-600 hover:text-terra-800 underline"
            >
              Admin login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
