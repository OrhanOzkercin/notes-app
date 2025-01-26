'use client'

import { AuthForm } from '../components/auth-form'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { APIException } from '@/lib/types/api'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const { mutate: register, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.register(email, password),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your account has been created successfully. Please sign in.",
      })
      router.push('/auth/login')
    },
    onError: (error) => {
      if (error instanceof APIException) {
        // Handle specific error codes
        if (error.hasErrorCode('USER_EXISTS')) {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: "An account with this email already exists.",
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
          console.error('Registration error:', {
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

  const handleRegister = (email: string, password: string) => {
    register({ email, password })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-gray-600 mb-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
        <AuthForm mode="register" onSubmit={handleRegister} isLoading={isPending} />
      </div>
    </div>
  )
} 