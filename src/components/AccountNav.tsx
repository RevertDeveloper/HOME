import { useState } from "react"
import { ChevronDown, LogIn, LogOut, UserRound, UserRoundPlus } from "lucide-react"
import { useAccounts } from "../context/AccountsContext"
import { accountUrl } from "../lib/accounts"

const mobileMenuClass = "absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-slate-700/70 bg-slate-950/95 p-2 text-sm shadow-2xl shadow-slate-950/50 backdrop-blur-xl"
const menuLinkClass = "flex min-h-10 items-center gap-2 rounded-lg px-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"

export function AccountNav() {
  const { user, usage, loading, logout } = useAccounts()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) return <span className="h-9 w-20 animate-pulse rounded-md bg-slate-800" aria-label="Cargando cuenta" />

  return (
    <nav className="relative" aria-label=" ">
      <div className="hidden items-center gap-1 sm:flex">
        {!user ? (
          <>
            <a href={accountUrl("login")} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"><LogIn className="h-4 w-4" /><span className="hidden sm:inline">Acceder</span></a>
            <a href={accountUrl("register")} className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/30 px-2.5 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/10"><UserRoundPlus className="h-4 w-4" /><span className="hidden md:inline">Registrarse</span></a>
          </>
        ) : (
          <>
            {usage && <span className="hidden text-xs tabular-nums text-slate-400 lg:inline" title="Interacciones disponibles hoy">{usage.remaining_today}/{usage.daily_limit}</span>}
            <a href={accountUrl("account")} className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-cyan-300" title="Mi cuenta" aria-label="Mi cuenta"><UserRound className="h-4 w-4" /></a>
            <button type="button" onClick={() => void logout()} className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-rose-300" title="Cerrar sesión" aria-label="Cerrar sesión"><LogOut className="h-4 w-4" /></button>
          </>
        )}
      </div>

      <div className="sm:hidden">
        <button type="button" aria-expanded={mobileOpen} aria-controls="mobile-account-menu" onClick={() => setMobileOpen((open) => !open)} className="flex min-h-10 items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
          <UserRound className="h-4 w-4" aria-hidden="true" /><ChevronDown className={"h-3.5 w-3.5 text-cyan-400 transition-transform " + (mobileOpen ? "rotate-180" : "")} aria-hidden="true" />
        </button>
        {mobileOpen && <div id="mobile-account-menu" className={mobileMenuClass}>
          {!user ? (
            <>
              <a href={accountUrl("login")} className={menuLinkClass}><LogIn className="h-4 w-4 text-slate-500" />Acceder</a>
              <a href={accountUrl("register")} className={menuLinkClass}><UserRoundPlus className="h-4 w-4 text-cyan-400" />Registrarse</a>
            </>
          ) : (
            <>
              <a href={accountUrl("account")} className={menuLinkClass}><UserRound className="h-4 w-4 text-cyan-400" />Mi cuenta</a>
              <button type="button" onClick={() => { setMobileOpen(false); void logout() }} className={menuLinkClass + " w-full"}><LogOut className="h-4 w-4 text-rose-400" />Cerrar sesión</button>
            </>
          )}
        </div>}
      </div>
    </nav>
  )
}
