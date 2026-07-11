import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "RestoCare Academy | Online Examination System",
  description:
    "Online MCQ examination system for RestoCare Academy hospitality skill assessments.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <footer className="no-print border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} RestoCare Academy — Online Examination System
        </footer>
      </body>
    </html>
  );
}
