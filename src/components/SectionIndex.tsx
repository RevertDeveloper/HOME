import { useEffect, useState } from 'react'
import { ChevronDown, List } from 'lucide-react'

const sections = [
  { id: 'inicio', label: 'Presentación' }, { id: 'perfil', label: 'Full Stack' }, { id: 'servicios', label: 'Capacidades' },
  { id: 'metodologia', label: 'Metodología' }, { id: 'tecnologias', label: 'Tecnologías' },
  { id: 'propuesta', label: 'A medida' }, { id: 'planes', label: 'Planes' }, { id: 'proyectos', label: 'Proyectos' },
] as const

export function SectionIndex({ mobileInHeader = false }: { mobileInHeader?: boolean }) {
  const [activeSection, setActiveSection] = useState('inicio')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    let frame = 0
    const updateActiveSection = () => {
      const scrollLimit = document.documentElement.scrollHeight - window.innerHeight
      if (window.scrollY >= scrollLimit - 24) {
        setActiveSection("proyectos")
        return
      }
      const readingLine = window.innerHeight * 0.32
      const current = sections.map(({ id }) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null)
        .filter((element) => element.getBoundingClientRect().top <= readingLine)
        .at(-1)
      setActiveSection(current?.id ?? "inicio")
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActiveSection)
    }
    updateActiveSection()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const navigateTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
    setIsMobileOpen(false)
  }

  return <nav aria-label="Índice de la página" className={mobileInHeader ? "static sm:hidden" : "fixed right-2 top-22 z-30 w-24 max-sm:hidden"}>
    <div className={mobileInHeader ? "hidden" : "block"}>
      <p className="px-3 pb-2 pt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">Índice</p>
      <ol className="space-y-0.5">{sections.map((section) => { const active = section.id === activeSection; return <li key={section.id}><button type="button" onClick={() => navigateTo(section.id)} aria-current={active ? 'true' : undefined} className={`group flex min-h-8 w-full items-center gap-2 rounded-lg px-3 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-300 ${active ? 'font-bold text-cyan-300' : 'font-medium text-slate-500 hover:bg-slate-800/60 hover:text-slate-200'}`}><span className={`h-1 w-1 shrink-0 rounded-full ${active ? 'bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]' : 'bg-slate-700 group-hover:bg-slate-400'}`} aria-hidden="true" />{section.label}</button></li> })}</ol>
    </div>
    <div className={mobileInHeader ? "relative block sm:hidden" : "hidden"}><button type="button" aria-expanded={isMobileOpen} aria-controls="mobile-section-index" onClick={() => setIsMobileOpen((open) => !open)} className="flex min-h-10 items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/85 px-3 text-xs font-semibold text-slate-200 shadow-xl shadow-slate-950/30 backdrop-blur-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"><List className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />Índice<ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${isMobileOpen ? 'rotate-180' : ''}`} aria-hidden="true" /></button>{isMobileOpen && <ol id="mobile-section-index" className="absolute left-1/2 top-full z-40 mt-2 w-48 -translate-x-1/2 text-center space-y-0.5 rounded-2xl border border-slate-700/60 bg-slate-950/95 p-2 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">{sections.map((section) => { const active = section.id === activeSection; return <li key={section.id}><button type="button" onClick={() => navigateTo(section.id)} aria-current={active ? 'true' : undefined} className={`flex min-h-9 w-full items-center rounded-lg px-3 text-left text-xs focus-visible:outline-2 focus-visible:outline-cyan-300 ${active ? 'font-bold text-cyan-300' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'}`}>{section.label}</button></li> })}</ol>}</div>
  </nav>
}
