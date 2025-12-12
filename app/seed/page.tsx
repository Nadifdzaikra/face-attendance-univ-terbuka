'use client';

import { useState } from 'react';
import Link from 'next/link';

interface User {
  id?: string;
  email: string;
  name: string;
  role: string;
  password_for_testing?: string;
}

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [seedStatus, setSeedStatus] = useState<any>(null);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
      });
      const data = await res.json();
      setResponse(data);
      
      if (res.ok) {
        // Auto refresh status after seed
        await checkSeedStatus();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkSeedStatus = async () => {
    try {
      const res = await fetch('/api/seed');
      const data = await res.json();
      setSeedStatus(data);
    } catch (err) {
      console.error('Error checking seed status:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    const role = formData.get('role');

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/seed/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setResponse(data);
        (e.target as HTMLFormElement).reset();
        await checkSeedStatus();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-yellow-50 to-white p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 transition-colors hover:text-amber-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="rounded-2xl bg-white shadow-lg overflow-hidden border border-amber-100">
          {/* Title */}
          <div className="bg-linear-to-r from-amber-600 to-amber-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">🌱 Seed Database</h1>
            <p className="mt-1 text-amber-100">Buat sample users untuk testing</p>
          </div>

          <div className="p-8">
            {/* Status Box */}
            <div className="mb-8 p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
              <h3 className="font-bold text-blue-900 mb-2">📊 Database Status</h3>
              <button
                onClick={checkSeedStatus}
                className="text-blue-600 hover:text-blue-700 underline text-sm"
              >
                Check Status
              </button>
              {seedStatus && (
                <div className="mt-3">
                  <p className="text-sm text-blue-800">
                    Status: <strong>{seedStatus.is_seeded ? '✅ Sudah di-seed' : '❌ Belum di-seed'}</strong>
                  </p>
                  <p className="text-sm text-blue-800">
                    Total Users: <strong>{seedStatus.total_users}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Seed Button */}
            <div className="mb-8 p-6 rounded-lg border-2 border-green-200 bg-green-50">
              <h3 className="font-bold text-green-900 mb-3">Auto Seed Users</h3>
              <p className="text-sm text-green-800 mb-4">
                Ini akan membuat 5 sample users otomatis. Akan skip jika database sudah ada data.
              </p>
              <button
                onClick={handleSeed}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {loading ? '⏳ Processing...' : '🌱 Auto Seed Database'}
              </button>
            </div>

            {/* Manual Create User */}
            <div className="mb-8 p-6 rounded-lg border-2 border-purple-200 bg-purple-50">
              <h3 className="font-bold text-purple-900 mb-4">Manual Create User</h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-1">Role</label>
                  <select
                    name="role"
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  {loading ? '⏳ Creating...' : '➕ Create User'}
                </button>
              </form>
            </div>

            {/* Response Display */}
            {response && (
              <div className="p-4 rounded-lg border-2 border-amber-200 bg-amber-50">
                <h3 className="font-bold text-amber-900 mb-3">Response:</h3>
                <pre className="text-xs text-amber-800 overflow-auto max-h-96 bg-white p-3 rounded border border-amber-300">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
                <h3 className="font-bold text-red-900 mb-2">❌ Error:</h3>
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Quick Login Links */}
            <div className="mt-8 p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-3">🔐 Quick Login</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Admin:</strong> admin@universitas-terbuka.ac.id / admin123456
                </p>
                <p>
                  <strong>Mahasiswa:</strong> mahasiswa1@universitas-terbuka.ac.id / mahasiswa123456
                </p>
              </div>
              <Link
                href="/login"
                className="mt-4 inline-block bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Go to Login →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
