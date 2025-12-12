"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export default function ClientThemeProvider({ children }: { children: ReactNode }) {
  // next-themes will manage the `class` on <html> and SSR flash prevention.
  // attribute="class" makes it add/remove `dark` class. enableSystem=true
  // ensures the library respects the OS preference when set to `system`.
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      {children}
    </ThemeProvider>
  );
}
