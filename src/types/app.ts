export type AppCategory = 'ai' | 'blockchain' | 'enterprise'
export type AppStatus = 'online' | 'offline'

export interface AppItem {
  id: string
  name: string
  short_description?: string
  description: string
  tech: string[]
  url: string
  category: AppCategory
  image_url?: string
  status: AppStatus
}

export interface AppsResponse {
  apps: AppItem[]
  generated_at: string
}
