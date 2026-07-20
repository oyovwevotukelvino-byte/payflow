import type { ReactNode } from "react";
// Add to src/app/layout.tsx
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// then on <body>:  className={`${sora.variable} ${inter.variable} font-sans`}
export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      {children}
    </main>
  );
}