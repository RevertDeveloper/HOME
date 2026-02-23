import type { AppsResponse } from '../types/app.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

export async function getApps(): Promise<AppsResponse> {
  return apiFetch<AppsResponse>('/api/apps')
}
