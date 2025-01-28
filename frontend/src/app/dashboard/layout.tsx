'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
  FileText,
  Settings,
  Star,
  Trash,
  LogOut,
} from "lucide-react"
import { toast } from 'sonner'

const sidebarNavItems = [
  {
    title: "All Notes",
    href: "/dashboard",
    icon: FileText,
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: Star,
  },
  {
    title: "Trash",
    href: "/dashboard/trash",
    icon: Trash,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success('Successfully logged out')
    router.push('/auth/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <FileText className="h-6 w-6" />
              <span>Notes App</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                    pathname === item.href
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                      : "transparent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
} 