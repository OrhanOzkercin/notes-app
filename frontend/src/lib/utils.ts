import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getHeaderType(pathname: string): 'auth' | 'dashboard' | 'none' {
  if (pathname.startsWith('/auth')) {
    return 'auth'
  }
  if (pathname.startsWith('/dashboard')) {
    return 'dashboard'
  }
  return 'none'
}
