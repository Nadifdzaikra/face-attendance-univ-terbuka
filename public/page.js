'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/apiService';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/authContext';
import { fakeToken, fakeUser } from '@/lib/fake';
import * as CgIcons from "react-icons/cg";
// import { Eye, EyeOff } from 'lucide-react';

export default function AuthLogin () {
  const router = useRouter();
  const { loading, setLoading, setUserId, login, error } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail] = useState('viana@sccic.go.id');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      router.push('/');
    }
  }, []);

  // test login fetch api login to dashboard
  const handleLogin = async (e) => {
    e.preventDefault();
    if (
      email === 'viana@sccic.go.id' &&
      password === 'password'
    ) {
      login(fakeToken, fakeUser)
      router.push('/');
      return;
    } else {
      toast.error("Password atau Username salah", { position: "top-center" })
    }

    setLoading(true);
    setErrorMessage('');

  };


  return (
    <div className="relative w-full min-h-screen bg-linear-to-b from-amber-50 to-white">
      <div className="absolute inset-0 bg-linear-to-br from-amber-100/30 via-transparent to-transparent" />

      <div className="flex min-h-screen items-center justify-center relative px-4">

        <form onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-amber-100"
        >
          <div className="text-center mb-4">
            <div className="flex justify-center mb-4">
              <Image
                src="/image/viana-new.png"
                alt="Logo Universitas Terbuka"
                width={70}
                height={70}
                className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'
                  }`}
                onLoadingComplete={() => setLoaded(true)}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Sistem Kehadiran</h1>
            <p className="text-sm text-amber-700 mt-1">Universitas Terbuka</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              placeholder="nama@universitas.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 pr-10"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <CgIcons.CgLastpass size={18} /> : <CgIcons.CgEye size={18} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{errorMessage}</div>
          )}
          {/* <a href='/auth/register' className='text-sm underline'>Register</a> */}
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
