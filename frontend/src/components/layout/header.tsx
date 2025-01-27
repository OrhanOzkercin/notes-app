'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"


export function Header() {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-white/75 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60"
    >
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="group flex items-center gap-2 transition-transform hover:scale-105">
            <span 
              className="font-cal text-stone-950 text-2xl bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 bg-clip-text "
            >
              Notes
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            {[
              { href: '/features', label: 'Features' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/about', label: 'About' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative text-base font-medium transition-colors duration-200",
                  "before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-0 before:bg-primary-500 before:transition-all before:duration-300 hover:before:w-full",
                  pathname === href 
                    ? "text-primary-600 before:w-full" 
                    : "text-neutral-600 hover:text-primary-600"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {!isAuthPage && (
            <nav className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button 
                  variant="ghost" 
                  className="text-lg font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button 
                  className="text-lg font-medium bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 hover:from-primary-600 hover:via-accent-600 hover:to-secondary-600 text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
                >
                  Get Started
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
} 