"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AttendanceCamera from "@/app/components/AttendanceCamera";

const API_URL = "https://api-face-inahef.layanancerdas.id";

export default function AttendancePage() {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCapture = async (base64Image: string) => {
    setCapturedImage(base64Image);
    setError(null);
  };

  const handleSubmitAttendance = async () => {
    if (!capturedImage) {
      setError("Foto belum diambil");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/attendance`, {
        image: capturedImage,
      });

      console.log("Attendance success:", response.data);
      setSuccess(true);
      setCapturedImage(null);
      
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      console.error("Attendance error:", err);
      setError(
        err?.response?.data?.message || 
        "Absensi gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setCapturedImage(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
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

        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-amber-100">
            <div className="bg-linear-to-r from-amber-600 to-amber-700 px-6 py-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Absensi
                  </h1>
                  <p className="text-sm text-amber-100">
                    Verifikasi wajah untuk absensi
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {success ? (
                // Success Message
                <div className="space-y-4">
                  <div className="rounded-xl border-2 border-green-200 bg-linear-to-br from-green-50 to-emerald-50 p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="mb-2 text-xl font-bold text-green-900">
                      Absensi Berhasil!
                    </h2>
                    <p className="text-sm text-green-700">
                      Kehadiran Anda telah dicatat. Anda akan dikembalikan ke beranda dalam beberapa detik...
                    </p>
                  </div>
                </div>
              ) : (
                // Form Content
                <div className="space-y-6">
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      Ambil Foto Wajah <span className="text-red-500">*</span>
                    </label>
                    <AttendanceCamera 
                      onCapture={handleCapture}
                      disabled={loading}
                      loading={loading}
                    />
                  </div>

                  {capturedImage && (
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Foto Terambil
                      </h3>
                      <div className="overflow-hidden rounded-xl border-2 border-amber-200 shadow-md">
                        <img
                          src={`data:image/jpeg;base64,${capturedImage}`}
                          alt="Captured"
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-start gap-3 rounded-xl border-2 border-red-200 bg-linear-to-r from-red-50 to-rose-50 p-4">
                      <svg className="h-6 w-6 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="rounded-xl border-2 border-amber-200 bg-linear-to-br from-amber-50 to-yellow-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="font-bold text-amber-900">
                        📋 Panduan
                      </h3>
                    </div>
                    <ol className="space-y-2 text-sm text-amber-800">
                      <li className="flex gap-2">
                        <span className="font-bold">1.</span>
                        <span>Pastikan kamera sudah aktif dan terang</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">2.</span>
                        <span>Hadapkan wajah ke kamera dengan jelas</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">3.</span>
                        <span>Tunggu hingga status menunjukkan "Posisi sempurna"</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">4.</span>
                        <span>Klik tombol "Ambil Foto" untuk capture</span>
                      </li>
                    </ol>
                  </div>

                  <div className="flex gap-3">
                    {capturedImage ? (
                      <>
                        <button
                          type="button"
                          onClick={handleSubmitAttendance}
                          disabled={loading}
                          className="flex-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Memproses...</span>
                            </>
                          ) : (
                            <>
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Submit Absensi</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          disabled={loading}
                          className="px-6 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          Ulangi
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/"
                        className="w-full rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 transition-colors text-center"
                      >
                        Kembali
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

