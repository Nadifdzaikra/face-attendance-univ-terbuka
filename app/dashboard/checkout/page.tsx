"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import ExcelJS from "exceljs";

const API_URL = "https://api-face-inahef.layanancerdas.id/api";

interface AttendanceRecord {
  id: number;
  name: string;
  timestamps: string;
  timestamps_formatted?: string;
  status: string;
}

export default function CheckOutDetailPage() {
  const [allData, setAllData] = useState<AttendanceRecord[]>([]); // Semua data dari API
  const [data, setData] = useState<AttendanceRecord[]>([]); // Data yang sudah difilter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Set default date filter ke hari ini
  const [dateFilter, setDateFilter] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  useEffect(() => {
    fetchData();
    // Refresh data setiap 30 detik
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter data ketika allData, searchTerm, atau dateFilter berubah
  useEffect(() => {
    filterData();
  }, [allData, searchTerm, dateFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gunakan endpoint tunggal /absences dengan limit besar
      const response = await axios.get(`${API_URL}/absences`, {
        params: {
          page: 1,
          limit: 1000,
        },
      });
      
      if (response.data && Array.isArray(response.data.items)) {
        setAllData(response.data.items);
      } else {
        setAllData([]);
      }
    } catch (err: any) {
      console.error("Error fetching check-out data:", err);
      setError(err.response?.data?.message || "Gagal mengambil data check-out");
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    // Filter hanya data check-out (status === "checkout")
    let filtered = allData.filter((item) => item.status?.toLowerCase() === "checkout");

    // Filter berdasarkan search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((record) =>
        record.name?.toLowerCase().includes(searchLower) ||
        record.id.toString().includes(searchLower) ||
        formatTimestamp(record.timestamps, record.timestamps_formatted).toLowerCase().includes(searchLower)
      );
    }

    // Filter berdasarkan tanggal
    if (dateFilter) {
      filtered = filtered.filter((record) => {
        try {
          // Format dari API: "05-11-2025 04:43:41" (DD-MM-YYYY)
          const timestampStr = record.timestamps;
          const datePart = timestampStr.split(' ')[0]; // "05-11-2025"
          const [day, month, year] = datePart.split('-'); // ["05", "11", "2025"]
          const recordDate = `${year}-${month}-${day}`; // "2025-11-05" untuk compare
          
          return recordDate === dateFilter;
        } catch (error) {
          console.error('Error parsing date:', record.timestamps, error);
          return false;
        }
      });
    }

    setData(filtered);
  };

  const formatTimestamp = (timestamps: string, formatted?: string) => {
    if (formatted) return formatted;
    
    try {
      // Format dari API: "05-11-2025 04:43:41" (DD-MM-YYYY HH:mm:ss)
      const [datePart, timePart] = timestamps.split(' ');
      const [day, month, year] = datePart.split('-');
      
      // Parse sebagai DD-MM-YYYY
      const date = new Date(`${year}-${month}-${day}T${timePart || '00:00:00'}`);
      
      if (isNaN(date.getTime())) {
        return timestamps; // Jika gagal parse, return original
      }
      
      return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return timestamps;
    }
  };

  const exportToExcel = async () => {
    if (data.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const excelData = data.map((record, index) => ({
      "No": index + 1,
      "ID": record.id,
      "Nama": record.name || "Unknown",
      "Waktu": formatTimestamp(record.timestamps, record.timestamps_formatted),
      "Status": "Check-out"
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Check-Out");

    // Tambahkan header
    const headers = ["No", "ID", "Nama", "Waktu", "Status"];
    worksheet.addRow(headers);

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD3D3D3" } };

    // Tambahkan data
    excelData.forEach(record => {
      worksheet.addRow([record["No"], record["ID"], record["Nama"], record["Waktu"], record["Status"]]);
    });

    // Atur lebar kolom
    worksheet.columns = [
      { width: 5 },  // No
      { width: 8 },  // ID
      { width: 30 }, // Nama
      { width: 25 }, // Waktu
      { width: 15 }  // Status
    ];

    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const fileName = `Detail_Check-Out_${dateString}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
          Detail Data Check-Out
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Daftar lengkap absensi check-out pegawai
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search & Date Filter */}
        <div className="flex flex-1 gap-2 max-w-2xl">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari nama, ID, atau waktu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            />
          </div>
          
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 px-4 text-sm text-zinc-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="absolute inset-y-0 right-9 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                title="Clear date filter"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportToExcel}
            disabled={loading || data.length === 0}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                  Waktu Check-Out
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center sm:px-6">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center sm:px-6">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                      <button
                        onClick={fetchData}
                        className="mt-2 text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Coba lagi
                      </button>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center sm:px-6">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        {searchTerm || dateFilter ? "Tidak ada data yang cocok" : "Belum ada data check-out"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((record, index) => (
                  <tr
                    key={record.id}
                    className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                  >
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 sm:px-6">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white sm:px-6">
                      #{record.id}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            {record.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                          {record.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 sm:px-6">
                      {formatTimestamp(record.timestamps, record.timestamps_formatted)}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Check-out
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && !error && data.length > 0 && (
          <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/30 sm:px-6">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Menampilkan <span className="font-semibold">{data.length}</span> data check-out
              {(searchTerm || dateFilter) && (
                <span className="ml-1 text-purple-600 dark:text-purple-400">(terfilter)</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
