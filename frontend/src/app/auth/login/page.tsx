'use client'

import { AuthForm } from '../components/auth-form'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { APIException } from '@/lib/types/api'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      })
      router.push('/')
    },
    onError: (error) => {
      console.log("LoginPage -> error:", error)
      if (error instanceof APIException) {
        // Handle specific error codes
        if (error.hasErrorCode('INVALID_CREDENTIALS')) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          })
        }
        
        // Log error for debugging (in development)
        if (process.env.NODE_ENV === 'development') {
          console.error('Login error:', {
            message: error.message,
            requestId: error.requestId,
            errors: error.errors,
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        })
      }
    },
  })

  const handleLogin = (email: string, password: string) => {
    login({ email, password })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
        <AuthForm mode="login" onSubmit={handleLogin} isLoading={isPending} />
      </div>
    </div>
  )
} 