import { ReactNode } from "react";
import Link from "next/link";

interface QuickMenuButtonProps {
  color: string;
  hoverColor: string;
  iconBg: string;
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  href?: string;
}

export function QuickMenuButton({
  color,
  hoverColor,
  iconBg,
  icon,
  title,
  description,
  onClick,
  href,
}: QuickMenuButtonProps) {
  const className = `flex items-center gap-3 rounded-lg border-2 border-zinc-200 bg-zinc-50 p-4 text-left transition-all hover:border-${color}-400 hover:bg-${hoverColor}-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-${color}-500 dark:hover:bg-${color}-900/20`;

  const content = (
    <>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="font-semibold text-zinc-900 dark:text-white">{title}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export default function QuickMenuCard() {
  return (
    <div className="rounded-xl border border-amber-50 bg-linear-to-br from-white to-amber-50/50 p-6 shadow-sm dark:border-amber-900/30 dark:from-zinc-800 dark:to-amber-900/20">
      <h2 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">Menu Cepat</h2>
      <div className="grid gap-3">
        <QuickMenuButton
          color="amber"
          hoverColor="amber"
          iconBg="bg-linear-to-br from-amber-500 to-yellow-600"
          title="Registrasi Wajah Baru"
          description="Tambah pegawai baru"
          href="/register"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
            </svg>
          }
        />

        {/* <QuickMenuButton
          color="green"
          hoverColor="green"
          iconBg="bg-green-600"
          title="Lihat Laporan"
          description="Rekap kehadiran"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          }
        /> */}

        <QuickMenuButton
          color="cyan"
          hoverColor="blue"
          iconBg="bg-linear-to-br from-cyan-500 to-blue-600"
          title="Laporan Masalah"
          description="Lihat daftar laporan"
          href="/dashboard/problems-list"
          icon={
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

      </div>
    </div>
  );
}
