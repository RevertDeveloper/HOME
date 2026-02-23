import { useEffect, useRef } from 'react'
import { Bot, Blocks, BriefcaseBusiness } from 'lucide-react'
import { Hero } from '../components/Hero.tsx'
import { ServiceBadge } from '../components/ServiceBadge.tsx'
import { AppCard } from '../components/AppCard.tsx'
import { getApps } from '../lib/api.ts'
import { usePortalStore } from '../store/usePortalStore.ts'
import { useAuth } from '../auth/AuthProvider.tsx'

export function HomePage() {
  const appCatalogRef = useRef<HTMLElement | null>(null)
  const apps = usePortalStore((state) => state.apps)
  const appsLoading = usePortalStore((state) => state.appsLoading)
  const appsError = usePortalStore((state) => state.appsError)
  const setApps = usePortalStore((state) => state.setApps)
  const setAppsLoading = usePortalStore((state) => state.setAppsLoading)
  const setAppsError = usePortalStore((state) => state.setAppsError)

  const { isAuthenticated, isLoading, userName, login, logout } = useAuth()

  useEffect(() => {
    let active = true

    setAppsLoading(true)
    setAppsError(null)

    void getApps()
      .then((response) => {
        if (!active) {
          return
        }

        setApps(response.apps)
      })
      .catch(() => {
        if (!active) {
          return
        }

        setAppsError('No fue posible cargar el catálogo de aplicaciones.')
      })
      .finally(() => {
        if (!active) {
          return
        }

        setAppsLoading(false)
      })

    return () => {
      active = false
    }
  }, [setApps, setAppsError, setAppsLoading])

  return (
    <main className="relative min-h-screen overflow-x-clip bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.16),transparent_40%)]" />

      <header className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10 lg:px-14">
        <p className="text-sm font-medium text-slate-300">home.tanian.net</p>
        <div className="flex items-center gap-3">
          {!isLoading && isAuthenticated && userName ? (
            <>
              <span className="text-sm text-slate-300">{userName}</span>
              <button
                type="button"
                onClick={logout}
                className="min-h-11 rounded-lg border border-slate-700 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              className="min-h-11 rounded-lg border border-cyan-400/40 px-4 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <Hero
        onExplore={() => {
          appCatalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />

      <section className="relative z-10 px-6 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold text-white">Services Showcase</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ServiceBadge
              icon={Bot}
              title="AI Engineering"
              description="Arquitectura de agentes, modelos de predicción y automatización inteligente para procesos críticos."
            />
            <ServiceBadge
              icon={Blocks}
              title="Blockchain Systems"
              description="Construcción y auditoría de soluciones sobre redes EVM para trazabilidad y confianza."
            />
            <ServiceBadge
              icon={BriefcaseBusiness}
              title="Enterprise Platforms"
              description="Software empresarial de alto rendimiento con foco en integraciones y operaciones seguras."
            />
          </div>
        </div>
      </section>

      <section ref={appCatalogRef} className="relative z-10 px-6 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold text-white">The App Catalog</h2>
          {appsLoading ? <p className="mt-6 text-slate-300">Loading apps…</p> : null}
          {appsError ? <p className="mt-6 text-rose-300">{appsError}</p> : null}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} isAuthenticated={isAuthenticated} onLogin={(url) => login(url)} />
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-800/80 px-6 py-8 text-sm text-slate-400 sm:px-10 lg:px-14">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <p>© 2026 Tanian. All rights reserved.</p>
          <nav className="flex items-center gap-4">
            <a href="mailto:contact@tanian.net" className="hover:text-slate-200">
              Contact
            </a>
            <a href="https://status.tanian.net" target="_blank" rel="noreferrer" className="hover:text-slate-200">
              Status
            </a>
          </nav>
        </div>
      </footer>
    </main>
  )
}
