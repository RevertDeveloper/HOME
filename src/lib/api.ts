import { fallbackApps } from '../data/fallbackApps.ts'
import type { AppCategory, AppItem, AppsResponse, AppStatus } from '../types/app.ts'

const CANONICAL_API_BASE_URL = 'https://carlosrevert.es'
const JSON_HEADERS = {
  Accept: 'application/json',
} as const

const LEGACY_CLARK_APP_ID = 'nc-elevacion'

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '')
}

function getApiBaseCandidates(): string[] {
  const candidates = new Set<string>()
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (configuredBaseUrl) {
    candidates.add(normalizeBaseUrl(configuredBaseUrl))
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    candidates.add(normalizeBaseUrl(window.location.origin))

    if (window.location.hostname !== 'carlosrevert.es') {
      candidates.add(CANONICAL_API_BASE_URL)
    }
  }

  if (candidates.size === 0) {
    candidates.add('')
  }

  return [...candidates]
}

function isAppCategory(value: unknown): value is AppCategory {
  return value === 'ai' || value === 'blockchain' || value === 'enterprise'
}

function isAppStatus(value: unknown): value is AppStatus {
  return value === 'online' || value === 'offline'
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false
  }

  try {
    const { protocol } = new URL(value)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

function isAppItem(value: unknown): value is AppItem {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string'
    && typeof candidate.name === 'string'
    && (candidate.short_description === undefined || typeof candidate.short_description === 'string')
    && typeof candidate.description === 'string'
    && isStringArray(candidate.tech)
    && isHttpUrl(candidate.url)
    && isAppCategory(candidate.category)
    && (candidate.image_url === undefined || typeof candidate.image_url === 'string')
    && isAppStatus(candidate.status)
  )
}

function isAppsResponse(value: unknown): value is AppsResponse {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return Array.isArray(candidate.apps)
    && candidate.apps.every((app) => isAppItem(app))
    && typeof candidate.generated_at === 'string'
}

async function apiFetch<T>(baseUrl: string, path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: JSON_HEADERS,
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

function normalizeLegacyApps(response: AppsResponse): AppsResponse {
  const clarkApp = fallbackApps.find((app) => app.id === 'clark')

  if (!clarkApp) {
    return response
  }

  return {
    ...response,
    apps: response.apps.map((app) => (
      app.id === LEGACY_CLARK_APP_ID ? clarkApp : app
    )),
  }
}

function buildFallbackResponse(): AppsResponse {
  return {
    apps: fallbackApps,
    generated_at: new Date().toISOString(),
  }
}

export async function getApps(): Promise<AppsResponse> {
  const errors: Error[] = []

  for (const baseUrl of getApiBaseCandidates()) {
    try {
      const response = await apiFetch<unknown>(baseUrl, '/api/apps')

      if (!isAppsResponse(response)) {
        throw new Error(`Invalid apps response from ${baseUrl || 'current origin'}`)
      }

      return normalizeLegacyApps(response)
    } catch (error) {
      errors.push(error instanceof Error ? error : new Error('Unknown apps request error'))
    }
  }

  console.warn('Falling back to local app catalog.', errors)

  return buildFallbackResponse()
}
