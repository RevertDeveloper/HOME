export const ACCOUNTS_ORIGIN = import.meta.env.VITE_ACCOUNTS_ORIGIN || 'https://cuenta.carlosrevert.es'
const API = `${ACCOUNTS_ORIGIN}/api/v1`

export type AccountUser = { id: number; username: string; email: string; first_name: string; last_name: string; plan: string | null }
export type UsageSummary = { plan: string; daily_limit: number; used_today: number; remaining_today: number; resets_at: string }
export type AccountApplication = { name: string; slug: string; base_url: string; consumes_quota: boolean }

function readCookie(name: string) {
  const prefix = `${name}=`
  const value = document.cookie.split('; ').find((item) => item.startsWith(prefix))
  return value ? decodeURIComponent(value.slice(prefix.length)) : ''
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(`${API}${path}`, {
      ...init,
      credentials: 'include',
      signal: controller.signal,
      headers: { Accept: 'application/json', ...init.headers },
    })
    if (!response.ok) throw new Error(`Accounts HTTP ${response.status}`)
    return (response.status === 204 ? undefined : await response.json()) as T
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function loadAccount() {
  const [me, applications] = await Promise.all([
    request<{ authenticated: boolean; user: AccountUser | null }>('/auth/me/'),
    request<AccountApplication[]>('/applications/'),
  ])
  const usage = me.authenticated ? await request<UsageSummary>('/usage/summary/') : null
  return { user: me.authenticated ? me.user : null, usage, applications }
}

export async function logoutAccount() {
  await request('/auth/csrf/')
  await request<void>('/auth/logout/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': readCookie('csrftoken') },
  })
}

export function accountUrl(path: 'login' | 'register' | 'account') {
  const url = new URL(`/${path}/`, ACCOUNTS_ORIGIN)
  if (path !== 'account') url.searchParams.set('next', window.location.href)
  return url.toString()
}
