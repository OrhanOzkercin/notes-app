import Cookies from 'js-cookie'
import { authApi } from '@/lib/api'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const AUTH_TOKEN_KEY = 'token'

interface AuthState {
  token: string | null
  setToken: (token: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string | null) => {
        if (token) {
          // Set cookie to expire in 7 days when token is set
          Cookies.set(AUTH_TOKEN_KEY, token, { expires: 7 })
        } else {
          // Remove cookie when token is null
          Cookies.remove(AUTH_TOKEN_KEY)
        }
        set({ token })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

export function useAuth() {
  const { token, setToken } = useAuthStore()

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    setToken(response.token)
    return response
  }

  const register = async (email: string, password: string) => {
    const response = await authApi.register(email, password)
    return response
  }

  const logout = () => {
    setToken(null)
  }

  const isAuthenticated = () => {
    return !!token
  }

  return {
    token,
    login,
    register,
    logout,
    isAuthenticated,
  }
} 