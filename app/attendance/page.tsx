"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AttendanceCamera from "@/app/components/AttendanceCamera";
import { MdOutlineMeetingRoom } from "react-icons/md";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.0.107.18:8009/api";

export default function AttendancePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Input ruangan, Step 2: Face recognition
  const [ruang, setRuang] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCapture = async (base64Image: string) => {
    setCapturedImage(base64Image);
    setError(null);
    
    // Auto submit setelah capture
    submitAttendance(base64Image);
  };

  const submitAttendance = async (imageData: string) => {
    if (!ruang) {
      setError("Silakan input nama ruangan terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Gunakan proxy API route untuk menghindari CORS
      const response = await axios.post(`${API_URL}/recognize`, {
        image: imageData,
        ruang: ruang,
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
      setCapturedImage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAttendance = async () => {
    if (!capturedImage) {
      setError("Foto belum diambil");
      return;
    }

    await submitAttendance(capturedImage);
  };

  // Reset form
  const handleReset = () => {
    setCapturedImage(null);
    setError(null);
    setSuccess(false);
  };

  const handleNextStep = () => {
    if (!ruang.trim()) {
      setError("Silakan input nama ruangan terlebih dahulu");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
    setCapturedImage(null);
    setError(null);
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
                <div className="space-y-6">
                  {/* Step Indicator */}
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                      step >= 1 ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                      1
                    </div>
                    <div className={`flex-1 h-1 ${step >= 2 ? "bg-amber-600" : "bg-gray-200"}`}></div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                      step >= 2 ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                      2
                    </div>
                  </div>

                  {/* Step 1: Input Ruangan */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="mb-2 text-lg font-bold text-gray-900">
                          Langkah 1: Input Ruangan
                        </h2>
                        <p className="text-sm text-gray-600">
                          Masukkan nama ruangan tempat Anda melakukan absensi
                        </p>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200 sm:text-sm">
                          Nomor Ruangan <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MdOutlineMeetingRoom className="h-5 w-5 text-zinc-400" />
                          </div>
                          <input
                            type="number"
                            value={ruang}
                            onChange={(e) => setRuang(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleNextStep()}
                            className="w-full rounded-lg border-2 border-zinc-200 bg-white py-2 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/10 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-amber-400 sm:rounded-xl sm:py-2.5 sm:pl-12 sm:pr-4"
                            // placeholder="Contoh: Lab Informatika, Ruang Meeting, dll"
                            placeholder="Contoh: 101, 202, 303, dll"
                            autoFocus
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-start gap-3 rounded-xl border-2 border-red-200 bg-linear-to-r from-red-50 to-rose-50 p-4">
                          <svg className="h-6 w-6 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm font-medium text-red-700">{error}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Link
                          href="/"
                          className="flex-1 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-center py-2.5"
                        >
                          Kembali
                        </Link>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 transition-colors flex items-center justify-center gap-2"
                        >
                          <span>Lanjut ke Deteksi Wajah</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Face Recognition */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="mb-2 text-lg font-bold text-gray-900">
                          Langkah 2: Deteksi Wajah
                        </h2>
                        <p className="text-sm text-gray-600">
                          Ruangan: <span className="font-semibold text-amber-600">{ruang}</span>
                        </p>
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-semibold text-gray-700">
                          Ambil Foto Wajah <span className="text-red-500">*</span>
                        </label>
                        <AttendanceCamera
                          onCapture={handleCapture}
                          disabled={loading}
                          loading={loading}
                          autoCapture={!capturedImage}
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
                            📷 Petunjuk
                          </h3>
                        </div>
                        <ul className="space-y-2 text-sm text-amber-800">
                          <li className="flex gap-2">
                            <span>✓</span>
                            <span>Pastikan cahaya cukup terang</span>
                          </li>
                          <li className="flex gap-2">
                            <span>✓</span>
                            <span>Hadapkan wajah langsung ke kamera</span>
                          </li>
                          <li className="flex gap-2">
                            <span>✓</span>
                            <span>Tunggu status "Posisi sempurna"</span>
                          </li>
                          <li className="flex gap-2">
                            <span>✓</span>
                            <span>Foto akan otomatis terambil dan dikirim</span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex gap-3">
                        {capturedImage ? (
                          <>
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
                          <button
                            type="button"
                            onClick={handleBackStep}
                            disabled={loading}
                            className="flex-1 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Kembali</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

