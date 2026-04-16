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
    description: 'Estudiamos los flujos de trabajo de tu empresa para detectar cuellos de botella, errores recurrentes y oportunidades de mejora.',
  },
  {
    number: '02',
    title: 'Diseño',
    description: 'Diseñamos soluciones a medida con las tecnologías más adecuadas para cada problema detectado.',
  },
  {
    number: '03',
    title: 'Implementación',
    description: 'Desarrollamos e instalamos las herramientas en tu infraestructura propia, garantizando privacidad y control total.',
  },
  {
    number: '04',
    title: 'Escalado',
    description: 'El hardware instalado es la base para escalar tecnológicamente. Nuevas necesidades se integran aprovechando lo existente.',
  },
]

/* ------------------------------------------------------------------ */
/*  Technology capabilities for the tech section                       */
/* ------------------------------------------------------------------ */
const techCapabilities = [
  {
    icon: Brain,
    title: 'Inteligencia Artificial',
    items: ['Modelos LLM locales', 'Speech-to-Text / Text-to-Speech', 'Generación de imágenes', 'Identificación de patrones', 'OCR y parseo inteligente'],
    gradient: 'from-cyan-500/10 to-blue-500/5',
  },
  {
    icon: Database,
    title: 'Bases de Datos',
    items: ['SQL y NoSQL', 'Bases de datos vectoriales', 'Gestión avanzada de datos', 'Migración y optimización', 'Backups y recuperación'],
    gradient: 'from-violet-500/10 to-purple-500/5',
  },
  {
    icon: Workflow,
    title: 'Trazabilidad',
    items: ['Software de trazabilidad industrial', 'Verificación paso a paso', 'Control de calidad en tiempo real', 'Blockchain para seguridad', 'Flujo de datos optimizado'],
    gradient: 'from-emerald-500/10 to-green-500/5',
  },
  {
    icon: Server,
    title: 'Infraestructura Local',
    items: ['Servidores dedicados en tu empresa', 'Soberanía total de datos', 'Modelos de IA en local', 'Hardware escalable', 'Independencia de servicios cloud'],
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
          <p className="text-sm font-semibold tracking-wide text-slate-200">Tanian</p>
        </div>

        {/* Central Badge */}
        <div className="pointer-events-none absolute inset-x-0 top-2 flex items-center justify-center pt-6 sm:pt-6">
          <div className="pointer-events-auto hidden items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-[10px] font-medium tracking-wider uppercase text-cyan-300 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 status-online" />
            Software Industrial · IA · Trazabilidad · BlockChain
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

      {/* ── Quiénes somos ── */}
      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Quiénes somos</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Transformamos procesos industriales con tecnología
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Somos especialistas en detectar los puntos débiles de empresas y fábricas —desde cuellos de botella en producción
              hasta fallos de seguridad en datos— y crear herramientas personalizadas que resuelven cada problema de raíz.
              Nuestro enfoque combina <strong className="text-slate-200">inteligencia artificial, software de trazabilidad
                y gestión avanzada de datos</strong> para que cada paso de tu proceso esté verificado, controlado
              y libre de errores que detengan la producción.
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
              title="Ingeniería IA"
              description="Modelos de lenguaje, visión artificial, reconocimiento de voz, OCR y agentes inteligentes ejecutados en local."
              gradient="from-cyan-500/10 to-blue-500/5"
            />
            <ServiceBadge
              icon={Blocks}
              title="Blockchain y Trazabilidad"
              description="Desarrollo sobre redes EVM para trazabilidad certificada, auditorías inmutables y confianza total en la cadena de datos."
              gradient="from-violet-500/10 to-purple-500/5"
            />
            <ServiceBadge
              icon={BriefcaseBusiness}
              title="Software Empresarial"
              description="Plataformas de alto rendimiento para gestión de producción, calidad, logística e integraciones entre sistemas."
              gradient="from-amber-500/10 to-orange-500/5"
            />
            <ServiceBadge
              icon={Server}
              title="Infraestructura Local"
              description="Instalación de servidores en tu empresa para ejecutar IA y software propio. Control total sin depender de la nube."
              gradient="from-emerald-500/10 to-green-500/5"
            />
            <ServiceBadge
              icon={Phone}
              title="Asistentes Telefónicos IA"
              description="Configuración de asistentes de voz con IA para atender llamadas, informar sobre stock, desviar comunicaciones y más."
              gradient="from-pink-500/10 to-rose-500/5"
            />
            <ServiceBadge
              icon={ShieldCheck}
              title="Seguridad y Backups"
              description="Auditoría de vulnerabilidades, configuración de sistemas de respaldo y protección avanzada de la infraestructura."
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
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Cómo trabajamos</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Un proceso claro y directo para llevar tu empresa al siguiente nivel tecnológico.
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
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Nuestro arsenal tecnológico</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Herramientas robustas y de vanguardia que nos permiten crear soluciones fiables y escalables para cualquier sector.
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
                En la mayoría de proyectos, instalamos un <strong className="text-slate-200">servidor local</strong> en
                las instalaciones de la empresa. Este servidor ejecuta los modelos de IA, las bases de datos y todo el software
                personalizado, garantizando que <strong className="text-slate-200">ningún dato sale de tu empresa</strong>.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
                Una vez instalado el hardware, se convierte en la base para <strong className="text-slate-200">escalar
                  tecnológicamente</strong>: cuando surjan nuevas necesidades o aparezcan nuevas tecnologías, podremos
                integrarlas aprovechando la infraestructura existente. Y si fuera necesario, el hardware también se puede ampliar.
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
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Catálogo</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Nuestras soluciones en acción</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Explora las herramientas que ya hemos desarrollado. Cada una es totalmente personalizable
              y adaptable a las necesidades específicas de tu empresa.
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
            <span className="text-sm font-semibold text-slate-300">Tanian</span>
            <span className="text-sm text-slate-500">© 2026</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-400">
            <a href="mailto:contact@tanian.net" className="transition hover:text-slate-200">
              Contacto
            </a>
            <a href="https://status.tanian.net" target="_blank" rel="noreferrer" className="transition hover:text-slate-200">
              Estado
            </a>
          </nav>
        </div>
      </footer>
    </main>
  )
}
