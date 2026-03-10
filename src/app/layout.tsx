import type { Metadata } from "next";
import "./globals.css";
import AmplifyProvider from "@/components/AmplifyProvider";

export const metadata: Metadata = {
  title: "TaskFlow — Stay Organized",
  description: "A simple, fast todo app powered by Next.js and AWS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  );
}
