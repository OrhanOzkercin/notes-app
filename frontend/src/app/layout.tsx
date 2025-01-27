import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import localFont from 'next/font/local';

const inter = Inter({ subsets: ["latin"] });

const cal = localFont({
  src: "../../public/fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal",
});

export const metadata: Metadata = {
  title: "Notes App",
  description: "Collaborative rich-text note-taking platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cal.variable}>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
