import { useMutation, useQueryClient } from '@tanstack/react-query'
import { noteApi } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { CreateNoteInput } from '@/lib/types/note'

export function useCreateNote() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { token, isAuthenticated } = useAuth()

  return useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      if (!isAuthenticated() || !token) throw new Error('Authentication required')
      return noteApi.create(input, token)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      toast.success('Note created successfully')
      router.push(`/notes/${data.id}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create note')
      console.error('Failed to create note:', error)
    },
  })
} 