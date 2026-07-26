import { useEffect, useRef } from 'react'
import {
  Blocks, Server, Database, Brain, Workflow, Layers, ArrowRight,
  BrainCircuit, Network, CodeXml, MonitorSmartphone, GitBranch, PhoneCall, BotMessageSquare,
  CircleGauge, Crown,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Hero } from '../components/Hero.tsx'
import { ServiceBadge } from '../components/ServiceBadge.tsx'
import { AppCard } from '../components/AppCard.tsx'
import { getApps } from '../lib/api.ts'
import { usePortalStore } from '../store/usePortalStore.ts'
import { AccountNav } from '../components/AccountNav.tsx'
import { AppSwitcher } from '../components/AppSwitcher.tsx'
import { SectionIndex } from '../components/SectionIndex.tsx'

/* ------------------------------------------------------------------ */
/*  Methodology steps for the process section                          */
/* ------------------------------------------------------------------ */
const methodologySteps = [
  {
    number: '01',
    title: 'Entender el problema',
    description: 'Aclaro requisitos, usuarios, restricciones y objetivos antes de decidir qué merece construirse.',
  },
  {
    number: '02',
    title: 'Diseñar la solución',
    description: 'Defino la arquitectura, el modelo de datos y las decisiones proporcionales a las restricciones reales.',
  },
  {
    number: '03',
    title: 'Construir e integrar',
    description: 'Construyo frontend, backend, IA, procesos asíncronos e integraciones como partes de un mismo producto.',
  },
  {
    number: '04',
    title: 'Operar y evolucionar',
    description: 'Despliego, observo y mejoro el sistema para mantenerlo útil, estable y preparado para crecer.',
  },
]

/* ------------------------------------------------------------------ */
/*  Technology capabilities for the tech section                       */
/* ------------------------------------------------------------------ */
const techCapabilities = [
  {
    icon: Brain,
    title: 'IA aplicada, RAG y agentes',
    items: ['Modelos locales y proveedores cloud', 'RAG y recuperación trazable', 'Agentes, herramientas y MCPs', 'Speech-to-Text y Text-to-Speech', 'OCR y procesamiento documental'],
    gradient: 'from-cyan-500/10 to-blue-500/5',
  },
  {
    icon: Database,
    title: 'Producto Full Stack',
    items: ['Interfaces responsive y accesibles', 'React, Next.js y TypeScript', 'Python, FastAPI y APIs REST', 'Arquitecturas modulares', 'Procesos asíncronos'],
    gradient: 'from-violet-500/10 to-purple-500/5',
  },
  {
    icon: Workflow,
    title: 'Datos, búsqueda y contexto',
    items: ['Ingesta, limpieza y chunking', 'Embeddings y recuperación semántica', 'PostgreSQL, MySQL y SQLite', 'Qdrant y pgvector', 'Respuestas trazables a sus fuentes'],
    gradient: 'from-emerald-500/10 to-green-500/5',
  },
  {
    icon: Server,
    title: 'Infraestructura y operaciones',
    items: ['Docker y Docker Compose', 'Linux y Proxmox', 'Despliegues cloud o self-hosted', 'VPN, DNS, dominios y proxys', 'Automatización con n8n y APIs'],
    gradient: 'from-amber-500/10 to-orange-500/5',
  },
]

