import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import QueryProvider from "@/providers/QueryProvider";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const agale = localFont({
  src: "../../public/fonts/Agale-DEMO-BF68590f7433e5f.otf",
  variable: "--font-agale",
});

export const metadata: Metadata = {
  title: "AI Powered Resume Assistance",
  description: "Agentic system for candidate ranking and resume assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${agale.variable} antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
