import { useEffect, useRef } from 'react'
import {
  Bot, Blocks, BriefcaseBusiness, Server, Phone,
  ShieldCheck, Database, Brain, Workflow, Layers, ArrowRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Hero } from '../components/Hero.tsx'
import { ServiceBadge } from '../components/ServiceBadge.tsx'
import { AppCard } from '../components/AppCard.tsx'
import { getApps } from '../lib/api.ts'
import { usePortalStore } from '../store/usePortalStore.ts'
import { useAuth } from '../auth/AuthProvider.tsx'

/* ------------------------------------------------------------------ */
/*  Methodology steps for the process section                          */
/* ------------------------------------------------------------------ */
const methodologySteps = [
  {
    number: '01',
    title: 'Análisis',
    description: 'Entiendo el producto, sus usuarios y sus procesos para detectar fricción, límites técnicos y oportunidades con impacto real.',
  },
  {
    number: '02',
    title: 'Diseño',
    description: 'Defino una solución viable, una arquitectura mantenible y el camino más corto entre la necesidad y el resultado.',
  },
  {
    number: '03',
    title: 'Implementación',
    description: 'Construyo frontend, backend, datos e integraciones de IA como partes de un mismo producto, listo para desplegar.',
  },
  {
    number: '04',
    title: 'Escalado',
    description: 'Mido, optimizo y amplío el sistema para incorporar más usuarios, automatizaciones y nuevas necesidades.',
  },
]

