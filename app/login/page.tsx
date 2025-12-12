"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams(window.location.search);
    const from = params.get("from") || "/dashboard";

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || "Login failed");
      }

      router.push(from);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="hidden lg:grid lg:grid-cols-2 lg:w-full lg:h-screen overflow-hidden">
        <div className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <Image
            src="/image/landscape_login.jpg"
            alt="Pemandangan Ilustrasi"
            layout="fill"
            objectFit="cover"
            priority
            className="absolute inset-0 object-cover"
          />
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>

          <div className="absolute bottom-6 left-6">
            <h3 className="text-xl font-bold text-white drop-shadow-lg">Kehadiran Digital</h3>
          </div>
        </div>

        <div className="w-full bg-white dark:bg-zinc-800 p-8 flex flex-col justify-center">
          <div className="w-full max-w-md lg:max-w-lg mx-auto">
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500 transition-colors hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-400"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Beranda
              </Link>
            </div>

            <div className="px-0 py-0 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-18 w-18 items-center justify-center rounded-full text-white">
                 <Image
                    src="/image/Logo_Universitas_Terbuka.svg"
                    alt="Universitas Terbuka"
                    width={80}
                    height={80}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    Selamat Datang
                  </h1>
                  <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                    Masuk ke akun Anda
                  </p>
                </div>
              </div>
            </div>

            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              error={error}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              handleSubmit={handleSubmit}
            />
          </div>

        </div>
      </div>

      <div className="lg:hidden w-full max-w-md">

        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 transition-colors hover:text-amber-400 dark:text-amber-400 dark:hover:text-amber-400 sm:gap-2 sm:text-sm"
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-zinc-800 dark:shadow-xl dark:shadow-zinc-900/50 sm:rounded-2xl">

          <div className="bg-linear-to-r from-amber-400 to-yellow-600 px-4 py-5 sm:px-6 sm:py-7">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:h-12 sm:w-12">
                <svg className="h-5 w-5 text-white sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white sm:text-2xl">
                  Selamat Datang
                </h1>
                <p className="mt-0.5 text-xs text-amber-100 sm:text-sm">
                  Masuk ke akun Anda
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              error={error}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  error: string | null;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

function LoginForm({ email, setEmail, password, setPassword, loading, error, showPassword, setShowPassword, handleSubmit }: LoginFormProps) {
  return (
    <>
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border-2 border-red-200 bg-linear-to-r from-red-50 to-rose-50 p-3 dark:border-red-800 dark:from-red-900/30 dark:to-rose-900/30 sm:mb-5 sm:gap-2.5 sm:rounded-xl">
          <svg className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs font-medium text-red-700 dark:text-red-400 sm:text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200 sm:text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
              <svg className="h-4 w-4 text-zinc-400 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-2 border-zinc-200 bg-white py-2 pl-10 pr-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/10 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-amber-400 sm:rounded-xl sm:py-2.5 sm:pl-12 sm:pr-4"
              placeholder="nama@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200 sm:text-sm">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
              <svg className="h-4 w-4 text-zinc-400 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-zinc-200 bg-white py-2 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/10 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-amber-400 sm:rounded-xl sm:py-2.5 sm:pl-12 sm:pr-12"
              placeholder="Masukkan password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300 sm:pr-4"
            >
              {showPassword ? (
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full overflow-hidden rounded-lg bg-linear-to-r from-amber-500 to-yellow-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:from-amber-600 hover:to-yellow-700 hover:shadow-lg disabled:cursor-not-allowed cursor-pointer disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-60 disabled:hover:scale-100 sm:rounded-xl sm:px-6 sm:py-2.5 sm:text-base"
        >
          <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Masuk
              </>
            )}
          </span>
          <div className="absolute inset-0 z-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </button>
      </form>

      <div className="mt-4 text-center sm:mt-5">
        <p className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-amber-400 transition-colors hover:text-amber-400 dark:text-amber-400 dark:hover:text-amber-400"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </>
  );
}