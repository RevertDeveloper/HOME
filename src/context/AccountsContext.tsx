import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadAccount, logoutAccount, type AccountApplication, type AccountUser, type UsageSummary } from '../lib/accounts'

type AccountsState = {
  user: AccountUser | null
  usage: UsageSummary | null
  applications: AccountApplication[]
  loading: boolean
  logout: () => Promise<void>
}

const AccountsContext = createContext<AccountsState | null>(null)

export function AccountsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountUser | null>(null)
  const [usage, setUsage] = useState<UsageSummary | null>(null)
  const [applications, setApplications] = useState<AccountApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    void loadAccount()
      .then((data) => {
        if (!active) return
        setUser(data.user)
        setUsage(data.usage)
        setApplications(data.applications)
      })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const value = useMemo(() => ({
    user, usage, applications, loading,
    logout: async () => {
      await logoutAccount()
      setUser(null)
      setUsage(null)
    },
  }), [applications, loading, usage, user])

  return <AccountsContext.Provider value={value}>{children}</AccountsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAccounts() {
  const context = useContext(AccountsContext)
  if (!context) throw new Error('useAccounts requiere AccountsProvider')
  return context
}