/* ------------------------------------------------------------------ */
/*  Technology capabilities for the tech section                       */
/* ------------------------------------------------------------------ */
const techCapabilities = [
  {
    icon: Brain,
    title: 'IA aplicada y RAG',
    items: ['LLM locales y proveedores cloud', 'RAG y recuperación semántica', 'Speech-to-Text y Text-to-Speech', 'Agentes y herramientas', 'OCR y procesamiento documental'],
    gradient: 'from-cyan-500/10 to-blue-500/5',
  },
  {
    icon: Database,
    title: 'Producto Full Stack',
    items: ['React, Next.js y TypeScript', 'Python, FastAPI y APIs REST', 'Interfaces responsive y accesibles', 'Arquitecturas modulares', 'Procesos asíncronos'],
    gradient: 'from-violet-500/10 to-purple-500/5',
  },
  {
    icon: Workflow,
    title: 'Datos y contexto',
    items: ['PostgreSQL, MySQL y SQLite', 'Qdrant y pgvector', 'Ingesta, limpieza y chunking', 'Embeddings y búsqueda híbrida', 'Respuestas trazables a sus fuentes'],
    gradient: 'from-emerald-500/10 to-green-500/5',
  },
  {
    icon: Server,
    title: 'Infraestructura y operaciones',
    items: ['Docker y Docker Compose', 'Linux y Proxmox', 'Despliegues cloud o self-hosted', 'TLS, dominios y proxy inverso', 'Automatización con n8n y APIs'],
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
      {/* Ambient background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.12),transparent_50%),radial-gradient(ellipse_at_80%_20%,rgba(139,92,246,0.1),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(6,182,212,0.06),transparent_50%)]" />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10 lg:px-14">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-cyan-400">
            <Layers className="h-4 w-4 text-slate-950" />
          </div>
          <p className="text-sm font-semibold tracking-wide text-slate-200">Carlos Revert</p>
        </div>

        {/* Central Badge */}
        <div className="pointer-events-none absolute inset-x-0 top-2 flex items-center justify-center pt-6 sm:pt-6">
          <div className="pointer-events-auto hidden items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-[10px] font-medium tracking-wider uppercase text-cyan-300 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 status-online" />
            Full Stack · IA aplicada · RAG · Infraestructura
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 status-online" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-11 w-24 rounded-lg shimmer" />
          ) : isAuthenticated && userName ? (
            <>
              <span className="hidden text-sm text-slate-400 sm:inline">{userName}</span>
              <button
                type="button"
                onClick={logout}
                className="min-h-11 rounded-xl border border-slate-700/80 px-4 text-sm font-medium text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-800/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              className="min-h-11 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-5 text-sm font-medium text-cyan-300 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Iniciar sesión
            </button>
          )}
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
      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Perfil profesional</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Una visión completa para mejorar tu producto
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Trabajo sobre el ciclo completo: análisis, arquitectura, frontend, backend, datos, IA y despliegue.
              Esto me permite entender un producto como un sistema y no como una suma de piezas. Puedo incorporarme para
              resolver un reto concreto o acompañar su evolución de extremo a extremo, eligiendo entre <strong className="text-slate-200">servicios cloud,
                modelos locales e infraestructura propia</strong> según la privacidad, el coste, la latencia y la escala que realmente necesita.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Servicios ── */}
      <section className="relative z-10 px-6 py-16 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Servicios</span>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Áreas de especialización</h2>
          </motion.div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ServiceBadge
              icon={Bot}
              title="IA aplicada y sistemas RAG"
              description="Convierto modelos, documentos y datos en asistentes útiles, trazables y conectados con el conocimiento real del negocio."
              gradient="from-cyan-500/10 to-blue-500/5"
            />
            <ServiceBadge
              icon={Blocks}
              title="Arquitectura y escalabilidad"
              description="Diseño sistemas modulares que pueden crecer en usuarios, datos y funcionalidades sin hipotecar el producto."
              gradient="from-violet-500/10 to-purple-500/5"
            />
            <ServiceBadge
              icon={BriefcaseBusiness}
              title="Desarrollo Full Stack"
              description="Construyo productos completos: interfaces, APIs, bases de datos, procesos asíncronos e integraciones externas."
              gradient="from-amber-500/10 to-orange-500/5"
            />
            <ServiceBadge
              icon={Server}
              title="Cloud y self-hosted"
              description="Despliego en la nube o en infraestructura privada, con Docker, observabilidad y control sobre aplicaciones y datos."
              gradient="from-emerald-500/10 to-green-500/5"
            />
            <ServiceBadge
              icon={Phone}
              title="Frontend y experiencia de usuario"
              description="Hago accesible la complejidad con interfaces responsive, claras y orientadas a la tarea que el usuario necesita completar."
              gradient="from-pink-500/10 to-rose-500/5"
            />
            <ServiceBadge
              icon={ShieldCheck}
              title="Automatización e integraciones"
              description="Conecto APIs, agentes y flujos para eliminar tareas repetitivas y convertir información dispersa en procesos fiables."
              gradient="from-sky-500/10 to-blue-500/5"
            />
          </div>
        </div>
      </section>

      {/* ── Section Divider ── */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ── Metodología ── */}
      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-14">
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
      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-14">
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
      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-14">
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
                  híbridas o completamente locales</strong> según el nivel de privacidad, rendimiento y control que requiere cada caso.
                Cuando los datos deben permanecer dentro de la organización, puedo desplegar modelos, bases de datos y aplicaciones en infraestructura propia.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
                La arquitectura queda preparada para <strong className="text-slate-200">crecer sin empezar de cero</strong>:
                incorporar nuevas herramientas, automatizar procesos, ampliar capacidad o integrar otros modelos aprovechando lo que ya funciona.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section Divider ── */}
      <div className="section-divider mx-auto max-w-4xl" />

      {/* ── Catálogo de Apps ── */}
      <section ref={appCatalogRef} className="relative z-10 px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Proyectos</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Lo que sé hacer, en producción</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Estos productos muestran cómo combino desarrollo, IA, datos e infraestructura para resolver necesidades concretas y construir experiencias completas.
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
              <AppCard key={app.id} app={app} isAuthenticated={isAuthenticated} isLoading={isLoading} onLogin={(url) => login(url)} />
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
          <nav className="flex items-center gap-6 text-sm text-slate-400">
            <a href="mailto:revert.developer@gmail.com" className="transition hover:text-slate-200">
              Contacto
            </a>
            <a href="https://github.com/RevertDeveloper" target="_blank" rel="noreferrer" className="transition hover:text-slate-200">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/carlos-revert/" target="_blank" rel="noreferrer" className="transition hover:text-slate-200">
              LinkedIn
            </a>
          </nav>
        </div>
      </footer>
    </main>
  )
}
