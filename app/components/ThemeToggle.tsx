"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Pastikan component sudah mounted di client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Tampilkan placeholder saat belum mounted
  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded px-2 py-1 text-sm ring-1 ring-transparent hover:ring-zinc-300 dark:hover:ring-zinc-600"
        disabled
      >
        ...
      </button>
    );
  }

  const isDark = theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  return (
    <button
      type="button"
      aria-pressed={!!isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded border border-zinc-300 bg-zinc-100 px-3 py-1 text-sm text-zinc-900 hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
      title="Toggle theme"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
