import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { PhoneGeniusProvider } from "@/context/PhoneGeniusContext";
import MainLayout from "@/components/global/MainLayout";
import CookieBanner from "@/components/global/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phone Master - Mobile Phone Marketplace & Support",
  description: "Your trusted marketplace for mobile phones, accessories, and expert technical support. Buy, sell, and troubleshoot mobile devices.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <AuthProvider>
          <PhoneGeniusProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <CookieBanner />
          </PhoneGeniusProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
