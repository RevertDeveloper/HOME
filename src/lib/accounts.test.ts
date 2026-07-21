import { afterEach, describe, expect, it, vi } from 'vitest'
import { accountUrl, loadAccount } from './accounts'

afterEach(() => vi.unstubAllGlobals())

describe('accounts client', () => {
  it('preserves the current page when opening login', () => {
    vi.stubGlobal('window', { location: { href: 'https://carlosrevert.es/#apps' } })

    expect(accountUrl('login')).toBe(
      'https://cuenta.carlosrevert.es/login/?next=https%3A%2F%2Fcarlosrevert.es%2F%23apps',
    )
  })

  it('loads public session and applications without requesting quota', async () => {
    vi.stubGlobal('window', { setTimeout, clearTimeout })
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ authenticated: false, user: null }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ slug: 'juridia' }]), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await loadAccount()

    expect(result.user).toBeNull()
    expect(result.usage).toBeNull()
    expect(result.applications).toEqual([{ slug: 'juridia' }])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
