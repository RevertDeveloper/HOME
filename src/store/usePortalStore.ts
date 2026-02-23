import { create } from 'zustand'
import type { AppItem } from '../types/app.ts'

interface AuthState {
  initialized: boolean
  isAuthenticated: boolean
  token: string | null
  userName: string | null
}

interface PortalState {
  apps: AppItem[]
  appsLoading: boolean
  appsError: string | null
  auth: AuthState
  setAppsLoading: (appsLoading: boolean) => void
  setApps: (apps: AppItem[]) => void
  setAppsError: (appsError: string | null) => void
  setAuth: (auth: AuthState) => void
}

export const usePortalStore = create<PortalState>((set) => ({
  apps: [],
  appsLoading: false,
  appsError: null,
  auth: {
    initialized: false,
    isAuthenticated: false,
    token: null,
    userName: null,
  },
  setAppsLoading: (appsLoading) => set({ appsLoading }),
  setApps: (apps) => set({ apps, appsError: null }),
  setAppsError: (appsError) => set({ appsError }),
  setAuth: (auth) => set({ auth }),
}))
