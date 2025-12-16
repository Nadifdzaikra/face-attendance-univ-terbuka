"use client";

import AttendanceTable from "./components/AttendanceTable";
import StatsCard from "./components/StatsCard";
import QuickMenuCard from "./subMenu-card";
import SubActivityCard from "./subActivity-card";

export default function DashboardHome() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-linear-to-r from-amber-600 to-yellow-400 p-6 sm:p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white drop-shadow-xs sm:text-3xl md:text-4xl">
          Selamat Datang!
        </h1>
        <p className="mt-2 text-white/90 drop-shadow-xs">
          Kelola sistem absensi Anda dengan mudah
        </p>
      </div>

      {/* Stats Grid */}
      <StatsCard />

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickMenuCard />
        <SubActivityCard />
      </div>

      {/* Attendance Tables */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AttendanceTable type="check-in" />
        <AttendanceTable type="check-out" />
      </div>
    </div>
  );
}
