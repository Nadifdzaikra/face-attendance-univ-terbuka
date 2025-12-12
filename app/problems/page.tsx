"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";

const API_URL = "https://api-face-inahef.layanancerdas.id/api";

interface FormErrors {
  name?: string;
  description?: string;
  submit?: string;
}

export default function ProblemsPage() {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation function
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nama minimal 3 karakter";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Nama maksimal 100 karakter";
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Deskripsi minimal 10 karakter";
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = "Deskripsi maksimal 1000 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!validate()) return;

    setLoading(true);
    setSuccess(false);
    setErrors({});

    try {
      const response = await axios.post(`${API_URL}/problems`, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setFormData({ name: "", description: "" });

        // Auto-clear success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Gagal mengirim laporan";
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10"></div>
        <div className="absolute -right-20 top-40 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-500/10"></div>
        <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl dark:bg-pink-500/10"></div>
      </div>

      {/* Back Button */}
      <div className="absolute left-4 top-4 z-10 sm:left-8 sm:top-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 backdrop-blur-sm transition-all hover:bg-white dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-0 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:to-purple-400 sm:text-4xl">
              Laporkan Masalah
            </h1>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-300">
              {/* Bantu kami meningkatkan sistem dengan melaporkan masalah atau kendala yang Anda alami */}
              Bantu kami dengan melaporkan kendala yang Anda alami
            </p>
          </div>

          {/* Form Card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-zinc-800">
            <div className="p-8 sm:p-10">
              {/* Success Message */}
              {success && (
                <div className="mb-6 flex items-start gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <svg className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-200">Laporan berhasil dikirim!</h3>
                    <p className="mt-1 text-sm text-green-800 dark:text-green-300">
                      Terima kasih atas laporan Anda. Tim kami akan meninjau dan merespons segera.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <svg className="h-6 w-6 shrink-0 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-200">Gagal mengirim laporan</h3>
                    <p className="mt-1 text-sm text-red-800 dark:text-red-300">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-zinc-900 dark:text-white">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Muhammad Ali"
                    className={`mt-2 w-full rounded-lg border px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:bg-zinc-700 dark:text-white dark:placeholder:text-zinc-500 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500/10"
                        : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500/10 dark:border-zinc-600 dark:focus:border-blue-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.314 12.9a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8z" />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {formData.name.length}/100 karakter
                  </p>
                </div>

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-zinc-900 dark:text-white">
                    Deskripsi Masalah <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Jelaskan masalah yang Anda alami secara detail..."
                    rows={6}
                    className={`mt-2 w-full rounded-lg border px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:bg-zinc-700 dark:text-white dark:placeholder:text-zinc-500 ${
                      errors.description
                        ? "border-red-500 focus:ring-red-500/10"
                        : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500/10 dark:border-zinc-600 dark:focus:border-blue-500"
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.314 12.9a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8z" />
                      </svg>
                      {errors.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {formData.description.length}/1000 karakter
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 dark:from-blue-500 dark:to-purple-500"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Kirim Laporan
                    </span>
                  )}
                </button>
              </form>

              {/* Help Text */}
              <div className="mt-8 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700/50">
                <h3 className="font-semibold text-zinc-900 dark:text-white">Tips untuk laporan yang lebih baik:</h3>
                <ul className="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Jelaskan masalah dengan detail dan spesifik</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Sebutkan langkah-langkah yang menyebabkan masalah</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Informasi perangkat/browser Anda akan membantu kami</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
