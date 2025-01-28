import type { ErrorResponse, SuccessResponse } from './types/api';
import type { Note, CreateNoteInput, UpdateNoteInput } from './types/note';
import { APIException } from './types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
console.log("API_URL:", API_URL)

interface LoginResponse {
  token: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    // If it's a JSON error response, throw our custom APIException
    if (isJson && 'errors' in data) {
      throw new APIException(data as ErrorResponse, response.status);
    }
    // For non-JSON errors or unexpected formats, throw a generic error
    throw new Error(data?.message || response.statusText);
  }

  // For successful responses, return the data field
  return (data as SuccessResponse<T>).data;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return handleResponse<LoginResponse>(response);
  },

  register: async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return handleResponse<void>(response);
  },
};

export const noteApi = {
  create: async (input: CreateNoteInput, token: string): Promise<Note> => {
    const url = new URL(`${API_URL}/notes`);
    console.log("create: -> url:", url)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    return handleResponse<Note>(response);
  },

  list: async (token: string): Promise<Note[]> => {
    const response = await fetch(`${API_URL}/notes`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    return handleResponse<Note[]>(response);
  },

  get: async (id: string, token: string): Promise<Note> => {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    return handleResponse<Note>(response);
  },

  update: async (id: string, input: UpdateNoteInput, token: string): Promise<Note> => {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    return handleResponse<Note>(response);
  },

  delete: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    return handleResponse<void>(response);
  },
};
