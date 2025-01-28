import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import type { CreateNoteInput, UpdateNoteInput } from '@/lib/types/note';

export function useNotes() {
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useAuth();

  // Query for fetching all notes
  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      if (!isAuthenticated() || !token) throw new Error('Authentication required');
      return noteApi.list(token);
    },
    enabled: isAuthenticated(),
  });

  // Mutation for creating a note
  const createNoteMutation = useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      if (!isAuthenticated() || !token) throw new Error('Authentication required');
      return noteApi.create(input, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create note');
      console.error('Create note error:', error);
    },
  });

  // Mutation for updating a note
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateNoteInput }) => {
      if (!isAuthenticated() || !token) throw new Error('Authentication required');
      return noteApi.update(id, input, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update note');
      console.error('Update note error:', error);
    },
  });

  // Mutation for deleting a note
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isAuthenticated() || !token) throw new Error('Authentication required');
      return noteApi.delete(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete note');
      console.error('Delete note error:', error);
    },
  });

  return {
    notes: notesQuery.data ?? [],
    isLoading: notesQuery.isLoading,
    error: notesQuery.error,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
  };
} 