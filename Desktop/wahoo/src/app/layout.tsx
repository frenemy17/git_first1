import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wraft — WhatsApp AI for your business",
  description: "Set up an AI receptionist and sales agent on WhatsApp in minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
