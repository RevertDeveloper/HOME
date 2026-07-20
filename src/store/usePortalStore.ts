import { create } from 'zustand'
import type { AppItem } from '../types/app.ts'

interface PortalState {
  apps: AppItem[]
  appsLoading: boolean
  appsError: string | null
  setAppsLoading: (appsLoading: boolean) => void
  setApps: (apps: AppItem[]) => void
  setAppsError: (appsError: string | null) => void
}

export const usePortalStore = create<PortalState>((set) => ({
  apps: [],
  appsLoading: false,
  appsError: null,
  setAppsLoading: (appsLoading) => set({ appsLoading }),
  setApps: (apps) => set({ apps, appsError: null }),
  setAppsError: (appsError) => set({ appsError }),
}))
