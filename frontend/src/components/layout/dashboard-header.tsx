import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { auth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function DashboardHeader() {
  const router = useRouter()

  const handleLogout = () => {
    auth.removeToken()
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/dashboard" className="font-cal text-xl">
          Notes
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
} 