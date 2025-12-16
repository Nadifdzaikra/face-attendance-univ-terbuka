"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import ExcelJS from "exceljs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.0.107.18:8009/api";

interface AttendanceRecord {
  id: number;
  name: string;
  timestamps: string;
  timestamps_formatted?: string;
  status: string;
  source?: "checkin" | "late" | "checkout"; // track origin so we can show 'Late' when appropriate
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  returned: number;
}

interface AttendanceTableProps {
  type: "check-in" | "check-out";
}

export default function AttendanceTable({ type }: AttendanceTableProps) {
  const [allData, setAllData] = useState<AttendanceRecord[]>([]); // Semua data dari API
  const [data, setData] = useState<AttendanceRecord[]>([]); // Data untuk ditampilkan di halaman saat ini
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]); // Data setelah filter (search/status)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    returned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [type]);

  // useEffect(() => {
  //   // Refresh data setiap 30 detik
  //   const interval = setInterval(() => fetchData(), 30000);
  //   return () => clearInterval(interval);
  // }, [type]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Effect terpisah untuk handle pagination setelah data difilter or search
  useEffect(() => {
    paginateData();
  }, [allData, currentPage, itemsPerPage, type, debouncedSearch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Map component type to API status segment
      const apiStatus = type === "check-in" ? "checkin" : "checkout";

      // Helper to extract array data from response (supports array or { items: [...] })
      const extractArrayFromResponse = (res: any): AttendanceRecord[] => {
        if (!res || !res.data) return [];
        const d = res.data;
        if (Array.isArray(d)) return d as AttendanceRecord[];
        if (Array.isArray(d.items)) return d.items as AttendanceRecord[];
        const maybeArray = Object.values(d).find((v) => Array.isArray(v));
        if (Array.isArray(maybeArray)) return maybeArray as AttendanceRecord[];
        return [];
      };

      // If check-in table, fetch both checkin and late and merge results
      if (apiStatus === "checkin") {
        const [checkinRes, lateRes] = await Promise.all([
          axios.get(`${API_URL}/absences/today/checkin`),
          axios.get(`${API_URL}/absences/today/late`),
        ]);

        const a = extractArrayFromResponse(checkinRes).map((r) => ({ ...r, source: "checkin" as const }));
        const b = extractArrayFromResponse(lateRes).map((r) => ({ ...r, source: "late" as const }));

        // Merge and dedupe by id. If a record appears in late, mark source as 'late'.
        const map = new Map<number | string, AttendanceRecord>();
        a.forEach((rec) => {
          const key = (rec as any).id ?? JSON.stringify(rec);
          map.set(key as number, rec);
        });
        b.forEach((rec) => {
          const key = (rec as any).id ?? JSON.stringify(rec);
          if (map.has(key as number)) {
            // prefer marking as late while keeping other fields from existing record
            const existing = map.get(key as number)!;
            map.set(key as number, { ...existing, ...rec, source: "late" });
          } else {
            map.set(key as number, rec);
          }
        });

        // Sort by timestamp (newest first) before setting state
        const merged = Array.from(map.values());
        merged.sort((a, b) => parseTimestampToMillis(b.timestamps) - parseTimestampToMillis(a.timestamps));
        setAllData(merged);
      } else {
        // Endpoint: /absences/today/{checkout}
        const response = await axios.get(`${API_URL}/absences/today/${apiStatus}`);
        const arr = extractArrayFromResponse(response).map((r) => ({ ...r, source: "checkout" as const }));
        arr.sort((a, b) => parseTimestampToMillis(b.timestamps) - parseTimestampToMillis(a.timestamps));
        setAllData(arr);
      }
    } catch (err: any) {
      console.error(`Error fetching ${type} data:`, err);
      setError(err.response?.data?.message || `Gagal mengambil data ${type}`);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  const paginateData = () => {
    // First, apply status filter defensively (endpoint should already filter by status)
    let results = allData.filter((item: AttendanceRecord) => {
      if (!item) return false;
      if (type === "check-in") {
        return item.status?.toLowerCase() !== "checkout";
      }
      return item.status?.toLowerCase() === "checkout";
    });

    // Apply search filter (name)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      results = results.filter((r) => (r.name || "").toLowerCase().includes(q));
    }

    // Save filtered results for export and other uses
    setFilteredData(results);

    // Pagination calculations
    const total = results.length;

    if (itemsPerPage === 0) {
      // Show all
      setData(results);
      setPagination({ page: 1, limit: total, total, pages: 1, returned: total });
      return;
    }

    const pages = Math.max(1, Math.ceil(total / itemsPerPage));
    // Ensure currentPage within range
    const safePage = Math.min(Math.max(1, currentPage), pages);
    if (safePage !== currentPage) setCurrentPage(safePage);

    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = results.slice(startIndex, endIndex);

    setData(pageData);
    setPagination({ page: safePage, limit: itemsPerPage, total, pages, returned: pageData.length });
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

  // Parse timestamps from API to milliseconds for sorting.
  // Supports DD-MM-YYYY HH:mm:ss, DD-MM-YYYY HH:mm, or ISO formats.
  const parseTimestampToMillis = (timestamps?: string) => {
    if (!timestamps) return 0;
    try {
      const parts = timestamps.split(' ');
      if (parts.length >= 2) {
        const [datePart, timePart] = parts;
        const dateParts = datePart.split('-');
        if (dateParts.length === 3) {
          const [day, month, year] = dateParts;
          // build ISO-like string
          const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`;
          const d = new Date(iso);
          if (!isNaN(d.getTime())) return d.getTime();
        }
      }

      // Fallback to Date parser
      const fallback = new Date(timestamps);
      return isNaN(fallback.getTime()) ? 0 : fallback.getTime();
    } catch {
      return 0;
    }
  };

  const getStatusBadge = (status: string, source?: AttendanceRecord["source"]) => {
    // If source indicates late, show Late badge
    const isLate = source === "late" || status?.toLowerCase() === "late";
    const isCheckout = status?.toLowerCase() === "checkout" || source === "checkout";

    if (isLate) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Late
        </span>
      );
    }

    if (isCheckout) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Check-out
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Check-in
      </span>
    );
  };

  const exportToExcel = async () => {
    const exportSource = filteredData.length > 0 ? filteredData : data;
    if (exportSource.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    // Persiapkan data untuk Excel
    const excelData = exportSource.map((record, index) => ({
      "No": index + 1,
      "Nama": record.name || "Unknown",
      "Waktu": formatTimestamp(record.timestamps || "", record.timestamps_formatted),
      "Status": record.source === "late" ? "Late" : (type === "check-in" ? "Check-in" : "Check-out")
    }));

    // Buat workbook dan worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type === "check-in" ? "Check-In" : "Check-Out");

    // Tambahkan header
    const headers = ["No", "Nama", "Waktu", "Status"];
    worksheet.addRow(headers);

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD3D3D3" } };

    // Tambahkan data
    excelData.forEach(record => {
      worksheet.addRow([record["No"], record["Nama"], record["Waktu"], record["Status"]]);
    });

    // Atur lebar kolom
    worksheet.columns = [
      { width: 5 },  // No
      { width: 30 }, // Nama
      { width: 25 }, // Waktu
      { width: 15 }  // Status
    ];

    // Generate nama file dengan tanggal
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const fileName = `Data_${type === "check-in" ? "Check-In" : "Check-Out"}_${dateString}.xlsx`;

    // Download file
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
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/50 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white sm:text-base">
            {type === "check-in" ? (
              <>
                <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Data Check-In Hari Ini
              </>
            ) : (
              <>
                <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Data Check-Out Hari Ini
              </>
            )}
            <Link
              href={type === "check-in" ? "/dashboard/checkin" : "/dashboard/checkout"}
              className="ml-2 text-nowrap text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              (Lihat Detail)
            </Link>
          </h3>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button
              onClick={exportToExcel}
              disabled={loading || data.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              title="Export ke Excel"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Export Excel</span>
            </button>
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              <svg className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
              />
              <svg className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-900/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                Waktu
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center sm:px-6">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center sm:px-6">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                    <button
                      onClick={() => fetchData()}
                      className="mt-2 text-xs text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Coba lagi
                    </button>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center sm:px-6">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Belum ada data {type === "check-in" ? "check-in" : "check-out"}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                      Data akan muncul setelah ada absensi
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={record.id || index}
                  className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                >
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 sm:px-6">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {record.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        {record.name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 sm:px-6">
                    {formatTimestamp(record.timestamps)}
                  </td>
                  <td className="px-4 py-3 sm:px-6 lg:text-nowrap">
                    {getStatusBadge(record.status, record.source)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      {!loading && !error && data.length > 0 && (
        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/30 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Info */}
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Menampilkan <span className="font-semibold">{data.length}</span> dari{" "}
              <span className="font-semibold">{pagination.total}</span> data
              <span className="ml-1">
                (Halaman {currentPage} dari {pagination.pages})
              </span>
            </div>

            {/* Pagination Controls - Always show if there are pages */}
            <div className="flex items-center gap-2">
              {/* First Page Button */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                title="Halaman pertama"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                {/* <span className="hidden sm:inline">Pertama</span> */}
              </button>

              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                title="Halaman sebelumnya"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {/* <span className="hidden sm:inline">Prev</span> */}
              </button>
              <div className="flex items-center gap-1.5">
                {/* <label htmlFor={`limit-${type}`} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Tampilkan:
                </label> */}
                <select
                  id={`limit-${type}`}
                  value={itemsPerPage}
                  onChange={(e) => {
                    const newLimit = Number(e.target.value);
                    setItemsPerPage(newLimit);
                    setCurrentPage(1); // Reset ke halaman 1 saat ganti limit
                  }}
                  className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={0}>Semua</option>
                </select>
              </div>
              {/* Page Numbers - Show only if more than 1 page */}
              {/* {pagination.pages > 1 && (
                <div className="hidden items-center gap-1 md:flex">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === pagination.pages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsis && (
                            <span className="px-2 text-xs text-zinc-400">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-medium transition-colors ${currentPage === page
                              ? "border-blue-600 bg-blue-600 text-white shadow-sm dark:border-blue-500 dark:bg-blue-500"
                              : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                              }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>
              )} */}

              {/* Current Page Indicator (Mobile) */}
              <div className="flex items-center gap-1 rounded-lg border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white md:hidden">
                <span>{currentPage}</span>
                <span className="text-blue-200">/</span>
                <span>{pagination.pages}</span>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(pagination.pages, prev + 1))}
                disabled={currentPage === pagination.pages}
                className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                title="Halaman berikutnya"
              >
                {/* <span className="hidden sm:inline">Next</span> */}
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Last Page Button */}
              <button
                onClick={() => setCurrentPage(pagination.pages)}
                disabled={currentPage === pagination.pages}
                className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                title="Halaman terakhir"
              >
                {/* <span className="hidden sm:inline">Terakhir</span> */}
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
