import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-linear-to-br dark:from-blue-900 dark:via-zinc-900 dark:to-blue-900">

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-yellow-400/20 blur-3xl dark:bg-yellow-500/10 animate-pulse duration-10000"></div>
        <div className="absolute -right-20 top-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10"></div>
        <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/10 animate-pulse duration-12000 delay-500"></div>
      </div>

      <div className="absolute right-4 top-4 z-10 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="relative z-0 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-row lg:gap-12 lg:px-8">

        <div className="w-full space-y-8 lg:w-1/2">
            <div className="flex justify-center lg:justify-start">
              <div className="flex items-center gap-3 rounded-2xl px-6 py-3 ">
                <Image
                  src="/image/Logo_Universitas_Terbuka.svg"
                  className="dark:drop-shadow-zinc-600/50 dark:drop-shadow-xs"
                  alt="Universitas Terbuka"
                  width={150}
                  height={100}
                  priority
                />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h1 className="bg-linear-to-r from-blue-600 text-nowrap to-cyan-600 bg-clip-text text-4xl font-black tracking-tight text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-5xl md:text-6xl pb-2">
                Absensi Digital
              </h1>
              {/* <h2 className="mt-2 text-3xl font-bold text-zinc-800 dark:text-white sm:text-4xl md:text-5xl">
                Pengenalan Wajah Cerdas
              </h2> */}
            </div>

          <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 lg:mx-0 lg:text-left">
            Kehadiran berbasis teknologi pengenalan wajah proses absensi lebih mudah, cepat, dan transparan untuk semua civitas akademika.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm dark:bg-zinc-800/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/50">
                <svg className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Deteksi Instan</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Proses absensi kurang dari 1 detik</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm dark:bg-zinc-800/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Data Terjaga</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Privasi dan keamanan terjamin</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm dark:bg-zinc-800/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Akses Dimana Saja</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Tersedia di smartphone dan komputer</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm dark:bg-zinc-800/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/50">
                <svg className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Sangat Mudah</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Cukup arahkan wajah ke kamera</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/attendance"
              className="group relative order-first sm:border-0 flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-amber-500 to-yellow-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:px-5 sm:py-2.5 sm:text-md"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Absensi Sekarang
              </span>
              <div className="absolute inset-0 z-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
            </Link>

            <Link
              href="/register"
              className="flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50/80 px-6 py-3 text-md font-bold text-amber-900 backdrop-blur-sm transition-all hover:scale-105 hover:border-amber-400 hover:bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-100 dark:hover:border-amber-700 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Daftar
            </Link>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white/80 px-6 py-3 text-md font-bold text-zinc-900 backdrop-blur-sm transition-all hover:scale-105 hover:border-amber-400 hover:bg-white dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-white dark:hover:border-amber-500 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Masuk
            </Link>
          </div>

          <div className="text-center">
            <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Dipercaya oleh <span className="text-blue-500 font-bold">100.000+</span> pengguna terdaftar.
            </p>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Ada yang bermasalah?{" "}
              <Link
                href="/problems"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Hubungi kami
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 w-full lg:mt-0 lg:w-1/2">
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-800 border border-blue-100 dark:border-blue-900/30">

              <div className="relative aspect-square overflow-hidden rounded-2xl bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                <div className="flex h-full items-center justify-center">

                  <svg className="h-48 w-48 text-blue-600/30 dark:text-blue-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>

                  <svg className="absolute h-10 w-10 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-pulse"></div>

                <div className="absolute left-4 top-4 h-12 w-12 border-l-4 border-t-4 border-cyan-500"></div>
                <div className="absolute right-4 top-4 h-12 w-12 border-r-4 border-t-4 border-cyan-500"></div>
                <div className="absolute bottom-4 left-4 h-12 w-12 border-b-4 border-l-4 border-cyan-500"></div>
                <div className="absolute bottom-4 right-4 h-12 w-12 border-b-4 border-r-4 border-cyan-500"></div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-center dark:bg-blue-900/20">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">99%</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Akurat</div>
                </div>
                <div className="rounded-xl bg-yellow-50 p-3 text-center dark:bg-yellow-900/20">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">&lt;1s</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Cepat</div>
                </div>
                <div className="rounded-xl bg-cyan-50 p-3 text-center dark:bg-cyan-900/20">
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">24/7</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Aktif</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 -top-4 rounded-full bg-yellow-500 p-4 shadow-xl">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}