export function HomePage() {
  const appCatalogRef = useRef<HTMLElement | null>(null)
  const apps = usePortalStore((state) => state.apps)
  const appsLoading = usePortalStore((state) => state.appsLoading)
  const appsError = usePortalStore((state) => state.appsError)
  const setApps = usePortalStore((state) => state.setApps)
  const setAppsLoading = usePortalStore((state) => state.setAppsLoading)
  const setAppsError = usePortalStore((state) => state.setAppsError)

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
      <SectionIndex />
      {/* Ambient background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.12),transparent_50%),radial-gradient(ellipse_at_80%_20%,rgba(139,92,246,0.1),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(6,182,212,0.06),transparent_50%)]" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/80 px-3 py-4 backdrop-blur-xl sm:relative sm:z-10 sm:border-b-0 sm:bg-transparent sm:px-10 sm:py-6 sm:backdrop-blur-none lg:px-14">
        <div className="flex min-w-0 items-center gap-1">
          <AppSwitcher />
          <p className="text-sm font-semibold tracking-wide whitespace-nowrap text-slate-200">Carlos Revert</p>
        </div>

        {/* Central Badge */}
        <div className="pointer-events-none absolute inset-x-0 top-2 flex items-center justify-center pt-6 sm:pt-6">
          <div className="pointer-events-auto hidden items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-[10px] font-medium tracking-wider uppercase text-cyan-300 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 status-online" />
            Full Stack · IA aplicada · Modelos locales · Self-hosted
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 status-online" />
          </div>
        </div>

        <div className="-mr-1 flex items-center gap-1">
          <SectionIndex mobileInHeader />
          <AccountNav />
        </div>

      </header>

      {/* ── Hero ── */}
      <Hero
        onExplore={() => {
          appCatalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />

      {/* ── Section Divider ── */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ── Perfil profesional ── */}
      <section id="perfil" className="relative z-10 scroll-mt-24 px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Arquitectura de software e Inteligecia Artificial</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Una visión global del ciclo de vida del producto
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Trabajo sobre el ciclo completo: requisitos, arquitectura, datos, backend asíncrono, frontend, IA y despliegue.
              Esto me permite entender un producto como un sistema y no como una suma de piezas. Elijo entre <strong className="text-slate-200">servicios cloud,
                modelos locales e infraestructura </strong>propia según la privacidad, el coste, la latencia, la escala y el mantenimiento que exige cada caso.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Servicios ── */}
      <section id="servicios" className="relative z-10 scroll-mt-24 px-6 py-16 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Capacidades técnicas</span>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Áreas de dominio técnico</h2>
          </motion.div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ServiceBadge
              icon={BrainCircuit}
              title="IA aplicada, RAG y agentes"
              description="Construyo asistentes conectados a conocimiento real, con recuperación trazable, herramientas y flujos agénticos."
              gradient="from-cyan-500/10 to-blue-500/5"
            />
            <ServiceBadge
              icon={Network}
              title="Arquitectura y evolución"
              description="Diseño sistemas modulares y mantenibles, proporcionales a las restricciones reales de usuarios, datos y operación."
              gradient="from-violet-500/10 to-purple-500/5"
            />
            <ServiceBadge
              icon={CodeXml}
              title="Desarrollo Full Stack y APIs"
              description="Construyo interfaces, APIs, bases de datos, procesos asíncronos e integraciones como partes de un mismo producto."
              gradient="from-amber-500/10 to-orange-500/5"
            />
            <ServiceBadge
              icon={Server}
              title="Infraestructura"
              description="Despliego en cloud, entornos híbridos o infraestructura privada con Docker, observabilidad y control sobre el dato."
              gradient="from-emerald-500/10 to-green-500/5"
            />
            <ServiceBadge
              icon={MonitorSmartphone}
              title="Frontend y diseño UI/UX"
              description="Hago accesible la complejidad con interfaces responsive, claras y orientadas a las tareas que el usuario necesita completar."
              gradient="from-pink-500/10 to-rose-500/5"
            />
            <ServiceBadge
              icon={GitBranch}
              title="Automatización e integraciones"
              description="Conecto APIs, MCPs agentes y flujos para convertir información dispersa en procesos fiables y reducir tareas repetitivas."
              gradient="from-sky-500/10 to-blue-500/5"
            />
            <ServiceBadge
              icon={PhoneCall}
              title="Voz y asistentes conectados"
              description="Diseño flujos de voz, llamadas y WhatsApp conectados a la información de la empresa, sus bases de datos y las herramientas necesarias."
              gradient="from-rose-500/10 to-pink-500/5"
            />
            <ServiceBadge
              icon={BotMessageSquare}
              title="Agentes autónomos"
              description="Configuro agentes, tareas programadas, herramientas y gateways para automatizar rutinas y operar información de forma controlada."
              gradient="from-indigo-500/10 to-violet-500/5"
            />
            <ServiceBadge
              icon={Blocks}
              title="Blockchain y Web3"
              description="Experiencia desde 2018 en ecosistemas EVM, contratos inteligentes, seguridad y análisis de operaciones entre redes, exchanges y plataformas descentralizadas."
              gradient="from-amber-500/10 to-orange-500/5"
            />
          </div>
        </div>
      </section>

      {/* ── Section Divider ── */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ── Metodología ── */}
      <section id="metodologia" className="relative z-10 scroll-mt-24 px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Metodología</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Cómo trabajo</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Un proceso claro para avanzar desde un problema bien entendido hasta un producto preparado para evolucionar.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {methodologySteps.map((step, index) => (
              <motion.div
                key={step.number}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 24 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 backdrop-blur transition-all duration-300 hover:border-slate-700/80"
              >
                <span className="text-3xl font-extrabold text-gradient-cyan">{step.number}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
                {index < methodologySteps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-cyan-500/30 lg:block" aria-hidden="true" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section Divider ── */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ── Tecnologías ── */}
      <section id="tecnologias" className="relative z-10 scroll-mt-24 px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Tecnología</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Tecnología al servicio del producto</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Elijo cada herramienta por su encaje con el problema, no por tendencia: calidad, mantenimiento, privacidad, coste y escala marcan la decisión.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {techCapabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 24 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 backdrop-blur transition-all duration-300 hover:border-slate-700/80"
              >
                <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${cap.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/80">
                      <cap.icon className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{cap.title}</h3>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {cap.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-cyan-500/60" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section Divider ── */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ── Propuesta de valor (servidor local) ── */}
      <section id="propuesta" className="relative z-10 scroll-mt-24 px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-3xl border border-cyan-500/15 bg-linear-to-br from-cyan-500/5 via-slate-900/60 to-violet-500/5 p-8 backdrop-blur sm:p-12"
          >
            <div className="mx-auto max-w-3xl text-center">
              <Server className="mx-auto h-10 w-10 text-cyan-400" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
                Tu servidor. Tus datos. Tu control.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
                No todos los productos necesitan la misma infraestructura. Diseño soluciones <strong className="text-slate-200">cloud,
                  híbridas o completamente locales</strong> según la sensibilidad del dato, la latencia, el coste operativo y el nivel de control que requiere cada caso.
                He operado modelos locales de hasta <strong className="text-slate-200">120B parámetros</strong> en servidores propios y flujos agénticos.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
                La arquitectura queda preparada para <strong className="text-slate-200">evolucionar sin empezar de cero</strong>:
                incorporar herramientas, automatizar procesos, ampliar capacidad o sustituir modelos y proveedores aprovechando lo que ya funciona.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section Divider ── */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ── Planes de uso ── */}
      <section id="planes" className="relative z-10 scroll-mt-24 px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Entorno interactivo de prueba</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Prueba las aplicaciones con datos y modelos reales</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Puedes explorar las aplicaciones libremente. El saldo diario limita las operaciones de IA para proteger la infraestructura compartida.
            </p>
          </div>

          <div className="mt-12 grid border-y border-slate-800/70 sm:grid-cols-2 sm:divide-x sm:divide-slate-800/70">
            <div className="px-4 py-8 sm:px-10">
              <CircleGauge className="h-7 w-7 text-cyan-400" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-white">Acceso de demostración</h3>
              <p className="mt-2 text-3xl font-bold text-white">5 <span className="text-base font-normal text-slate-400">interacciones diarias</span></p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">5 interacciones diarias compartidas entre Juridia, CLARK y Transcriptor.</p>
            </div>
            <div className="px-4 py-8 sm:px-10">
              <Crown className="h-7 w-7 text-amber-400" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-white">Acceso de prueba ampliado</h3>
              <p className="mt-2 text-3xl font-bold text-white">20 <span className="text-base font-normal text-slate-400">interacciones diarias</span></p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">20 interacciones diarias. Durante esta fase, se asigna manualmente desde la administración.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section Divider ── */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ── Catálogo de Apps ── */}
      <section id="proyectos" ref={appCatalogRef} className="relative z-10 scroll-mt-24 px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Proyectos</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Proyectos que conectan producto y tecnología</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Estos productos muestran cómo combino desarrollo, IA, datos e infraestructura para resolver problemas concretos y llevar una idea hasta una experiencia funcional.
            </p>
          </motion.div>

          {appsLoading ? (
            <div className="mt-12 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-3xl shimmer" />
              ))}
            </div>
          ) : null}

          {appsError ? (
            <div className="mt-12 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
              <p className="text-rose-300">{appsError}</p>
            </div>
          ) : null}

          <div className="mt-12 space-y-8">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-800/60 px-6 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-cyan-400">
              <Layers className="h-3.5 w-3.5 text-slate-950" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Carlos Revert</span>
            <span className="text-sm text-slate-500">© 2026</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
            <a href="mailto:revert.developer@gmail.com" className="transition hover:text-slate-200">
              Contacto
            </a>
            <a href="https://github.com/RevertDeveloper" target="_blank" rel="noreferrer" className="transition hover:text-slate-200">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/carlos-revert/" target="_blank" rel="noreferrer" className="transition hover:text-slate-200">
              LinkedIn
            </a>
            <a href="https://cuenta.carlosrevert.es/privacy/" className="transition hover:text-slate-200">
              Privacidad
            </a>
            <a href="https://cuenta.carlosrevert.es/terms/" className="transition hover:text-slate-200">
              Términos
            </a>
          </nav>
        </div>
      </footer>
    </main>
  )
}
