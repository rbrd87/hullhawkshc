import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hull Hawks Hockey Club",
  description: "Fixtures, results and league table for Hull Hawks 1.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
