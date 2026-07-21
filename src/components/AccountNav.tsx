import { LogIn, LogOut, UserRound, UserRoundPlus } from 'lucide-react'
import { useAccounts } from '../context/AccountsContext'
import { accountUrl } from '../lib/accounts'

export function AccountNav() {
  const { user, usage, loading, logout } = useAccounts()

  if (loading) return <span className="h-9 w-20 animate-pulse rounded-md bg-slate-800" aria-label="Cargando cuenta" />

  if (!user) {
    return (
      <nav className="flex items-center gap-1" aria-label="Cuenta">
        <a href={accountUrl('login')} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"><LogIn className="h-4 w-4" /><span className="hidden sm:inline">Acceder</span></a>
        <a href={accountUrl('register')} className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/30 px-2.5 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/10"><UserRoundPlus className="h-4 w-4" /><span className="hidden md:inline">Registrarse</span></a>
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-1" aria-label="Cuenta">
      {usage && <span className="hidden lg:inline text-xs tabular-nums text-slate-400" title="Interacciones disponibles hoy">{usage.remaining_today}/{usage.daily_limit}</span>}
      <a href={accountUrl('account')} className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-cyan-300" title="Mi cuenta" aria-label="Mi cuenta"><UserRound className="h-4 w-4" /></a>
      <button onClick={() => void logout()} className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-rose-300" title="Cerrar sesión" aria-label="Cerrar sesión"><LogOut className="h-4 w-4" /></button>
    </nav>
  )
}
