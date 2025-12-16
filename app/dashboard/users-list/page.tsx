"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.0.107.18:8009/api";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  returned: number;
}

export default function UsersListPage() {
  const [allData, setAllData] = useState<string[]>([]);
  const [data, setData] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    returned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Apply filters and paginate
  useEffect(() => {
    paginateData();
  }, [allData, currentPage, itemsPerPage, debouncedSearch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/users/summary`);

      // Extract names array from response
      if (response.data && Array.isArray(response.data.names)) {
        setAllData(response.data.names);
      } else {
        setAllData([]);
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Gagal mengambil data pengguna");
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  const paginateData = () => {
    // Apply search filter
    let results = allData.filter((name) => {
      if (!name) return false;
      const q = debouncedSearch.toLowerCase();
      return name.toLowerCase().includes(q);
    });

    setFilteredData(results);

    const total = results.length;

    if (itemsPerPage === 0) {
      setData(results);
      setPagination({ page: 1, limit: total, total, pages: 1, returned: total });
      return;
    }

    const pages = Math.max(1, Math.ceil(total / itemsPerPage));
    const safePage = Math.min(Math.max(1, currentPage), pages);
    if (safePage !== currentPage) setCurrentPage(safePage);

    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = results.slice(startIndex, endIndex);

    setData(pageData);
    setPagination({ page: safePage, limit: itemsPerPage, total, pages, returned: pageData.length });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Daftar Pegawai</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Total {pagination.total} pegawai terdaftar di sistem
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-lg bg-zinc-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-700 dark:bg-zinc-500 dark:hover:bg-zinc-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        {/* Header */}
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/50 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white sm:text-base">
              Daftar Pengguna ({pagination.total})
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama..."
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 sm:w-64"
                />
                <svg className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                </svg>
              </div>
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
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:px-6">
                  Nama
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center sm:px-6">
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
                  <td colSpan={2} className="px-4 py-8 text-center sm:px-6">
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
                  <td colSpan={2} className="px-4 py-8 text-center sm:px-6">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Belum ada pengguna
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        {searchTerm ? "Coba ubah kata kunci pencarian" : "Tidak ada data"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((name, index) => (
                  <tr key={index} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                    <td className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:px-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                          {name}
                        </span>
                      </div>
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
                <span className="font-semibold">{pagination.total}</span> pengguna
                <span className="ml-1">
                  (Halaman {currentPage} dari {pagination.pages})
                </span>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  title="Halaman pertama"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>

                {/* Previous */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  title="Halaman sebelumnya"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Items Per Page */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={0}>Semua</option>
                </select>

                {/* Page Indicator (Mobile) */}
                <div className="flex items-center gap-1 rounded-lg border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white md:hidden">
                  <span>{currentPage}</span>
                  <span className="text-blue-200">/</span>
                  <span>{pagination.pages}</span>
                </div>

                {/* Next */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.pages, prev + 1))}
                  disabled={currentPage === pagination.pages}
                  className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  title="Halaman berikutnya"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Last Page */}
                <button
                  onClick={() => setCurrentPage(pagination.pages)}
                  disabled={currentPage === pagination.pages}
                  className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  title="Halaman terakhir"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
