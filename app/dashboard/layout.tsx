import type { ReactNode } from "react";
import Navbar from "./components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navbar />
      <main className="mx-auto max-w-7xl">{children}</main>
    </div>
  );
}
