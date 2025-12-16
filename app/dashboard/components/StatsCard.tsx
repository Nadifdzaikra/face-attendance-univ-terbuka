"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.0.107.18:8009/api";

interface StatsData {
  totalPegawai: number;
  hadirHariIni: number;
  checkOut: number;
  totalAbsensi: number;
}

export default function StatsCard() {
  const [stats, setStats] = useState<StatsData>({
    totalPegawai: 0,
    hadirHariIni: 0,
    checkOut: 0,
    totalAbsensi: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Refresh setiap 30 detik
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch data from new endpoints: /absences/today/{checkin|checkout}
      const [checkInResponse, checkOutResponse, usersResponse] = await Promise.all([
        axios.get(`${API_URL}/absences/today/checkin`),
        axios.get(`${API_URL}/absences/today/checkout`),
        axios.get(`${API_URL}/users/summary`),
      ]);

      // Helper to determine count from response which may be an array or an object with items/total
      const extractCount = (res: any) => {
        if (!res || !res.data) return 0;
        const d = res.data;
        if (Array.isArray(d)) return d.length;
        if (Array.isArray(d.items)) return d.items.length;
        if (typeof d.total === "number") return d.total;
        // Try to find an array in values
        const maybeArray = Object.values(d).find((v) => Array.isArray(v));
        if (Array.isArray(maybeArray)) return (maybeArray as any[]).length;
        return 0;
      };

      const checkInTotal = extractCount(checkInResponse);
      const checkOutTotal = extractCount(checkOutResponse);
      const totalUsers = usersResponse.data?.total_users || 0;

      // Hitung total absensi hari ini (check-in + check-out)
      const totalAbsensiHariIni = checkInTotal + checkOutTotal;

      // Set stats with calculated values
      setStats({
        totalPegawai: totalUsers,
        hadirHariIni: checkInTotal,
        checkOut: checkOutTotal,
        totalAbsensi: totalAbsensiHariIni,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Jika error, tetap tampilkan data terakhir atau 0
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Pegawai - Clickable Link */}
      <Link href="/dashboard/users-list" className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Pegawai</p>
            {loading ? (
              <div className="mt-2 h-9 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
            ) : (
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats.totalPegawai}</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Terdaftar di sistem</p>
      </Link>

      {/* Hadir Hari Ini */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Hadir Hari Ini</p>
            {loading ? (
              <div className="mt-2 h-9 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
            ) : (
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats.hadirHariIni}</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {stats.totalPegawai > 0 ? `${Math.round((stats.hadirHariIni / stats.totalPegawai) * 100)}% kehadiran` : "0% kehadiran"}
        </p>
      </div>

      {/* Check-Out */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Check-Out</p>
            {loading ? (
              <div className="mt-2 h-9 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
            ) : (
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats.checkOut}</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {stats.hadirHariIni > 0 ? `${Math.round((stats.checkOut / stats.hadirHariIni) * 100)}% sudah pulang` : "Dari total hadir"}
        </p>
      </div>

      {/* Total Absensi */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Absensi</p>
            {loading ? (
              <div className="mt-2 h-9 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
            ) : (
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{stats.totalAbsensi}</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Seluruh record</p>
      </div>
    </div>
  );
}
