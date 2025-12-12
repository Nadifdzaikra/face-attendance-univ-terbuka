import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientThemeProvider from "./providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Face Attendance",
  description: "Aplikasi Absensi Berbasis Pengenalan Wajah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Small inline script placed before the client ThemeProvider/hydration to
            synchronously set html.className and color-scheme so server markup and
            client initial state don't mismatch. This mirrors next-themes' behavior
            but ensures no hydration error if the server and client disagree. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `;(function(){try{var t=localStorage.getItem('theme');var prefers=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var isDark=false;if(t==='dark'){isDark=true;}else if(t==='light'){isDark=false;}else{isDark=!!prefers;}if(isDark){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){} })();`,
          }}
        />

        {/* Wrap children with next-themes provider (client) so theme state is handled
            by the library and `dark` class is managed on <html>. */}
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}
