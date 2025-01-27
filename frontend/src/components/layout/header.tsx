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
      className="sticky top-0 z-50 w-full border-b bg-background/75 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="group flex items-center gap-2 transition-transform hover:scale-105">
            <span className="font-cal text-2xl text-foreground">
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
                  "before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-0 before:bg-primary before:transition-all before:duration-300 hover:before:w-full",
                  pathname === href 
                    ? "text-primary before:w-full" 
                    : "text-muted-foreground hover:text-primary"
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
                  className="font-medium"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button 
                  variant="cta"
                  className="font-medium"
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