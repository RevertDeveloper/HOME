import { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { initKeycloak, getKeycloak } from './keycloak.ts'
import { usePortalStore } from '../store/usePortalStore.ts'

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  userName: string | null
  login: (redirectUri?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = usePortalStore((state) => state.auth)
  const setAuth = usePortalStore((state) => state.setAuth)

  useEffect(() => {
    let isMounted = true

    void initKeycloak()
      .then(async ({ instance, isAuthenticated }) => {
        if (!isMounted) {
          return
        }

        if (isAuthenticated) {
          try {
            await instance.loadUserProfile()
          } catch {
            // Keep authenticated state even if profile endpoint is unavailable
          }
        }

        setAuth({
          initialized: true,
          isAuthenticated,
          token: instance.token ?? null,
          userName: instance.profile?.username ?? null,
        })

        instance.onAuthSuccess = () => {
          setAuth({
            initialized: true,
            isAuthenticated: true,
            token: instance.token ?? null,
            userName: instance.profile?.username ?? null,
          })
        }

        instance.onAuthLogout = () => {
          setAuth({
            initialized: true,
            isAuthenticated: false,
            token: null,
            userName: null,
          })
        }

        instance.onTokenExpired = () => {
          void instance.updateToken(30).catch(() => {
            setAuth({
              initialized: true,
              isAuthenticated: false,
              token: null,
              userName: null,
            })
          })
        }
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setAuth({
          initialized: true,
          isAuthenticated: false,
          token: null,
          userName: null,
        })
      })

    return () => {
      isMounted = false
    }
  }, [setAuth])

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: auth.isAuthenticated,
      isLoading: !auth.initialized,
      userName: auth.userName,
      login: (redirectUri) => {
        void getKeycloak().login({ redirectUri: redirectUri ?? window.location.href })
      },
      logout: () => {
        void getKeycloak().logout({ redirectUri: 'https://home.tanian.net' })
      },
    }),
    [auth.initialized, auth.isAuthenticated, auth.userName],
  )

  return <AuthContext value={contextValue}>{children}</AuthContext>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
