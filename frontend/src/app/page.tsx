import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Welcome to Notes App</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Link href="/auth/login">
              <Button className="w-full" variant="default">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="w-full" variant="outline">
                Create Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
