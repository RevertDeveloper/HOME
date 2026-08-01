import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ExternalLink, Layers } from 'lucide-react'

const apps = [
  { name: 'Juridia', url: 'https://juridia.carlosrevert.es/' },
  { name: 'CLARK', url: 'https://clark.carlosrevert.es/' },
  { name: 'Transcriptor', url: 'https://transcriptor.carlosrevert.es/' },
]

export function AppSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={switcherRef} className="relative">
      <button type="button" aria-expanded={isOpen} aria-controls="app-switcher-menu" aria-label="Abrir aplicaciones" onClick={() => setIsOpen((open) => !open)} className="group flex items-center gap-2 rounded-xl p-1.5 pr-2.5 transition hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.18)] transition group-hover:shadow-[0_0_24px_rgba(6,182,212,0.34)]">
          <Layers className="h-4 w-4 text-slate-950" aria-hidden="true" />
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-300' : ''}`} aria-hidden="true" />
      </button>
      {isOpen && <div id="app-switcher-menu" role="menu" aria-label="Aplicaciones de Carlos Revert" className="absolute left-0 top-full z-30 mt-2 min-w-56 origin-top-left rounded-xl border border-slate-700/70 bg-slate-900/95 p-1.5 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
        <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Aplicaciones</p>
        {apps.map((app) => <a key={app.name} href={app.url} role="menuitem" className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-200 focus-visible:bg-cyan-500/10 focus-visible:outline-none">{app.name}<ExternalLink className="h-3.5 w-3.5 text-slate-600 transition group-hover:text-cyan-400" aria-hidden="true" /></a>)}
      </div>}
    </div>
  )
}
