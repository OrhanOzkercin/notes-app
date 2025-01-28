'use client'

import { AuthForm } from '@/app/auth/components/auth-form'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const { mutate: handleRegister, isPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      await register(data.email, data.password)
    },
    onSuccess: () => {
      toast.success('Successfully registered! Please log in.')
      router.push('/auth/login')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register')
    },
  })

  return (
    <div className="container flex h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="w-full max-w-[350px] space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Notes
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <AuthForm onSubmit={handleRegister} isLoading={isPending} />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 