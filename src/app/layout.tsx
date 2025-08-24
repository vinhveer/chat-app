import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/data/auth";

export const metadata: Metadata = {
  title: "Chat",
  description: "Connect, communicate, and collaborate with your team in real-time. Experience seamless messaging with modern design and powerful features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
