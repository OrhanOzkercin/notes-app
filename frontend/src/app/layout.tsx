import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
